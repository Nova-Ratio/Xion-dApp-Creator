import * as color from "picocolors"
import * as prompts from "@clack/prompts"
import { note } from "./note"

export function outro(projectName: string) {
  note(
    `Run ${color.blue(`cd ${projectName}/web`)} to navigate into your new dApp.

Run ${color.blue("yarn dev")} to start the development server.`,
    "Running your dApp UI"
  )

  note(
    `Run ${color.blue(`cd ${projectName}/scripts`)} to navigate into your scripts directory.

Run ${color.blue("npm run command -- <contract-command> <contract-name>")} to interact with your contracts.

View the README.md for more information.`,
    "Running scripts to interact with your contracts"
  )

  prompts.outro(
    `Problems? ${color.underline(
      color.cyan("https://github.com/burnt-labs")
    )}`
  )
}
