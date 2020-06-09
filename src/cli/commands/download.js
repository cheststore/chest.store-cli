import fs from 'fs'
import path from 'path'
import Conf from './config'
import ApiHelpers from '../../libs/ApiHelpers'
import FileManagement from '../../libs/FileManagement'
// import config from '../../config'

export default function Download({ log } = {}) {
  const confCommand = Conf({ log })
  const fileMgmt = FileManagement()

  return {
    help() {
      return `Download a file from a chest.store server with its ID. See '$ chest ls' command to get ID.`
    },

    async run(objectId) {
      const newFile = await new Promise(async (resolve, reject) => {
        try {
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

          const validArgs = typeof objectId === 'string'
          if (!validArgs)
            throw new Error(
              `Please enter an object ID to download from chest.store\nex. $ chest download qqqq4011-a999-1234-89a4-xxxxx5aaaaaa`
            )

          const client = ApiHelpers.createApiClient(localConfig)
          const {
            data: { object },
          } = await client.get(`/api/1.0/objects/get?id=${objectId}`)
          const fileName = object.name
          const filePath = path.join('.', fileName)
          const writeStream = fs.createWriteStream(filePath)

          const { data } = await client.get(`/file/download/${objectId}`, {
            responseType: 'stream',
          })

          data
            .on('err', reject)
            .on('end', () => resolve(filePath))
            .pipe(writeStream)
        } catch (err) {
          reject(err)
        }
      })

      console.log(`Successfully downloaded file to ${newFile}`)
    },
  }
}
