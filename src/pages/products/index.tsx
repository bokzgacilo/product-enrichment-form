import { supabase } from "@/config/Supabase";
import { ProductFormValues } from "@/types/ProductFormValues";
import { ActionBar, Box, Button, Checkbox, CloseButton, Dialog, Field, Flex, Heading, IconButton, Input, Kbd, Portal, Spinner, Stack, Table, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useEffect, useMemo, useState } from "react";
import { LuPlus, LuTrash, LuX } from "react-icons/lu";

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

const List: FC<ProductsPageProps> = ({ catalogs, initialProducts, initialCatalogId }) => {
  const [catalogList, setCatalogList] = useState<Catalog[]>(catalogs);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(initialCatalogId);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [showOffCanvas, setShowOffCanvas] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductFormValues | null>(null)
  const [newCatalogName, setNewCatalogName] = useState<string>("");
  const [createCatalogLoading, setCreateCatalogLoading] = useState<boolean>(false);

  const selectedCatalog = useMemo(
    () => catalogList.find((catalog) => catalog.id === selectedCatalogId) ?? null,
    [catalogList, selectedCatalogId]
  );

  const fetchCatalogProducts = async () => {
    if (!selectedCatalogId) {
      setCatalogProducts([]);
      return;
    }

    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("core_products")
      .select("id,catalog_id,sku,name,vendor,brand")
      .eq("catalog_id", selectedCatalogId)
      .order("name");

    if (error) {
      console.error(error);
      setCatalogProducts([]);
    } else {
      setCatalogProducts(data ?? []);
    }

    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchCatalogProducts();
  }, [selectedCatalogId]);

  const handleFetchSelectedProduct = async (id: string) => {
    const { data, error } = await supabase.from('core_products').select('*').eq('id', id).maybeSingle()
    setSelectedProduct(data)
    console.log(data)
  }

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
      const updatedCatalogs = [...catalogList, data].sort((a, b) => a.name.localeCompare(b.name));
      setCatalogList(updatedCatalogs);
      setSelectedCatalogId(data.id);
      setCatalogProducts([]);
      setNewCatalogName("");
      setShowOffCanvas(false);
      setSelectedProduct(null);
    }

    setCreateCatalogLoading(false);
  };

  const [selection, setSelection] = useState<{ id: string }[]>([])
  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < catalogProducts.length;

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
            alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="border">
            <Heading size="md">Catalogs</Heading>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <IconButton
                  aria-label="Create catalog"
                  variant="outline"
                  size="xs"
                >
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
                        <Input value={newCatalogName} onChange={(e) => setNewCatalogName(e.target.value)} size="sm" placeholder="Spring 2026" />
                      </Field.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton />
                      </Dialog.CloseTrigger>
                      <Button size="sm" loading={createCatalogLoading} onClick={handleCreateCatalog}>Create</Button>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>

          </Flex>
          {catalogList.length === 0 ? (
            <Text p={4} color="fg.muted">No catalogs found.</Text>
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
          <Flex p={4} borderBottom="1px solid" borderColor="border" alignItems="center" justifyContent="space-between">
            <Heading size="lg">{selectedCatalog?.name ?? "Products"}</Heading>
            <Text color="fg.muted">{catalogProducts.length} product{catalogProducts.length === 1 ? "" : "s"}</Text>
          </Flex>
          <Table.ScrollArea maxW="100%" w="100%">
            <Table.Root size="sm" variant="outline" stickyHeader showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.surface">
                  <Table.ColumnHeader w="6"></Table.ColumnHeader>
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
                    <Table.Cell colSpan={12}>
                      No products found.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  catalogProducts.map((product) => (
                    <Table.Row
                      key={product.id}
                      bg={selection.some((item) => item.id === product.id) ? "bg.info" : "bg.surface"}
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
                                : selection.filter((item) => item.id !== product.id),
                            )
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>
                      <Table.Cell
                        cursor="pointer"
                        onClick={() => {
                          setShowOffCanvas(true)
                          handleFetchSelectedProduct(product.id)
                        }}
                      >{product.sku}</Table.Cell>
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
                  onClick={async () => {
                    const response = await supabase
                      .from('core_products')
                      .delete()
                      .in('id', selection.map((item) => item.id))

                    setCatalogProducts(prev =>
                      prev.filter(product => !selection.map((item) => item.id).includes(product.id))
                    )


                    if (response) {
                      console.log(response)
                      setSelection([])
                    }
                  }}
                  variant="outline" size="xs" colorPalette="red"><LuTrash /> Remove Selected</Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>
        <Stack
          gap={4}
          borderLeft="1px solid"
          borderLeftColor="border"
          p={4}
          w="500px" display={showOffCanvas ? "flex" : "none"}
        >
          {
            selectedProduct ? (
              <>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text>{selectedProduct.name}</Text>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      setShowOffCanvas(false)
                      setSelectedProduct(null)
                    }}>
                    <LuX />
                  </IconButton>
                </Flex>
                <Stack
                  overflow="auto"
                >
                  <Field.Root>
                    <Field.Label>SKU</Field.Label>
                    <Input value={selectedProduct.sku} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input value={selectedProduct.name} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Vendor</Field.Label>
                    <Input value={selectedProduct.vendor} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Brand</Field.Label>
                    <Input value={selectedProduct.brand} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Category</Field.Label>
                    <Input value={selectedProduct.category} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Family</Field.Label>
                    <Input value={selectedProduct.family} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Price</Field.Label>
                    <Input value={selectedProduct.price} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Size Chart Link</Field.Label>
                    <Input value={selectedProduct.size_chart_link} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>How To Measure Link</Field.Label>
                    <Input value={selectedProduct.how_to_measure_link} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Decoration Method</Field.Label>
                    <Input value={selectedProduct.decoration_method} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Setup Cost</Field.Label>
                    <Input value={selectedProduct.setup_cost} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Setup Cost Code</Field.Label>
                    <Input value={selectedProduct.setup_cost_code} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Deco Cost</Field.Label>
                    <Input value={selectedProduct.deco_cost} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>MOQ</Field.Label>
                    <Input value={selectedProduct.moq} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Production Time</Field.Label>
                    <Input value={selectedProduct.production_time} variant="subtle" disabled size="sm" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Shipping Weight</Field.Label>
                    <Input value={selectedProduct.shipping_weight} variant="subtle" disabled size="sm" />
                  </Field.Root>
                </Stack>
              </>
            ) : (
              <Spinner />
            )
          }
        </Stack>
      </Flex >
    </>
  );
};

export default List;
