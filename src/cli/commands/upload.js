import FormData from 'form-data'
import Conf from './config'
import ApiHelpers from '../../libs/ApiHelpers'
import FileManagement from '../../libs/FileManagement'
// import config from '../../config'

export default function Upload({ log } = {}) {
  const confCommand = Conf({ log })
  const fileMgmt = FileManagement()

  return {
    help() {
      return `Upload a file from your file system to a chest.store server.`
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
          `Please enter a local file path to upload to chest.store\nex. $ chest upload ./test.json`
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

      const client = ApiHelpers.createApiClient(localConfig)
      await client.post(`/object/upload`, form, {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
      })

      console.log(
        `Successfully uploaded ${localFile} to the chest.store server!`
      )
    },
  }
}
