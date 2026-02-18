"use client";

import { Button, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ColorModeButton } from "./ui/color-mode";

export default function Header() {
  const router = useRouter();
  return (
    <>
      <Tabs.Root
        flex={1}
        position="sticky"
        top={0}
        bg="bg"
        zIndex={20000}
        size="lg"
        value={router.pathname === "/" ? "/product-directory" : router.pathname}
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
          <Tabs.Trigger value="/product-directory">
            Product Directory
          </Tabs.Trigger>
          <ColorModeButton
            ml="auto"
            alignSelf="center"
            justifySelf="center"
          />
        </Tabs.List>
      </Tabs.Root>
    </>
  )
}