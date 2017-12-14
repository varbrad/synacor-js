# Synacor.js
A collection of tools and utilities for working with the [Synacor Virtual Machine](https://challenge.synacor.com/).

Implements the full architecture instruction set (0x00 thru 0x15), with some additional debugging instructions (0xF0 thru 0xFF), as well as  some extra associated tools including a compiler and decompiler.

## Includes

### Synacor VM

Able to execute binary synacor files (uint16LE buffer), using a modified instruction set from the full architecture spec.

### Compiler

Compile .sy files with Synacor source code into a VM-compatible binary.

### Decompiler

Decompile a VM-compatible binary into Synacor source code.
