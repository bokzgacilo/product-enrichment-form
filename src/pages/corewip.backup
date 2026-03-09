import { ColorModeButton } from "@/components/ui/color-mode";
import {
  Stack,
  Field,
  Flex,
  Input,
  Button,
  SimpleGrid,
  Text,
  HStack,
  Table,
  Box,
  IconButton,
  NativeSelect,
  Link
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useRef } from "react";
import { LuAppWindow, LuDownload } from "react-icons/lu";
import { TbCopy, TbEdit, TbPlus, TbTableExport, TbTrash } from "react-icons/tb";

const initialForm = {
  vendor_link: "",
  vendor_name: "",
  product_name: "",
  product_sku: "",
  product_color: "",
  product_sizes_offered: "",
  taxcode: "PC040156",
  attribute_set: "",
  ihvendor: "",
  product_family: "",
  decoration: "",
  moq: "",
  setup_cost: "",
  deco_cost: "",
  price: "",
  brand: "",
  production_time: "",
  size_chart_link: "",
  how_to_measure_link: ""
};

export default function CoreWip() {
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState([]);
  const debounceTimer = useRef(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }, 300);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!form.vendor_link.trim() || !form.vendor_name.trim() || !form.product_name.trim()) {
      alert("Vendor Link, Vendor Name, and Product Name are required.");
      return;
    }

    if (isEditing) {
      const updatedProducts = products.map((item, index) =>
        index === editIndex ? form : item
      );
      setProducts(updatedProducts);
      setEditIndex(null);
    } else {
      setProducts([...products, form]);
    }

    setIsEditing(false);
    setForm(initialForm);
  };

  const handleExport = async () => {
    const cleaned = products.map((p) => ({
      ...p
    }));

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: cleaned })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "export_" + Date.now() + ".csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleDelete = (vendor_link) => {
    setProducts((prev) => prev.filter((p) => p.vendor_link !== vendor_link));
  };

  const handleEdit = (product, index) => {
    setIsEditing(true);
    setEditIndex(index);
    setForm(product);
  };

  const handleDuplicate = (product) => {
    setIsEditing(false);
    setForm({
      ...product,
      vendor_link: `${product.vendor_link}-copy`
    });
  };

  return (
    <>
      <Head>
        <title>Core WIP</title>
      </Head>

      <Stack gap={0}>
        <Flex height="88vh" p={0} direction={{ base: "column", lg: "row" }}>
          {/* LEFT FORM */}
          <Stack gap={2} w={{ base: "100%", lg: "30%" }} bg="bg" p={4} overflow="auto">
            <HStack gap={4}>
              <Field.Root>
                <Field.Label>Link</Field.Label>
                <Input size="xs" name="vendor_link" value={form.vendor_link} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Vendor</Field.Label>
                <Input size="xs" name="vendor_name" value={form.vendor_name} onChange={handleChange} />
              </Field.Root>
            </HStack>

            <HStack gap={4}>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input size="xs" name="product_name" value={form.product_name} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Sku</Field.Label>
                <Input size="xs" name="product_sku" value={form.product_sku} onChange={handleChange} />
              </Field.Root>
            </HStack>

            <HStack gap={4}>
              <Field.Root>
                <Field.Label>Color(s)</Field.Label>
                <Input size="xs" name="product_color" value={form.product_color} onChange={handleChange} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Sizes</Field.Label>
                <Input size="xs" name="product_sizes_offered" value={form.product_sizes_offered} onChange={handleChange} />
              </Field.Root>
            </HStack>

            <HStack gap={4}>
              <Field.Root>
                <Field.Label>Product Family</Field.Label>
                <Input size="xs" name="product_family" value={form.product_family} onChange={handleChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>TaxCode</Field.Label>
                <NativeSelect.Root size="xs">
                  <NativeSelect.Field
                    name="taxcode"
                    value={form.taxcode}
                    onChange={handleChange}
                  >
                    <option value="PC040156">PC040156 - All Wearables</option>
                    <option value="P0000000">P0000000 - All Hardgoods</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>
            </HStack>

            <SimpleGrid columns={{ base: 2, lg: 3 }} gap={4}>
              <Field.Root>
                <Field.Label>Attribute Set</Field.Label>
                <NativeSelect.Root size="xs">
                  <NativeSelect.Field
                    name="attribute_set"
                    value={form.attribute_set}
                    onChange={handleChange}
                  >
                    <option value="">None</option>
                    <option value="Color">Color</option>
                    <option value="Color_and_Size">Color_and_Size</option>
                    <option value="Color_and_Size_and_Lenght">Color_and_Size_and_Lenght</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>IH/Vendor</Field.Label>
                <NativeSelect.Root size="xs">
                  <NativeSelect.Field
                    name="ihvendor"
                    value={form.ihvendor}
                    onChange={handleChange}
                  >
                    <option value="">None</option>
                    <option value="IH">In-house</option>
                    <option value="Vendor">Vendor</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Decoration</Field.Label>
                <Input size="xs" name="decoration" value={form.decoration} onChange={handleChange} />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 2, lg: 4 }} gap={4}>
              <Field.Root>
                <Field.Label>MOQ</Field.Label>
                <Input size="xs" name="moq" value={form.moq} onChange={handleChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Setup Cost</Field.Label>
                <Input size="xs" name="setup_cost" value={form.setup_cost} onChange={handleChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Deco Cost</Field.Label>
                <Input size="xs" name="deco_cost" value={form.deco_cost} onChange={handleChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Price</Field.Label>
                <Input size="xs" name="price" value={form.price} onChange={handleChange} />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 2, lg: 2 }} gap={4}>
              <Field.Root>
                <Field.Label>Brand</Field.Label>
                <Input size="xs" name="brand" value={form.brand} onChange={handleChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Production Time</Field.Label>
                <Input size="xs" name="production_time" value={form.production_time} onChange={handleChange} />
              </Field.Root>
            </SimpleGrid>

            <Field.Root>
              <Field.Label>Size Chart Link</Field.Label>
              <Input size="xs" name="size_chart_link" value={form.size_chart_link} onChange={handleChange} />
            </Field.Root>

            <Field.Root>
              <Field.Label>How To Measure Link</Field.Label>
              <Input size="xs" name="how_to_measure_link" value={form.how_to_measure_link} onChange={handleChange} />
            </Field.Root>
          </Stack>

          {/* TABLE */}
          <Box flex={1}>
            <Table.ScrollArea minW="100%">
              <Table.Root size="sm" interactive>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Link</Table.ColumnHeader>
                    <Table.ColumnHeader>Vendor</Table.ColumnHeader>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Sku</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {products.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>No products. Add</Table.Cell>
                    </Table.Row>
                  ) : (
                    products.map((product, index) => (
                      <Table.Row key={product.vendor_link}>
                        <Table.Cell>
                          <Text truncate maxW="240px">{product.vendor_link}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text truncate maxW="120px">{product.vendor_name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text truncate maxW="400px">{product.product_name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text truncate maxW="400px">{product.product_sku}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap={2} justifyContent="end">
                            <IconButton size="xs" variant="outline" onClick={() => handleEdit(product, index)}>
                              <TbEdit />
                            </IconButton>
                            <IconButton size="xs" variant="outline" onClick={() => handleDelete(product.vendor_link)}>
                              <TbTrash />
                            </IconButton>
                            <IconButton size="xs" variant="outline" onClick={() => handleDuplicate(product)}>
                              <TbCopy />
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        </Flex>

        {/* FOOTER */}
        <Flex
          height="6vh"
          flexShrink={0}
          borderTop="1px solid"
          borderColor="bg.muted"
          bg="bg"
          p={2}
          gap={4}
          justifyContent="flex-end"
          position="fixed"
          bottom={0}
          left={0}
          right={0}
        >
          <Button variant="outline" as={Link} href="/extension"><LuDownload /> Download Extension</Button>
          <Button onClick={handleExport} disabled={products.length === 0}>
            Export CSV <TbTableExport />
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update Product" : "Add Product"}{" "}
            {isEditing ? <TbEdit /> : <TbPlus />}
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
