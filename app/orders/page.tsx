"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Order, CargoType } from "../types";
import { getOrders, deleteOrder } from "../lib/storage";
import { getCityLabel } from "../lib/cities";
import ConfirmDialog from "../components/ConfirmDialog";
import { CARGO_TYPE_LABELS, STATUS_LABELS } from "../constants/cargos";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cargoFilter, setCargoFilter] = useState<CargoType | "">("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCityLabel(order.destinationCity)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCargo =
        cargoFilter === "" || order.cargoType === cargoFilter;

      return matchesSearch && matchesCargo;
    });
  }, [orders, searchQuery, cargoFilter]);

  const handleDelete = () => {
    if (deleteId) {
      deleteOrder(deleteId);
      setOrders(getOrders());
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
          История заявок
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по имени получателя или городу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 text-black"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={cargoFilter}
                onChange={(e) =>
                  setCargoFilter(e.target.value as CargoType | "")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder:text-gray-400 text-black"
              >
                <option value="">Все типы груза</option>
                {Object.entries(CARGO_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">
              {orders.length === 0
                ? "Заявок пока нет. Создайте первую заявку!"
                : "Заявки не найдены по заданным критериям"}
            </p>
            {orders.length === 0 && (
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Создать заявку
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Link
                    href={`/orders/detail?id=${order.id}`}
                    className="flex-1 group"
                  >
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      <span>{getCityLabel(order.senderCity)}</span>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <span>{getCityLabel(order.destinationCity)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span>Отправитель: {order.senderName}</span>
                      <span>Получатель: {order.recipientName}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {CARGO_TYPE_LABELS[order.cargoType]}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.weight} кг
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "in_transit"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      Создано: {formatDate(order.createdAt)}
                    </p>
                  </Link>
                  <button
                    onClick={() => setDeleteId(order.id)}
                    className="self-start sm:self-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить заявку"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Удалить заявку?"
          message="Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить."
          confirmText="Удалить"
          cancelText="Отмена"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </div>
  );
}
