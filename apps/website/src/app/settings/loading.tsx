import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "easyshell - account settings",
}

export default function Page() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Your Information</h2>
            <p className="text-sm text-gray-500">
              Update your personal details.
            </p>
          </CardHeader>
          <CardContent className="flex animate-pulse items-center gap-4 pb-10">
            <div className="size-20 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="h-8 flex-grow bg-gray-200 dark:bg-neutral-800"></div>
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
              <div className="h-5 w-10 animate-pulse rounded-full bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Integrations</h2>
            <p className="text-sm text-gray-500">Connect your accounts.</p>
          </CardHeader>
          <CardContent className="flex animate-pulse flex-wrap items-center justify-center gap-4 pb-8 lg:gap-8">
            <div className="h-16 w-32 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="h-16 w-32 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="h-16 w-32 rounded-full bg-gray-200 dark:bg-neutral-800" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
