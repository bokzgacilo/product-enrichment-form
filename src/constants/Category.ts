export type Category = {
  value: string;
  label: string;
  product_tax_code: string;
  families: string[];
};

export const CategoryList: Category[] = [
  {
    value: "mens_apparel",
    label: "Men's Apparel",
    product_tax_code: "PC040156",
    families: [
      "Polos",
      "Outerwear",
      "Wovens",
      "T-Shirts",
      "Workwear",
      "Jacket",
      "Pants",
      "Long Sleeve Polo",
      "Babywear"
    ]
  },
  {
    value: "womens_apparel",
    label: "Women's Apparel",
    product_tax_code: "PC040156",
    families: [
      "Polos",
      "Outerwear",
      "Wovens",
      "T-Shirts",
      "Workwear",
      "Blouses & Cardigans",
      "Jacket",
      "Pants",
      "Long Sleeve Polo",
      "Babywear"
    ]
  },
  {
    value: "headwear",
    label: "Headwear",
    product_tax_code: "PC040156",
    families: ["Structured", "Unstructured", "Knit"]
  },
  {
    value: "drinkware",
    label: "Drinkware",
    product_tax_code: "PC000000",
    families: [
      "Tumblers",
      "Mugs",
      "Bottles",
      "Cups",
      "Drinkware Accessories"
    ]
  },
  {
    value: "bags",
    label: "Bags",
    product_tax_code: "PC000000",
    families: [
      "Backpacks",
      "Slings",
      "Duffels",
      "Suitcases",
      "Totes",
      "Laptop/Messenger",
      "Travel Accessories",
      "Coolers"
    ]
  },
  {
    value: "office",
    label: "Office",
    product_tax_code: "PC000000",
    families: [
      "Desk Accessories",
      "Journals & Notebooks",
      "Padfolios",
      "Writing",
      "Lanyards & Badgeholders",
      "Calendars"
    ]
  },
  {
    value: "tech",
    label: "Tech",
    product_tax_code: "PC000000",
    families: [
      "Headphones & Earbuds",
      "Speakers",
      "Tech Accessories",
      "Cables & Adapters",
      "Charging"
    ]
  },
  {
    value: "sports_outdoors",
    label: "Sports & Outdoors",
    product_tax_code: "PC000000",
    families: [
      "Games",
      "Golf",
      "Hunting & Fishing",
      "Flashlights & Lanterns",
      "Knives & Tools",
      "Sun Protection",
      "Camping & Hiking",
      "Outdoor Living",
      "Cooler",
      "Cookware",
      "Blankets",
      "Health & Wellness",
      "Fitness"
    ]
  },
  {
    value: "events",
    label: "Events",
    product_tax_code: "PC000000",
    families: [
      "Table Covers",
      "Flags",
      "Displays",
      "Tents",
      "Inflatables",
      "Tradeshows",
      "Banners"
    ]
  },
  {
    value: "giveaways",
    label: "Giveaways",
    product_tax_code: "PC000000",
    families: [
      " ",
      "Personal Care & Wellness",
      "Lifestyle & Novelty"
    ]
  }
];