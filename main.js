const Registers = require('./registers')

const MAX_VALUE = 32767

function getRegister(v) {
  if (v < MAX_VALUE || v > MAX_VALUE + 8)
    throw new Error(`Invalid register "${v}"`)
  return v - (MAX_VALUE + 1)
}

function getValue(v, registers) {
  if (v < 0) throw new Error(`Invalid value "${v}", below minimum of 0`)
  if (v >= 0 && v <= MAX_VALUE) return v
  return registers.read(getRegister(v))
}

/**
 * @param {Buffer} program
 */
function getProgramValue(program, i) {
  return program.readUInt16LE(i * 2)
}

/**
 * @param {Buffer} program
 * @param {NodeJS.WriteStream} writeStream
 */
function run(program, args, writeStream, log) {
  let registers = new Registers()
  let stack = []
  let i = 0
  let halt = false

  while (true) {
    // Get instruction from buffer
    let ins = getProgramValue(program, i)
    let a, b, c
    switch (ins) {
      case 0x00: // HALT
        halt = true
        break
      case 0x01: // SET
        a = getRegister(getProgramValue(program, i + 1))
        b = getValue(getProgramValue(program, i + 2), registers)
        registers.write(a, b)
        i += 2
        break
      case 0x02: // PUSH a on to the stack
        a = getValue(getProgramValue(program, i + 1), registers)
        stack.push(a)
        i += 1
        break
      case 0x03: // POP stack and set to a
        a = getRegister(getProgramValue(program, i + 1))
        registers.write(a, stack.pop())
        i += 1
        break
      case 0x04: // eq -> set a to 1 if b = c
        a = getRegister(getProgramValue(program, i + 1))
        b = getValue(getProgramValue(program, i + 2), registers)
        c = getValue(getProgramValue(program, i + 3), registers)
        registers.write(a, b === c ? 1 : 0)
        i += 3
        break
      case 0x05: // gt set a to 1 if b > c
        a = getRegister(getProgramValue(program, i + 1))
        b = getValue(getProgramValue(program, i + 2), registers)
        c = getValue(getProgramValue(program, i + 3), registers)
        registers.write(a, b > c ? 1 : 0)
        i += 3
        break
      case 0x06: // JMP
        a = getValue(getProgramValue(program, i + 1), registers)
        i = a - 1 // -1 because end of switch increments
        break
      case 0x07: // JT -> Jump if <a> is nonzero, to <b>
        a = getValue(getProgramValue(program, i + 1), registers)
        if (a > 0) {
          b = getValue(getProgramValue(program, i + 2), registers)
          i = b - 1
        } else {
          i += 2
        }
        break
      case 0x08: // JF -> Jump if <a> is zero, to <b>
        a = getValue(getProgramValue(program, i + 1), registers)
        if (a === 0) {
          b = getValue(getProgramValue(program, i + 2), registers)
          i = b - 1
        } else {
          i += 2
        }
        break
      case 0x09: // ADD
        a = getRegister(getProgramValue(program, i + 1))
        b = getValue(getProgramValue(program, i + 2), registers)
        c = getValue(getProgramValue(program, i + 3), registers)
        registers.write(a, (b + c) % (MAX_VALUE + 1))
        i += 3
        break
      case 0x13: // OUT
        a = getValue(getProgramValue(program, i + 1), registers)
        writeStream.write(String.fromCharCode(a))
        i++
        break
      case 0x15: // NOOP
        break
      // Special OPS
      case 0xf0: // REG_DUMP
        console.log('REGDUMP')
        writeStream.write(registers.pretty() + '\n')
        break
      default:
        halt = true
        writeStream.write(`\n\nSomething went wrong at address "${i}"\n`)
        writeStream.write(
          `\n\tInstruction "0x${ins.toString(16)}" not recognized.`
        )
        writeStream.write(`\n\tMemory: ${program.readUInt16LE(i)}`)
        break
    }

    if (halt) break

    i++
  }

  writeStream.write('\ndone\n')
}

module.exports = {
  run
}
