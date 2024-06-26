import { exec } from "child_process"
import * as prompts from "@clack/prompts"
import * as color from "picocolors"
import { APPS_ENGINE_DIR } from "../utils/app"
import type { Project } from "./getUserInput"
import { experiences } from "./experiences"

const CONTRACTS_REPO = "git@github.com:findolor/xion-dapp-kickstarter.git"

async function execAsync(command: string, options = {}) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { ...options, maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
        resolve(stdout)
      }
    )
  })
}

export async function setupProject(projectDir: string, project: Project) {
  const spinner = prompts.spinner()

  const execCommand = async (command: string, options = {}) => {
    await execAsync(command, { ...options, cwd: projectDir, stdio: "ignore" })
  }

  const copyContract = async (contractName: string) => {
    spinner.message(`Copying ${contractName}`)
    await execAsync(
      `cp -r ${APPS_ENGINE_DIR}/templates/contracts/${contractName} ./contracts/${contractName}`,
      { cwd: projectDir }
    )
  }

  const copyScript = async (contractName: string) => {
    spinner.message(`Copying ${contractName}`)
    await execAsync(
      `cp -r ${APPS_ENGINE_DIR}/templates/scripts/${contractName} ./scripts/${contractName}`,
      { cwd: projectDir }
    )
  }

  try {
    spinner.start("Setting up your Xion dApp Kickstarter contracts...")

    await execAsync(`mkdir ${projectDir}`)
    await execCommand("git init")
    await execAsync(`git clone -b add_scripts ${CONTRACTS_REPO} ${APPS_ENGINE_DIR}`, {
      cwd: projectDir,
    })

    await execCommand(`mkdir ./contracts`)
    await execCommand(`mkdir ./scripts`)
    await execCommand(`mkdir ./web`)

    spinner.message("Copying scripts utils")
    await execAsync(
      `cp -r ${APPS_ENGINE_DIR}/templates/scripts/ ./scripts/`,
      { cwd: projectDir }
    );

    const selectedContracts = project.selectedModules
    const contractNames = experiences.map((experience) => experience.value)
    let contractSelected = false

    for (const contractName of contractNames) {
      await execCommand(`rm -rf ./scripts/${contractName}`)
    }

    for (const contractName of contractNames) {
      if (selectedContracts.includes(contractName)) {
        contractSelected = true
        await copyContract(contractName) 
        await copyScript(contractName)
      }
    }

    if (contractSelected) {
      await execCommand(`git add ./contracts`)

      spinner.message("Installing dependencies");
      await execAsync(`npm install`, { cwd: `${projectDir}/scripts` });

      await execCommand(`git add ./scripts`)
      await execCommand('git commit -m "Added CosmWasm contracts & scripts"')
    } else {
      await execCommand(`rm -rf ./contracts`)
      await execCommand(`rm -rf ./scripts`)
    }

    spinner.message("Copying frontend template")
    await execAsync(
      `cp -r ${APPS_ENGINE_DIR}/templates/web/xion-nextjs/* ./web/`,
      { cwd: projectDir }
    )
    await execAsync(
      `cp ${APPS_ENGINE_DIR}/templates/web/xion-nextjs/.gitignore ./web/`,
      { cwd: projectDir }
    )

    spinner.message("Installing dependencies")
    await execAsync(`npm install`, { cwd: `${projectDir}/web` })

    await execCommand(`git add ./web`)
    await execCommand('git commit -m "Added Next.js project"')

    await execCommand(`rm -rf ${APPS_ENGINE_DIR}`)

    spinner.stop(
      `${project.name} created successfully with Xion dApp Kickstarter! 🚀`
    )
  } catch (e) {
    console.error(e)
    prompts.log.error(color.red("Error initializing project"))
    process.exit(1)
  }
} 

