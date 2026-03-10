import { supabase } from "@/config/Supabase";
import { Button, ButtonGroup, Link, Flex, Heading, IconButton, Input, Pagination, Stack, Table, Box, Spinner } from "@chakra-ui/react";
import Head from "next/head.js";
import { FC, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuPen, LuSearch, LuTrash } from "react-icons/lu";
import { TbTableExport } from "react-icons/tb";

type Product = {
  sku: string;
  name: string;
  url: string;
  vendor: string;
  brand: string;
}

const PAGE_SIZE = 12;

export async function getServerSideProps() {
  const { data, count, error } = await supabase
    .from("products")
    .select("sku,name,url,vendor,brand", { count: "exact" })
    .range(0, 9);

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    return {
      props: {
        products: data,
        count: count ?? 0,
      },
    };
  }
}

const List: FC = ({ products, count }: { products: Product[], count: number }) => {
  const [CoreProducts, setCoreProducts] = useState<Product[]>(products);
  const [page, setPage] = useState<number>(1);
  const [searchWord, setSearchWord] = useState<string>("");
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const fetchProducts = async (pageNumber: number) => {
    setTableLoading(true);

    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("products")
      .select("sku,name,url,vendor,brand")
      .range(from, to);

    if (!error && data) {
      setCoreProducts(data);
      setTableLoading(false)
    }
  };

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page);
  }, [page]);

  const handleSearch = async () => {
    const from = 0 * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("products")
      .select("sku,name,url,vendor,brand")
      .or(
        `name.ilike.%${searchWord}%,sku.ilike.%${searchWord}%,brand.ilike.%${searchWord}%,vendor.ilike.%${searchWord}%,url.ilike.%${searchWord}%`
      )
      .range(from, to);

    setCoreProducts(data || []);
  }

  const handleRemove = async (sku: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("sku", sku)

    if (!error) {
      setCoreProducts((prev) => prev.filter((p) => p.sku !== sku))
    }
  }

  return (
    <>
      <Head>
        <title>Core Product List</title>
      </Head>
      <Stack p={0} pt={4} gap={4}>
        <Flex px={4} alignItems="center" justifyContent="space-between">
          <Heading>Products [{count}]</Heading>

          <Pagination.Root count={count} pageSize={PAGE_SIZE} defaultPage={1} page={page} onPageChange={(e) => setPage(e.page)}>
            <ButtonGroup>
              <Pagination.PageText format="long" flex="1" />
              <Pagination.PrevTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.NextTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>
        <Flex gap={2} maxW="500px" px={4}>
          <Input size="xs" type="search" onChange={(e) => setSearchWord(e.target.value)} value={searchWord} placeholder="Search" />
          <Button size="xs" onClick={handleSearch}>Search <LuSearch /></Button>
          <Button size="xs" asChild><Link href="/products/builder">Export Parent <TbTableExport /></Link></Button>
        </Flex>
        <Box px={4} position="relative">
          {
            tableLoading && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0, 0, 0, 0.02)"
                display="flex"
                backdropFilter="blur(2px)"
                alignItems="center"
                justifyContent="center"
                zIndex="10"
                rounded="md"
              >
                <Spinner />
              </Box>
            )
          }
          <Table.ScrollArea rounded="md" >
            <Table.Root border="1px solid" borderColor="border" size="sm" variant="outline" showColumnBorder interactive>
              <Table.Header>
                <Table.Row>
                  {
                    ["SKU", "Name", "Vendor", "Brand", "Actions"].map((header) => (
                      <Table.ColumnHeader
                        key={header}
                        width={header === "Actions" ? "1%" : "auto"}
                        colSpan={header === "Actions" ? 1 : 6}
                      >{header}</Table.ColumnHeader>
                    ))
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {CoreProducts.map((product) => (
                  <Table.Row
                    key={product.sku}
                    cursor="pointer"
                  >
                    <Table.Cell colSpan={6}><Link href={`/products/${product.sku}`}>{product.sku}</Link></Table.Cell>
                    <Table.Cell colSpan={6}>{product.name}</Table.Cell>
                    <Table.Cell colSpan={6}>{product.vendor}</Table.Cell>
                    <Table.Cell colSpan={6}>{product.brand}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <ButtonGroup>
                        <Button variant="ghost" size="xs" colorPalette="red" onClick={() => handleRemove(product.sku)}><LuTrash /></Button>
                      </ButtonGroup>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      </Stack >
    </>
  );
};

export default List;
