class Stack {
  data: Buffer

  constructor() {
    this.data = Buffer.allocUnsafe(0)
  }
}

export default Stack
