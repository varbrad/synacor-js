import Memory from './storage/memory'

import { compile } from './compile'
import { execute } from './execute'

const program: string = `out 106
out 109
out 112
out 32
out 108
out 97
out 110
out 100
out 115
out 32
out 43
out 50
out 10
halt 
`

let comp: Memory = compile(program)

const result = execute(comp, process.stdout)
