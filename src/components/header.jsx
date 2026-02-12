"use client";

import { Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <Tabs.Root
      size="lg"
      value={router.pathname}
      onValueChange={(e) => {
        console.log(e.value)
        router.push(e.value)
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="/data-enrichment">
          Enrichment
        </Tabs.Trigger>
        <Tabs.Trigger value="/corewip">
          WIP
        </Tabs.Trigger>
        <Tabs.Trigger value="/logoprocessor">
          Logo
        </Tabs.Trigger>
        <Tabs.Trigger value="/category">
          Category
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}