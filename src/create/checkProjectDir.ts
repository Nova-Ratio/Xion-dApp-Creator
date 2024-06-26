import * as fs from "fs"
import { APPS_ENGINE_DIR, removeDownloadedApps } from "../utils/app"

export async function checkProjectDir(projectDir: string) {
  if (fs.existsSync(projectDir)) {
    await removeDownloadedApps(projectDir)
    await removeDownloadedApps(APPS_ENGINE_DIR)
  }
}
