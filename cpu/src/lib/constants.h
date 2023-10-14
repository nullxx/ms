/*
 * File: /src/lib/constants.h
 * Project: cpu
 * File Created: Monday, 21st March 2022 11:08:39 am
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Sunday, 10th April 2022 4:03:18 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#ifndef constants_h
#define constants_h

#define MEM_VALUE_SIZE_BITS 16
#define MEM_SIZE_KB 0.25
#define MEM_START_VALUE 0x00

#define DATA_BUS_SIZE_BITS 16
#define DIR_BUS_SIZE_BITS 7

#define PC_REG_SIZE_BIT 7
#define ALU_A_REG_SIZE_BIT 16
#define ALU_B_REG_SIZE_BIT 16

#define RI_D_REG_SIZE_BIT 7
#define RI_F_REG_SIZE_BIT 7
#define RI_C0_REG_SIZE_BIT 2

#define ALU_MEM_RELATION 2 * 1 // factorial(2)

#define CONTROL_BUS_CFZ_BIT_POSITION 0
#define CONTROL_BUS_CB_BIT_POSITION 1
#define CONTROL_BUS_CA_BIT_POSITION 2
#define CONTROL_BUS_CRI_BIT_POSITION 3
#define CONTROL_BUS_CPC_BIT_POSITION 4
#define CONTROL_BUS_WR_BIT_POSITION 5
#define CONTROL_BUS_ALU0_BIT_POSITION 6
#define CONTROL_BUS_ALU1_BIT_POSITION 7
#define CONTROL_BUS_MPX0_BIT_POSITION 8
#define CONTROL_BUS_MPX1_BIT_POSITION 9
#endif /* constants_h */
