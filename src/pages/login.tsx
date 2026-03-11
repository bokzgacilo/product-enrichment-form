import { supabase } from "@/config/Supabase";
import { logout } from "@/middleware";
import { Button, Field, Heading, Input, PinInput, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const LoginPage: FC = () => {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const [pinValue, setPinValue] = useState(["", "", "", "", "", ""])
  const [checkingAuth, setCheckingAuth] = useState(true)


  // 🔒 Prevent logged-in users from accessing login
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      console.log(data)
      if (data.session) {
        router.replace("/products")
        return
      }

      setCheckingAuth(false)
    }

    checkSession()
  }, [])

  if (checkingAuth) return <>
    <Head><title>Checking user sessions</title></Head>
    <Stack>
      <Text>Checking if user is already signed-in.</Text>
    </Stack>
  </>

  const sendOtp = async () => {
    setButtonLoading(true)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (!error) setStep("otp")

    setButtonLoading(false)
  }

  async function verifyOtp() {
    setButtonLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: pinValue.join(""),
      type: "email"
    })

    if (!error) {
      router.push("/products")
    }

    setButtonLoading(false)
  }

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>

      <Stack p={4}>
        <Heading>Login</Heading>

        {step === "email" && (
          <Field.Root maxW="300px">
            <Field.Label>Email</Field.Label>
            <Input
              size="xs"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field.HelperText>Enter your email to receive an OTP</Field.HelperText>
            <Button loading={buttonLoading} size="xs" onClick={sendOtp}>
              Send OTP
            </Button>
          </Field.Root>
        )}

        {step === "otp" && (
          <Field.Root maxW="300px">
            <Field.Label>Enter OTP</Field.Label>

            <PinInput.Root
              size="sm"
              value={pinValue}
              onValueChange={(e) => setPinValue(e.value)}
            >
              <PinInput.HiddenInput />
              <PinInput.Control>
                <PinInput.Input index={0} />
                <PinInput.Input index={1} />
                <PinInput.Input index={2} />
                <PinInput.Input index={3} />
                <PinInput.Input index={4} />
                <PinInput.Input index={5} />
              </PinInput.Control>
            </PinInput.Root>

            <Field.HelperText>
              Enter the OTP sent to your email
            </Field.HelperText>

            <Button loading={buttonLoading} size="xs" onClick={verifyOtp}>
              Verify OTP
            </Button>
          </Field.Root>
        )}
      </Stack>
    </>
  )
}

export default LoginPage;