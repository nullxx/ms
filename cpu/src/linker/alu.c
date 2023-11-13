/*
 * File: /src/linker/mem.c
 * Project: cpu
 * File Created: Friday, 22nd April 2022 2:44:53 am
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Friday, 22nd April 2022 2:45:16 am
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include <stdio.h>

#include "../lib/pubsub.h"
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#include "../lib/components/mem.h"

static Bus_t *alu_output_bus = NULL;
static PubSubSubscription *alu_output_bus_subscription = NULL;

void init_linker_alu(void) {
    alu_output_bus = create_bus_data();
    alu_output_bus_subscription = subscribe_to(ALU_OUTPUT_BUS_TOPIC, alu_output_bus);
}

void shutdown_linker_alu(void) {
    unsubscribe_for(alu_output_bus_subscription);
    destroy_bus_data(alu_output_bus);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_alu_output(void) { return word_to_int(alu_output_bus->next_value); }
