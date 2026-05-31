export type Role = "guest" | "customer" | "staff" | "admin";
export type Permission =
  | "manage_products" | "manage_orders" | "manage_customers" | "manage_prices"
  | "manage_invoices" | "manage_support" | "manage_special_requests";

export type Product = {
  id: string; name: string; category: string; description: string; manufacturer: string;
  color_name: string; package_size: string; base: string; purpose: string; retail_price: number;
  image_url?: string; in_stock: boolean;
};

export type Invoice = {
  id: string; name: string; amount: number; status: "Poruceno" | "U obradi" | "Na putu" | "Dostavljeno" | "Ceka uplatu";
  is_paid: boolean;
};

export type DemoAccount = {
  username: string; password: string; role: Role; label: string; email: string; phone: string; credit: number;
  permissions: Permission[]; invoices: Invoice[];
};
