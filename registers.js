const MAX_VALUE = 32767

class Registers {
  constructor() {
    // Buffer has 16 bytes, for 8 registers in 16-bit/2-byte LE
    this.buffer = Buffer.from([...Array(16).keys()].map(v => 0x00))
  }
  read(n) {
    if (n < 0 || n > 7) throw new Error(`Invalid registry position "${n}"`)
    return this.buffer.readUInt16LE(n * 2)
  }
  write(n, v) {
    if (n < 0 || n > 7) throw new Error(`Invalid registry position "${n}"`)
    if (v < 0 || v > MAX_VALUE) throw new Error(`Invalid registry value "${v}"`)
    this.buffer.writeUInt16LE(v, n * 2)
  }
  pretty() {
    let arr = []
    for (let i = 0; i < 16; i += 2) {
      arr.push(this.buffer.readUInt16LE(i))
    }
    return arr
  }
}

module.exports = Registers
