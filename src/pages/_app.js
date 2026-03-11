import { Provider } from "@/components/ui/provider";
import { Stack } from "@chakra-ui/react";
import { DataProvider } from "@/context/DataContext";
import { CategoryDataProvider } from "@/context/CategoryDataContext";
import { Analytics } from '@vercel/analytics/next';
import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter()

  const hideHeaderRoutes = ["/login"]
  const hideHeader = hideHeaderRoutes.includes(router.pathname)

  return (
    <Provider>
      <Stack height="100vh" gap={0}>
        <DataProvider>
          <CategoryDataProvider>
            {!hideHeader && <Header />}
            <Component {...pageProps} />
            <Analytics />
          </CategoryDataProvider>
        </DataProvider>
      </Stack>
    </Provider>
  )
}