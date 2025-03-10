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
import { checkValidUsername, sleep } from "@/lib/utils"
import { setUserImage } from "@/server/actions/set-image"
import { setUsername } from "@/server/actions/set-username"

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
          <div className="relative h-20 w-20 group cursor-pointer overflow-hidden rounded-full">
            <Avatar className="h-full w-full absolute group-hover:blur-xs transition-all">
              <AvatarImage src={image ? URL.createObjectURL(image) : _image} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload">
              <div className="h-full w-full flex items-center justify-center top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity absolute cursor-pointer">
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
      <CardFooter className="flex justify-end gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <div className="text-gray-500 hover:underline cursor-pointer text-xs lg:text-sm mr-auto lg:mr-0">
              Need Help?
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h3 className="font-semibold text-sm">Username</h3>
              <p className="text-neutral-400 text-xs">
                The username must satisfy the following criteria
              </p>
              <ul className="list-disc ml-4 text-xs mt-2">
                <li>Must be at least 3 and at most 20 characters.</li>
                <li>
                  Must contain only alphanumerics, underscores and dashes.
                </li>
              </ul>
              <h3 className="font-semibold text-sm mt-4">Avatar Image</h3>
              <p className="text-neutral-400 text-xs">
                The avatar image must satisfy the following criteria
              </p>
              <ul className="list-disc ml-4 text-xs mt-2">
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
