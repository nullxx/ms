/*
 * File: /src/lib/components/cu.c
 * Project: cpu
 * File Created: Saturday, 2nd April 2022 1:22:58 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Saturday, 2nd April 2022 1:23:13 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "cu.h"

#include <stdio.h>

#include "../../clock.h"
#include "../../constants.h"
#include "../../electronic/bus.h"
#include "../../error.h"
#include "../../logger.h"
#include "../../pubsub.h"
#include "../../utils.h"
#include "../../watcher.h"
#include "../alu.h"
#include "../components.h"
#include "../mem.h"
#include "../pc.h"
#include "dxflipflop.h"
#include "rom.h"
#include "seq.h"
#include "ri.h"
#include "states.h"

#include "../alu_a_reg.h"
#include "../alu_b_reg.h"
#include "../inc.h"
#include "../mpx.h"

/**
 * Clock tick generator must be inside CU, but as this is a simulator,
 * the clock will be managed from the window to decrease CPU usage
 *
 */
double run_cu_clock_cycle(void)
{
    clock_t start = clock();
    while (1)
    {
        int clock_tick = get_clock_tick();
        run_cu(clock_tick);

        if (clock_tick == 1)
        {
            clock_t end = clock();
            double seconds_spent = (double)(end - start) / CLOCKS_PER_SEC;
            return seconds_spent;
        }
    }
}

void init_cu(void)
{
    init_cu_ri();
    init_cu_seq();
    init_cu_dxflipflop();
    init_cu_rom();
}

void shutdown_cu(void)
{
    shutdown_cu_ri();
    shutdown_cu_seq();
    shutdown_cu_dxflipflop();
    shutdown_cu_rom();
}

void run_asyncronus_components(void)
{
    run_alu_a_reg();
    run_alu_b_reg();

    for (size_t i = 0; i < ALU_MEM_RELATION; i++)
    {
        run_mem();
        run_alu();
    }
}

void run_sync_comp(void (*run_comp_fn)(void))
{
    run_comp_fn();
    run_asyncronus_components();
}

void run_cu(int clk)
{ // 1 opstate per run
    log_debug("Clock: %d", clk);

    if (clk == 0)
        run_cu_dxflipflop();
    if (clk == 1)
        run_cu_rom();
    if (clk == 1)
        run_mpx();
    if (clk == 1)
        run_inc();
    if (clk == 1)
        run_asyncronus_components();
    if (clk == 1)
        run_cu_ri();
    if (clk == 1)
        run_cu_seq();
    if (clk == 1)
        run_sync_comp(run_pc);
}