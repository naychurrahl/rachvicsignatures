export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string[];
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderInterface {
  id: string;
  date: string;
  total: number;
  status: "new" | "in-progress" | "completed";
  items: CartItem[];
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  paymentMethod: string;
}

export interface Staff {
  id?: string;
  name: string;
  email: string;
  role: "staff" | "admin";
  status: "active" | "inactive";
}

export interface apiData {
  url: string;
  method?: "GET" | "POST" | "OPTIONS" | "PUT" | "DELETE";
  body?: any;
  headers?: object;
}
