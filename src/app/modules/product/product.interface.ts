export type IProductFilters = {
  search?: string;
  category_id?: string;
  brand_id?: string;
};

export type IProductParams = {
  store_id?: string | undefined;
  id?: string | undefined;
};
