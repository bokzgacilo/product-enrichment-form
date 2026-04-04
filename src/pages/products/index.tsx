import { supabase } from "@/config/Supabase";
import { CategoryList } from "@/constants/Category";
import { ProductFormValues } from "@/types/ProductFormValues";
import {
  ActionBar,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Heading,
  IconButton,
  Input,
  NativeSelect,
  Portal,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { LuPen, LuPlus, LuSave, LuSearch, LuTrash, LuX } from "react-icons/lu";

type Catalog = {
  id: string;
  name: string;
};

type CatalogProduct = {
  id: string;
  catalog_id: string | null;
  sku: string;
  name: string | null;
  vendor: string | null;
  brand: string | null;
};

type ProductsPageProps = {
  catalogs: Catalog[];
  initialProducts: CatalogProduct[];
  initialCatalogId: string | null;
};

type ExtendedProductFormValues = {
  id: string;
} & ProductFormValues;

export async function getServerSideProps() {
  const { data: catalogsData, error: catalogsError } = await supabase
    .from("catalogs")
    .select("id,name")
    .order("name");

  if (catalogsError) {
    console.error(catalogsError);

    return {
      props: {
        catalogs: [],
        initialProducts: [],
        initialCatalogId: null,
      },
    };
  }

  const catalogs = catalogsData ?? [];
  const initialCatalogId = catalogs[0]?.id ?? null;

  if (!initialCatalogId) {
    return {
      props: {
        catalogs,
        initialProducts: [],
        initialCatalogId: null,
      },
    };
  }

  const { data: initialProductsData, error: productsError } = await supabase
    .from("core_products")
    .select("id,catalog_id,sku,name,vendor,brand,category,family")
    .eq("catalog_id", initialCatalogId)
    .order("name");

  if (productsError) {
    console.error(productsError);
  }

  return {
    props: {
      catalogs,
      initialProducts: initialProductsData ?? [],
      initialCatalogId,
    },
  };
}

const toNullableNumber = (value: string): number | null => {
  if (value.trim() === "") return null;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const List: FC<ProductsPageProps> = ({
  catalogs,
  initialProducts,
  initialCatalogId,
}) => {
  const [catalogList, setCatalogList] = useState<Catalog[]>(catalogs);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    initialCatalogId
  );
  const [catalogProducts, setCatalogProducts] =
    useState<CatalogProduct[]>(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  const [showOffCanvas, setShowOffCanvas] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ExtendedProductFormValues | null>(null);
  const [editableProduct, setEditableProduct] =
    useState<ExtendedProductFormValues | null>(null);
  const [debouncedEditableProduct, setDebouncedEditableProduct] =
    useState<ExtendedProductFormValues | null>(null);

  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [updateProductLoading, setUpdateProductLoading] =
    useState<boolean>(false);

  const [newCatalogName, setNewCatalogName] = useState<string>("");
  const [createCatalogLoading, setCreateCatalogLoading] =
    useState<boolean>(false);
  const [skuKeyword, setSkuKeyword] = useState<string>("");

  const [selection, setSelection] = useState<{ id: string }[]>([]);

  const selectedCatalog = useMemo(
    () => catalogList.find((catalog) => catalog.id === selectedCatalogId) ?? null,
    [catalogList, selectedCatalogId]
  );
  const selectedEditableCategory = useMemo(
    () =>
      CategoryList.find(
        (category) => category.label === editableProduct?.category
      ) ?? null,
    [editableProduct?.category]
  );
  const familyOptions = selectedEditableCategory?.families ?? [];

  const hasSelection = selection.length > 0;
  const productInputVariant = isEditingProduct ? "outline" : "subtle";

  const fetchCatalogProducts = useCallback(async () => {
    if (!selectedCatalogId) {
      setCatalogProducts([]);
      return;
    }

    setLoadingProducts(true);

    let query = supabase
      .from("core_products")
      .select("id,catalog_id,sku,name,vendor,brand")
      .eq("catalog_id", selectedCatalogId)
      .order("name");

    if (skuKeyword.trim()) {
      query = query.ilike("sku", `%${skuKeyword.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setCatalogProducts([]);
    } else {
      setCatalogProducts(data ?? []);
    }

    setLoadingProducts(false);
  }, [selectedCatalogId, skuKeyword]);

  useEffect(() => {
    void Promise.resolve().then(fetchCatalogProducts);
  }, [fetchCatalogProducts]);

  useEffect(() => {
    if (!editableProduct || !isEditingProduct) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedEditableProduct(editableProduct);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [editableProduct, isEditingProduct]);

  const handleFetchSelectedProduct = async (id: string) => {
    const { data, error } = await supabase
      .from("core_products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setSelectedProduct(data);
    setEditableProduct(data);
    setDebouncedEditableProduct(data);
    setIsEditingProduct(false);
  };

  const handleCreateCatalog = async () => {
    const trimmedName = newCatalogName.trim();

    if (!trimmedName) {
      return;
    }

    setCreateCatalogLoading(true);

    const { data, error } = await supabase
      .from("catalogs")
      .insert([{ name: trimmedName }])
      .select("id,name")
      .single();

    if (error) {
      console.error(error);
      setCreateCatalogLoading(false);
      return;
    }

    if (data) {
      const updatedCatalogs = [...catalogList, data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCatalogList(updatedCatalogs);
      setSelectedCatalogId(data.id);
      setCatalogProducts([]);
      setNewCatalogName("");
      setShowOffCanvas(false);
      setSelectedProduct(null);
      setEditableProduct(null);
      setDebouncedEditableProduct(null);
      setIsEditingProduct(false);
    }

    setCreateCatalogLoading(false);
  };

  const handleProductInputChange = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K]
  ) => {
    setEditableProduct((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleCategoryChange = (categoryLabel: string) => {
    const nextCategory =
      CategoryList.find((category) => category.label === categoryLabel) ?? null;

    setEditableProduct((prev) => {
      if (!prev) return prev;

      const nextFamily = nextCategory?.families.includes(prev.family)
        ? prev.family
        : (nextCategory?.families[0] ?? "");

      return {
        ...prev,
        category: categoryLabel,
        family: nextFamily,
      };
    });
  };

  const handleCancelEdit = () => {
    setEditableProduct(selectedProduct);
    setDebouncedEditableProduct(selectedProduct);
    setIsEditingProduct(false);
  };

  const handleClosePanel = () => {
    setShowOffCanvas(false);
    setSelectedProduct(null);
    setEditableProduct(null);
    setDebouncedEditableProduct(null);
    setIsEditingProduct(false);
    setUpdateProductLoading(false);
  };

  const handleUpdateProduct = async () => {
    if (!editableProduct?.id) {
      return;
    }

    setUpdateProductLoading(true);

    const { data, error } = await supabase
      .from("core_products")
      .update({
        sku: editableProduct.sku,
        name: editableProduct.name,
        vendor: editableProduct.vendor,
        brand: editableProduct.brand,
        category: editableProduct.category,
        family: editableProduct.family,
        price: editableProduct.price,
        size_chart_link: editableProduct.size_chart_link,
        how_to_measure_link: editableProduct.how_to_measure_link,
        decoration_method: editableProduct.decoration_method,
        setup_cost: editableProduct.setup_cost,
        setup_cost_code: editableProduct.setup_cost_code,
        deco_cost: editableProduct.deco_cost,
        moq: editableProduct.moq,
        production_time: editableProduct.production_time,
        shipping_weight: editableProduct.shipping_weight,
      })
      .eq("id", editableProduct.id)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      setUpdateProductLoading(false);
      return;
    }

    setSelectedProduct(data);
    setEditableProduct(data);
    setDebouncedEditableProduct(data);
    setIsEditingProduct(false);

    setCatalogProducts((prev) =>
      prev.map((product) =>
        product.id === data.id
          ? {
            ...product,
            sku: data.sku,
            name: data.name,
            vendor: data.vendor,
            brand: data.brand,
          }
          : product
      )
    );

    setUpdateProductLoading(false);
  };

  return (
    <>
      <Head>
        <title>Catalog Products</title>
      </Head>

      <Flex height="calc(100vh - 5vh)" overflow="hidden">
        <Stack
          width="280px"
          minWidth="280px"
          gap={0}
          borderRight="1px solid"
          borderColor="border"
          overflow="auto"
        >
          <Flex
            px={4}
            pt={4}
            pb={3}
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid"
            borderColor="border"
          >
            <Heading size="md">Catalogs</Heading>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <IconButton aria-label="Create catalog" variant="outline" size="xs">
                  <LuPlus />
                </IconButton>
              </Dialog.Trigger>

              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Create Catalog</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                      <Field.Root required>
                        <Field.Label>Catalog Name</Field.Label>
                        <Input
                          value={newCatalogName}
                          onChange={(e) => setNewCatalogName(e.target.value)}
                          size="sm"
                          placeholder="Spring 2026"
                        />
                      </Field.Root>
                    </Dialog.Body>

                    <Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton />
                      </Dialog.CloseTrigger>
                      <Button
                        size="sm"
                        loading={createCatalogLoading}
                        onClick={handleCreateCatalog}
                      >
                        Create
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Flex>

          {catalogList.length === 0 ? (
            <Text p={4} color="fg.muted">
              No catalogs found.
            </Text>
          ) : (
            catalogList.map((catalog) => {
              const isActive = catalog.id === selectedCatalogId;

              return (
                <Button
                  key={catalog.id}
                  justifyContent="flex-start"
                  variant={isActive ? "solid" : "ghost"}
                  rounded="none"
                  height="auto"
                  py={2}
                  px={4}
                  fontWeight={isActive ? "semibold" : "normal"}
                  onClick={() => setSelectedCatalogId(catalog.id)}
                >
                  {catalog.name}
                </Button>
              );
            })
          )}
        </Stack>

        <Stack flex="1" gap={0} overflow="hidden">
          <Flex
            p={4}
            borderBottom="1px solid"
            borderColor="border"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="lg">{selectedCatalog?.name ?? "Products"}</Heading>
            <Text color="fg.muted">
              {catalogProducts.length} product{catalogProducts.length === 1 ? "" : "s"}
            </Text>
          </Flex>

          <Flex p={4} gap={2} borderBottom="1px solid" borderColor="border">
            <Input
              size="sm"
              placeholder="Search SKU"
              value={skuKeyword}
              onChange={(e) => setSkuKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void fetchCatalogProducts();
                }
              }}
            />
            <Button size="sm" onClick={() => void fetchCatalogProducts()}>
              Search <LuSearch />
            </Button>
          </Flex>

          <Table.ScrollArea maxW="100%" w="100%">
            <Table.Root size="sm" variant="outline" stickyHeader showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.surface">
                  <Table.ColumnHeader w="6" />
                  <Table.ColumnHeader>SKU</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Vendor</Table.ColumnHeader>
                  <Table.ColumnHeader>Brand</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {loadingProducts ? (
                  <Table.Row>
                    <Table.Cell colSpan={12}>
                      <Flex>
                        <Spinner />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : catalogProducts.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={12}>No products found.</Table.Cell>
                  </Table.Row>
                ) : (
                  catalogProducts.map((product) => (
                    <Table.Row
                      key={product.id}
                      bg={
                        selection.some((item) => item.id === product.id)
                          ? "bg.info"
                          : "bg.surface"
                      }
                    >
                      <Table.Cell>
                        <Checkbox.Root
                          size="sm"
                          top="0.5"
                          aria-label="Select row"
                          checked={selection.some((item) => item.id === product.id)}
                          onCheckedChange={(changes) => {
                            setSelection((prev) =>
                              changes.checked
                                ? [...prev, { id: product.id }]
                                : prev.filter((item) => item.id !== product.id)
                            );
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>

                      <Table.Cell
                        cursor="pointer"
                        onClick={() => {
                          setShowOffCanvas(true);
                          void handleFetchSelectedProduct(product.id);
                        }}
                      >
                        {product.sku}
                      </Table.Cell>

                      <Table.Cell>{product.name}</Table.Cell>
                      <Table.Cell>{product.vendor}</Table.Cell>
                      <Table.Cell>{product.brand}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Stack>

        <ActionBar.Root open={hasSelection}>
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <ActionBar.SelectionTrigger>
                  {selection.length} item{selection.length === 1 ? "" : "s"} selected
                </ActionBar.SelectionTrigger>

                <ActionBar.Separator />

                <Button
                  variant="outline"
                  size="xs"
                  colorPalette="red"
                  onClick={async () => {
                    const ids = selection.map((item) => item.id);

                    const response = await supabase
                      .from("core_products")
                      .delete()
                      .in("id", ids);

                    if (response.error) {
                      console.error(response.error);
                      return;
                    }

                    setCatalogProducts((prev) =>
                      prev.filter((product) => !ids.includes(product.id))
                    );
                    setSelection([]);
                  }}
                >
                  <LuTrash />
                  Remove Selected
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>

        <Stack
          gap={4}
          borderLeft="1px solid"
          borderLeftColor="border"
          p={4}
          w="500px"
          display={showOffCanvas ? "flex" : "none"}
        >
          {selectedProduct ? (
            <>
              <Flex alignItems="center" justifyContent="space-between">
                <Text>{selectedProduct.name}</Text>

                <Flex alignItems="center" gap={2}>
                  <Button
                    size="xs"
                    variant={isEditingProduct ? "solid" : "outline"}
                    loading={updateProductLoading}
                    onClick={
                      isEditingProduct
                        ? handleUpdateProduct
                        : () => setIsEditingProduct(true)
                    }
                  >
                    {isEditingProduct ? "Save" : "Edit"}
                    {isEditingProduct ? <LuSave /> : <LuPen />}
                  </Button>

                  {isEditingProduct && (
                    <Button
                      size="xs"
                      variant="outline"
                      loading={updateProductLoading}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                      <LuX />
                    </Button>
                  )}

                  <IconButton size="xs" variant="ghost" onClick={handleClosePanel}>
                    <LuX />
                  </IconButton>
                </Flex>
              </Flex>

              <Stack overflow="auto">
                <Field.Root>
                  <Field.Label>SKU</Field.Label>
                  <Input
                    value={editableProduct?.sku ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("sku", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input
                    value={editableProduct?.name ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("name", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Vendor</Field.Label>
                  <Input
                    value={editableProduct?.vendor ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("vendor", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Brand</Field.Label>
                  <Input
                    value={editableProduct?.brand ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("brand", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Category</Field.Label>
                  <NativeSelect.Root size="sm" disabled={!isEditingProduct}>
                    <NativeSelect.Field
                      value={editableProduct?.category ?? ""}

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
                  <NativeSelect.Root size="sm" disabled={!isEditingProduct}>
                    <NativeSelect.Field
                      value={editableProduct?.family ?? ""}

                      onChange={(e) =>
                        handleProductInputChange("family", e.target.value)
                      }
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

                <Field.Root>
                  <Field.Label>Price</Field.Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={editableProduct?.price ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange(
                        "price",
                        toNullableNumber(e.target.value) as ProductFormValues["price"]
                      )
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Size Chart Link</Field.Label>
                  <Input
                    value={editableProduct?.size_chart_link ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("size_chart_link", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>How To Measure Link</Field.Label>
                  <Input
                    value={editableProduct?.how_to_measure_link ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("how_to_measure_link", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Decoration Method</Field.Label>
                  <Input
                    value={editableProduct?.decoration_method ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("decoration_method", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Setup Cost</Field.Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={editableProduct?.setup_cost ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange(
                        "setup_cost",
                        toNullableNumber(e.target.value) as ProductFormValues["setup_cost"]
                      )
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Setup Cost Code</Field.Label>
                  <Input
                    value={editableProduct?.setup_cost_code ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("setup_cost_code", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Deco Cost</Field.Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={editableProduct?.deco_cost ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange(
                        "deco_cost",
                        toNullableNumber(e.target.value) as ProductFormValues["deco_cost"]
                      )
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>MOQ</Field.Label>
                  <Input
                    type="number"
                    value={editableProduct?.moq ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange(
                        "moq",
                        toNullableNumber(e.target.value) as ProductFormValues["moq"]
                      )
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Production Time</Field.Label>
                  <Input
                    value={editableProduct?.production_time ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange("production_time", e.target.value)
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Shipping Weight</Field.Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={editableProduct?.shipping_weight ?? ""}
                    variant={productInputVariant}
                    disabled={!isEditingProduct}
                    size="sm"
                    onChange={(e) =>
                      handleProductInputChange(
                        "shipping_weight",
                        toNullableNumber(e.target.value) as ProductFormValues["shipping_weight"]
                      )
                    }
                  />
                </Field.Root>
              </Stack>
            </>
          ) : (
            <Spinner />
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default List;
