import { supabase } from "@/config/Supabase";
import { Stack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FC, useState } from "react";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sku } = context.params as { sku: string }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    return {
      props: {
        product: data[0]
      }
    }
  }
}

const EditPage: FC<any> = (props) => {
  const [product, setProduct] = useState(props.product);

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Stack>

      </Stack>
    </>

  )
}

export default EditPage;