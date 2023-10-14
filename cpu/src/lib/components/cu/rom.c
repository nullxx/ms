/*
 * File: /src/lib/components/cu/rom.c
 * Project: cpu
 * File Created: Thursday, 14th April 2022 6:30:44 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Thursday, 14th April 2022 6:31:09 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "rom.h"

#include <stdio.h>

#include "../../electronic/bus.h"
#include "../../pubsub.h"
#include "../../utils.h"
#include "../../logger.h"

#define X 0

#define CU_SIGNAL_ROWS_COUNT 8
#define CU_SIGNAL_COLS_COUNT 16
#define SIGNAL_SIZE_BITS 31

static Bus_t *actual_status_Q2_bus = NULL;
static Bus_t *actual_status_Q1_bus = NULL;
static Bus_t *actual_status_Q0_bus = NULL;

static PubSubSubscription *actual_status_Q2_subscription = NULL;
static PubSubSubscription *actual_status_Q1_subscription = NULL;
static PubSubSubscription *actual_status_Q0_subscription = NULL;

const int ROM[CU_SIGNAL_ROWS_COUNT][CU_SIGNAL_COLS_COUNT] = {
    // this are the signals
    //                  MPX1, MPX0, ALU1, ALU0, W/R, CPC, CRI, CA, CB, FZ
    {X, X, X, X, X, X, 0, 0, X, X, 0, 1, 1, 0, 0, 0}, // S0 // 0
    {X, X, X, X, X, X, X, X, X, X, 0, 0, 0, 0, 0, 0}, // S1 // 1
    {X, X, X, X, X, X, 1, 0, X, X, 0, 0, 0, 0, 1, 0}, // S2 // 2
    {X, X, X, X, X, X, 1, 1, X, X, 0, 0, 0, 1, 0, 0}, // S6 // 3
    {X, X, X, X, X, X, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1}, // S7 // 4
    {X, X, X, X, X, X, X, X, 0, 1, 0, 0, 0, 0, 0, 1}, // S9 // 5
    {X, X, X, X, X, X, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1}, // S10 // 6
    {X, X, X, X, X, X, 1, 1, X, X, 0, 1, 1, 0, 0, 0}  // S11 // 7
    // {X, X, X, X, X, X, 1, 1, X, X, 1, 0, 0, 1, 0, 0}, // S8

    // {X, X, X, X, X, X, X, X, X, X, 0, 0, 0, 0, 0, 0}, // S5
    // {X, X, X, X, X, X, 1, 0, X, X, 0, 0, 0, 0, 1, 0}, // S4
    // {X, X, X, X, X, X, 1, 0, X, X, 0, 0, 0, 0, 1, 0}, // S3
};

void init_cu_rom(void)
{
    actual_status_Q2_bus = create_bus_data();
    actual_status_Q1_bus = create_bus_data();
    actual_status_Q0_bus = create_bus_data();

    actual_status_Q2_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q2_BUS_TOPIC, actual_status_Q2_bus);
    actual_status_Q1_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q1_BUS_TOPIC, actual_status_Q1_bus);
    actual_status_Q0_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q0_BUS_TOPIC, actual_status_Q0_bus);
}


void run_cu_rom(void)
{
    Word w;
    initialize_word(&w, 0);
    w.bits[2] = actual_status_Q2_bus->next_value.bits[0];
    w.bits[1] = actual_status_Q1_bus->next_value.bits[0];
    w.bits[0] = actual_status_Q0_bus->next_value.bits[0];

    int rom_pos = word_to_int(w);
    log_debug("ROM pos: %d", rom_pos);

    if (rom_pos < 0 || rom_pos > CU_SIGNAL_ROWS_COUNT)
        return;

    Word to_send;
    initialize_word(&to_send, 0);

    // int j = CU_SIGNAL_COLS_COUNT - 1;
    for (int i = 0; i < CU_SIGNAL_COLS_COUNT; i++)
    {
        to_send.bits[CU_SIGNAL_COLS_COUNT - 1 - i] = ROM[rom_pos][i];
    }

    publish_message_to(CONTROL_BUS_TOPIC, to_send);

    update_bus_data(actual_status_Q2_bus);
    update_bus_data(actual_status_Q1_bus);
    update_bus_data(actual_status_Q0_bus);
}

void shutdown_cu_rom(void)
{
    unsubscribe_for(actual_status_Q2_subscription);
    unsubscribe_for(actual_status_Q1_subscription);
    unsubscribe_for(actual_status_Q0_subscription);

    destroy_bus_data(actual_status_Q2_bus);
    destroy_bus_data(actual_status_Q1_bus);
    destroy_bus_data(actual_status_Q0_bus);
}