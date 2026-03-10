import { supabase } from "@/config/Supabase";
import { CoreWipInputs } from "@/constants/CoreWipInputs";
import { Product } from "@/constants/Product";
import { Button, Field, Flex, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { LuChevronLeft, LuPen, LuSave } from "react-icons/lu";

export async function getServerSideProps(context: any) {
  const { sku } = context.params;
  const data = await supabase.from("products").select("*").eq("sku", sku).single();

  if (!data) {
    return { notFound: true };
  }

  return { props: { product: data.data } };
}

const ProductPage: FC = ({ product }: { product: Product }) => {
  const [form, setForm] = useState(product)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const isFormChanged = Object.keys(form).some(
    key => form[key] !== product[key]
  )

  const handleSave = async () => {
    if (!isFormChanged) {
      alert("No changes detected")
      setIsEditing(false)
      return
    }

    setIsEditing(false)
    setLoading(true)

    const { data } = await supabase.from("products").update(form).eq("sku", form.sku).select()

    if (!data) {
      alert("Failed to update product")
      setLoading(false)
      return
    }

    alert("Product updated successfully")
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Flex gap={4} top={11} position="sticky" zIndex={1} bg="bg" borderBottom="1px solid" borderColor="border" px={4} py={2}>
        <Button size="xs" variant="outline" asChild><Link href="/products"><LuChevronLeft />Back</Link></Button>
        <Button
          size="xs"
          variant="solid"
          onClick={isEditing ? handleSave : handleEdit}
          loading={loading}
        >
          {isEditing ? "Save" : "Edit"}
          {isEditing ? <LuSave /> : <LuPen />}
        </Button>
      </Flex>
      <Stack p={4} gap={4}>
        {CoreWipInputs.map((input) => (
          <Field.Root key={input.name}>
            <Field.Label>{input.label}</Field.Label>
            <Input
              value={form[input.name] ?? ""}
              onChange={(e) => setForm({ ...form, [input.name]: e.target.value })}
              disabled={!isEditing || input.name === "sku"}
            />
            {input.name === "sku" && (
              <Field.HelperText>
                SKU is the unique identifier for the product (You cannot edit this)
              </Field.HelperText>
            )}
          </Field.Root>
        ))}
      </Stack>
    </>
  )
}

export default ProductPage;
