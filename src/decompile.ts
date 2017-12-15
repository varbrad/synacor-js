import Memory from './storage/Memory'

import { Opcode, Oplabel, Opargs, getOpcodeLabel, getOpcodeArgs } from './ops'

function getValueLabel(v: number): string {
  if (v <= 32767) return String(v)
  if (v <= 32775) return 'abcdefgh'[v - 32768]
  throw new Error(`Invalid value in binary "${v}"`)
}

export function decompile(memory: Memory) {
  // A list of the instructions
  const instructions = []
  let i: number = 0
  let memoryLength: number = memory.length()
  // Loop until we are done
  while (i < memoryLength) {
    // Get this memory instruction opcode
    const opcode: Opcode = memory.get(i)
    const label: Oplabel = getOpcodeLabel(opcode)
    const args: Opargs = getOpcodeArgs(opcode)

    let line: string = label
    let argsArray: (number | string)[] = []
    for (let k = 0; k < args; ++k)
      argsArray.push(getValueLabel(memory.get(i + k + 1)))

    line += ' ' + argsArray.join(' ')

    // Write the label to the instruction
    instructions.push(line)

    i += args + 1 // Arguments plus the opcode itself
  }
  // Return the instructions
  return instructions.join('\n')
}
