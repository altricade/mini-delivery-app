import { Suspense } from "react";
import OrderDetailClient from "./OrderDetailClient";

function LoadingFallback() {
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

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderDetailClient />
    </Suspense>
  );
}
