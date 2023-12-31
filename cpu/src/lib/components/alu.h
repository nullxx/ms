/*
 * File: /src/lib/components/alu.h
 * Project: cpu
 * File Created: Tuesday, 29th March 2022 10:29:02 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Tuesday, 29th March 2022 10:29:04 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#ifndef alu_h
#define alu_h
#include <stdbool.h>

enum SelAluOp { ADD = 0b00, CMP = 0b01, TRANSPARENT = 0b10, NC = 0b11 };

void init_alu(void);
void shutdown_alu(void);
void run_alu(void);

#endif