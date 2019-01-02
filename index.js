#!/usr/bin/env node
let process = require('process')
let program = require('commander')
const rp = require('request-promise')
const chalk = require('chalk')

const yaml = require('js-yaml')
const fs = require('fs')

const execCommands = require('./src/execCommands')
const logError = function(errMsg) {
  console.log(chalk.red(`Error: ${errMsg}`))
}

program
  .command('init <pose> [appOptions...]')
  .description('init <starter> to <app name>')
  .option('-p, --path [localPath]', 'Use local path to init project starter')
  .option('-l, --link [urlLink]', 'Use url link to init project starter')
  .action(async function(pose, appOptions, cmdOptions) {
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

    if (cmdOptions.path) {
      starterYamlFile = fs.readFileSync(
        `${process.cwd()}/${cmdOptions.path}`,
        'utf8'
      )
    } else {
      const yamlUrl = cmdOptions.link
        ? cmdOptions.link
        : `https://raw.githubusercontent.com/devpose/posehub/master/ymls/${pose}.yml`

      try {
        starterYamlFile = await rp(yamlUrl)
      } catch (e) {
        logError(`Starter config "${pose}" not existed.`)
        return
      }
    }

    fs.mkdirSync(appName)
    process.chdir(appName)

    try {
      const starterConfig = yaml.safeLoad(starterYamlFile)
      execCommands(starterConfig)
    } catch (err) {
      throw err
    }
  })

program.version('0.0.1').parse(process.argv)
