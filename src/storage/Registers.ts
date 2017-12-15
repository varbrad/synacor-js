class Registers {
  buffer: Buffer

  constructor() {
    this.buffer = Buffer.alloc(16, 0x00)
  }

  set(r: number, v: number) {
    this.buffer.writeUInt16LE(this.get(v), this.index(r) * 2)
  }

  get(v: number) {
    if (v < 32768) return v
    if (v > 32775) throw new Error(`Invalid value "${v}" in Register.get`)
    return this.buffer.readUInt16LE(this.index(v) * 2)
  }

  index(v: number): number {
    if (v < 32768 || v > 32775) throw new Error(`Invalid register index "${v}"`)
    return v - 32768
  }
}

export default Registers
