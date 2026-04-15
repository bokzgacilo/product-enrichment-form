import { toaster, Toaster } from "@/components/ui/toaster";
import { supabase } from "@/config/Supabase";
import { CategoryList } from "@/constants/Category";
import { ProductFormValues } from "@/types/ProductFormValues";
import { Button, Field, Flex, Input, NativeSelect, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { LuListPlus, LuRefreshCcw } from "react-icons/lu";
import debounce from "lodash.debounce"

const REQUIRED_FIELDS = ["name", "vendor", "url", "sku"];

function cleanString(str) {
  return str.replace(/[^\x20-\x7E]/g, "")
}

type TextFieldName =
  | "name"
  | "vendor"
  | "brand"
  | "url"
  | "sku"
  | "ref_id"
  | "color"
  | "size"
  | "price"
  | "category"
  | "family"
  | "size_chart_link"
  | "how_to_measure_link"
  | "decoration_method"
  | "setup_cost"
  | "setup_cost_code"
  | "deco_cost"
  | "moq"
  | "production_time"
  | "shipping_weight";

const TEXT_FIELDS: Array<{ name: TextFieldName; label: string; required?: boolean }> = [
  { name: "name", label: "Name", required: true },
  { name: "vendor", label: "Vendor", required: true },
  { name: "brand", label: "Brand" },
  { name: "url", label: "URL", required: true },
  { name: "sku", label: "SKU", required: true },
  { name: "ref_id", label: "Ref ID" },
  { name: "color", label: "Color" },
  { name: "size", label: "Size" },
  { name: "price", label: "Price" },
  { name: "decoration_method", label: "Decoration Method" },
  { name: "setup_cost", label: "Setup Cost" },
  { name: "setup_cost_code", label: "Setup Cost Code" },
  { name: "deco_cost", label: "Deco Cost" },
  { name: "moq", label: "MOQ" },
  { name: "production_time", label: "Production Time" },
  { name: "shipping_weight", label: "Shipping Weight" },
  { name: "size_chart_link", label: "Size Chart Link" },
  { name: "how_to_measure_link", label: "How To Measure Link" },
];

const formInitialValue = {
  name: "",
  vendor: "",
  brand: "",
  url: "",
  ref_id: "",
  sku: "",
  color: "",
  size: "",
  category: "Men's Apparel",
  family: "Polos",
  price: 0.0,
  size_chart_link: "",
  how_to_measure_link: "",
  decoration_method: "",
  setup_cost: 0.0,
  setup_cost_code: "",
  deco_cost: 0.0,
  moq: 0,
  production_time: "",
  shipping_weight: 0.0,
  id: ""
}

type Catalog = {
  name: string,
  id: string
}

type ExtendedProductFormValues = {
  id: string;
  ref_id: string;
} & ProductFormValues;

const CoreWip: FC = () => {
  const [values, setValues] = useState<ExtendedProductFormValues>(formInitialValue)
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog>({
    name: "",
    id: ""
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("catalogs")
        .select("id,name")

      if (!error && data) {
        console.log(data)
        setCatalogs(data)
        setSelectedCatalog(data[0] ?? null)
      }

      setLoading(false)
    }

    fetchCatalogs()
  }, [])

  const selectedCategory = useMemo(
    () => CategoryList.find((category) => category.label === values.category) ?? CategoryList[0],
    [values.category]
  );
  const familyOptions = selectedCategory?.families ?? [];

  const handleChange = (name: TextFieldName, val: string) => {
    const cleaned = cleanString(val)

    // ✅ update immediately (keeps input responsive)
    setValues((prev) => ({
      ...prev,
      [name]: cleaned,
    }))

    // ✅ debounce side effects (API, validation, etc.)
    debouncedSideEffect(name, cleaned)
  }

  const debouncedSideEffect = useMemo(
    () =>
      debounce((name: TextFieldName, val: string) => {
        // e.g. API call, validation, etc.
      }, 300),
    []
  )

  if (loading || !selectedCatalog) {
    return <Stack p={4}>
      <Spinner />
    </Stack>
  }


  function handleCategoryChange(categoryLabel: string) {
    const nextCategory = CategoryList.find((category) => category.label === categoryLabel) ?? CategoryList[0];
    setValues((prev) => ({
      ...prev,
      category: nextCategory.label,
      family: nextCategory.families.includes(prev.family) ? prev.family : (nextCategory.families[0] ?? ""),
    }));
  }

  const handleStoreProduct = async () => {
    const missing = REQUIRED_FIELDS.filter(
      (field) => !values[field]?.trim()
    );

    if (missing.length > 0) {
      alert(`Missing required fields: ${missing.join(", ")}`);
      return;
    }

    const selectedCategory = CategoryList.find(
      c => c.label === values.category
    );

    const sku = values.sku.trim();

    try {
      setButtonLoading(true)
      const { data: existingSku, error: skuError } = await supabase
        .from("core_products")
        .select("sku")
        .eq("sku", sku)
        .eq("catalog_id", selectedCatalog?.id ?? null)
        .maybeSingle();

      if (skuError) {
        console.error("SKU check error:", skuError);
        alert("Error checking SKU");
        return;
      }

      if (existingSku) {
        toaster.create({
          title: "Existing SKU",
          description: "SKU already exists. Please use a different SKU.",
          type: "error",
          duration: 5000,
          closable: true,
        })
        return;
      }

      const productPayload = {
        catalog_id: selectedCatalog?.id ?? null,
        name: values.name?.trim(),
        vendor: values.vendor?.trim() || null,
        brand: values.brand?.trim() || null,
        url: values.url?.trim() || null,
        sku: sku?.trim(),
        colors: values.color
          ? values.color.split(",").map(c => c.trim()).filter(Boolean)
          : null,
        sizes: values.size,
        category: values.category?.trim() || null,
        family: values.family?.trim() || null,
        price: values.price,
        size_chart_link: values.size_chart_link?.trim() || null,
        how_to_measure_link: values.how_to_measure_link?.trim() || null,
        decoration_method: values.decoration_method?.trim() || null,
        setup_cost: values.setup_cost,
        setup_cost_code: values.setup_cost_code?.trim() || null,
        deco_cost: values.deco_cost,
        moq: values.moq,
        production_time: values.production_time?.trim() || null,
        shipping_weight: values.shipping_weight,
        tax_code: selectedCategory?.product_tax_code || null,
        ref_id: values.ref_id?.trim() || null,
      };

      console.log(productPayload);

      const { error } = await supabase
        .from("core_products")
        .insert([productPayload]);

      if (error) {
        console.error("Insert error:", error);
        alert(error.message);
        return;
      }

      toaster.create({
        title: "Product Added",
        description: "Product added successfully",
        type: "success",
        duration: 5000,
        closable: true,
      });

      handleReset();
      setButtonLoading(false)
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setButtonLoading(false)
    }
  };

  const handleReset = () => {
    setValues(formInitialValue)
  };

  return (
    <>
      <Head>
        <title>Core Product Form</title>
      </Head>
      <Stack p={4} gap={4}>
        <Toaster />
        <SimpleGrid gap={4} templateColumns="40% 1fr">
          <Field.Root>
            <Field.Label>Catalog</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={selectedCatalog.id}
                onChange={(e) => setSelectedCatalog(catalogs.find((catalog) => catalog.id === e.target.value) ?? { name: "", id: "" })}
              >
                {catalogs.map((catalog) => (
                  <option key={catalog.name} value={catalog.id}>
                    {catalog.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Ref ID</Field.Label>
            <Input
              value={values.ref_id}
              onChange={(e) => handleChange("ref_id", e.target.value)}
            />
          </Field.Root>
        </SimpleGrid>

        <Field.Root required>
          <Field.Label>Category</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={values.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {CategoryList.map((category) => (
                <option key={category.value} value={category.label}>
                  {category.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        <Field.Root>
          <Field.Label>Family</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={values.family}
              onChange={(e) => handleChange("family", e.target.value)}
            >
              {familyOptions.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        {TEXT_FIELDS.map((field) => (
          <Field.Root
            hidden={field.name === "ref_id"}
            key={field.name} required={field.required}>
            <Field.Label>{field.label}</Field.Label>
            <Input
              type={field.name === "price" || field.name === "setup_cost" || field.name === "deco_cost" || field.name === "moq" || field.name === "shipping_weight" ? "number" : "text"}
              value={values[field.name]}
              step={field.name === "price" || field.name === "setup_cost" || field.name === "deco_cost" || field.name === "shipping_weight" ? "0.01" : ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </Field.Root>
        ))}

      </Stack>
      <Flex justifyContent="end" gap={2} position="sticky" bottom={0} bg="bg" p={2} borderTop="1px solid" borderTopColor="border">
        <Button size="xs" loading={buttonLoading} variant="outline" onClick={handleReset}><LuRefreshCcw /> Reset</Button>
        <Button size="xs" loading={buttonLoading} onClick={handleStoreProduct}>Add Product <LuListPlus /></Button>
      </Flex>
    </>
  );
}

export default CoreWip;
