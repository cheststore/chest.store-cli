import Conf from './conf'
import ApiHelpers from '../../libs/ApiHelpers'
// import config from '../../config'

export default function Ls({ log } = {}) {
  const confCommand = Conf({ log })

  return {
    help() {
      return `Fetch objects from a chest.store server in a particular cloud bucket.`
    },

    async run(...args) {
      let [searchQuery, page, perPage] = [null, 1, 10]
      if (args.length > 1) searchQuery = args[0]
      if (args.length > 2) page = args[1]
      if (args.length > 3) perPage = args[2]

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
          page,
          perPage,
        },
      })

      console.log(
        ApiHelpers.columnify(
          data.objectInfo.data.map((item) => ({
            bucket_type: item.bucket_type,
            // bucket_id: item.bucket_id,
            bucket_uid: item.bucket_uid,
            object_id: item.id,
            full_path: item.full_path,
            name: item.name,
          }))
        )
      )
    },
  }
}
