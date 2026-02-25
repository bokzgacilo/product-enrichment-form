"use client";

import { COLOR_CODE_MAP } from "@/helper/getColorCode";
import { DECO_METHODS } from "@/helper/getDecoMethodCode";
import { LOGO_CODE_MAP } from "@/helper/getLogoCode";
import { PLACEMENT_MAP } from "@/helper/getPlacementCode";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxCard,
  Flex,
  Icon,
  Image,
  Input,
  NativeSelect,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { PiImageBroken } from "react-icons/pi";
import { TbLink } from "react-icons/tb";

export default function ProductCard({ index, handleChange, data }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const noLogo = data.noLogo;

  const handleRetryFetching = async () => {
    setError(false);
    setLoaded(false);
    setRetryKey((prev) => prev + 1);
  };

  return (
    <Card.Root variant="elevated" size="sm">
      <Card.Header px={4} pb={0}>
        <Flex alignItems="center" justifyContent="space-between">
          <Card.Title fontSize="10px">{data.SKU}</Card.Title>
          <Checkbox.Root
            size="sm"
            onCheckedChange={(e) =>
              handleChange(index, "noLogo", !!e.checked)
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>No Logo</Checkbox.Label>
          </Checkbox.Root>
        </Flex>
      </Card.Header>
      <Card.Body pt={4} px={4} pb={4}>
        <SimpleGrid templateColumns={{ base: "1fr", lg: "40% 1fr" }} gap={4}>
          <Stack gap={4} order={{ base: 2, lg: 1 }}>
            <NativeSelect.Root size='sm'>
              <NativeSelect.Field
                value={data.logoName}
                onChange={(e) => handleChange(index, "logoName", e.currentTarget.value)}
                disabled={noLogo || error}
              >
                <option value="">Select Logo Name</option>
                {
                  Object.keys(LOGO_CODE_MAP).map((logo) => (
                    <option key={logo} value={logo}>
                      {logo}
                    </option>
                  ))
                }
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size='sm'>
              <NativeSelect.Field
                value={data.logoColor}
                onChange={(e) => handleChange(index, "logoColor", e.currentTarget.value)}
                disabled={noLogo || error}
              >
                <option value="">Select Logo Color</option>
                {
                  Object.keys(COLOR_CODE_MAP).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))
                }
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size='sm'>
              <NativeSelect.Field
                value={data.placement}
                onChange={(e) => handleChange(index, "placement", e.currentTarget.value)}
                disabled={noLogo || error}
              >
                <option value="">Select Placement</option>
                {
                  Object.keys(PLACEMENT_MAP).map((placement) => (
                    <option key={placement} value={placement}>
                      {placement}
                    </option>
                  ))
                }
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size='sm'>
              <NativeSelect.Field
                value={data.decoMethod}
                onChange={(e) => handleChange(index, "decoMethod", e.currentTarget.value)}
                disabled={noLogo || error}
              >
                <option value="">Select Deco Method</option>
                {
                  Object.keys(DECO_METHODS).map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))
                }
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            {data.pdpLink &&
              <Button variant="subtle" size="xs" asChild>
                <a href={data.pdpLink} target="_blank" rel="noopener noreferrer"><TbLink /> Visit PDP</a>
              </Button>
            }

          </Stack>
          {!loaded && !error && (
            <Skeleton
              h={{ base: "280px", md: "320px", lg: "350px" }}
              width="100%"
              rounded="xl"
              order={{ base: 1, lg: 2 }}
            />
          )}
          {!error && (
            <Box
              order={{ base: 1, lg: 2 }}
              cursor="pointer"
              onClick={() => window.open(data.ImageURL, '_blank', 'noopener,noreferrer')}
              display={loaded ? "block" : "none"}
            >
              <Image
                objectFit="cover"
                transition="transform 0.3s ease"
                key={retryKey}
                src={data.ImageURL}
                alt={data.ReferenceCode}
                onLoad={() => {
                  setTimeout(() => setLoaded(true), 1000);
                }}
                onError={() => {
                  setError(true);
                }}
                h={{ base: "280px", md: "320px", lg: "auto" }}
                width="100%"
                rounded="xl"
                referrerPolicy="no-referrer"
              />
            </Box>
          )}
          {error && (
            <Stack
              rounded="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="1px"
              borderStyle="solid"
              fontSize="sm"
              h={{ base: "280px", md: "320px", lg: "350px" }}
              textAlign="center"
            >
              <Icon size="2xl">
                <PiImageBroken />
              </Icon>
              <Text fontWeight="semibold">Image not available</Text>
              <Text fontSize="12px">
                Image not reachable or requires special access.
              </Text>
              <Button
                rounded="full"
                size="sm"
                w="50%"
                mt={4}
                onClick={handleRetryFetching}
              >
                Retry
              </Button>
            </Stack>
          )}
        </SimpleGrid>
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card.Root >
  );
}