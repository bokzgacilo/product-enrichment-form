import { toaster, Toaster } from "@/components/ui/toaster";
import { supabase } from "@/config/Supabase";
import { CategoryList } from "@/constants/Category";
import { CoreWipInputs } from "@/constants/CoreWipInputs";
import { Button, Field, Flex, Input, NativeSelect, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useState } from "react";
import { LuListPlus, LuRefreshCcw } from "react-icons/lu";

const REQUIRED_FIELDS = ["name", "vendor", "url", "sku"];

const CoreWip: FC = () => {
  const [values, setValues] = useState(() => Object.fromEntries(CoreWipInputs.map((input) => [input.name, input.defaultValue ?? ""])))
  const [selectedFamily, setSelectedFamily] = useState("Men's Apparel")

  function handleChange(name, val) {
    setValues((prev) => ({
      ...prev,
      [name]: val,
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
      // 🔎 Check if SKU already exists
      const { data: existingSku, error: skuError } = await supabase
        .from("products")
        .select("sku")
        .eq("sku", sku)
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
        url: values.url || null,
        vendor: values.vendor || null,
        brand: values.brand || null,
        name: values.name.trim(),
        sku: sku,
        colors: values.color
          ? values.color.split(",").map(c => c.trim()).filter(Boolean)
          : null,
        sizes: values.size || null,
        category: values.category || null,
        family: values.family || null,
        price_usd: values.price ? Number(values.price) : null,
        size_chart_link: values.size_chart_link || null,
        how_to_measure_guide_link: values.how_to_measure_link || null,
        decoration_method: values.decoration_method || null,
        moq: values.moq ? Number(values.moq) : null,
        production_time: values.production_time || null,
        shipping_weight: values.shipping_weight
          ? Number(values.shipping_weight)
          : null,
        tax_code: selectedCategory?.product_tax_code || null,
      };

      console.log(productPayload);

      const { error } = await supabase
        .from("products")
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

    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleReset = () => {
    setValues(
      Object.fromEntries(
        CoreWipInputs.map(i => [i.name, i.defaultValue ?? ""])
      )
    );
  };

  return (
    <>
      <Head>
        <title>Core Product Form</title>
      </Head>
      <Stack p={4} gap={4}>
        <Toaster />

        {
          CoreWipInputs.map((input, i) => (
            <Field.Root key={i}>
              <Field.Label>{input.label}</Field.Label>
              {input.name === "category" && (
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name={input.name}
                    value={selectedFamily}
                    onChange={(e) => {
                      const selectedLabel = e.currentTarget.value;

                      const selectedCategory = CategoryList.find(
                        (category) => category.label === selectedLabel
                      );

                      setSelectedFamily(selectedLabel);

                      setValues((prev) => ({
                        ...prev,
                        family: selectedCategory?.families?.[0] || null,
                      }));

                      handleChange("category", selectedLabel);
                    }}
                  >
                    {input.name === "category" &&
                      CategoryList.map((category) => (
                        <option key={category.label} value={category.label}>
                          {category.label}
                        </option>
                      ))
                    }
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
              {input.name === "family" && (
                <NativeSelect.Root
                >
                  <NativeSelect.Field
                    name={input.name}
                    value={values[input.name]}
                    onChange={e => handleChange("family", e.currentTarget.value)}
                  >
                    {
                      CategoryList.find((category) => category.label === selectedFamily)?.families.map((family) => (
                        <option key={family} value={family}>
                          {family}
                        </option>
                      ))
                    }
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
              {
                input.name !== "category" && input.name !== "family" && (
                  <Input
                    name={input.name}
                    value={values[input.name]}
                    onChange={(e) => handleChange(input.name, e.target.value)}
                  />
                )
              }
            </Field.Root>
          ))
        }
      </Stack>
      <Flex justifyContent="end" gap={2} position="sticky" bottom={0} bg="bg" p={2} borderTop="1px solid" borderTopColor="border">
        <Button size="sm" variant="outline" onClick={handleReset}><LuRefreshCcw /> Reset</Button>
        <Button size="sm" asChild>
          <a href="corewip/list">List</a></Button>
        <Button size="sm" onClick={handleStoreProduct}>Save <LuListPlus /></Button>
      </Flex>
    </>
  );
}

export default CoreWip;
