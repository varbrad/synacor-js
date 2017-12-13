const fs = require('fs')

const Synacor = require('./main')
const compiler = require('./compiler')

const program = fs.readFileSync('spec/challenge.bin')

// const program = compiler.compile(`out 66
// out 67
// out 68
// out 69
// out 70
// halt`)

Synacor.run(program, [], process.stdout)
