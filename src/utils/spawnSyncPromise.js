const { spawnSync } = require('child_process')

const spawnSyncPromise = cmd => {
  const cmdSplit = cmd.split(' ')
  const command = cmdSplit[0]
  const args = cmdSplit.slice(1)
  return new Promise(function(resolve, reject) {
    const process = spawnSync(command, args, { stdio: 'inherit' })
    const { status } = process

    if (status === 0) {
      resolve()
    } else {
      reject()
    }
  })
}

module.exports = spawnSyncPromise
