const fs = require('fs')
const spawnSyncPromise = require('./utils/spawnSyncPromise')

const execCommands = async starterConfig => {
  const commands = starterConfig.commands

  for (let i = 0, len = commands.length; i < len; i++) {
    const cmdItem = commands[i]

    if (typeof cmdItem === 'object' && cmdItem.devpose) {
      switch (cmdItem.devpose.command) {
        case 'CreateFlatFile':
          const fileContentKey = cmdItem.devpose.content
          const fileContent = starterConfig[fileContentKey]
          fs.writeFile(
            `${process.cwd()}/${cmdItem.devpose.name}`,
            fileContent.join('\n\n'),
            err => {
              if (err) throw err
            }
          )
          break
        case 'CreateYamlFile':
          const yamlKey = cmdItem.devpose.content
          const yamlContent = starterConfig[yamlKey]
          const yamlStr = yaml.safeDump(yamlContent)
          fs.writeFile(
            `${process.cwd()}/${cmdItem.devpose.name}`,
            yamlStr,
            err => {
              if (err) throw err
            }
          )
          break
      }
    } else {
      const cmds = cmdItem.split(' ')
      const cmd = cmds[0]
      switch (cmd) {
        case 'cd':
          process.chdir(cmds[1])
          break
        default:
          await spawnSyncPromise(cmdItem)
      }
    }
  }
}

module.exports = execCommands
