"use client";

import { useFormContext } from "react-hook-form";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { CITIES } from "../../lib/cities";
import { DeliveryFormData } from "../../types";
import { CARGO_TYPE_LABELS } from "@/app/constants/cargos";

const CARGO_OPTIONS = Object.entries(CARGO_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export default function Step2Recipient() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<DeliveryFormData>();

  const senderCity = watch("senderCity");
  const availableCities = CITIES.filter((city) => city.value !== senderCity);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Получатель и посылка
      </h2>

      <FormInput
        label="Имя получателя"
        placeholder="Введите имя получателя"
        error={errors.recipientName?.message}
        required
        {...register("recipientName")}
      />

      <FormSelect
        label="Город назначения"
        options={availableCities}
        error={errors.destinationCity?.message}
        required
        {...register("destinationCity")}
      />

      <FormSelect
        label="Тип груза"
        options={CARGO_OPTIONS}
        error={errors.cargoType?.message}
        required
        {...register("cargoType")}
      />

      <FormInput
        label="Вес (кг)"
        type="number"
        step="0.1"
        min="0.1"
        max="30"
        placeholder="Введите вес груза"
        error={errors.weight?.message}
        required
        {...register("weight", { valueAsNumber: true })}
      />
    </div>
  );
}
