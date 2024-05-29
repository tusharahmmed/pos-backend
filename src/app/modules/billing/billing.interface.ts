export type IPayloadProduct = {
  product_id: string;
  quantity: number;
};

export type IBillingPayload = {
  customer_name: string;
  customer_phone: string;
  tax_amount: number;
  total_amount: number;
  products: IPayloadProduct[];
  store_id?: string;
};
