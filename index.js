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
  this.repo.getContents(this._branch, this._file, true, function (err, result, res) {
    if (err) return new Promise(function (_, reject) { reject(err) })
    content = result
  }).then(function () {
    return new Promise(function (resolve) {
      resolve(content)
    })
  })
}

GhStorage.prototype.write = function (data) {
  if (data) {
    this.repo.writeFile(this._branch, this._file, data, 'Update lowdb', function (err, result, res) {
      if (err) return new Promise(function (_, reject) { reject(err) })
      return new Promise(function (resolve) { resolve(result) })
    })
  }
}

module.exports = GhStorage
