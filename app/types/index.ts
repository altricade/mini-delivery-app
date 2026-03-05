export type CargoType = "documents" | "fragile" | "regular";

export interface SenderData {
  senderName: string;
  senderPhone: string;
  senderCity: string;
}

export interface RecipientData {
  recipientName: string;
  destinationCity: string;
  cargoType: CargoType;
  weight: number;
}

export interface ConfirmationData {
  agreedToTerms: boolean;
}

export interface DeliveryFormData
  extends SenderData, RecipientData, ConfirmationData {}

export interface Order extends DeliveryFormData {
  id: string;
  createdAt: string;
  status: "pending" | "in_transit" | "delivered";
}
