//
//  component.c
//  cpu
//
//  Created by Jon Lara trigo on 21/3/22.
//
#include "components.h"

#include <stdbool.h>
#include <stdio.h>

#include "../error.h"
#include "alu_a_reg.h"
#include "alu_b_reg.h"
#include "alu.h"
#include "mem.h"
#include "pc.h"
#include "inc.h"
#include "mpx.h"
#include "cu/cu.h"
#include "../electronic/bus.h"

void init_components(void) {
    init_buses();

    init_mem();
    init_inc();
    init_pc();
    init_mpx();
    init_alu_a_reg();
    init_alu_b_reg();
    init_alu();
    init_cu();
}

void shutdown_components(void) {
    shutdown_mem();
    shutdown_inc();
    shutdown_pc();
    shutdown_mpx();
    shutdown_alu_a_reg();
    shutdown_alu_b_reg();
    shutdown_alu();
    shutdown_cu();

    shutdown_buses();
}
