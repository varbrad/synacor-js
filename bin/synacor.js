#! /usr/bin/env node
const fs = require('fs')

const bytes = require('bytes')
const chalk = require('chalk')

const Synacor = require('../main.js')

const read = fs.createReadStream('spec/challenge.bin')
let chunks = [],
  totalLength = 0

read.on('data', function(chunk) {
  chunks.push(chunk)
  totalLength += chunk.length
})

read.on('end', function() {
  console.log(chalk.blue('Loaded', bytes(totalLength), ' binary'))
  Synacor.run(Buffer.concat(chunks, totalLength), [])
})
