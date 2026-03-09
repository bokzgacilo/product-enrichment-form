"use client";

import { Button, Text, Heading, Stack, FileUpload, Icon, Box, Link, SimpleGrid, ActionBar, Portal } from "@chakra-ui/react";
import Head from "next/head";
import { LuDownload, LuRefreshCcw, LuSave, LuUpload } from "react-icons/lu";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Toaster, toaster } from "@/components/ui/toaster";
import CategoryCard from "@/components/CategoryCard";
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
      <Stack
        alignSelf="center"
      >
        {
          data.length === 0 ?
            <Stack w="750px" p={4}>
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
                    <Stack gap={0}>
                      <Text fontSize="16px">Drag and drop files here</Text>
                      <Text mt={2} fontSize="16px">
                        or click below to browse files
                      </Text>
                      <FileUpload.Trigger asChild>
                        <Button my={4} loading={loading} loadingText="Loading...">
                          Browse File <LuUpload />
                        </Button>
                      </FileUpload.Trigger>
                      <Text fontSize="12px">.csv only up to 5MB</Text>
                    </Stack>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
              </FileUpload.Root>
            </Stack>
            :
            <SimpleGrid columns={6} gap={4} px={4}>
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