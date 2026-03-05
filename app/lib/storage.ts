import { Order } from '../types';

const ORDERS_KEY = 'mini-delivery-orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function deleteOrder(id: string): void {
  const orders = getOrders().filter((order) => order.id !== id);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((order) => order.id === id);
}

export function generateOrderId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
