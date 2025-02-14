import type { ProblemConfig } from "@/server/utils/problem"

const config: ProblemConfig = {
  id: 1,
  slug: "say-hello",
  title: "Say Hello to the Shell",
  description: `Print "Hello, World!"—your first step into the world of shell commands.`,
  tags: ["Basics"],
  capture_stdout: true,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: false,
  testcases: [
    { id: 1, folder: "1", public: true, expected_stdout: "Hello, World!\n" },
  ],
}

export default config
