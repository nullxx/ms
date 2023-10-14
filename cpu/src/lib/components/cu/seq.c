/*
 * File: /src/lib/components/cu/seq.c
 * Project: cpu
 * File Created: Thursday, 14th April 2022 12:58:57 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Thursday, 14th April 2022 12:59:47 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */
#include "seq.h"

#include <stdio.h>

#include "../../electronic/bus.h"
#include "../../pubsub.h"
#include "../../utils.h"

#include "states.h"

static Bus_t *actual_status_Q2_bus = NULL;
static Bus_t *actual_status_Q1_bus = NULL;
static Bus_t *actual_status_Q0_bus = NULL;
static Bus_t *fz_bus = NULL;
static Bus_t *ri_c0_0_bus = NULL;
static Bus_t *ri_c0_1_bus = NULL;

static PubSubSubscription *actual_status_Q2_subscription = NULL;
static PubSubSubscription *actual_status_Q1_subscription = NULL;
static PubSubSubscription *actual_status_Q0_subscription = NULL;
static PubSubSubscription *fz_subscription = NULL;
static PubSubSubscription *ri_c0_0_subscription = NULL;
static PubSubSubscription *ri_c0_1_subscription = NULL;

void init_cu_seq(void)
{
    actual_status_Q2_bus = create_bus_data();
    actual_status_Q1_bus = create_bus_data();
    actual_status_Q0_bus = create_bus_data();
    fz_bus = create_bus_data();
    ri_c0_0_bus = create_bus_data();
    ri_c0_1_bus = create_bus_data();

    actual_status_Q2_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q2_BUS_TOPIC, actual_status_Q2_bus);
    actual_status_Q1_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q1_BUS_TOPIC, actual_status_Q1_bus);
    actual_status_Q0_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q0_BUS_TOPIC, actual_status_Q0_bus);
    fz_subscription = subscribe_to(ALU_FZ_OUTPUT_BUS_TOPIC, fz_bus);
    ri_c0_0_subscription = subscribe_to(RI_OUTPUT_C0_0_BUS_TOPIC, ri_c0_0_bus);
    ri_c0_1_subscription = subscribe_to(RI_OUTPUT_C0_1_BUS_TOPIC, ri_c0_1_bus);
}

void run_cu_seq(void)
{
    const unsigned int q2 = actual_status_Q2_bus->next_value.bits[0]; // next_value????????
    const unsigned int q1 = actual_status_Q1_bus->next_value.bits[0];
    const unsigned int q0 = actual_status_Q0_bus->next_value.bits[0];

    const unsigned int fz = fz_bus->next_value.bits[0];
    const unsigned int c0 = ri_c0_0_bus->next_value.bits[0];
    const unsigned int c1 = ri_c0_1_bus->next_value.bits[0];
    
    Word d2, d1, d0;
    initialize_word(&d2, 0);
    initialize_word(&d1, 0);
    initialize_word(&d0, 0);

    // d0.bits[0] = (!q2 && !q1 && !q0) || (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && !c1) || (q2 && q1 && q0 && c0) || (q2 && q1 && q0);
    // d0.bits[0] = (!q2 && !q1 && !q0) || (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && !c1) || (q2 && q1 && q0 && !c0) || (q2 && q1 && q0);
    d0.bits[0] = (!q2 && !q1 && !q0) || (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && !c1) || (q2 && q1 && q0 && c0) || (q2 && q1 && q0) || (q1 && q0 && c0);
         // d0 = (!q2 && !q1 && !q0) || (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && !c1) || (q2 && q1 && q0 && !c0) || (q2 && q1 && q0);
    d1.bits[0] = (!q2 && !q1 && q0 && !c1) || (!q2 && !q1 && q0 && !c0) || (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && !c1) || (!q2 && q1 && !q0 && c1);
    d2.bits[0] = (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && c1) || (!q2 && q1 && q0 && c0) || (!q2 && q1 && q0 && !c0);/*(!q1 && q1 && q0 && !c0);*/
              // (!q2 && !q1 && q0 && c1 && c0 && fz) || (!q2 && q1 && !q0 && c1) || (!q2 && q1 && q0 && c0) || (q2 && !q1 && !q0);
    Word state_id; // only for debugging
    initialize_word(&state_id, 0);
    state_id.bits[0] = d0.bits[0];
    state_id.bits[1] = d1.bits[0];
    state_id.bits[2] = d2.bits[0];

    publish_message_to(CU_SEQ_OUTPUT_D2_BUS_TOPIC, d2);
    publish_message_to(CU_SEQ_OUTPUT_D1_BUS_TOPIC, d1);
    publish_message_to(CU_SEQ_OUTPUT_D0_BUS_TOPIC, d0);
}

void shutdown_cu_seq(void)
{
    unsubscribe_for(actual_status_Q2_subscription);
    unsubscribe_for(actual_status_Q1_subscription);
    unsubscribe_for(actual_status_Q0_subscription);
    unsubscribe_for(fz_subscription);
    unsubscribe_for(ri_c0_0_subscription);
    unsubscribe_for(ri_c0_1_subscription);

    destroy_bus_data(actual_status_Q2_bus);
    destroy_bus_data(actual_status_Q1_bus);
    destroy_bus_data(actual_status_Q0_bus);
    destroy_bus_data(fz_bus);
    destroy_bus_data(ri_c0_0_bus);
    destroy_bus_data(ri_c0_1_bus);
}