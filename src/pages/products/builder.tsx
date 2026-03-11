import { supabase } from "@/config/Supabase";
import { Field, Flex, Text, Heading, Input, SimpleGrid, Stack, IconButton, CheckboxCard, Table, Button, HStack } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { TbTableExport } from "react-icons/tb";

type SearchedProducts = {
  sku: string,
  colors: string[],
}

type Product = {
  url: string | null
  vendor: string | null
  brand: string | null
  name: string
  sku: string
  colors: string | null
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
  const [selectedColors, setSelectedColors] = useState<Record<string, string[]>>({})
  const [items, setItems] = useState<any[]>([]);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const handleSearch = async () => {
    const { data } = await supabase
      .from('products')
      .select('sku, colors')
      .ilike("sku", `%${searchedWord}%`)
      .limit(7)

    if (!data) return;

    console.log(data)

    setSearcedProducts(data)
  }

  const handleColorChange = (sku: string, color: string, checked: boolean) => {
    setSelectedColors(prev => {
      const current = prev[sku] || []

      let updated

      if (checked) {
        updated = [...current, color]
      } else {
        updated = current.filter(c => c !== color)
      }

      return {
        ...prev,
        [sku]: updated
      }
    })
  }

  const handleInsert = (sku: string) => {
    const colors = selectedColors[sku] || []

    // if (!colors.length) return

    const newRow = {
      sku,
      color: colors.join(",")
    }

    setItems(prev => {
      const filtered = prev.filter(item => item.sku !== sku)
      return [...filtered, newRow]
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      if (!items.length) return

      const uniqueSkus = [...new Set(items.map(item => item.sku))]

      for (const sku of uniqueSkus) {
        const { data } = await supabase
          .from("products")
          .select(`
          url,
          vendor,
          brand,
          name,
          sku,
          sizes,
          category,
          family,
          price_usd,
          size_chart_link,
          how_to_measure_guide_link,
          decoration_method,
          moq,
          production_time,
          shipping_weight,
          tax_code
        `)
          .eq("sku", sku)
          .single()

        if (!data) continue

        const colors = (selectedColors[sku] || []).join(",")

        const productRow: Product = {
          ...data,
          colors
        }

        setParentProducts(prev =>
          prev.some(p => p.sku === productRow.sku)
            ? prev
            : [...prev, productRow]
        )
      }
    }
    fetchProducts()
  }, [items])

  useEffect(() => {
    console.log(parentProducts)
  }, [parentProducts])

  const handleParentExport = async () => {
    setButtonLoading(true)
    const res = await fetch("/api/product/export-parent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parentProducts)
    })

    const csvText = await res.text()

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "products.csv"

    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    setButtonLoading(false)
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
        <Stack
          py={4}
          borderRight="1px solid"
          borderColor="border"
          overflow="auto"
        >
          <Field.Root
            px={4}
          >
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
            gap={0}
            overflow="auto"
          >
            {
              searchedProducts.map((product, index) => (
                <Flex
                  borderBottom="1px solid"
                  borderColor="border"
                  rounded="sm"
                  gap={0}
                  pb={4}
                  pt={2}
                  pl={4}
                  pr={2}
                  key={`${product.sku}-${index}`}
                >
                  <Stack
                    gap={2}
                  >
                    <Text>{product.sku}</Text>
                    <HStack
                      wrap="wrap"
                      gap={2}
                    >
                      {product.colors?.length ? (
                        product.colors.map((color, index) => {

                          const isChecked = selectedColors[product.sku]?.includes(color)

                          return (
                            <CheckboxCard.Root
                              cursor="pointer"
                              colorPalette="blue"
                              key={`${product.sku}-${color}-${index}`}
                              size="sm"
                              variant="surface"
                              rounded="full"

                              flex={0}
                              checked={isChecked}
                              onCheckedChange={(e) =>
                                handleColorChange(product.sku, color, !!e.checked)
                              }
                            >
                              <CheckboxCard.HiddenInput />
                              <CheckboxCard.Control
                                alignItems="center"
                                justifyContent="center"
                                py={1}
                                px={3}
                              >
                                <CheckboxCard.Label
                                  whiteSpace="nowrap"
                                  fontSize="10px"
                                >{color}</CheckboxCard.Label>
                              </CheckboxCard.Control>
                            </CheckboxCard.Root>
                          )
                        })
                      ) : (
                        <Text>No colors available</Text>
                      )}
                    </HStack>
                  </Stack>
                  <IconButton variant="outline" size="xs" ml="auto" onClick={() => handleInsert(product.sku)}>
                    <LuPlus />
                  </IconButton>
                </Flex>
              ))
            }
          </Stack>
        </Stack>
        <Stack py={4} overflow="auto">
          <Flex px={4} alignItems="center" gap={4}>
            <Heading>Parent Products</Heading>
            <Button loading={buttonLoading} onClick={handleParentExport} size="xs"><TbTableExport />Export Parent</Button>
          </Flex>
          <Table.ScrollArea
            width="100%"
            height="100%"
            bg="gray.50"
          >
            <Table.Root
              variant="outline"
              showColumnBorder
              size="sm"
            >
              <Table.Header>
                <Table.Row
                  bg="bg.surface"
                >
                  {
                    productColumns.map((column) => (
                      <Table.ColumnHeader
                        key={column}
                      >{column}</Table.ColumnHeader>
                    ))
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {parentProducts.map((product) => (
                  <Table.Row
                    bg="bg"
                    key={product.sku}>
                    <Table.Cell>{product.url}</Table.Cell>
                    <Table.Cell>{product.vendor}</Table.Cell>
                    <Table.Cell>{product.brand}</Table.Cell>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.sku}</Table.Cell>
                    <Table.Cell>{product.colors}</Table.Cell>
                    <Table.Cell>{product.sizes}</Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>{product.family}</Table.Cell>
                    <Table.Cell>{product.price_usd}</Table.Cell>
                    <Table.Cell>{product.size_chart_link}</Table.Cell>
                    <Table.Cell>{product.how_to_measure_guide_link}</Table.Cell>
                    <Table.Cell>{product.decoration_method}</Table.Cell>
                    <Table.Cell>{product.moq}</Table.Cell>
                    <Table.Cell>{product.production_time}</Table.Cell>
                    <Table.Cell>{product.shipping_weight}</Table.Cell>
                    <Table.Cell>{product.tax_code}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Stack>
      </SimpleGrid >
    </>
  )
}

export default Builder;