//
//  mxdir.c
//  cpu
//
//  Created by https://github.com/nullxx on 23/3/22.
//

#include "inc.h"

#include <stdio.h>

#include "../constants.h"
#include "../electronic/bus.h"
#include "../electronic/adder.h"
#include "../error.h"
#include "../pubsub.h"
#include "../utils.h"
#include "components.h"

static Bus_t *last_bus_dir = NULL;

static PubSubSubscription *dir_bus_topic_subscription = NULL;


void run_inc(void) {
    update_bus_data(last_bus_dir);

    unsigned int result;
    unsigned int carry;

    adder_7(word_to_int(last_bus_dir->current_value), 1, &result, &carry);

    publish_message_to(DIR_BUS_TOPIC_2, int_to_word(result));
}

void init_inc(void) {
    last_bus_dir = create_bus_data();
    dir_bus_topic_subscription = subscribe_to(DIR_BUS_TOPIC_1, last_bus_dir);
}

void shutdown_inc(void) {
    unsubscribe_for(dir_bus_topic_subscription);
    destroy_bus_data(last_bus_dir);
}