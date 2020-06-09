import path from 'path'
import inquirer from 'inquirer'
import rootDir from 'root-require'
import FileManagement from '../../libs/FileManagement'
import config from '../../config'

export default function Config({ log } = {}) {
  return {
    ...FileManagement(),

    confDir() {
      return path.join(config.configPath, '.chest.store')
    },

    confFile() {
      return path.join(this.confDir(), 'config.json')
    },

    firstTimeInstallConfFile() {
      try {
        const firstTimeConf = rootDir(path.join('..', 'config.json'))
        return firstTimeConf
      } catch (err) {
        return null
      }
    },

    help() {
      return `Configure your environment with required options to communicate to chest.store`
    },

    async getConfig() {
      return JSON.parse(await this.getLocalFile(this.confFile()))
    },

    async run() {
      const currentConfig = await this.checkAndPromptToCreateConfigFile()
      if (!currentConfig) {
        const err = `There was a problem with your configuration file.`
        console.error(err)
        return log.error(err)
      }

      log.debug(
        'Current configuration before going through prompts to update',
        currentConfig
      )
      const response = await inquirer.prompt([
        {
          name: 'cheststoreApiHost',
          message: `Optional: chest.store host to send API requests to`,
          type: 'input',
          default: currentConfig.cheststoreApiHost || 'https://app.chest.store',
        },
        {
          name: 'cheststoreApiKey',
          message: `Required: API key provided by chest.store for authentication`,
          type: 'input',
          default: currentConfig.cheststoreApiKey || '',
        },
      ])

      await this.writeFile(this.confFile(), JSON.stringify(response, null, 2))
      console.log('Successfully updated your local configuration!')
    },

    async checkAndPromptToCreateConfigFile() {
      const confDir = this.confDir()
      const confFile = this.confFile()
      const doesDirExist = await this.doesDirectoryExist(confDir)
      const doesFileExist = await this.doesFileExist(confFile)
      if (!(doesDirExist && doesFileExist)) {
        const response = await inquirer.prompt([
          {
            name: 'allowedToCreateConfig',
            message: `May we create & use a configuration file at the following location: ${confFile}?`,
            type: 'confirm',
            default: true,
          },
        ])

        if (!response.allowedToCreateConfig) return false

        await this.checkAndCreateDirectoryOrFile(confDir)
        const firstTimeInstallConfigFileContents = this.firstTimeInstallConfFile()

        let initialContents = JSON.stringify({}, null, 2)
        if (!!firstTimeInstallConfigFileContents)
          initialContents = JSON.stringify(
            firstTimeInstallConfigFileContents,
            null,
            2
          )

        await this.checkAndCreateDirectoryOrFile(
          confFile,
          true,
          initialContents
        )
        return JSON.parse(initialContents)
      }
      const confStr = await this.getLocalFile(confFile, 'utf8')
      return JSON.parse(confStr)
    },
  }
}
