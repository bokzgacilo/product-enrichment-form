import { Button, Flex, Heading, Image, Link, Stack, Text } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";

export default function Extension() {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      pb={4}
    >
      <Stack
        mt={10}
        w="800px"
        gap={4}
      >
        <Image src="/extension_cover.png" alt="Brand Junkie Logo" />
        <Button rounded="full" size="2xl" w="75%" mx="auto" my={6} asChild><Link href="/brand_junkie_highlighter_ext.zip" target="_blank" download><LuDownload />Download & Install</Link></Button>
        <Flex gap={4} alignItems="center" mb={4}>
          <Image boxSize="40px" src="/extension_icon.png" alt="Brand Junkie Logo" />
          <Heading size="4xl">Brand Junkie Highlighter</Heading>
        </Flex>
        <Text>
          <strong>Brand Junkie Highlighter</strong> is a browser extension designed to speed up building COREWIP product data.
          Instead of manually copying and formatting product details, you simply highlight text on a webpage and send it directly to the Highlighter UI.
          <br /><br />
          The extension automatically prepares the information into a structured form.
          If the form is correct, you save it — building your product list in seconds.
          <br /><br />
          After collecting products, you can export everything to CSV and merge it into the COREWIP master sheet.
        </Text>
        <Heading size="2xl" mt={4}>How To Install</Heading>
        <Text>Step 1: Download the extension and extract the zip file.</Text>
        <Text>Step 2: Enable developer mode in your browser</Text>
        <Image src="/extension_installation/step-1.png" alt="Brand Junkie Logo" />
        <Text>Step 3: Click "Load unpacked" and select the "build" folder.</Text>
        <Image src="/extension_installation/step-2.png" alt="Brand Junkie Logo" />
        <Image src="/extension_installation/step-3.png" alt="Brand Junkie Logo" />
        <Text>Step 4: Verify if installed properly, make sure the extension is enabled/active</Text>
        <Image src="/extension_installation/step-4.png" alt="Brand Junkie Logo" />
        <Heading size="2xl" mt={4}>How To Use</Heading>
        <video controls>
          <source src="/how-to-use.mov" type="video/mp4" />
        </video>
      </Stack>
    </Stack>
  )
}