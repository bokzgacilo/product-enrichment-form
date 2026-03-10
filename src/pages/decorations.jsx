"use client";

import { Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { DataProvider, useData } from "@/context/DataContext";
import Landing from "../components/landing";
import MainGrid from "../components/main-grid";

export default function Layout() {
  const { data } = useData();

  return (
    <>
      <Head>
        <title>Logo Processor</title>
      </Head>
      <Stack
        height="100vh"
        overflow="none"
      >
        {data.length === 0 ? <Landing /> : <MainGrid />}
      </Stack>
    </>
  );
}