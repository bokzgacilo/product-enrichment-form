import { supabase } from "@/config/Supabase";
import { Field, Flex, Text, Heading, Input, SimpleGrid, Stack, IconButton, CheckboxCard, Table, Button, HStack } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useState } from "react";
import { LuPlus } from "react-icons/lu";

type SearchedProducts = {
  sku: string,
  colors: string[],
}

type Product = {
  id: string
  url: string | null
  vendor: string | null
  brand: string | null
  name: string
  sku: string
  colors: string[] | null
  sizes: string | null
  category: string | null
  family: string | null
  price_usd: number | null
  size_chart_link: string | null
  how_to_measure_guide_link: string | null
  decoration_method: string | null
  moq: number | null
  production_time: string | null
  shipping_weight: number | null
  tax_code: string | null
}

const productColumns: (keyof Product)[] = [
  "id",
  "url",
  "vendor",
  "brand",
  "name",
  "sku",
  "colors",
  "sizes",
  "category",
  "family",
  "price_usd",
  "size_chart_link",
  "how_to_measure_guide_link",
  "decoration_method",
  "moq",
  "production_time",
  "shipping_weight",
  "tax_code",
]

const Builder: FC = () => {
  const [parentProducts, setParentProducts] = useState<Product[]>([]);
  const [searchedProducts, setSearcedProducts] = useState<SearchedProducts[]>([
    // { sku: "test", colors: ["red", "blue", "black", "grey", "titanium black 234"] }
  ])
  const [searchedWord, setSearchedWord] = useState<string>("")

  const handleSearch = async () => {
    const { data } = await supabase
      .from('products')
      .select('sku, colors')
      .or(`sku.ilike.%${searchedWord}%`)

    if (!data) return;

    console.log(data)

    setSearcedProducts(data)
  }

  return (
    <>
      <Head>
        <title>Parent Builder</title>
      </Head>
      <SimpleGrid
        height="calc(100vh - 5vh)"
        templateColumns="30% 1fr"
      >
        <Stack p={4}
          borderRight="1px solid"
          borderColor="border"
          overflow="auto"
        >
          <Field.Root>
            <Field.Label>Product SKU</Field.Label>
            <Input
              type="search"
              size="xs"
              placeholder="Search SKU"
              onChange={(e) => setSearchedWord(e.target.value)}
              value={searchedWord}
            />
            <Field.HelperText>
              Search for a product to add it to the parent list
            </Field.HelperText>
            <Button size="xs" onClick={handleSearch}>Search</Button>
          </Field.Root>
          <Stack
            mt={4}

            overflow="auto"
          >
            {
              searchedProducts.map((product) => (
                <Flex
                  border="1px solid"
                  borderColor="border"
                  p={4}
                  rounded="sm"
                  gap={0}
                >
                  <Stack gap={4}>
                    <Text>{product.sku}</Text>
                    <HStack
                      wrap="wrap"
                      gap={2}
                    >
                      {product.colors?.length ? (
                        product.colors.map((color) => (
                          <CheckboxCard.Root
                            cursor="pointer"
                            colorPalette="blue"
                            key={color}
                            size="sm"
                            variant="surface"
                            flex={0}
                          >
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control
                              alignItems="center"
                              justifyContent="center"
                              py={1}
                            >
                              <CheckboxCard.Label
                                whiteSpace="nowrap"
                                fontSize="sm"
                              >{color}</CheckboxCard.Label>
                              {/* <CheckboxCard.Indicator rounded="full" /> */}
                            </CheckboxCard.Control>
                          </CheckboxCard.Root>
                        ))
                      ) : (
                        <Text>No colors available</Text>
                      )}
                    </HStack>
                  </Stack>
                  <IconButton size="xs" ml="auto">
                    <LuPlus />
                  </IconButton>
                </Flex>
              ))
            }
          </Stack>
        </Stack>
        <Stack p={4} overflow="auto">
          <Heading>Parent Products</Heading>
          <Table.ScrollArea
            width="100%"
          >
            <Table.Root
              variant="outline"
              showColumnBorder
            >
              <Table.Header>
                <Table.Row>
                  {
                    productColumns.map((column) => (
                      <Table.ColumnHeader
                        key={column}
                        width="auto"
                      >{column}</Table.ColumnHeader>
                    ))
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>

                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Stack>
      </SimpleGrid>
    </>
  )
}

export default Builder;