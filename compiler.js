const MIN_VALUE = 0
const MAX_VALUE = 32767

function reg(symbol) {
  let r = [null, 0x80]
  switch (symbol) {
    case 'a':
      r[0] = 0x00
      break
    case 'b':
      r[0] = 0x01
      break
    case 'c':
      r[0] = 0x02
      break
    case 'd':
      r[0] = 0x03
      break
    case 'e':
      r[0] = 0x04
      break
    case 'f':
      r[0] = 0x05
      break
    case 'g':
      r[0] = 0x06
      break
    case 'h':
      r[0] = 0x07
      break
    default:
      throw new Error('Invalid registry symbol -> "' + symbol + '"')
  }
  return r
}

function sym(symbol) {
  const val = parseInt(symbol)
  if (isNaN(val)) {
    return reg(symbol)
  } else {
    if (val < MIN_VALUE || val > MAX_VALUE)
      throw new Error('Invalid literal -> ' + val)
    return [val % 256, Math.floor(val / 256)]
  }
}

function mem(symbol) {
  const val = parseInt(symbol)
  return [val % 256, Math.floor(val / 256)]
}

// halt: 0
//   stop execution and terminate the program
const halt = () => Buffer.from([0x00, 0x00])
// set: 1 a b
//   set register <a> to the value of <b>
const set = (a, b) => Buffer.from([0x01, 0x00, ...reg(a), ...sym(b)])
// push: 2 a
//   push <a> onto the stack
const push = a => Buffer.from([0x02, 0x00, ...sym(a)])
// pop: 3 a
//   remove the top element from the stack and write it into <a>; empty stack = error
const pop = a => Buffer.from([0x03, 0x00], ...reg(a))
// eq: 4 a b c
//   set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
const eq = (a, b, c) =>
  Buffer.from([0x04, 0x00], ...reg(a), ...sym(b), ...sym(c))
// gt: 5 a b c
//   set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
const gt = (a, b, c) =>
  Buffer.from([0x05, 0x00], ...reg(a), ...sym(b), ...sym(c))
// jmp: 6 a
//   jump to <a>
const jmp = a => Buffer.from([0x06, 0x00], ...sym(a))
// jt: 7 a b
//   if <a> is nonzero, jump to <b>
const jt = (a, b) => Buffer.from([0x07, 0x00], ...sym(a), ...sym(b))
// jf: 8 a b
//   if <a> is zero, jump to <b>
const jf = (a, b) => Buffer.from([0x08, 0x00], ...sym(a), ...sym(b))
// add: 9 a b c
//   assign into <a> the sum of <b> and <c> (modulo 32768)
const add = (a, b, c) =>
  Buffer.from([0x09, 0x00, ...reg(a), ...sym(b), ...sym(c)])
// mult: 10 a b c
//   store into <a> the product of <b> and <c> (modulo 32768)
const mult = (a, b, c) =>
  Buffer.from([0x0a, 0x00], ...reg(a), ...sym(b), ...sym(c))
// mod: 11 a b c
//   store into <a> the remainder of <b> divided by <c>
const mod = (a, b, c) =>
  Buffer.from([0x0b, 0x00], ...reg(a), ...sym(b), ...sym(c))
// and: 12 a b c
//   stores into <a> the bitwise and of <b> and <c>
const and = (a, b, c) =>
  Buffer.from([0x0c, 0x00], ...reg(a), ...sym(b), ...sym(c))
// or: 13 a b c
//   stores into <a> the bitwise or of <b> and <c>
const or = (a, b, c) =>
  Buffer.from([0x0d, 0x00], ...reg(a), ...sym(b), ...sym(c))
// not: 14 a b
//   stores 15-bit bitwise inverse of <b> in <a>
const not = (a, b) => Buffer.from([0x0e, 0x00], ...reg(a), ...sym(b))
// rmem: 15 a b
//   read memory at address <b> and write it to <a>
const rmem = (a, b) => Buffer.from([0x0f, 0x00], ...reg(a), ...sym(b))
// wmem: 16 a b
//   write the value from <b> into memory at address <a>
const wmem = (a, b) => Buffer.from([0x10, 0x00], ...sym(a), ...reg(b))
// call: 17 a
//   write the address of the next instruction to the stack and jump to <a>
const call = a => Buffer.from([0x11, 0x00], ...mem(a))
// ret: 18
//   remove the top element from the stack and jump to it; empty stack = halt
const ret = () => Buffer.from([0x12, 0x00])
// out: 19 a
//   write the character represented by ascii code <a> to the terminal
const out = a => Buffer.from([0x13, 0x00, ...sym(a)])
// in: 20 a
//   read a character from the terminal and write its ascii code to <a>; it can be assumed that once input starts, it will continue until a newline is encountered; this means that you can safely read whole lines from the keyboard and trust that they will be fully read
const _in = a => Buffer.from([0x14, 0x00, ...reg(a)])
// noop: 21
//   no operation
const noop = () => Buffer.from([0x15, 0x00])

// SPECIAL OPS
const REG_DUMP = () => Buffer.from([0xf0, 0x00])

const ensureLen = (a, l) => {
  if (a.length !== l)
    throw new Error(
      `Syntax error. "${a[0]}" expects ${l - 1} arguments, not ${a.length - 1}`
    )
}

function compile(data) {
  // Split by lines
  let totalLength = 0
  let buffers = data
    .split('\n')
    .map(l => l.split(' '))
    .map(ins => {
      let buf = null
      switch (ins[0]) {
        case 'halt': // 0x00
          ensureLen(ins, 1)
          buf = halt()
          break
        case 'set': // 0x01
          ensureLen(ins, 3)
          buf = set(ins[1], ins[2])
          break
        case 'push': // 0x02
          ensureLen(ins, 2)
          buf = push(ins[1])
          break
        case 'add': // 0x09
          ensureLen(ins, 4)
          buf = add(ins[1], ins[2], ins[3])
          break
        case 'out': // 0x13
          ensureLen(ins, 2)
          buf = out(ins[1])
          break
        case 'REG_DUMP': // 0xf0
          ensureLen(ins, 1)
          buf = REG_DUMP()
          break
        default:
          buf = halt()
      }
      totalLength += buf.length
      return buf
    })

  return Buffer.concat(buffers, totalLength)
}

module.exports = {
  compile
}
