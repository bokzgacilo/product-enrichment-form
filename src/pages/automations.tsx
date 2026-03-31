import { supabase } from "@/config/Supabase";
import { logout } from "@/middleware";
import { Button, Field, Flex, Heading, Icon, IconButton, Input, NativeSelect, PinInput, SimpleGrid, Spinner, Stack, Table, Text, Textarea } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { LuCheck, LuRefreshCcw, LuSave, LuSettings, LuSettings2, LuX } from "react-icons/lu";

type Notification = {
  url: string;
  status: "scanning" | "finished" | "error";
};

const AutomationsPage = () => {
  const router = useRouter()
  const [supplier, setSupplier] = useState<string>("Sanmar")
  const [urlList, setUrlList] = useState<Array<string>>([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<"Idle" | "Running" | "Done" | "Error">("Idle")
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [skuExistsMap, setSkuExistsMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkNew = async () => {
      const unchecked = results
        .map((r: any) => r.sku)
        .filter((sku) => skuExistsMap[sku] === undefined);

      if (unchecked.length === 0) return;

      const unique = [...new Set(unchecked)];

      const { data, error } = await supabase
        .from("products")
        .select("sku")
        .in("sku", unique);

      if (error) {
        console.error(error);
        return;
      }

      const existingSet = new Set(data?.map((d: any) => d.sku));

      const updates: Record<string, boolean> = {};

      for (const sku of unique) {
        updates[sku] = existingSet.has(sku);
      }

      setSkuExistsMap((prev) => ({
        ...prev,
        ...updates,
      }));
    };

    checkNew();
  }, [results]);

  const handleStart = () => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      setStatus("Running");
      setLoading(true)
      socket.send(
        JSON.stringify({
          urls: urlList,
        })
      );
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "result") {
        setResults((prev) => [...prev, msg.data]);
      }

      if (msg.type === "notifications") {
        const { url, status } = msg.data;
        console.log(msg.data)

        setNotifications((prev) => {
          const exists = prev.find((n) => n.url === url);

          if (exists) {
            return prev.map((n) =>
              n.url === url ? { ...n, status } : n
            );
          }

          return [...prev, { url, status }];
        });
      }

      if (msg.type === "done") {
        setStatus("Done");
        socket.close();
        setLoading(false)
      }

      if (msg.type === "error") {
        console.error("Error:", msg);
      };

      socket.onerror = (err) => {
        console.error("Socket error:", err);
        setStatus("Error");
      };
    };
  }

  const saveResults = async () => {
    const productPayload = results.map((result: any) => ({
      url: result.url || null,
      vendor: supplier,
      brand: result.brand || null,
      name: result.name?.trim() || null,
      sku: result.sku,
      colors: result.colors
        ? result.colors
          .split(",")
          .map((c: string) => c.trim())
          .filter(Boolean)
        : null,
      sizes: result.sizes || null,
      price_usd: result.price_usd ? Number(result.price_usd) : null,
      size_chart_link: result.size_chart_link || null,
      how_to_measure_guide_link: result.how_to_measure_link || null,
      decoration_method: result.decoration_method || null,
      moq: 1,
    }));

    const { data } = await supabase.from("products").insert(productPayload)

    if (data) {
      console.log(data)
      alert("Success")
    }
  }

  const handleReset = () => {
    setResults([])
    setNotifications([])
    setStatus("Idle")
    setSkuExistsMap({})
    setUrlList([])
    setLoading(false)
  }

  const handleSaveSingle = async ({ payload }) => {
    try {
      const normalizedPayload = {
        ...payload,
        vendor: supplier,
        colors: Array.isArray(payload.colors)
          ? payload.colors
          : payload.colors
            ? payload.colors.split(",").map(c => c.trim())
            : []
      }
      const { data, error } = await supabase
        .from("products")
        .insert(normalizedPayload)
      if (error) throw error
      console.log(data)
      alert("Success")
    } catch (err) {
      if (err.code === "23505") {
        alert("existing")
      }
    }
  }

  return (
    <>
      <Head>
        <title>Automations</title>
      </Head>

      <SimpleGrid height="calc(100vh - 5vh)" templateColumns="400px 1fr" overflow="hidden">
        <Stack gap={0} p={4} borderRight="1px solid" borderColor="border" overflow="auto">
          <Field.Root mb={4}>
            <Field.Label>Select Vendor</Field.Label>
            <NativeSelect.Root size="xs">
              <NativeSelect.Field>
                <option>Sanmar</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root mb={4}>
            <Field.Label>SKU List</Field.Label>
            <Textarea
              value={urlList.join("\n")}
              onChange={(e) => {
                const uniqueUrls = [...new Set(e.target.value.split("\n").map(u => u.trim()).filter(Boolean))];
                setUrlList(uniqueUrls);
              }}
            />
          </Field.Root>
          <Button mb={2} loading={loading} onClick={handleStart} loadingText="Starting..." size="xs">Start <LuSettings /></Button>
          <Button mb={2} variant="outline" onClick={handleReset} size="xs"><LuRefreshCcw />Reset</Button>
          <Text>Status: {status}</Text>
          <Stack gap={0}>
            {
              notifications.map((n, i) => (
                <Flex key={i} alignItems="center" gap={4} maxW="300px">
                  {n.status === "scanning" ? <Spinner size="sm" /> :
                    n.status === "finished" ? <Icon as={LuCheck} color="green.500" /> :
                      <Icon as={LuX} color="red.500" />
                  }
                  <Text
                    truncate
                    color={
                      n.status === "scanning" ? "fg.info" : n.status === "finished" ? "fg.success" : "fg.error"
                    }
                    fontSize="13px">{n.url}</Text>
                </Flex>
              ))
            }
          </Stack>

        </Stack>
        <Stack py={4} gap={4} overflow="scroll">
          <Flex px={4} alignItems="center" justifyContent="space-between">
            <Heading >Results</Heading>
            <Button size="xs" onClick={saveResults}>Save Results</Button>
          </Flex>
          <Table.ScrollArea maxW="100%" >
            <Table.Root size="sm" variant="outline" showColumnBorder interactive>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader>Brand</Table.ColumnHeader>
                  <Table.ColumnHeader>SKU</Table.ColumnHeader>
                  <Table.ColumnHeader>Title</Table.ColumnHeader>
                  <Table.ColumnHeader>Price</Table.ColumnHeader>
                  <Table.ColumnHeader>Size</Table.ColumnHeader>
                  <Table.ColumnHeader>Selected Color</Table.ColumnHeader>
                  <Table.ColumnHeader>Size Chart Link</Table.ColumnHeader>
                  <Table.ColumnHeader>Decoration Method</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {results.length === 0 ? <Table.Row><Table.Cell colSpan={12}>No data to show</Table.Cell></Table.Row> :
                  results.map((result: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <IconButton size="xs" variant="ghost" onClick={() => handleSaveSingle({ payload: result })}>
                          <LuSave />
                        </IconButton>
                      </Table.Cell>
                      <Table.Cell >{result.brand}</Table.Cell>
                      <Table.Cell color={skuExistsMap[result.sku] ? "red.500" : "inherit"}>
                        {result.sku}
                      </Table.Cell>
                      <Table.Cell>{result.name}</Table.Cell>
                      <Table.Cell>{result.price_usd}</Table.Cell>
                      <Table.Cell>{result.sizes}</Table.Cell>
                      <Table.Cell>{result.colors}</Table.Cell>
                      <Table.Cell>{result.size_chart_link}</Table.Cell>
                      <Table.Cell>{result.decoration_method}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Stack>
      </SimpleGrid>
    </>
  )
}

export default AutomationsPage;