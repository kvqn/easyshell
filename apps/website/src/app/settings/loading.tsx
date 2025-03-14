import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "easyshell - account settings",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Your Information</h2>
            <p className="text-sm text-gray-500">
              Update your personal details.
            </p>
          </CardHeader>
          <CardContent className="animate-pulse pb-10 flex gap-4 items-center">
            <div className="size-20 rounded-full bg-gray-200" />
            <div className="h-8 bg-gray-200 flex-grow"></div>
          </CardContent>
        </Card>
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
              <div className="w-10 h-5 rounded-full animate-pulse bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Integrations</h2>
            <p className="text-sm text-gray-500">Connect your accounts.</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-8 gap-4 lg:gap-8 flex-wrap animate-pulse">
            <div className="w-32 h-16 bg-gray-200 rounded-full" />
            <div className="w-32 h-16 bg-gray-200 rounded-full" />
            <div className="w-32 h-16 bg-gray-200 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
