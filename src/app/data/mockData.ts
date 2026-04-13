// Mock data for the commerce system

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

export interface Order {
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
  id: string;
  name: string;
  email: string;
  role: "staff" | "owner";
  status: "active" | "inactive";
}

export interface apiData {
  url: string;
  method?: "GET" | "POST" | "OPTIONS" | "PUT" | "DELETE";
  body?: any;
  headers?: object;
}

export async function apiRequest({
  url,
  method = "GET",
  body = null,
  headers = {},
}: apiData) {
  if (!url) {
    throw new Error("Requires a url");
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    options.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, options);

  let result;
  const ContentType = response.headers.get("content-type");

  if (ContentType && ContentType?.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    throw new Error(result?.message || `Request failed with status `);
  }

  return result;
}

export const baseUrl = "https://localhost:8283";

const product = await apiRequest({
  url: `${baseUrl}/product`
});

export const categories = product.categories;

export const mockProducts: Product[] = product.products;

export const mockOrders: Order[] = await apiRequest({
  url: `${baseUrl}/orders`,
});/* [
  {
    id: "ORD-001",
    date: "2026-01-06",
    total: 304.98,
    status: "new",
    deliveryMethod: "delivery",
    address: "123 Main St, City, State 12345",
    paymentMethod: "Credit Card",
    items: [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[3], quantity: 1 },
    ],
  },
  {
    id: "ORD-002",
    date: "2026-01-05",
    total: 199.99,
    status: "in-progress",
    deliveryMethod: "pickup",
    paymentMethod: "PayPal",
    items: [{ ...mockProducts[1], quantity: 1 }],
  },
  {
    id: "ORD-003",
    date: "2026-01-04",
    total: 144.98,
    status: "completed",
    deliveryMethod: "delivery",
    address: "456 Oak Ave, Town, State 67890",
    paymentMethod: "Credit Card",
    items: [
      { ...mockProducts[5], quantity: 1 },
      { ...mockProducts[2], quantity: 1 },
    ],
  },
]; */

export const mockStaff: Staff[] = await apiRequest({
  url: `${baseUrl}/staff`,
});/* [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "staff",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "staff",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "staff",
    status: "inactive",
  },
  {
    id: "4",
    name: "Mob Johnson",
    email: "mob@example.com",
    role: "staff",
    status: "active",
  },
]; */
