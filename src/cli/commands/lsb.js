import Conf from './config'
import ApiHelpers from '../../libs/ApiHelpers'
// import config from '../../config'

export default function Ls({ log } = {}) {
  const confCommand = Conf({ log })

  return {
    help() {
      return `List all cloud buckets you have access to.`
    },

    async run(...args) {
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

      log.debug(`making request to fetch buckets to /api/1.0/buckets/list`)

      const client = ApiHelpers.createApiClient(localConfig)
      const { data } = await client.get(`/api/1.0/buckets/list`, {
        params: {},
      })

      console.log(
        ApiHelpers.columnify(
          data.buckets.map((buck) => ({
            type: buck.type,
            bucket: buck.bucket_uid,
            id: buck.id,
          }))
        )
      )
    },
  }
}
