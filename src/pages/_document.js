import { Analytics } from "@vercel/analytics/next";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  );
}
