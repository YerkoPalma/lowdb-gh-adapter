const test = require('tape')
require('dotenv').config()
const low = require('lowdb')
const GhStorage = require('.')
const Github = require('github-api')

// before
var repo
const TEST_BRANCH = 'test'
const DB_FILE = 'db.json'

test('setup', t => {
  // ensure a test branch exists
  var github = new Github({ token: process.env.TOKEN })
  repo = github.getRepo('YerkoPalma', 'lowdb-gh-adapter')
  repo.listBranches((err, results) => {
    if (err) t.fail()
    var branch = results.filter(b => b.name === TEST_BRANCH)[0]
    if (!branch) {
      repo.createBranch('master', TEST_BRANCH, () => t.end())
    } else {
      t.end()
    }
  })
})

test('should throw when some option is missed', t => {
  t.throws(() => {
    const adapter = GhStorage()
    low(adapter)
  })
  t.end()
})
test('should require token or username and password', t => {
  t.throws(() => {
    const adapter = GhStorage({
      file: DB_FILE,
      repo: 'lowdb-gh-adapter',
      user: 'YerkoPalma'
    })
    low(adapter)
  })
  t.throws(() => {
    const adapter = GhStorage({
      file: DB_FILE,
      repo: 'lowdb-gh-adapter',
      user: 'YerkoPalma',
      username: 'YerkoPalma'
    })
    low(adapter)
  })
  t.end()
})
test('should create file if not present', t => {
  const adapter = GhStorage({
    file: DB_FILE,
    repo: 'lowdb-gh-adapter',
    user: 'YerkoPalma',
    token: process.env.TOKEN
  })
  low(adapter)
    .then(db => {
      repo.getContents('master', DB_FILE, true, (err, content) => {
        if (err) {
          t.fail()
          t.end()
        } else {
          t.pass()
          t.end()
        }
      })
    })
})
test('should accept branch option', t => {
  const adapter = GhStorage({
    file: DB_FILE,
    repo: 'lowdb-gh-adapter',
    user: 'YerkoPalma',
    token: process.env.TOKEN,
    branch: TEST_BRANCH
  })
  low(adapter)
    .then(db => {
      repo.getContents(TEST_BRANCH, DB_FILE, true, (err, content) => {
        if (err) {
          t.fail()
          t.end()
        } else {
          t.pass()
          t.end()
        }
      })
    })
})

// after
test.onFinish(() => {
  // delete db files
  repo.listBranches((err, branches) => {
    if (err) throw err
    branches.map(branch => {
      repo.deleteFile(branch.name, DB_FILE)
    })
  })
})
