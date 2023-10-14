/*
 * File: /src/lib/components/cu/d4flipflop.c
 * Project: cpu
 * File Created: Friday, 15th April 2022 3:41:39 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Friday, 15th April 2022 3:42:29 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "dxflipflop.h"

#include <stdio.h>

#include "../../pubsub.h"


static Bus_t *d2flipflop_bus;
static Bus_t *d1flipflop_bus;
static Bus_t *d0flipflop_bus;


static PubSubSubscription *d2_bus_topic_subscription = NULL;
static PubSubSubscription *d1_bus_topic_subscription = NULL;
static PubSubSubscription *d0_bus_topic_subscription = NULL;

void init_cu_dxflipflop(void) {

    d2flipflop_bus = create_bus_data();
    d1flipflop_bus = create_bus_data();
    d0flipflop_bus = create_bus_data();

    d2_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D2_BUS_TOPIC, d2flipflop_bus);
    d1_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D1_BUS_TOPIC, d1flipflop_bus);
    d0_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D0_BUS_TOPIC, d0flipflop_bus);
}

void run_cu_dxflipflop(void) {
    update_bus_data(d2flipflop_bus);
    update_bus_data(d1flipflop_bus);
    update_bus_data(d0flipflop_bus);

    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q2_BUS_TOPIC, d2flipflop_bus->current_value);
    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q1_BUS_TOPIC, d1flipflop_bus->current_value);
    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q0_BUS_TOPIC, d0flipflop_bus->current_value);
}

void shutdown_cu_dxflipflop(void) {
    unsubscribe_for(d2_bus_topic_subscription);
    unsubscribe_for(d1_bus_topic_subscription);
    unsubscribe_for(d0_bus_topic_subscription);

    destroy_bus_data(d2flipflop_bus);
    destroy_bus_data(d1flipflop_bus);
    destroy_bus_data(d0flipflop_bus);
}
