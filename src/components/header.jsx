"use client";

import { Flex } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react"
import NextLink from "next/link"
import { usePathname } from "next/navigation";

export default function Header() {
	const pathname = usePathname();

	return (
		<Flex p={2} flexShrink={0} bg="bg" height="6vh" alignItems="center" position="sticky" top={0} zIndex={5} gap={4}>
			<ChakraLink
				asChild
				textDecoration={pathname === "/" ? "underline" : "none"}
			>
				<NextLink href="/">Data Enrichment</NextLink>
			</ChakraLink>

			<ChakraLink
				asChild
				textDecoration={pathname === "/corewip" ? "underline" : "none"}
			>
				<NextLink href="/corewip">Core WIP</NextLink>
			</ChakraLink>
			<ChakraLink
				asChild
				textDecoration={pathname === "/logoprocessor" ? "underline" : "none"}
			>
				<NextLink href="/logoprocessor">Logo Processor</NextLink>
			</ChakraLink>
		</Flex>
	)
}