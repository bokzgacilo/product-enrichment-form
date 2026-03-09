type InputField = {
  name: string;
  label: string;
  defaultValue?: string;
};

export const CoreWipInputs: InputField[] = [
  { name: "url", label: "URL", defaultValue: "" },
  { name: "vendor", label: "Vendor", defaultValue: "" },
  { name: "brand", label: "Brand", defaultValue: "" },
  { name: "name", label: "Name", defaultValue: "" },
  { name: "sku", label: "SKU", defaultValue: "" },
  { name: "price", label: "Price", defaultValue: "" },
  { name: "size", label: "Size", defaultValue: "" },
  { name: "color", label: "Color", defaultValue: "" },
  { name: "category", label: "Category", defaultValue: "Men's Apparel" },
  { name: "family", label: "Family", defaultValue: "Polos" },
  { name: "moq", label: "MOQ", defaultValue: "" },
  { name: "decoration_method", label: "Decoration Method", defaultValue: "" },
  { name: "product_net_cost", label: "Net Cost", defaultValue: "" },
  { name: "setup_cost", label: "Setup Cost", defaultValue: "" },
  { name: "deco_cost", label: "Deco Cost", defaultValue: "" },
  { name: "production_time", label: "Production Time", defaultValue: "" },
  { name: "size_chart_link", label: "Size Chart Link", defaultValue: "" },
  { name: "how_to_measure_link", label: "How to Measure Link", defaultValue: "" },
];