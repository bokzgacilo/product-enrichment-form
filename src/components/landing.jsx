"use client";

import {
  Stack,
  Heading,
  Button,
  Box,
  FileUpload,
  Icon,
  Text,
} from "@chakra-ui/react";
import { LuUpload, LuDownload } from "react-icons/lu";
import Papa from "papaparse";
import { useData } from "@/context/DataContext";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useState } from "react";
import Link from "next/link";

export default function Landing() {
  const { setData } = useData();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (File) => {
    if (!File) return;
    setLoading(true);

    Papa.parse(File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const requiredHeaders = [
          "Reference Code",
          "Image URL",
          "Logo Name",
          "Logo Color",
          "Placement",
          "Deco Method",
          "No Logo",
          "PDP Link"
        ];

        const headers = results.meta.fields || [];

        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h),
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

        const filtered = results.data.filter((row) =>
          Object.values(row).some((v) => v && v.toString().trim() !== ""),
        );

        const enriched = filtered.map((row) => ({
          ReferenceCode: row["Reference Code"] || "",
          ImageURL: row["Image URL"] || "",
          logoName: row["Logo Name"] || "",
          logoColor: row["Logo Color"] || "",
          placement: row["Placement"] || "",
          decoMethod: row["Deco Method"] || "",
          noLogo: row["No Logo"] === "true" || row["No Logo"] === true || false,
          pdpLink: row["PDP Link"] || "",
        }));

        toaster.create({
          max: 3,
          duration: 3000,
          type: "success",
          description: `Upload successful! Your CSV passed all checks and is ready to review.`,
        });

        setData(enriched);
        setLoading(false);
      },
    });
  };

  return (
    <Stack height="92dvh" gap={4} p={4} w={{ base: "100%", lg: "500px" }} alignSelf="center">
      <Toaster />
      <Heading mt={12} size={{ base: "md", lg: "2xl" }}>
        Step 1: Prepare CSV
      </Heading>
      <Button size="xl" rounded="full" as={Link} href="/Template.csv" download>
        Download CSV Template
        <LuDownload />
      </Button>
      <Heading mt={6} size={{ base: "md", lg: "2xl" }}>
        Step 2: Upload Data
      </Heading>
      <Box>
        <FileUpload.Root
          onFileAccept={(files) => handleFileUpload(files.files[0])}
          onFileChange={(files) => handleFileUpload(files.files)}
          accept={["text/csv"]}
          maxFiles={1}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone
            w="100%"
          >
            <Icon size="xl">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Stack gap={0}>
                <Text fontSize="16px">Drag and drop files here</Text>
                <Text mt={2} fontSize="16px">
                  or click below to browse files
                </Text>
                <FileUpload.Trigger asChild>
                  <Button my={4} rounded="full" size="xl" loading={loading} loadingText="Loading...">
                    Browse File <LuUpload />
                  </Button>
                </FileUpload.Trigger>
                <Text fontSize="12px">.csv only up to 5MB</Text>
              </Stack>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      </Box>
    </Stack>
  );
}