import bunyan from 'bunyan'
import App from '../cli/App'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)
;(async function runCli() {
  try {
    await App(process.argv, { log })
    process.exit()
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    // log.error(`Error executing chest.store CLI command`, err)
    process.exit()
  }
})()
