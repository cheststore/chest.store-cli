import axios from 'axios'
import FormData from 'form-data'
import Conf from './conf'
import FileManagement from '../../libs/FileManagement'
import config from '../../config'

export default function MvCommand({ log } = {}) {
  const confCommand = Conf({ log })
  const fileMgmt = FileManagement()

  return {
    help() {
      return `Copy a file from your file system to chest.store or vice versa.`
    },

    async run(localFile) {
      let localConfig
      try {
        localConfig = await confCommand.getConfig()
      } catch (err) {
        let errorText =
          `There was an error getting your local configuration file.` +
          `\n` +
          `Run '$ chest conf' to create your configuration file.` +
          '\n\n'
        throw new Error(errorText)
      }

      const validArgs = typeof localFile === 'string'
      if (!validArgs)
        throw new Error(
          `Please enter a local file path to upload to chest.store\nex. $ chest mv ./test.json`
        )

      const fileExists = await fileMgmt.doesFileExist(localFile)
      if (!fileExists)
        throw new Error(
          `We couldn't find the file you'd like to move\n${localFile}`
        )

      const fileReadStream = fileMgmt.getLocalFileStream(localFile)
      const splitFile = localFile.split('/')
      const fileName = splitFile[splitFile.length - 1]
      const form = new FormData()
      form.append(`file`, fileReadStream, fileName)

      await axios.post(`${localConfig.cheststoreApiHost}/object/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'User-Agent': 'chest.store-cli',
          [config.apiKeyHeader]: localConfig.cheststoreApiKey,
        },
        responseType: 'arraybuffer',
      })

      console.log(
        `Successfully uploaded ${localFile} to the chest.store server!`
      )
    },
  }
}
