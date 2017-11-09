var assert = require('nanoassert')
var Github = require('github-api')

function GhStorage (opts) {
  if (!(this instanceof GhStorage)) return new GhStorage(opts)
  // mandatory
  assert.ok(opts, 'GhStorage: Must provide an opts parameter')
  assert.ok(opts.file, 'GhStorage: `opts.file` must be specified')
  assert.ok(opts.repo, 'GhStorage: `opts.repo` must be specified')
  assert.ok(opts.token || (opts.username && opts.password), 'GhStorage: A token or username/password credentials must be set')
  assert.ok(opts.user, 'GhStorage: Github user and repo must be provided')
  this._file = opts.file
  this._repo = opts.repo
  this._user = opts.user

  // optional
  this._branch = opts.branch || 'master'
  var credentials = opts.token ? { token: opts.token } : { username: opts.username, password: opts.password }
  var github = new Github(credentials)
  this.repo = github.getRepo(this._user, this._repo)
}

GhStorage.prototype.read = function () {
  var content
  return this.repo.getContents(this._branch, this._file, true, (err, result, res) => {
    if (err && err.response.status !== 404) throw err
    content = result
  })
  .then(response => {
    if (content) {
      return new Promise(resolve => resolve(content))
    } else {
      // if content is not present we must create the file
      return this.repo.writeFile(this._branch, this._file, '{}', '[skip ci] Update lowdb', (err, result, res) => {
        if (err && err.response.status !== 404) throw err
        // if we get again a 404, then it is highly possible that the branch doesn't exist
        // so, attempt to create it
        if (err.response.status === 404) {
          // just return it, anyway we are going to send the default empty object
          return this.repo.createBranch('master', this._branch)
        }
      }).then(response => {
        return new Promise(resolve => resolve({}))
      })
    }
  })
}

GhStorage.prototype.write = function (data) {
  var content
  if (typeof data === 'object') data = JSON.stringify(data, null, 2)
  return this.repo.writeFile(this._branch, this._file, data, '[skip ci] Update lowdb', (err, result, res) => {
    if (err) return new Promise((resolve, reject) => reject(err))
    content = result
  }).then(response => {
    return new Promise(resolve => resolve(content))
  })
}

module.exports = GhStorage
