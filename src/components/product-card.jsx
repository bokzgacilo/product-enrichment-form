"use client";

import { COLOR_CODE_MAP } from "@/helper/getColorCode";
import { DECO_METHODS } from "@/helper/getDecoMethodCode";
import { LOGO_CODE_MAP } from "@/helper/getLogoCode";
import { PLACEMENT_MAP } from "@/helper/getPlacementCode";
import {
  Box,
  Button,
  Card,
  CheckboxCard,
  Flex,
  Icon,
  Image,
  NativeSelect,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { LuX } from "react-icons/lu";
import { PiImageBroken } from "react-icons/pi";
import { TbLink } from "react-icons/tb";

const selects = [
  { field: "logoName", label: "Select Logo Name", map: LOGO_CODE_MAP },
  { field: "logoColor", label: "Select Logo Color", map: COLOR_CODE_MAP },
  { field: "placement", label: "Select Placement", map: PLACEMENT_MAP },
  { field: "decoMethod", label: "Select Deco Method", map: DECO_METHODS },
  {
    field: "productColorFamily", label: "Select Product Color Family", map:
      [
        "Blue",
        "Grey",
        "Brown",
        "Purple",
        "Black",
        "Pink",
        "Camo",
        "Orange",
        "Yellow",
        "Green",
        "Silver",
        "Clear",
        "Red",
        "White",
        "Pattern"
      ]
  }
];

const ProductCard = React.memo(function ProductCard({ index, handleChange, data }) {
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
    <Card.Root variant="outline">
      <Card.Header>
        <Flex alignItems="center" gap={4}>
          <Card.Title mr="auto">#{index + 1} - {data.SKU}</Card.Title>
          <CheckboxCard.Root
            cursor="pointer"
            size="sm"
            variant="surface"
            colorPalette="orange"
            onCheckedChange={(e) =>
              handleChange(index, "noLogo", !!e.checked)
            }
            maxW="150px"
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control
              py={1.5}
              alignItems="center"
            >
              <CheckboxCard.Label fontSize="sm">No Logo?</CheckboxCard.Label>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </Flex>
      </Card.Header>
      <Card.Body pb={0}>
        <SimpleGrid templateColumns={{ base: "1fr", lg: "40% 1fr" }} gap={4}>
          <Stack gap={4} order={{ base: 2, lg: 1 }}>
            {selects.map(({ field, label, map }) => {
              if (field === "productColorFamily") {
                return (
                  <NativeSelect.Root size="sm" key={field}>
                    <NativeSelect.Field
                      value={data[field] ?? ""}
                      onChange={(e) =>
                        handleChange(index, field, e.currentTarget.value)
                      }
                      disabled={noLogo || error}
                    >
                      <option value="">{label}</option>
                      {map.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                )
              } else {
                return (
                  <NativeSelect.Root size="sm" key={field}>
                    <NativeSelect.Field
                      value={data[field] ?? ""}
                      onChange={(e) =>
                        handleChange(index, field, e.currentTarget.value)
                      }
                      disabled={noLogo || error}
                    >
                      <option value="">{label}</option>
                      {Object.keys(map).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                )
              }
            }
            )}

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
            // border="1px solid"
            // borderColor="border"
            >
              <Image
                border="1px solid"
                borderColor="gray.200"
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
})

export default ProductCard;