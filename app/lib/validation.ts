import { z } from "zod";

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const senderSchema = z.object({
  senderName: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов"),
  senderPhone: z
    .string()
    .regex(phoneRegex, "Введите корректный номер телефона"),
  senderCity: z.string().min(1, "Выберите город отправления"),
});

export const recipientSchema = z.object({
  recipientName: z
    .string()
    .min(2, "Имя получателя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов"),
  destinationCity: z.string().min(1, "Выберите город назначения"),
  cargoType: z.enum(["documents", "fragile", "regular"], {
    message: "Выберите тип груза",
  }),
  weight: z
    .number({ message: "Введите вес груза" })
    .min(0.1, "Минимальный вес 0.1 кг")
    .max(30, "Максимальный вес 30 кг"),
});

export const confirmationSchema = z.object({
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "Необходимо согласиться с условиями"),
});

export const fullDeliverySchema = senderSchema
  .merge(recipientSchema)
  .merge(confirmationSchema)
  .refine((data) => data.senderCity !== data.destinationCity, {
    message: "Город назначения не может совпадать с городом отправления",
    path: ["destinationCity"],
  });

export type SenderFormData = z.infer<typeof senderSchema>;
export type RecipientFormData = z.infer<typeof recipientSchema>;
export type ConfirmationFormData = z.infer<typeof confirmationSchema>;
