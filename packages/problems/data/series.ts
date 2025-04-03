export const SeriesList: Array<{
  slug: string
  name: string
  image: string
  description: string
  problems: Array<string>
}> = [
  {
    slug: "basics",
    name: "Basics",
    problems: ["say-hello", "cat-out-loud"],
    description: "Learn the basics of using the terminal.",
    image: "",
  },
  {
    slug: "file-management",
    name: "File Management",
    problems: [
      "find-that-file",
      "move-that-file",
      "move-and-rename",
      "bulk-move",
      "rm-that-file",
      "wipe-that-folder",
      "nuke-all-matches",
    ],
    description: "Manage your files, the way it was intended.",
    image: "",
  },
  {
    slug: "networking",
    name: "Networking",
    problems: ["get-it-curl", "post-it"],
    description: "Download, upload, make some requests, do some queries.",
    image: "",
  },
]
