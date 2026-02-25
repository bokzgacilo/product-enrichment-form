import {
  ActionBar,
  Button,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import { LuRefreshCcw, LuSave } from "react-icons/lu";
import { useData } from "@/context/DataContext";
import ProductCard from "./product-card";

export default function MainGrid() {
  const { data, setData } = useData();
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

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
        p={4}
        hidden={data.length === 0}
      >
        {data.map((row, index) => (
          <ProductCard
            key={`${row.referenceCode}-GRD-${index}`}
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