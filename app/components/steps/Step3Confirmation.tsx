"use client";

import { useFormContext } from "react-hook-form";
import { DeliveryFormData } from "../../types";
import { getCityLabel } from "../../lib/cities";
import { CARGO_TYPE_LABELS } from "@/app/constants/cargos";

export default function Step3Confirmation() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<DeliveryFormData>();

  const formData = watch();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Подтверждение заявки
      </h2>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Отправитель</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500">Имя</span>
            <p className="font-medium">{formData.senderName || "—"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Телефон</span>
            <p className="font-medium">{formData.senderPhone || "—"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Город отправления</span>
            <p className="font-medium">
              {getCityLabel(formData.senderCity) || "—"}
            </p>
          </div>
        </div>

        <h3 className="font-medium text-gray-700 mb-4">Получатель и посылка</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Имя получателя</span>
            <p className="font-medium">{formData.recipientName || "—"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Город назначения</span>
            <p className="font-medium">
              {getCityLabel(formData.destinationCity) || "—"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Тип груза</span>
            <p className="font-medium">
              {formData.cargoType ? CARGO_TYPE_LABELS[formData.cargoType] : "—"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Вес</span>
            <p className="font-medium">
              {formData.weight ? `${formData.weight} кг` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register("agreedToTerms")}
          />
          <span className="text-sm text-gray-700">
            Я согласен с условиями доставки и обработки персональных данных
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="mt-1 text-sm text-red-500">
            {errors.agreedToTerms.message}
          </p>
        )}
      </div>
    </div>
  );
}
