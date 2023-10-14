import { getRunningVariables } from "../../pages/Coder/components/CodeEditor";
import { execute } from "../core";

interface FindOperationValue {
  operation: string;
  range: [number, number];
}
type ReplacementFn = (offset: number, operation: string) => string;

const INM_NAME = "inm";
const DIR_NAME = "dir";
export const NO_OP_NAME = "-";
const FILL_NO_OP = true;
const replacementFunctions: ReplacementFn[] = [replaceInm, replaceDir];

let memSize: null | number = null;

export function deductOperationOf(fromMemOffset: number, toMemOffset: number) {
  if (memSize == null) memSize = execute<number>("get_memory_size");
  if (toMemOffset < fromMemOffset) {
    throw new Error("toMemOffset must be greater than fromMemOffset");
  }
  if (fromMemOffset < 0) {
    fromMemOffset = 0;
  }
  if (toMemOffset > memSize) {
    toMemOffset = memSize;
  }

  const operations: FindOperationValue[] = [];

  let initOffset = fromMemOffset;
  do {
    const currentMemValue = execute<number>("get_memory_value", initOffset);
    const operation = findOperation(initOffset, currentMemValue);
    if (!operation) {
      initOffset++;
      continue;
    }

    operations.push(operation);
    initOffset = operation.range[1] + 1;
  } while (operations.length === 0 || initOffset < toMemOffset);

  return operations;
}

const operations = [
  {
    NEMO: "ADD",
    co: 0b00,
    format(src: number, dest: number) {
      const variables = getRunningVariables();
      const srcVar = variables.find((v) => v.address === src);
      const destVar = variables.find((v) => v.address === dest);

      return `${this.NEMO} ${srcVar?.name || src}, ${destVar?.name || dest}`;    }
  },
  {
    NEMO: "MOV",
    co: 0b10,
    format(src: number, dest: number) {
      const variables = getRunningVariables();
      const srcVar = variables.find((v) => v.address === src);
      const destVar = variables.find((v) => v.address === dest);

      return `${this.NEMO} ${srcVar?.name || src}, ${destVar?.name || dest}`;
    }
  },
  {
    NEMO: "CMP",
    co: 0b01,
    format(src: number, dest: number) {
      const variables = getRunningVariables();
      const srcVar = variables.find((v) => v.address === src);
      const destVar = variables.find((v) => v.address === dest);

      return `${this.NEMO} ${srcVar?.name || src}, ${destVar?.name || dest}`;    }
  },
  {
    NEMO: "BEQ",
    co: 0b11,
    format(_src: number, dest: number) {
      return `${this.NEMO} ${dest}`;
    }
  },
]
function findOperation(
  initOffset: number,
  memValue: number
): FindOperationValue | null {
  // the first low 7 bits of the memory value are the destination
  // the following 7 bits are the source
  // the following 2 bits are the operation
  const co = (memValue & 0b1100000000000000) >> 14;
  const src = (memValue & 0b0011111110000000) >> 7;
  const dest = memValue & 0b0000000001111111;

  const op = operations.find((o) => o.co === co);
  // const op = operations.find((o) => parseInt(o.HEX, 16) === memValue);
  if (!op && !FILL_NO_OP) return null;
  if (!op) return { operation: NO_OP_NAME, range: [initOffset, initOffset] };
  return {
    operation: doReplacements(initOffset, op.format(src, dest)),
    range: [initOffset, initOffset],
  };
}

function doReplacements(offset: number, operation: string) {
  return replacementFunctions.reduce((acc, fn) => fn(offset, acc), operation);
}

function replaceInm(offset: number, operation: string) {
  return operation.replace(
    INM_NAME,
    execute<number>("get_memory_value", offset + 1).toString(16).toUpperCase()
  );
}

function replaceDir(offset: number, operation: string) {
  const hdir = execute<number>("get_memory_value", offset + 1).toString(16).toUpperCase();
  const ldir = execute<number>("get_memory_value", offset + 2).toString(16).toUpperCase();
  return operation.replace(DIR_NAME, `${hdir}${ldir}`);
}
