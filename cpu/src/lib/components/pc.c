/*
 * File: /src/lib/components/sp.c
 * Project: cpu
 * File Created: Thursday, 25th March 2022 15:42:00 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Thursday, 25th March 2022 7:12:02 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "pc.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../constants.h"
#include "../electronic/bus.h"
#include "../error.h"
#include "../pubsub.h"
#include "../utils.h"
#include "../watcher.h"
#include "components.h"

static Register pc_reg = {.bit_length = PC_REG_SIZE_BIT};

RegisterWatcher pc_reg_watcher = {.reg = &pc_reg, .type = WATCHER_TYPE_PC};

static Bus_t *last_bus_dir = NULL;
static Bus_t *control_bus = NULL;

static PubSubSubscription *dir_bus_topic_subscription = NULL;
static PubSubSubscription *control_bus_topic_subscription = NULL;

void init_pc(void) {
    initialize_word(&pc_reg.value, 0);

    last_bus_dir = create_bus_data();
    control_bus = create_bus_data();

    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);
    dir_bus_topic_subscription = subscribe_to(DIR_BUS_TOPIC_2, last_bus_dir);
    register_watcher(&pc_reg_watcher);
}

void shutdown_pc(void) {
    unregister_watcher(&pc_reg_watcher);

    unsubscribe_for(dir_bus_topic_subscription);
    unsubscribe_for(control_bus_topic_subscription);

    destroy_bus_data(last_bus_dir);
    destroy_bus_data(control_bus);
}

void run_pc(void) {
    update_bus_data(last_bus_dir);
    update_bus_data(control_bus);

    Word cpc_lb;
    initialize_word(&cpc_lb, 0);

    cpc_lb.bits[0] = control_bus->current_value.bits[CONTROL_BUS_CPC_BIT_POSITION];
    // pc
    if (word_to_int(cpc_lb) == 1) {
        // load pc
        int used_bits = get_used_bits(last_bus_dir->current_value);
        if (used_bits > pc_reg.bit_length) {
            Error err = {.show_errno = 0, .type = NOTICE_ERROR, .message = "Overflow attemping to load PC register"};
            return throw_error(err);
        }

        pc_reg.value = last_bus_dir->current_value;
    }

    publish_message_to(PC_OUTPUT_BUS_TOPIC, pc_reg.value);
}
