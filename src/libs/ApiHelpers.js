import axios from 'axios'
import columnify from 'columnify'
import config from '../config'

export default {
  createApiClient(localConfig) {
    return axios.create({
      baseURL: localConfig.cheststoreApiHost,
      headers: {
        'User-Agent': 'chest.store-cli',
        [config.apiKeyHeader]: localConfig.cheststoreApiKey,
      },
    })
  },

  columnify(data) {
    return columnify(data, {
      minWidth: 15,
    })
  },
}
