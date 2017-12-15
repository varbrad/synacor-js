import { Writable, Readable } from 'stream'

import Memory from './storage/Memory'
import Registers from './storage/Registers'
import Stack from './storage/Stack'

import { decompile } from './decompile'

import { Opcode, Opargs, getOpcodeLabel, getOpcodeArgs } from './ops'

/**
 * @param memory A memory object to run
 * @param writeStream A Writeable object to stream output to
 */
export function execute(
  memory: Memory,
  writeStream: Writable,
  readStream: Readable
): number {
  const registers = new Registers()
  const stack = []

  const memLen = memory.length()

  let i = 0
  let lastI = -1

  loop: while (i < memLen) {
    const opcode = memory.get(i)
    switch (opcode) {
      case Opcode.halt:
        // 0 -> stop execution and terminate the program
        writeStream.write('\nHALTED at memory address: ' + i)
        break loop
      case Opcode.set:
        // 1 -> set register <a> to the value of <b>
        registers.set(memory.get(i + 1), memory.get(i + 2))
        i += Opargs.set + 1
        break
      case Opcode.push:
        // 2 -> push <a> onto the stack
        stack.push(registers.get(memory.get(i + 1)))
        i += Opargs.push + 1
        break
      case Opcode.pop:
        // 3 -> remove the top element from the stack and write it into <a>
        registers.set(memory.get(i + 1), stack.pop())
        i += Opargs.pop + 1
        break
      case Opcode.eq:
        // 4 -> set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) === registers.get(memory.get(i + 3))
            ? 1
            : 0
        )
        i += Opargs.eq + 1
        break
      case Opcode.gt:
        // 5 -> set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) > registers.get(memory.get(i + 3))
            ? 1
            : 0
        )
        i += Opargs.gt + 1
        break
      case Opcode.jmp:
        // 6 -> jump to <a>
        i = registers.get(memory.get(i + 1))
        break
      case Opcode.jt:
        // 7 -> if <a> is nonzero, jump to <b>
        if (registers.get(memory.get(i + 1)) !== 0) {
          i = registers.get(memory.get(i + 2))
        } else {
          i += Opargs.jt + 1
        }
        break
      case Opcode.jf:
        // 8 -> if <a> is zero, jump to <b>
        if (registers.get(memory.get(i + 1)) === 0) {
          i = registers.get(memory.get(i + 2))
        } else {
          i += Opargs.jf + 1
        }
        break
      case Opcode.add:
        // 9 -> assign into <a> the sum of <b> and <c> % 32768
        registers.set(
          memory.get(i + 1),
          (registers.get(memory.get(i + 2)) +
            registers.get(memory.get(i + 3))) %
            32768
        )
        i += Opargs.add + 1
        break
      case Opcode.mult:
        // 10 -> assign into <a> the product of <b> and <c> % 32768
        registers.set(
          memory.get(i + 1),
          (registers.get(memory.get(i + 2)) *
            registers.get(memory.get(i + 3))) %
            32768
        )
        i += Opargs.mult + 1
        break
      case Opcode.mod:
        // 11 -> assign into <a> the value  of <b> % <c>
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) % registers.get(memory.get(i + 3))
        )
        i += Opargs.mod + 1
        break
      case Opcode.and:
        // 12 -> store into <a> the bitwise and of <b> and <c>
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) & registers.get(memory.get(i + 3))
        )
        i += Opargs.and + 1
        break
      case Opcode.or:
        // 13 -> store into <a> the bitwise and of <b> and <c>
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) | registers.get(memory.get(i + 3))
        )
        i += Opargs.or + 1
        break
      case Opcode.not:
        registers.set(
          memory.get(i + 1),
          registers.get(memory.get(i + 2)) ^ 32767
        )
        i += Opargs.not + 1
        break
      case Opcode.rmem:
        // 15 -> read memory at address <b> and write it to <a>
        registers.set(
          memory.get(i + 1),
          memory.get(registers.get(memory.get(i + 2)))
        )
        i += Opargs.rmem + 1
        break
      case Opcode.wmem:
        // 16 -> write the value from <b> into memory at address <a>
        memory.set(
          registers.get(memory.get(i + 1)),
          registers.get(memory.get(i + 2))
        )
        i += Opargs.wmem + 1
        break
      case Opcode.call:
        // 17 -> write the address of the next instruction to the stack and jump to <a>
        stack.push(i + Opargs.call + 1)
        i = registers.get(memory.get(i + 1))
        break
      case Opcode.ret:
        // 18 -> remove the top element from the stack and jump to it; empty stack = halt
        i = registers.get(stack.pop())
        break
      case Opcode.out:
        // 19 -> write the character represented by ascii code <a> to the terminal
        writeStream.write(
          String.fromCharCode(registers.get(memory.get(i + 1))),
          'utf-8'
        )
        i += Opargs.out + 1
        break
      case Opcode.in:
        break
      case Opcode.noop:
        // 21 -> no operation
        i += Opargs.noop + 1
        break
    }
    if (i === lastI) {
      writeStream.write(
        '\n\nGot stuck in a loop at memory address: ' +
          i +
          '\nOpcode: ' +
          opcode +
          '\nInstruction: ' +
          decompile(new Memory(memory.slice(i, getOpcodeArgs(opcode) + 1))) +
          '\n'
      )
      break loop
    }
    lastI = i
  }
  return -1
}
