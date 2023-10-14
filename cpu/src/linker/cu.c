/*
 * File: /src/linker/cu.c
 * Project: cpu
 * File Created: Friday, 22nd April 2022 11:17:52 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Friday, 22nd April 2022 11:17:54 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "../lib/components/cu/cu.h"

#include <stdio.h>
#include <stdint.h>

#include "../lib/pubsub.h"
#include "linker.h"
#include "../lib/components/cu/states.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif


static Bus_t *actual_status_Q2_bus = NULL;
static Bus_t *actual_status_Q1_bus = NULL;
static Bus_t *actual_status_Q0_bus = NULL;


static Bus_t *d2flipflop_bus;
static Bus_t *d1flipflop_bus;
static Bus_t *d0flipflop_bus;


static PubSubSubscription *actual_status_Q2_subscription = NULL;
static PubSubSubscription *actual_status_Q1_subscription = NULL;
static PubSubSubscription *actual_status_Q0_subscription = NULL;

static PubSubSubscription *d2_bus_topic_subscription = NULL;
static PubSubSubscription *d1_bus_topic_subscription = NULL;
static PubSubSubscription *d0_bus_topic_subscription = NULL;

void init_linker_cu(void) {
    actual_status_Q2_bus = create_bus_data();
    actual_status_Q1_bus = create_bus_data();
    actual_status_Q0_bus = create_bus_data();

    d2flipflop_bus = create_bus_data();
    d1flipflop_bus = create_bus_data();
    d0flipflop_bus = create_bus_data();

    actual_status_Q2_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q2_BUS_TOPIC, actual_status_Q2_bus);
    actual_status_Q1_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q1_BUS_TOPIC, actual_status_Q1_bus);
    actual_status_Q0_subscription = subscribe_to(CU_SEQ_ACTUAL_STATUS_Q0_BUS_TOPIC, actual_status_Q0_bus);

    d2_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D2_BUS_TOPIC, d2flipflop_bus);
    d1_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D1_BUS_TOPIC, d1flipflop_bus);
    d0_bus_topic_subscription = subscribe_to(CU_SEQ_OUTPUT_D0_BUS_TOPIC, d0flipflop_bus);
}

void shutdown_linker_cu(void) {
    unsubscribe_for(actual_status_Q2_subscription);
    unsubscribe_for(actual_status_Q1_subscription);
    unsubscribe_for(actual_status_Q0_subscription);

    unsubscribe_for(d2_bus_topic_subscription);
    unsubscribe_for(d1_bus_topic_subscription);
    unsubscribe_for(d0_bus_topic_subscription);

    destroy_bus_data(actual_status_Q2_bus);
    destroy_bus_data(actual_status_Q1_bus);
    destroy_bus_data(actual_status_Q0_bus);

    destroy_bus_data(d2flipflop_bus);
    destroy_bus_data(d1flipflop_bus);
    destroy_bus_data(d0flipflop_bus);
}

static int get_rom_pos(void) {
    Word w;
    initialize_word(&w, 0);
    w.bits[2] = actual_status_Q2_bus->next_value.bits[0];
    w.bits[1] = actual_status_Q1_bus->next_value.bits[0];
    w.bits[0] = actual_status_Q0_bus->next_value.bits[0];

    int rom_pos = word_to_int(w);
    return rom_pos;
}

static int get_processed_state(void) {
    Word w;
    initialize_word(&w, 0);
    w.bits[2] = d2flipflop_bus->next_value.bits[0];
    w.bits[1] = d1flipflop_bus->next_value.bits[0];
    w.bits[0] = d0flipflop_bus->next_value.bits[0];

    int next_state_id = word_to_int(w);
    return get_state_from_state_id(next_state_id);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
double run_clock_cycle(uint8_t update_ui) {
    double time = run_cu_clock_cycle();
    if (update_ui) get_update_ui_fn()();
    return time;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_state(void) {
    return get_state_from_state_id(get_rom_pos());
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_next_state(void) { return get_processed_state(); }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void reset_control(void) {
    // reset multiple control signals to 0, to start from the beginning of the rom
    Word emtpy = int_to_word(0);

    publish_message_to(CONTROL_BUS_TOPIC, emtpy);
    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q2_BUS_TOPIC, emtpy);
    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q1_BUS_TOPIC, emtpy);
    publish_message_to(CU_SEQ_ACTUAL_STATUS_Q0_BUS_TOPIC, emtpy);

    publish_message_to(CU_SEQ_OUTPUT_D2_BUS_TOPIC, emtpy);
    publish_message_to(CU_SEQ_OUTPUT_D1_BUS_TOPIC, emtpy);
    publish_message_to(CU_SEQ_OUTPUT_D0_BUS_TOPIC, emtpy);
}