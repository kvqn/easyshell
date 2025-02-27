"use client"

import { useEffect, useState } from "react"
import { PiCheck, PiX } from "react-icons/pi"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { checkValidUsername, sleep } from "@/lib/utils"
import { setUsername } from "@/server/actions/set-username"

export function SettingsNameImage({
  image: _image,
  name: _name,
}: {
  image?: string
  name: string
}) {
  const [name, setName] = useState(_name)
  const [image, setImage] = useState(_image)
  const [submitting, setSubmitting] = useState(false)

  const [changes, setChanges] = useState(false)

  useEffect(() => {
    setChanges(name !== _name || image !== _image)
  }, [name, image, _name, _image])

  async function handleSubmit() {
    setSubmitting(true)
    const resp = await setUsername(name)
    if (resp.success) {
      toast.success("Updated username", {
        description: "Refreshing the window to apply changes.",
      })
      await sleep(1000)
      window.location.reload()
    } else {
      toast.error(resp.message)
    }
    setSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Your Information</h2>
        <p className="text-sm text-gray-500">Update your personal details.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={image} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="relative grow">
            <Input
              value={name}
              className="text-gray-500 h-full w-full"
              onChange={(e) => setName(e.target.value)}
            />
            {checkValidUsername(name) ? (
              <PiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
            ) : (
              <PiX className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <div className="text-gray-500 hover:underline cursor-pointer text-sm">
          Need Help?
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setName(_name)
            setImage(_image)
          }}
        >
          Undo Changes
        </Button>
        <Button disabled={!changes || submitting} onClick={handleSubmit}>
          {changes ? (submitting ? "Saving" : "Save Changes") : "No changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
