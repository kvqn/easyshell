import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

export function MagicLink({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Head>
        <title>Your Magic Link</title>
        <Font
          fontFamily="Geist"
          webFont={{
            url: "https://github.com/vercel/geist-font/raw/refs/heads/main/packages/next/dist/fonts/geist-sans/Geist-Variable.woff2",
            format: "woff2",
          }}
          fallbackFontFamily="Arial"
        />
      </Head>
      <Preview>Sign in to easyshell.xyz</Preview>
      <Body>
        <Tailwind>
          <Container className="w-[400px] rounded-t-xl bg-neutral-100 py-4">
            <Section className="text-center">
              <Text className="inline text-3xl font-bold text-black">easy</Text>
              <Text className="inline text-3xl font-bold text-green-500">
                shell
              </Text>
            </Section>
          </Container>
          <Heading className="text-center text-emerald-500">
            ✨ Your Magic Link is Here ✨
          </Heading>
          <Text className="text-center text-sm">
            Click on the link below to sign in to your account.
          </Text>
          <Section className="text-center">
            <Button
              className="rounded-md bg-green-500 px-4 py-2 text-white"
              href={url}
            >
              Sign In
            </Button>
          </Section>
          <Text className="text-center text-xs text-neutral-400">
            If you did not request this, please ignore this email.
          </Text>
        </Tailwind>
      </Body>
    </Html>
  )
}
