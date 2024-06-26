import * as prompts from "@clack/prompts"
import { experiences } from "./experiences"

export interface Project {
  name: string
  selectedModules: string[]
}

export type EnvVar = {
  chainId: string
  rpcUrl: string
}

function kebabcase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

export async function getUserInput() {
  const project = (await prompts.group(
    {
      name: () => {
        return prompts.text({
          message: "Enter the name of your project",
          validate(value) {
            if (!value) return "Please enter a name."
            return
          },
        })
      },
      selectedModules: () => {
        return prompts.multiselect({
          message: "Select contracts to add (press space to remove)",
          initialValues: experiences.map(({ value }) => value),
          options: experiences,
          required: false,
        })
      },
    },
    {
      onCancel: () => {
        prompts.cancel("Cancelled")
        process.exit(0)
      },
    }
  )) as Project

  project.name = kebabcase(project.name)

  const envVars: EnvVar = {
    chainId: "xion-testnet-1",
    rpcUrl: "https://rpc.xion-testnet-1.burnt.com:443",
  }

  return { project, envVars }
}
