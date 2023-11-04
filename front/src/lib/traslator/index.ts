export interface CompiledBitLine {
    bits: string;
    address: number;
    sourceCodeLine?: number;
}

export interface TraslationError {
    message: string;
    line: number;
}

export interface Data {
    name: string;
    value: number | string;
    address: number;
    sourceCodeLine: number;
}

interface Label {
    name: string;
    address: number;
}

export interface Instruction {
    instructionName: string;
    source: {
        isLabel: boolean;
        value: number | string;
        isConstant: boolean;
        isVariable: boolean;
    };
    dest: {
        isLabel: boolean;
        value: number | string;
        isConstant: boolean;
        isVariable: boolean;
    };
    address: number;
    sourceCodeLine: number;
}

export interface Fin {
    hasFin: boolean;
    label: string;
    address: number;
    sourceCodeLine: number;
}
interface ParseLexResult {
    version: number;
    dataStartAddress: number;
    data: Data[];
    labels: Label[];
    instructions: Instruction[];
    fin: Fin;
    errors: TraslationError[];
}

export const parseInput = (code: string, offset: number = 0) => {
    const parseLexResult = parseAndLex(code, offset);

    if (parseLexResult.errors.length > 0) {
        return {
            errors: parseLexResult.errors,
            bits: [] as CompiledBitLine[],
            variables: [] as Data[],
            fin: parseLexResult.fin,
            instructions: parseLexResult.instructions,
        };
    }

    const bits = generateBits(parseLexResult);

    return {
        errors: [],
        bits,
        variables: parseLexResult.data,
        fin: parseLexResult.fin,
        instructions: parseLexResult.instructions,
    };
};

