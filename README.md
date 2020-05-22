# chest.store CLI

Interface with the chest.store web application via a CLI interface.

## Install

```sh
$ npm install -g @cheststore/cli
$ chest --help
```

## Commands

1. `conf` - Initialize configuration options such as the chest.store server endpoint and API key the CLI will use to execute requests.
2. `ls` - List objects in your bucket (can be used to get the ID needed to use in `$ chest download ...`)
   - An extra CLI argument can be added to filter results based on a search query
   - ex. `$ chest ls myFileName`
3. `download` - Download file from a chest.store server to your file system.
   - ex. `$ chest download qqqq4011-a999-1234-89a4-xxxxx5aaaaaa`
4. `upload` - Upload files on your local file system to a chest.store server.
   - ex. `$ chest upload ./local/file.txt`
