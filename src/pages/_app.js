import { Provider } from "@/components/ui/provider";
import { Stack } from "@chakra-ui/react";
import { DataProvider } from "@/context/DataContext";
import { CategoryDataProvider } from "@/context/CategoryDataContext";
import { Analytics } from '@vercel/analytics/next';
import Header from "@/components/Header";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Stack
        height="100vh"
        gap={0}
      >
        <DataProvider>
          <CategoryDataProvider>
            <Header />
            <Component {...pageProps} />
            <Analytics />
          </CategoryDataProvider>
        </DataProvider>
      </Stack>
    </Provider>
  )
}
