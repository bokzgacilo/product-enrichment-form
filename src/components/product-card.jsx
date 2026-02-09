"use client";

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
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { PiImageBroken } from "react-icons/pi";
import { TbGlobe, TbLink } from "react-icons/tb";

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
          <Card.Title fontSize="10px">{data.ReferenceCode}</Card.Title>
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
            <Input
              size="sm"
              placeholder="Logo Name"
              value={data.logoName}
              disabled={noLogo || error}
              onChange={(e) => handleChange(index, "logoName", e.target.value)}
            />
            <Input
              size="sm"
              placeholder="Logo Color"
              value={data.logoColor}
              disabled={noLogo || error}
              onChange={(e) => handleChange(index, "logoColor", e.target.value)}
            />
            <Input
              size="sm"
              placeholder="Placement"
              value={data.placement}
              disabled={noLogo || error}
              onChange={(e) => handleChange(index, "placement", e.target.value)}
            />
            <Input
              size="sm"
              placeholder="Deco Method"
              value={data.decoMethod}
              disabled={noLogo || error}
              onChange={(e) =>
                handleChange(index, "decoMethod", e.target.value)
              }
            />

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
              display={loaded ? "block" : "none"}
              rounded="xl"
              order={{ base: 1, lg: 2 }}
            />
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