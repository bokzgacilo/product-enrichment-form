"use client";

import { Button, Text, Heading, Stack, FileUpload, Icon, Box, Link, SimpleGrid, ActionBar, Portal } from "@chakra-ui/react";
import Head from "next/head";
import { LuDownload, LuRefreshCcw, LuSave, LuUpload } from "react-icons/lu";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Toaster, toaster } from "@/components/ui/toaster";
import CategoryCard from "@/components/category-card";
import { useCategoryData } from "@/context/CategoryDataContext";
import { saveAs } from "file-saver";

export default function Category() {
  const { data, setData } = useCategoryData();
  const [loading, setLoading] = useState(false);

  async function updateCsv() {
    setLoading(true);
    const res = await fetch("/api/export-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const blob = await res.blob();
    await saveAs(blob, `${Date.now()}.csv`);
    setLoading(false);
  }

  const handleFileUpload = (File) => {
    if (!File) return;
    setLoading(true);

    Papa.parse(File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const normalizeKey = (k) => k.trim().toLowerCase();

        const headers = (results.meta.fields || []).map(normalizeKey);

        const requiredHeaders = [
          "reference_id",
          "image_url",
          "category",
          "product_family"
        ];

        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          toaster.create({
            max: 3,
            duration: 5000,
            type: "error",
            description: `Invalid CSV template. Missing column(s): ${missingHeaders.join(", ")}`,
          });
          return;
        }

        results.data.map((row) => {
          setData(prev => [...prev, row])
        })
        toaster.create({
          max: 3,
          duration: 3000,
          type: "success",
          description: `Upload successful! Your CSV passed all checks and is ready to review.`,
        });
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Toaster />
      <Head>
        <title>Category</title>
      </Head>
      <Stack px={4}>
        {
          data.length === 0 ?
            <Stack maxWidth="500px">
              <Heading>Step 1. Download Template</Heading>
              <Button variant="outline" rounded="md" as={Link} href="/category_template.csv" download><LuDownload /> category_template.csv</Button>
              <Text>Populate the template with your list of pr  oducts that needs to be categorized.</Text>
              <Heading mt={4}>Step 2. Upload Template</Heading>
              <FileUpload.Root
                onFileAccept={(files) => handleFileUpload(files.files[0])}
                onFileChange={(files) => handleFileUpload(files.files)}
                accept={["text/csv"]}
                maxFiles={1}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone w="100%">
                  <Icon>
                    <LuUpload />
                  </Icon>
                  <FileUpload.DropzoneContent>
                    <Box>Drag and drop files here</Box>
                    <Box color="fg.muted">.csv up to 25MB</Box>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
              </FileUpload.Root>
            </Stack>
            :
            <SimpleGrid columns={6} gap={4}>
              {data.map((category, index) => (
                <CategoryCard key={index} index={index} data={category} />
              ))}
            </SimpleGrid>
        }
      </Stack>
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