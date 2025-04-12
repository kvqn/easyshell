import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ensureAuth } from "@/lib/server/auth"
import { getUserProviders } from "@/lib/server/queries"

import { SettingsNameImage } from "./_components/name-image"
import {
  DiscordCard,
  GithubCard,
  GoogleCard,
} from "./_components/provider-cards"
import { ThemeToggle } from "./_components/theme-toggle"

export const metadata = {
  title: "easyshell - account settings",
}

export default async function Page() {
  const user = await ensureAuth()
  const providers = await getUserProviders(user.id)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <SettingsNameImage image={user.image} name={user.name} />
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Preferences</h2>
            <p className="text-sm text-gray-500">Customize your experience.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme.</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Integrations</h2>
            <p className="text-sm text-gray-500">Connect your accounts.</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-center gap-4 pb-8 lg:gap-8">
            <DiscordCard connected={providers.discord} />
            <GithubCard connected={providers.github} />
            <GoogleCard connected={providers.google} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
