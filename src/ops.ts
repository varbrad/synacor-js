export enum Opcode {
  halt = 0x0000,
  set = 0x0001,
  push = 0x0002,
  pop = 0x0003,
  eq = 0x0004,
  gt = 0x0005,
  jmp = 0x0006,
  jt = 0x0007,
  jf = 0x0008,
  add = 0x0009,
  mult = 0x000a,
  mod = 0x000b,
  and = 0x000c,
  or = 0x000d,
  not = 0x000e,
  rmem = 0x000f,
  wmem = 0x0010,
  call = 0x0011,
  ret = 0x0012,
  out = 0x0013,
  in = 0x0014,
  noop = 0x0015
}

export enum Opargs {
  halt = 0,
  set = 2,
  push = 1,
  pop = 1,
  eq = 3,
  gt = 3,
  jmp = 1,
  jt = 2,
  jf = 2,
  add = 3,
  mult = 3,
  mod = 3,
  and = 3,
  or = 3,
  not = 2,
  rmem = 2,
  wmem = 2,
  call = 1,
  ret = 0,
  out = 1,
  in = 1,
  noop = 0
}

export enum Oplabel {
  halt = 'halt',
  set = 'set',
  push = 'push',
  pop = 'pop',
  eq = 'eq',
  gt = 'gt',
  jmp = 'jmp',
  jt = 'jt',
  jf = 'jf',
  add = 'add',
  mult = 'mult',
  mod = 'mod',
  and = 'and',
  or = 'or',
  not = 'not',
  rmem = 'rmem',
  wmem = 'wmem',
  call = 'call',
  ret = 'ret',
  out = 'out',
  in = 'in',
  noop = 'noop'
}

export function getOpcode(oplabel: Oplabel): Opcode {
  switch (oplabel) {
    case Oplabel.add:
      return Opcode.add
    case Oplabel.and:
      return Opcode.and
    case Oplabel.call:
      return Opcode.call
    case Oplabel.eq:
      return Opcode.eq
    case Oplabel.gt:
      return Opcode.gt
    case Oplabel.halt:
      return Opcode.halt
    case Oplabel.in:
      return Opcode.in
    case Oplabel.jf:
      return Opcode.jf
    case Oplabel.jmp:
      return Opcode.jmp
    case Oplabel.jt:
      return Opcode.jt
    case Oplabel.mod:
      return Opcode.mod
    case Oplabel.mult:
      return Opcode.mult
    case Oplabel.noop:
      return Opcode.noop
    case Oplabel.not:
      return Opcode.not
    case Oplabel.or:
      return Opcode.or
    case Oplabel.out:
      return Opcode.out
    case Oplabel.pop:
      return Opcode.pop
    case Oplabel.push:
      return Opcode.push
    case Oplabel.ret:
      return Opcode.ret
    case Oplabel.rmem:
      return Opcode.rmem
    case Oplabel.set:
      return Opcode.set
    case Oplabel.wmem:
      return Opcode.wmem
  }
}

export function getOpcodeLabel(opcode: Opcode): Oplabel {
  switch (opcode) {
    case Opcode.add:
      return Oplabel.add
    case Opcode.and:
      return Oplabel.and
    case Opcode.call:
      return Oplabel.call
    case Opcode.eq:
      return Oplabel.eq
    case Opcode.gt:
      return Oplabel.gt
    case Opcode.halt:
      return Oplabel.halt
    case Opcode.in:
      return Oplabel.in
    case Opcode.jf:
      return Oplabel.jf
    case Opcode.jmp:
      return Oplabel.jmp
    case Opcode.jt:
      return Oplabel.jt
    case Opcode.mod:
      return Oplabel.mod
    case Opcode.mult:
      return Oplabel.mult
    case Opcode.noop:
      return Oplabel.noop
    case Opcode.not:
      return Oplabel.not
    case Opcode.or:
      return Oplabel.or
    case Opcode.out:
      return Oplabel.out
    case Opcode.pop:
      return Oplabel.pop
    case Opcode.push:
      return Oplabel.push
    case Opcode.ret:
      return Oplabel.ret
    case Opcode.rmem:
      return Oplabel.rmem
    case Opcode.set:
      return Oplabel.set
    case Opcode.wmem:
      return Oplabel.wmem
  }
}

export function getOpcodeArgs(opcode: Opcode): Opargs {
  switch (opcode) {
    case Opcode.add:
      return Opargs.add
    case Opcode.and:
      return Opargs.and
    case Opcode.call:
      return Opargs.call
    case Opcode.eq:
      return Opargs.eq
    case Opcode.gt:
      return Opargs.gt
    case Opcode.halt:
      return Opargs.halt
    case Opcode.in:
      return Opargs.in
    case Opcode.jf:
      return Opargs.jf
    case Opcode.jmp:
      return Opargs.jmp
    case Opcode.jt:
      return Opargs.jt
    case Opcode.mod:
      return Opargs.mod
    case Opcode.mult:
      return Opargs.mult
    case Opcode.noop:
      return Opargs.noop
    case Opcode.not:
      return Opargs.not
    case Opcode.or:
      return Opargs.or
    case Opcode.out:
      return Opargs.out
    case Opcode.pop:
      return Opargs.pop
    case Opcode.push:
      return Opargs.push
    case Opcode.ret:
      return Opargs.ret
    case Opcode.rmem:
      return Opargs.rmem
    case Opcode.set:
      return Opargs.set
    case Opcode.wmem:
      return Opargs.wmem
  }
}
