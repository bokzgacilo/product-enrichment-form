"use client";

import { Box, Tabs } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { ColorModeButton } from "./ui/color-mode";
import { FC } from "react";

export const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      position="sticky"
      top={0}
      bg="bg"
      zIndex={20000}
    >
      <Tabs.Root
        value={pathname === "/" ? "/product-directory" : pathname}
        onValueChange={(e) => {
          router.push(e.value);
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value="/form" height="5vh">
            Core Products
          </Tabs.Trigger>

          <Tabs.Trigger value="/decorations" height="5vh">
            Decorations
          </Tabs.Trigger>

          <Tabs.Trigger value="/products" height="5vh">
            Products
          </Tabs.Trigger>

          <ColorModeButton
            ml="auto"
            alignSelf="center"
            justifySelf="center"
          />
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
};

export default Header;