function parseAndLex(sourceCode: string, offset: number) {
    const info: ParseLexResult = {
        version: -1,
        dataStartAddress: -1,
        data: [],
        labels: [],
        instructions: [],
        fin: {
            address: -1,
            label: '',
            hasFin: false,
            sourceCodeLine: -1,
        },
        errors: [],
    };

    const lines = sourceCode.split('\n').map(line => line.trim());

    let currentSection = null;

    let address = offset;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length === 0) continue;

        if (line.startsWith('.ver')) {
            currentSection = 'version';
            const versionRes = /\.(ver)\s+(\d+)/.exec(line);
            if (!versionRes) {
                info.errors.push({
                    message: `Error parsing version in line ${i + 1}`,
                    line: i,
                });
                continue;
            }

            info.version = Number(versionRes[2]);
        } else if (line.startsWith('.data')) {
            currentSection = 'data';
            const dataRes = /(\.data)\s*(\d*)$/i.exec(line);
            if (!dataRes) {
                info.errors.push({
                    message: `Error parsing data in line ${i + 1}`,
                    line: i,
                });
                continue;
            }
            if (dataRes[2]?.length > 0)
                info.dataStartAddress = Number(dataRes[2]);
        } else if (line.startsWith('.code')) {
            currentSection = 'code';
        } else if (line.startsWith('.fin')) {
            // .fin <label_name>
            const [, , labelName] = /(\.fin)\s+([a-zA-Z_]\w*)/.exec(line) || [];
            if (!labelName) {
                info.errors.push({
                    message: `Expected label`,
                    line: i,
                });
                continue;
            }

            info.fin = {
                label: labelName,
                address: -1,
                hasFin: true,
                sourceCodeLine: i,
            };
        } else if (line.startsWith(';')) {
            continue;
        } else if (line.startsWith('.')) {
            info.errors.push({
                message: `Unknown section '${line}'`,
                line: i,
            });
            continue;
        } else if (currentSection === 'data') {
            const [, , name, value] = /(dw)\s+(\w+)\s+(0[xX][0-9a-fA-F]+|\d+)/.exec(line) || [];

            const exists = info.data.find(data => data.name === name);
            if (exists) {
                info.errors.push({
                    message: `'${name}' already exists`,
                    line: i,
                });
                continue;
            }

            info.data.push({ name, value, sourceCodeLine: i, address: -1 });
        } else if (currentSection === 'code') {
            const labelResult = /((.+):)?\s*(.*)/.exec(line);
            const [, , label, instruction] = labelResult || [];
            if (label) {
                info.labels.push({
                    name: label,
                    address,
                });
            }
            const instructionResult = /^[ \t\r]*(\w+:)?[ \t\r]*(add|beq|mov|cmp)[ \t\r]+(((0[xX][0-9a-fA-F]+)|(\d+)|([a-zA-z]+\d*))*[ \t\r]*,)?[ \t\r]*((0[xX][0-9a-fA-F]+)|(\d+)|([a-zA-z]+\d*))*/i.exec(instruction);
            if (instructionResult === null) {
                if (instruction.length > 0)
                    info.errors.push({
                        message: `Could not parse instruction '${instruction}'`,
                        line: i,
                    });
                continue;
            }
            const instructionName = instructionResult[2];
            let source = instructionResult[4];
            const dest = instructionResult[11] || instructionResult[9] || instructionResult[10];

            // if (!source && !/beq/i.test(instructionName)) {
            //     info.errors.push({
            //         message: `src and dest is required for instruction '${instructionName}'`,
            //         line: i,
            //     });
            //     continue;
            // }

            if (!source && /beq/i.test(instructionName)) {
                source = dest;
            }

            if (!source || !dest) {
                info.errors.push({
                    message: `src or dest or both is required for instruction '${instructionName}'`,
                    line: i,
                });
                continue;
            }

            const parsedSource = parseNumberOrVariable(source);
            const parsedDest = parseNumberOrVariable(dest);

            if (parsedSource && typeof parsedSource === 'number' && parsedSource > Math.pow(2, 7) - 1) {
                info.errors.push({
                    message: `${parsedSource} is out of range. Max value is ${Math.pow(2, 7) - 1}`,
                    line: i,
                });
                continue;
            }

            if (parsedDest && typeof parsedDest === 'number' && parsedDest > Math.pow(2, 7) - 1) {
                info.errors.push({
                    message: `${parsedDest} is out of range. Max value is ${Math.pow(2, 7) - 1}`,
                    line: i,
                });
                continue;
            }

            info.instructions.push({
                instructionName,
                source: {
                    isLabel: /beq/i.test(instructionName), // not the best way to do it,
                    value: parsedSource,
                    isConstant: Boolean(source) && !isNaN(Number(parsedSource)),
                    isVariable: isNaN(Number(parsedSource)) && !/beq/i.test(instructionName),
                },
                dest: {
                    isLabel: /beq/i.test(instructionName), // not the best way to do it
                    value: parsedDest,
                    isConstant: Boolean(dest) && !isNaN(Number(parsedDest)),
                    isVariable: isNaN(Number(parsedDest)) && !/beq/i.test(instructionName),
                },
                address: address++,
                sourceCodeLine: i,
            });
        } else {
            info.errors.push({
                message: 'Could not parse',
                line: i,
            });
        }
    }

    // noooooo!!!!!
    // info.instructions.forEach(instruction => {
    //     if (instruction.dest.isLabel) {
    //         const attachedLabel = info.labels.find(label => label.name === instruction.dest.value);
    //         if (!attachedLabel) info.errors.push({
    //             message: `Label '${instruction.dest}' not found`,
    //             line: instruction.sourceCodeLine,
    //         })
    //         if (attachedLabel) {
    //             // instruction.destIsLabel = true;
    //             instruction.dest.value = attachedLabel.address;
    //         }
    //     }
    // });


    // add to data the constants

    // info.instructions.forEach(instruction => {
    // if (instruction.source.isConstant) {
    //     const constantExists = info.data.find(data => data.value === instruction.source.value && data.name.startsWith('const_'));
    //     if (!constantExists)
    //         info.data.push({
    //             name: `const_${instruction.address}_src`,
    //             value: instruction.source.value,
    //         });

    // }

    //     if (instruction.dest.isConstant) {
    //         const constantExists = info.data.find(data => data.value === instruction.dest.value and data.name.startsWith('const_'));
    //         if (!constantExists)
    //             info.data.push({
    //                 name: `const_${instruction.address}_dest`,
    //                 value: instruction.dest.value,
    //             });
    //     }
    // })

    address++; // one address in blank

    if (info.dataStartAddress === -1 || isNaN(info.dataStartAddress)) {
        info.dataStartAddress = address;
    } else {
        address = info.dataStartAddress;
    }

    info.data.forEach(data => {
        data.address = address++;
    });

    info.instructions.forEach(instruction => {
        // if (instruction.source.isConstant) {
        //     instruction.source.value = info.data.find(data => data.value === instruction.source.value and data.name.startsWith('const_'))!.address!;
        // }

        //     if (instruction.dest.isConstant) {
        //         instruction.dest.value = info.data.find(data => data.value === instruction.dest.value and data.name.startsWith('const_'))!.address!;
        //     }

        if (instruction.source.isVariable) {
            const attachedData = info.data.find(data => data.name === instruction.source.value);
            if (!attachedData) info.errors.push({
                message: `Variable '${instruction.source.value}' not found`,
                line: instruction.sourceCodeLine,
            })
            if (attachedData) {
                instruction.source.value = attachedData.address!;
            }
        }

        if (instruction.dest.isVariable) {
            const attachedData = info.data.find(data => data.name === instruction.dest.value);
            if (!attachedData) info.errors.push({
                message: `Variable '${instruction.dest.value}' not found`,
                line: instruction.sourceCodeLine,
            })
            if (attachedData) {
                instruction.dest.value = attachedData.address!;
            }
        }

        if (instruction.source.isLabel) {
            const attachedLabel = info.labels.find(label => label.name === instruction.source.value);
            if (!attachedLabel) info.errors.push({
                message: `Label '${instruction.source.value}' not found`,
                line: instruction.sourceCodeLine,
            })
            if (attachedLabel) {
                instruction.source.value = attachedLabel.address;
            }
        }
        if (instruction.dest.isLabel) {
            const attachedLabel = info.labels.find(label => label.name === instruction.dest.value);
            if (!attachedLabel) info.errors.push({
                message: `Label '${instruction.source.value}' not found`,
                line: instruction.sourceCodeLine,
            })
            if (attachedLabel) {
                instruction.dest.value = attachedLabel.address;
            }
        }
    });

    if (info.fin.label) {
        const labelExists = info.labels.find(label => label.name === info.fin.label);
        if (!labelExists) {
            info.errors.push({
                message: `Label '${info.fin.label}' not found`,
                line: info.fin.sourceCodeLine,
            });
        } else {
            info.fin.address = labelExists.address;
        }

    }

    return info;
}

