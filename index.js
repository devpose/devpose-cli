#!/usr/bin/env node
let process = require('process')
let program = require('commander')
const rp = require('request-promise')
const chalk = require('chalk')
const spawnSyncPromise = require('./lib/spawnSyncPromise')

const yaml = require('js-yaml')
const fs = require('fs')

const logError = function(errMsg) {
  console.log(chalk.red(`Error: ${errMsg}`))
}

program
  .command('init <pose> [appOptions...]')
  .description('init <starter> to <app name>')
  .action(async function(pose, appOptions) {
    let [to, appName] = appOptions.length === 2 ? appOptions : []

    if (to !== 'to') {
      logError(
        'You should input command in format like "dp init <starter> to <app name>"'
      )
      return
    }

    if (!appName || appName === '') {
      logError(
        'You should input command in format like "dp init <starter> to <app name>"'
      )
      return
    }

    if (fs.existsSync(appName)) {
      logError(`Folder "${appName}" alredy existed.`)
      return
    }

    let starterYamlFile
    try {
      starterYamlFile = await rp(
        `https://raw.githubusercontent.com/devpose/posehub/master/ymls/${pose}.yml`
      )
    } catch (e) {
      logError(`Starter config "${pose}" not existed.`)
      return
    }

    fs.mkdirSync(appName)
    process.chdir(appName)

    try {
      const starterConfig = yaml.safeLoad(starterYamlFile)

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
    } catch (err) {
      throw err
    }
  })

program.version('0.0.1').parse(process.argv)
