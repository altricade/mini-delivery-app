"use client";

import { useFormContext, Controller } from "react-hook-form";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import PhoneInput from "../PhoneInput";
import { CITIES } from "../../lib/cities";
import { DeliveryFormData } from "../../types";

export default function Step1Sender() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DeliveryFormData>();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Данные отправителя
      </h2>

      <FormInput
        label="Имя"
        placeholder="Введите ваше имя"
        error={errors.senderName?.message}
        required
        {...register("senderName")}
      />

      <Controller
        name="senderPhone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            label="Телефон"
            error={errors.senderPhone?.message}
            required
            {...field}
          />
        )}
      />

      <FormSelect
        label="Город отправления"
        options={CITIES}
        error={errors.senderCity?.message}
        required
        {...register("senderCity")}
      />
    </div>
  );
}
