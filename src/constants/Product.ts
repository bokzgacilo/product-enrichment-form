export type Product = {
  name: string;
  sku: string;
  vendor: string;
  brand: string;
  colors: Array<string>;
  category: string;
  family: string;
  price_usd: number;
  size_chart_link: string;
  how_to_measure_guide_link: string;
  decoration_method: string;
  moq: number;
  production_time: string;
  shipping_weight: number;
  tax_code: string;
};