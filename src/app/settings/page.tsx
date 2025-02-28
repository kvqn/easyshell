"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ensureAuth } from "@/server/auth"

export default function AccountSettingsPage() {
  const [image, setImage] = useState<string | null>(null)
  const [discordConnected, setDiscordConnected] = useState(true)
  const [githubConnected, setGithubConnected] = useState(true)
  const [googleConnected, setGoogleConnected] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p className="text-sm text-gray-500">
              Update your personal details.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="profile-picture-upload"
                className="hidden"
              />

              <label htmlFor="profile-picture-upload">
                <Button variant="outline" asChild>
                  <span>Change Photo</span>
                </Button>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                placeholder="Enter your name"
                className="mt-1 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                placeholder="email@gmail.com"
                className="mt-1 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <Input
                placeholder="Tell everyone about yourself"
                className="mt-1 text-gray-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Security</h2>
            <p className="text-sm text-gray-500">
              Manage your account security.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Password
              </label>
              <Input
                type="password"
                placeholder="New Password"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Preferences</h2>
            <p className="text-sm text-gray-500">Customize your experience.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <Input defaultValue="English" className="mt-1" />
            </div>
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
                  {discordConnected ? "Connected as @profile" : "Not connected"}
                </p>
              </div>
              <Button
                variant={discordConnected ? "destructive" : "default"}
                onClick={() => setDiscordConnected(!discordConnected)}
              >
                {discordConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">GitHub</p>
                <p className="text-sm text-gray-500">
                  {githubConnected ? "Connected as @profile" : "Not connected"}
                </p>
              </div>
              <Button
                variant={githubConnected ? "destructive" : "default"}
                onClick={() => setGithubConnected(!githubConnected)}
              >
                {githubConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Google</p>
                <p className="text-sm text-gray-500">
                  {googleConnected ? "Connected as @profile" : "Not connected"}
                </p>
              </div>
              <Button
                variant={googleConnected ? "destructive" : "default"}
                onClick={() => setGoogleConnected(!googleConnected)}
              >
                {googleConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500">
          <CardHeader>
            <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
            <p className="text-sm text-gray-500">Irreversible actions.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Delete Account
                </p>
                <p className="text-sm text-gray-500">
                  Permanently delete your account.
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
