import * as prompts from "@clack/prompts"
import { checkMinimumRequirements } from "./create/checkMinimumRequirements"
import { getUserInput } from "./create/getUserInput"
import { getProjectDir } from "./utils/dir"
import { checkProjectDir } from "./create/checkProjectDir"
import { setupProject } from "./create/setupProject"
import { outro } from "./create/outro"
import { textSync } from "figlet"
import * as color from "picocolors"

export const createProject = async () => {
  console.log(
    color.green(textSync("Xion Network", { horizontalLayout: "fitted" }))
  )

  await checkMinimumRequirements()

  prompts.intro("Welcome to Xion Network dApp Kickstarter! 🚀")

  const { project } = await getUserInput()

  const projectDir = getProjectDir(project.name)
  await checkProjectDir(projectDir)

  await setupProject(projectDir, project)

  outro(project.name)
}
