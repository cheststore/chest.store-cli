# chest.store CLI

This is a CLI interface to interact with a chest.store server to manage buckets & objects
including listing, uploading, and downloading them. Note that you can use the git CLI like
you would any other remote & repo without this package installed.

## Note on git

chest.store has a built in HTTP git server and can be used
like any other git remote to clone, push, pull, etc. any repository that uses git
for its version control. Therefore, use git CLI or another git client
to interact with your chest.store server without this package by simply setting up
a new remote in your repository(ies) of choice to your chest.store server and
push/pull as changes are made.

```sh
$ # `https://app.chest.store` below can be replaced with your server
$ git remote add chest https://app.chest.store/git/$YOUR_USERNAME/$REPO
$ git push chest master
```

## Install

```sh
$ npm install -g @cheststore/cli
$ chest config
$ chest --help
```

## Commands

1. `config` - Initialize configuration options such as the server endpoint and API key the CLI will use to execute requests.
   - To get your API key, navigate to `$CHESTSTORE_SERVER_URL/profile` and scroll down to tge API KEY section.
2. `ls` - List objects in your bucket (can be used to get the ID needed to use in `$ chest download ...`)
   - An extra CLI argument can be added to filter results based on a search query
   - ex. `$ chest ls myFileName`
3. `lsb` - List all cloud buckets you have access to
4. `download` - Download file/object from a chest.store server to your file system. The object ID is required (get from `ls`)
   - ex. `$ chest download qqqq4011-a999-1234-89a4-xxxxx5aaaaaa`
5. `upload` - Upload files on your local file system to a chest.store server.
   - ex. `$ chest upload ./local/file.txt`
