import { CargoType, Order } from "../types";

export const CARGO_TYPE_LABELS: Record<CargoType, string> = {
  documents: "Документы",
  fragile: "Хрупкое",
  regular: "Обычное",
};

export const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Ожидает",
  in_transit: "В пути",
  delivered: "Доставлено",
};
