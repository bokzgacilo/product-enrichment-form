import { Provider } from "@/components/ui/provider";
import { Stack } from "@chakra-ui/react";
import Header from "../components/header";
import { DataProvider } from "@/context/DataContext";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <DataProvider>
        <Stack>
          <Header />
          <Component {...pageProps} />
        </Stack>
      </DataProvider>
    </Provider>
  )
}
