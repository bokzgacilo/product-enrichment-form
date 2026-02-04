import { Provider } from "@/components/ui/provider";
import { Stack } from "@chakra-ui/react";
import Header from "./components/header";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Stack>
        <Header />
        <Component {...pageProps} />
      </Stack>
    </Provider>
  )
}
