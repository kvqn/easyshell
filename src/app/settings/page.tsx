import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ensureAuth } from "@/server/auth"
import { getUserProviders } from "@/server/db/queries"

import { SettingsNameImage } from "./_components/name-image"

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
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Integrations</h2>
            <p className="text-sm text-gray-500">Connect your accounts.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Discord</p>
                <p className="text-sm text-gray-500">
                  {providers.discord
                    ? "Connected as @profile"
                    : "Not connected"}
                </p>
              </div>
              <Button
                variant={providers.discord ? "destructive" : "default"}
                //onClick={() => setDiscordConnected(!discordConnected)}
              >
                {true ? "Disconnect" : "Connect"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">GitHub</p>
                <p className="text-sm text-gray-500">
                  {true ? "Connected as @profile" : "Not connected"}
                </p>
              </div>
              <Button
                variant={true ? "destructive" : "default"}
                //onClick={() => setGithubConnected(!githubConnected)}
              >
                {true ? "Disconnect" : "Connect"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Google</p>
                <p className="text-sm text-gray-500">
                  {true ? "Connected as @profile" : "Not connected"}
                </p>
              </div>
              <Button
                variant={true ? "destructive" : "default"}
                //onClick={() => setGoogleConnected(!googleConnected)}
              >
                {true ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
