# lowdb-gh-adapter [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Set your github repo as a backend for your [lowdb][lowdb] instance

## Usage

```js
const low = require('lowdb')
const GhStorage = require('lowdb-gh-adapter')

const adapter = GhStorage({
  file: 'db.json',
  repo: 'lowdb-gh-adapter',
  user: 'YerkoPalma',
  token: process.env.TOKEN
})

low(adapter)
  .then(db => {
    // Set some defaults
    return db.defaults({ posts: [], user: {} })
      .write()
      .then(() => {
        // Add a post
        db.get('posts')
          .push({ id: 1, title: 'lowdb is awesome'})
          .write()
          .then(() => {
            // Set a user using Lodash shorthand syntax
            db.set('user.name', 'yerkopalma')
              .write()
          })
      })
  })
```

## API

### `const adapter = GhStorage(opts)`

Create an asynchronous adapter object, and then use it like any other 
asynchronous adapter with lowdb. Most of the options are mandatory:

- **`file`**: Required. A string indicating the path of the file where you want 
to store your data in your repo. `json` extension is not mandatory but it is 
recommended. If this file is not present in your repo, it will be automatically 
created.
- **`repo`**: Required. A string for the github repo where the `file` is stored.
- **`user`**: Required. The github username that owns the github repo.
- **`token`**: The personal [access token for github][Github token]. You can 
[create tokens here][Create token], you only need the `repo` permission. If this 
option is not provided, then you must provide a `username` and `password` option 
for authentication.
- **`username`**: A Github username who have access to the `repo` specified. 
Not needed if you provided a token, if you don't, you will also need a password 
for this username.
- **`password`**: A Github password for the username provided.
- **`branch`**: Optional. Pass a string with the name of the branch where you 
want to save your data. If the branch is not specified, it will default to master. 
If the provided branch doesn't exists in the repo it will attemp to create it as 
a clone of master branch.

## Disclaimer

Please note that this is not recommended for big scale projects. As lowdb 
[limits section][limits] says, for bigger projects you should stay with solutions 
like MongoDB.

Specially for this adapter, you should have a look to [Github Rate limit][rate limit] 
which has a quota of 5000 requests per hour.

## License

[MIT](/LICENSE)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/lowdb-gh-adapter.svg?style=flat-square
[3]: https://npmjs.org/package/lowdb-gh-adapter
[4]: https://img.shields.io/travis/YerkoPalma/lowdb-gh-adapter/master.svg?style=flat-square
[5]: https://travis-ci.org/YerkoPalma/lowdb-gh-adapter
[6]: https://img.shields.io/codecov/c/github/YerkoPalma/lowdb-gh-adapter/master.svg?style=flat-square
[7]: https://codecov.io/github/YerkoPalma/lowdb-gh-adapter
[8]: http://img.shields.io/npm/dm/lowdb-gh-adapter.svg?style=flat-square
[9]: https://npmjs.org/package/lowdb-gh-adapter
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[Github token]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
[Create token]: https://github.com/settings/tokens/new
[limits]: https://github.com/typicode/lowdb#limits
[lowdb]: https://github.com/typicode/lowdb
[rate limit]: https://developer.github.com/v3/#rate-limiting