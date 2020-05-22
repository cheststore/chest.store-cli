import Conf from './conf'
import ApiHelpers from '../../libs/ApiHelpers'
// import config from '../../config'

export default function Ls({ log } = {}) {
  const confCommand = Conf({ log })

  return {
    help() {
      return `Fetch objects from a chest.store server in a particular cloud bucket.`
    },

    async run(searchQuery) {
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

      log.debug(`making request to fetch objects to /api/1.0/objects/list`)

      const client = ApiHelpers.createApiClient(localConfig)
      const { data } = await client.get(`/api/1.0/objects/list`, {
        params: {
          directoryId: null,
          filters: JSON.stringify({
            searchQuery: typeof searchQuery === 'string' && searchQuery,
          }),
          page: 1,
          perPage: 30,
        },
      })

      console.log(
        ApiHelpers.columnify(
          data.objectInfo.data.map((item) => ({
            object_id: item.id,
            bucket_id: item.bucket_id,
            full_path: item.full_path,
            name: item.name,
          }))
        )
      )
    },
  }
}
