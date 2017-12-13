const REGISTER_COUNT = 8
const MAX_VALUE = 32767

const fs = require('fs')

const program = fs.readFileSync('program.sy')
const programLength = program.length

const registers = Buffer.from(
  [...Array(REGISTER_COUNT * 2).keys()].map(v => 0x00)
)

// If less than or eq MAX_VALUE, just returns it
// Else returns register value
function parseValue(n) {
  if (n < 0 || n > MAX_VALUE + REGISTER_COUNT) throw new Error('Invalid value')
  if (n <= MAX_VALUE) return n
  else return registers.readUInt16LE((n - (MAX_VALUE + 1)) * 2)
}

function set() {
  let a = program.readUInt16LE(index + 2)
  let b = program.readUInt16LE(index + 4)
  // a should be a register, b can be register | literal
  a -= MAX_VALUE + 1 // To get into registry
  // a will now be 0 to 7 (inclusive)
  b = parseValue(b)
  //
  registers.writeUInt16LE(b, a * 2)
}

function add() {
  let a = program.readUInt16LE(index + 2)
  let b = program.readUInt16LE(index + 4)
  let c = program.readUInt16LE(index + 6)
  a -= MAX_VALUE + 1
  b = parseValue(b)
  c = parseValue(c)
  //
  registers.writeUInt16LE((b + c) % (MAX_VALUE + 1), a * 2)
}

function out() {
  let a = program.readUInt16LE(index + 2)
  a = parseValue(a)
  return String.fromCharCode(a)
}

let index = 0
let halt = 0
while (true) {
  // Get the value of index
  const ins = program.readUInt16LE(index)

  // Is this an instruction we understand?
  switch (ins) {
    case 0x00:
      halt = 1
      break
    case 0x01:
      set()
      index += 4
      break
    case 0x09:
      add()
      index += 6
      break
    case 0x13:
      process.stdout.write(out())
      index += 2
      break
    default:
      console.log('Unknown cmd', ins.toString(16))
      break
  }
  if (halt > 0) break
  index += 2
}

process.stdout.write('\n')
