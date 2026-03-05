"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import Stepper from "./Stepper";
import Step1Sender from "./steps/Step1Sender";
import Step2Recipient from "./steps/Step2Recipient";
import Step3Confirmation from "./steps/Step3Confirmation";
import { DeliveryFormData } from "../types";
import {
  senderSchema,
  recipientSchema,
  confirmationSchema,
  fullDeliverySchema,
} from "../lib/validation";
import { saveOrder, generateOrderId } from "../lib/storage";

const STEPS = ["Отправитель", "Получатель", "Подтверждение"];

export default function DeliveryForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<DeliveryFormData>({
    mode: "onChange",
    defaultValues: {
      senderName: "",
      senderPhone: "",
      senderCity: "",
      recipientName: "",
      destinationCity: "",
      cargoType: undefined,
      weight: undefined,
      agreedToTerms: false,
    },
  });

  const { handleSubmit, getValues, setError, clearErrors } = methods;

  const validateStep = (step: number): boolean => {
    clearErrors();
    const values = getValues();

    if (step === 0) {
      const result = senderSchema.safeParse(values);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof DeliveryFormData;
          setError(field, { message: issue.message });
        });
        return false;
      }
    } else if (step === 1) {
      const result = recipientSchema.safeParse(values);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof DeliveryFormData;
          setError(field, { message: issue.message });
        });
        return false;
      }
      if (values.senderCity === values.destinationCity) {
        setError("destinationCity", {
          message: "Город назначения не может совпадать с городом отправления",
        });
        return false;
      }
    } else if (step === 2) {
      const result = confirmationSchema.safeParse(values);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof DeliveryFormData;
          setError(field, { message: issue.message });
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: DeliveryFormData) => {
    const fullValidation = fullDeliverySchema.safeParse(data);
    if (!fullValidation.success) {
      return;
    }

    setIsSubmitting(true);

    const order = {
      ...data,
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    };

    saveOrder(order);
    router.push("/orders");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Sender />;
      case 1:
        return <Step2Recipient />;
      case 2:
        return <Step3Confirmation />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto">
        <Stepper currentStep={currentStep} steps={STEPS} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Назад
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Далее
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
