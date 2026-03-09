import { supabase } from "@/config/Supabase";
import { Button, ButtonGroup, Link, Flex, Heading, IconButton, Input, Pagination, Stack, Table, Box } from "@chakra-ui/react";
import Head from "next/head.js";
import { FC, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuPen, LuTrash } from "react-icons/lu";

type Product = {
  sku: string;
  name: string;
  url: string;
  vendor: string;
  brand: string;
}

const PAGE_SIZE = 10;

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

  const handleSearch = async () => {
    const { data } = await supabase
      .from("products")
      .select("sku,name,url,vendor,brand")
      .ilike("name", `%${searchWord}%`);

    setCoreProducts(data || []);
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
                <IconButton variant="outline" size="sm">
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.NextTrigger asChild>
                <IconButton variant="outline" size="sm">
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>
        <Flex gap={2} maxW="500px" px={4}>
          <Input size="sm" type="search" onChange={(e) => setSearchWord(e.target.value)} value={searchWord} placeholder="Search" />
          <Button size="sm" onClick={handleSearch}>Search</Button>
        </Flex>
        <Box px={4}>
          <Table.Root rounded="md" size="sm" variant="outline" showColumnBorder>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader colSpan={6}>SKU</Table.ColumnHeader>
                <Table.ColumnHeader colSpan={6}>Name</Table.ColumnHeader>
                <Table.ColumnHeader colSpan={6}>Vendor</Table.ColumnHeader>
                <Table.ColumnHeader colSpan={6}>Brand</Table.ColumnHeader>
                <Table.ColumnHeader w="1%">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {CoreProducts.map((product) => (
                <Table.Row key={product.sku}>
                  <Table.Cell colSpan={6}>{product.sku}</Table.Cell>
                  <Table.Cell colSpan={6}>{product.name}</Table.Cell>
                  <Table.Cell colSpan={6}>{product.vendor}</Table.Cell>
                  <Table.Cell colSpan={6}>{product.brand}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <ButtonGroup>
                      <Button variant="outline" size="xs" asChild>
                        <Link href={`/corewip/edit/${product.sku}`}><LuPen /> Edit</Link>
                      </Button>
                      <Button variant="solid" size="xs" colorPalette="red"><LuTrash />Remove</Button>
                    </ButtonGroup>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack >
    </>
  );
};

export default List;
