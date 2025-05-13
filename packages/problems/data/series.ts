export const SeriesList: Array<{
  slug: string
  name: string
  image: string
  description: string
  sections: Array<{
    title: string
    description: string
    problems: Array<string>
  }>
}> = [
  {
    slug: "file-management",
    name: "File Management",
    description: "Manage your files, the way it was intended.",
    image: "",
    sections: [
      {
        title: "Locating Files",
        description: "When locating files, `find` is your best friend.",
        problems: ["find-that-file"],
      },
      {
        title: "Moving And Renaming",
        description:
          "From the perspective of your computer, these are the same thing. Try out the following problems to get a feel for how to move and rename files.",
        problems: ["move-that-file", "move-and-rename", "bulk-move"],
      },

      {
        title: "Removing Files",
        description:
          "Removing files is a dangerous operation. Make sure you know what you're doing before you do it.",
        problems: [
          "rm-that-file",
          "wipe-that-folder",
          "nuke-all-matches",
          "mdx-no-more",
        ],
      },
    ],
  },
  // {
  //   slug: "networking",
  //   name: "Networking",
  //   problems: ["get-it-curl", "post-it", "post-with-token"],
  //   description: "Download, upload, make some requests, do some queries.",
  //   image: "",
  // },
]
