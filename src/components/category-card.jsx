"use client";

import { useCategoryData } from "@/context/CategoryDataContext";
import { useData } from "@/context/DataContext";
import {
  Card,
  createListCollection,
  Image,
  Portal,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CATEGORIES = createListCollection({
  items: [
    {
      "value": "mens_aprel",
      "label": "Men's Apparel",
      "families": [
        "Polos",
        "Outerwear",
        "Wovens",
        "T-Shirts",
        "Workwear",
        "Jacket"
      ]
    },
    {
      "value": "womens_apparel",
      "label": "Women's Apparel",
      "families": [
        "Polos",
        "Outerwear",
        "Wovens",
        "T-Shirts",
        "Workwear",
        "Blouses & Cardigans",
        "Jacket"
      ]
    },
    {
      "value": "headwear",
      "label": "Headwear",
      "families": [
        "Structured",
        "Unstructured",
        "Knit"
      ]
    },
    {
      "value": "drinkware",
      "label": "Drinkware",
      "families": [
        "Tumblers",
        "Mugs",
        "Bottles",
        "Cups",
        "Drinkware Accessories"
      ]
    },
    {
      "value": "bags",
      "label": "Bags",
      "families": [
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
      "value": "office",
      "label": "Office",
      "families": [
        "Desk Accessories",
        "Journals & Notebooks",
        "Padfolios",
        "Writing",
        "Lanyards & Badgeholders",
        "Calendars"
      ]
    },
    {
      "value": "tech",
      "label": "Tech",
      "families": [
        "Headphones & Earbuds",
        "Speakers",
        "Tech Accessories",
        "Cables & Adapters",
        "Charging"
      ]
    },
    {
      "value": "sports_outdoors",
      "label": "Sports & Outdoors",
      "families": [
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
      "value": "events",
      "label": "Events",
      "families": [
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
      "value": "giveaways",
      "label": "Giveaways",
      "families": [
        "Event Essentials",
        "Personal Care & Wellness",
        "Lifestyle & Novelty"
      ]
    }
  ]
})

export default function CategoryCard({ index, data }) {
  const { data: stateData, handleChange } = useCategoryData();
  const [initValue, setInitValue] = useState({
    category: "",
    family: ""
  });

  const [category, setCategory] = useState("");
  const [family, setFamily] = useState("");
  const [FAMILIES, setFAMILIES] = useState(null);

  useEffect(() => {
    if (!stateData) return;
    const matchedCategory = CATEGORIES.items.find(
      (item) => item.label === data.category
    );
    let matchedFamily = "";
    console.log(index, data.category, data.product_family)

    if (matchedCategory) {
      setCategory([matchedCategory?.value] || "");
      const familyCollection = createListCollection({ items: matchedCategory?.families.map((item) => ({ value: item, label: item })) })
      setFAMILIES(familyCollection);
      matchedFamily = familyCollection.items.find(
        (item) => item.label === data.product_family
      );
      setFamily([matchedFamily?.value] || "");
    }
  }, [stateData]);

  useEffect(() => {
    if (!initValue.category) return;
    const matchedCategory = CATEGORIES.items.find(
      (item) => item.value === initValue.category[0]
    );
    const matchedFamily = FAMILIES?.items.find(
      (item) => item.value === family[0]
    );

    handleChange(index, "category", matchedCategory?.label);
    handleChange(index, "product_family", matchedFamily?.label);
  }, [initValue])

  return (
    <Card.Root variant="elevated" size="sm">
      <Card.Header px={4} pb={0}>
        <Card.Title fontSize="12px">{data.reference_id}</Card.Title>
      </Card.Header>
      <Card.Body pt={4} px={4} pb={4}>
        <Image height="300px" objectFit="contain" src={data.image_url} alt={data.reference_id} referrerPolicy="no-referrer" />
        <Select.Root collection={CATEGORIES} value={category} onValueChange={(e) => {
          setCategory(e.value);
          setFamily([]);
          setInitValue({
            category: e.value,
            family: ""
          });
        }}>
          <Select.HiddenSelect />
          <Select.Label>Category</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select a category" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {
                  CATEGORIES.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))
                }
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root
          collection={FAMILIES} mt={4} disabled={!category}
          value={family}
          onValueChange={(e) => {
            setFamily(e.value);
            setInitValue({
              category: category,
              family: e.value
            });
          }}
        >
          <Select.HiddenSelect />
          <Select.Label>Product Family</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select a product family" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {
                  FAMILIES?.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))
                }
                {/* {
                  FAMILIES.length === 0 ? (
                    <Select.Item item={{ value: "", label: "Select a category first." }}>
                      Select a category first.
                      <Select.ItemIndicator />
                    </Select.Item>
                  ) : (
                    FAMILIES.items.map((item) => (
                      <Select.Item item={item} key={item}>
                        {item}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))
                  )
                } */}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Card.Body>
    </Card.Root >
  );
}