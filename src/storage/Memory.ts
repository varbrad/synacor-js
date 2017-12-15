class Memory {
  buffer: Buffer = null

  constructor(buffer: Buffer) {
    this.buffer = buffer
  }

  get(index: number): number {
    return this.buffer.readUInt16LE(index * 2)
  }

  set(index: number, v: number) {
    this.buffer.writeUInt16LE(v, index * 2)
  }

  length(): number {
    return this.buffer.length * 0.5
  }

  slice(start: number, length: number): Buffer {
    return this.buffer.slice(start * 2, start * 2 + length * 2)
  }

  static fromArray(array: number[]): Memory {
    // Create the buffer from this array of length * 2 (8-bit to 16-bit)
    const buffer: Buffer = Buffer.allocUnsafe(array.length * 2)
    // Loop thru array values
    array.forEach((value, i) => {
      buffer.writeUInt16LE(value, i * 2)
    })
    // Create & return the new Memory instance
    return new Memory(buffer)
  }
}

export default Memory
