"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "../../types";
import { getOrderById, deleteOrder } from "../../lib/storage";
import { getCityLabel } from "../../lib/cities";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CARGO_TYPE_LABELS, STATUS_LABELS } from "../../constants/cargos";

export default function OrderDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const foundOrder = getOrderById(id);
      setOrder(foundOrder || null);
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleDelete = () => {
    if (order) {
      deleteOrder(order.id);
      router.push("/orders");
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

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 mb-4">Заявка не найдена</p>
            <Link
              href="/orders"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад к списку
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold">
                  <span>{getCityLabel(order.senderCity)}</span>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
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
                <p className="mt-2 text-blue-100 text-sm">
                  Создано: {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`self-start sm:self-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  order.status === "delivered"
                    ? "bg-green-500 text-white"
                    : order.status === "in_transit"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-800"
                }`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Отправитель
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Имя</span>
                    <p className="font-medium text-gray-800">
                      {order.senderName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Телефон</span>
                    <p className="font-medium text-gray-800">
                      {order.senderPhone}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Город</span>
                    <p className="font-medium text-gray-800">
                      {getCityLabel(order.senderCity)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Получатель
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Имя</span>
                    <p className="font-medium text-gray-800">
                      {order.recipientName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Город</span>
                    <p className="font-medium text-gray-800">
                      {getCityLabel(order.destinationCity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Информация о грузе
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Тип груза</span>
                  <p className="font-medium text-gray-800">
                    {CARGO_TYPE_LABELS[order.cargoType]}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Вес</span>
                  <p className="font-medium text-gray-800">{order.weight} кг</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
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
                Удалить заявку
              </button>
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Удалить заявку?"
          message="Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить."
          confirmText="Удалить"
          cancelText="Отмена"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  );
}
