import {
  ActionBar,
  Button,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useCallback, useState } from "react";
import { LuRefreshCcw, LuSave } from "react-icons/lu";
import { useData } from "@/context/DataContext";
import ProductCard from "./product-card";

export default function MainGrid() {
  const { data, setData } = useData();
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((index, field, value) => {
    setData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  }, [])

  async function updateCsv() {
    setLoading(true);
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const blob = await res.blob();
    await saveAs(blob, `${Date.now()}.zip`);
    setLoading(false);
  }

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        gap={4}
        overflow="auto"
        p={4}
      >
        {data.map((row, index) => (
          <ProductCard
            key={`${row.referenceCode}-${index}`}
            index={index}
            handleChange={handleChange}
            data={row}
          />
        ))}
      </SimpleGrid>

      <ActionBar.Root open={data.length > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content rounded={{ base: "md", lg: "full" }} w={{ base: "100%", lg: "auto" }} overflow="auto" mx={2}>
              <ActionBar.SelectionTrigger rounded="full">
                {data.length} items
              </ActionBar.SelectionTrigger>
              <Button
                rounded="full"
                variant="outline"
                onClick={() => {
                  setData([]);
                }}
              >
                Reset <LuRefreshCcw />
              </Button>
              <Button rounded="full" onClick={updateCsv} loading={loading} loadingText="Saving...">
                Update CSV <LuSave />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}