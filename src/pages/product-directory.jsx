import { supabase } from "@/config/supabase"
import { Button, ButtonGroup, createListCollection, Field, Group, Heading, IconButton, Input, Pagination, Portal, Select, SimpleGrid, Spinner, Stack, Table, Text } from "@chakra-ui/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu"

const SEARCH_BY = createListCollection({
  items: [
    { value: "product_code", label: "SKU, Acumatica Code, Product Code" },
    { value: "name", label: "Product Name" }
  ]
})

export default function ProductDirectory() {
  const [loading, setLoading] = useState(false)
  const [searchedWord, setSearchedWord] = useState("")
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("product_code")
  const [totalCount, setTotalCount] = useState(0)
  const limit = 10;

  const handleSearch = async (searchedWord) => {
    setLoading(true)
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase.from("existing_products").select("*", { count: "exact" }).ilike(`${searchBy}`, `%${searchedWord}%`).range(from, to)
    if (error) {
      console.error(error)
      return
    }
    setTotalCount(count)
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    handleSearch(searchedWord)
  }, [page])

  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("existing_products").select("*").limit(10)
      if (error) {
        console.error(error)
        return
      }
      setProducts(data)
      setLoading(false)
    }
    fetchRandomProducts()
  }, [])

  return (
    <>
      <Head>
        <title>Product Directory</title>
      </Head>
      <Stack
        p={4}
        gap={4}
        alignSelf="center"
        w="750px"
      >
        <Heading>Product Directory</Heading>
        <Field.Root>
          <Field.Label>Search Existing Product</Field.Label>
          <Group attached w="full">
            <Input type="search" placeholder="Search" value={searchedWord} onChange={(e) => setSearchedWord(e.target.value)} />
            <Button onClick={() => handleSearch(searchedWord)}>
              <LuSearch />
              Search
            </Button>
          </Group>

          {/* <Field.HelperText>Check if product is existing.</Field.HelperText> */}
        </Field.Root>
        <SimpleGrid columns={2}>
          <Select.Root value={[searchBy]} onValueChange={e => setSearchBy(e.value)} collection={SEARCH_BY} size="sm">
            <Select.HiddenSelect />
            <Select.Label>Search By</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select By" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.ClearTrigger />
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {SEARCH_BY.items.map((searchBy) => (
                    <Select.Item item={searchBy} key={searchBy.value}>
                      {searchBy.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Pagination.Root onPageChange={e => setPage(e.page)} count={totalCount} page={page} pageSize={limit} mt="auto" ml="auto">
            <ButtonGroup size="sm" variant="ghost">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.PageText />
              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>

        </SimpleGrid>

        <Table.Root
          mt={4}
          size="sm"
          showColumnBorder
          interactive
          variant="outline"
          rounded="md"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="150px">Sku</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ?
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={2}>
                  <Spinner
                    mt={4}
                    alignSelf="center"
                  />
                </Table.Cell>
              </Table.Row>
              :
              products.length === 0 ?
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={2}>
                    No products found
                  </Table.Cell>
                </Table.Row>
                :
                products.map((product) => (
                  <Table.Row key={product.id}>
                    <Table.Cell>{product.product_code}</Table.Cell>
                    <Table.Cell>{product.name}</Table.Cell>
                  </Table.Row>
                ))
            }
          </Table.Body>
        </Table.Root>
      </Stack>
    </>

  )
}