const generateBits = (info: ParseLexResult) => {
    const generateInstructionBits = (instruction: Instruction) => {
        // dest takes 7 bits
        // source takes 7 bits
        // instruction name takes 2 bits
        // 16 bits in total

        const instructionName = instruction.instructionName.toLowerCase();
        const source = instruction.source.value;
        const dest = instruction.dest.value;

        const instructionNameBits = {
            add: '00',
            cmp: '01',
            mov: '10',
            beq: '11',
        }[instructionName];

        const sourceBits = (source || 0).toString(2).padStart(7, '0');
        const destBits = dest.toString(2).padStart(7, '0');

        return `${instructionNameBits}${sourceBits}${destBits}`;
    }

    const generateDataBits = (data: Data) => {
        return Number(data.value).toString(2).padStart(16, '0');
    }

    const compiledBitLines: CompiledBitLine[] = [];

    info.instructions.forEach(instruction => {
        const bits = generateInstructionBits(instruction);
        compiledBitLines.push({
            bits,
            address: instruction.address,
            sourceCodeLine: instruction.sourceCodeLine,
        });
    });

    info.data.forEach(data => {
        const bits = generateDataBits(data);
        compiledBitLines.push({
            bits,
            address: data.address!,
        });
    });

    return compiledBitLines;
}

function parseNumberOrVariable(numOrStr: string | number): number | string {
    if (numOrStr === undefined) return numOrStr;

    if (typeof numOrStr === 'number') return numOrStr;

    if (typeof numOrStr === 'string') {
        if (numOrStr.startsWith('0x')) {
            return parseInt(numOrStr, 16);
        } else if (/^\d+$/.test(numOrStr)) {
            return Number(numOrStr);
        }
    }

    return numOrStr;
}
