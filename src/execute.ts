import { Writable } from 'stream'

import Memory from './storage/Memory'
import Registers from './storage/Registers'
import Stack from './storage/Stack'

import { Opcode, Opargs } from './ops'

/**
 * @param memory A memory object to run
 * @param writeStream A Writeable object to stream output to
 */
export function execute(memory: Memory, writeStream: Writable): number {
  const registers = new Registers()
  const stack = new Stack()

  const memLen = memory.length()

  let i = 0
  loop: while (i < memLen) {
    const opcode = memory.get(i)
    switch (opcode) {
      case Opcode.halt:
        break loop
      case Opcode.set:
        registers.set(memory.get(i + 1), memory.get(i + 2))
        i += Opargs.set + 1
        break
      case Opcode.out:
        // write the character represented by ascii code <a> to the terminal
        writeStream.write(
          String.fromCharCode(registers.get(memory.get(i + 1))),
          'utf-8'
        )
        i += Opargs.out + 1
        break
      case Opcode.noop:
        // no operation
        i += Opargs.noop + 1
        break
    }
  }
  return -1
}
