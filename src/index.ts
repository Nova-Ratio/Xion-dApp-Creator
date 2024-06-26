import * as color from "picocolors"
import { Command } from "commander"
import { textSync } from "figlet"
import { createProject } from "./create"

const program = new Command()

console.log(
  color.green(textSync("Xion Network", { horizontalLayout: "fitted" }))
)

program.command("create").description("Create a new App").action(createProject)

program.parse(process.argv)
