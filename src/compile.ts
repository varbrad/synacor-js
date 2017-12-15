import Memory from './storage/Memory'

import { Oplabel, getOpcode } from './ops'

function getLabelValue(v: string): number {
  if (v === '') throw new Error(`Non-existant label value`)
  const indexOf = 'abcdefgh'.indexOf(v)
  if (indexOf > -1) return indexOf + 32768
  let value: number = Number(v)
  if (isNaN(value)) throw new Error(`Error parsing value "${v}"`)
  if (value < 0 || value > 32775)
    throw new Error(`Out-of-range value "${value}"`)
  return value
}

function flattenArray(array: any[]): any[] {
  return array.reduce(
    (flat, toFlatten) =>
      flat.concat(
        Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten
      ),
    []
  )
}

export function compile(source: string): Memory {
  const data = source
    .trim()
    .split('\n')
    .map(v => v.split(' '))
    .map((line, ln) => {
      const opcode = getOpcode(line[0] as Oplabel)
      const args = line.slice(1).map(getLabelValue)
      return [opcode, ...args]
    })
  return Memory.fromArray(flattenArray(data))
}
