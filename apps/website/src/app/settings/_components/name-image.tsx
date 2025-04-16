"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { setUserImage } from "@/lib/server/actions/set-image"
import { setUsername } from "@/lib/server/actions/set-username"
import { checkValidUsername, sleep } from "@/lib/utils"

import { useEffect, useState } from "react"
import { PiCheck, PiUploadBold, PiX } from "react-icons/pi"
import { toast } from "sonner"

export function SettingsNameImage({
  image: _image,
  name: _name,
}: {
  image?: string
  name: string
}) {
  const [name, setName] = useState(_name)
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [changes, setChanges] = useState(false)

  useEffect(() => {
    setChanges(name !== _name || image !== null)
  }, [name, image, _name, _image])

  async function handleSubmit() {
    setSubmitting(true)
    let reload = true
    if (name !== _name) {
      const respName = await setUsername(name)
      if (respName.success) {
        toast.success("Updated username")
      } else {
        toast.error("Failed to update username", {
          description: respName.message,
        })
        reload = false
      }
    }

    if (image) {
      if (image.size > 1024 * 1024) {
        toast.error("Image too large. Must be less than 1MB.")
        reload = false
      } else {
        const respImage = await setUserImage(image)
        if (respImage.success) {
          toast.success("Updated avatar")
        } else {
          toast.error("Failed to update avatar", {
            description: respImage.message,
          })
          reload = false
        }
      }
    }

    if (reload) {
      toast.info("Reloading page to apply changes")
      await sleep(1000)
      window.location.reload()
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
          <div className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full">
            <Avatar className="group-hover:blur-xs absolute h-full w-full transition-all">
              <AvatarImage src={image ? URL.createObjectURL(image) : _image} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload">
              <div className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <PiUploadBold className="text-xl text-white" />
              </div>
            </label>
            <input
              type="file"
              className="hidden"
              id="avatar-upload"
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files?.[0]) return
                const _file = e.target.files[0]
                if (_file.size > 1024 * 1024) {
                  toast.error("Image too large. Must be less than 1MB.")
                  return
                }
                setImage(e.target.files[0])
              }}
            />
          </div>
          <div className="relative grow">
            <Input
              value={name}
              className="h-full w-full text-gray-500"
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
      <CardFooter className="flex items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <div className="mr-auto cursor-pointer text-xs text-gray-500 hover:underline lg:mr-0 lg:text-sm">
              Need Help?
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h3 className="text-sm font-semibold">Username</h3>
              <p className="text-xs text-neutral-400">
                The username must satisfy the following criteria
              </p>
              <ul className="ml-4 mt-2 list-disc text-xs">
                <li>Must be at least 3 and at most 20 characters.</li>
                <li>
                  Must contain only alphanumerics, underscores and dashes.
                </li>
              </ul>
              <h3 className="mt-4 text-sm font-semibold">Avatar Image</h3>
              <p className="text-xs text-neutral-400">
                The avatar image must satisfy the following criteria
              </p>
              <ul className="ml-4 mt-2 list-disc text-xs">
                <li>Size be under 1MB.</li>
                <li>(Recommended) at least 400 x 400 pixels.</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="secondary"
          onClick={() => {
            setName(_name)
            setImage(null)
          }}
        >
          <p className="text-xs lg:text-base">Undo Changes</p>
        </Button>
        <Button disabled={!changes || submitting} onClick={handleSubmit}>
          <p className="text-xs lg:text-base">
            {changes ? (submitting ? "Saving" : "Save Changes") : "No changes"}
          </p>
        </Button>
      </CardFooter>
    </Card>
  )
}
