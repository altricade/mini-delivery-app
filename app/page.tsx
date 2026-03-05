import DeliveryForm from "./components/DeliveryForm";

export default function Home() {
  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Оформление доставки
        </h1>
        <DeliveryForm />
      </div>
    </div>
  );
}
