import { Command } from "commander"
import { createProject } from "./create"

const program = new Command()

program.command("create").description("Create a new App").action(createProject)

program.parse(process.argv)
