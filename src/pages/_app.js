import { Provider } from "@/components/ui/provider";
import { Stack } from "@chakra-ui/react";
import Header from "../components/header";
import { DataProvider } from "@/context/DataContext";
import { CategoryDataProvider } from "@/context/CategoryDataContext";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Stack>
        <DataProvider>
          <CategoryDataProvider>
            <Header />
            <Component {...pageProps} />
          </CategoryDataProvider>
        </DataProvider>
      </Stack>
    </Provider>
  )
}
