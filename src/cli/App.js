import program from 'commander'
import rootDir from 'root-require'
import Commands from './commands'

export default async function App(argv, { log } = {}) {
  return new Promise((resolve, reject) => {
    try {
      let command
      program.version(rootDir('package.json').version, '-v, --version')

      Object.keys(Commands).forEach((comm) => {
        const commandFactory = Commands[comm]({ log })
        program
          .command(comm)
          .description(commandFactory.help())
          .action(async (...args) => {
            try {
              command = comm
              await commandFactory.run(...args)
              resolve()
            } catch (err) {
              reject(err)
            }
          })
      })

      program.on('command:*', function invalidCommand() {
        reject(
          `Invalid command: ${program.args.join(
            ' '
          )}\nSee --help for a list of available commands.`
        )
      })

      program.parse(argv)

      if (program.args.length === 0)
        reject(
          'Please provide a valid command\nSee --help for a list of available commands.'
        )
    } catch (err) {
      reject(err)
    }
  })
}
