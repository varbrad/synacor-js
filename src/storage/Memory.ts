class Memory {
  buffer: Buffer = null

  constructor(buffer: Buffer) {
    this.buffer = buffer
  }

  get(index: number): number {
    return this.buffer.readUInt16LE(index * 2)
  }

  length(): number {
    return this.buffer.length * 0.5
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
