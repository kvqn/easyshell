/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginConfig}*/
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-packagejson",
  ],
  semi: false,
  importOrder: ["^@easyshell", "^@/(.*)$", "^[./]", ""],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config
