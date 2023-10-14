#include <stdio.h>

#include "../constants.h"
#include "../electronic/bus.h"
#include "../pubsub.h"

static Bus_t *last_pc_output = NULL;
static Bus_t *control_bus = NULL;
static Bus_t *ri_f = NULL;
static Bus_t *ri_d = NULL;

static PubSubSubscription *pc_output_subscription = NULL;
static PubSubSubscription *ri_f_subscription = NULL;
static PubSubSubscription *ri_d_subscription = NULL;
static PubSubSubscription *control_bus_topic_subscription = NULL;

void init_mpx(void) {
    last_pc_output = create_bus_data();
    control_bus = create_bus_data();
    ri_f = create_bus_data();
    ri_d = create_bus_data();

    pc_output_subscription = subscribe_to(PC_OUTPUT_BUS_TOPIC, last_pc_output);
    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);
    ri_f_subscription = subscribe_to(RI_F_REG_BUS_TOPIC, ri_f);
    ri_d_subscription = subscribe_to(RI_D_REG_BUS_TOPIC, ri_d);
}

void shutdown_mpx(void) {
    unsubscribe_for(pc_output_subscription);
    unsubscribe_for(ri_f_subscription);
    unsubscribe_for(ri_d_subscription);
    unsubscribe_for(control_bus_topic_subscription);

    destroy_bus_data(last_pc_output);
    destroy_bus_data(ri_f);
    destroy_bus_data(ri_d);
    destroy_bus_data(control_bus);
}

void run_mpx(void) {
    update_bus_data(last_pc_output);
    update_bus_data(control_bus);
    update_bus_data(ri_f);
    update_bus_data(ri_d);

    Word mpx_sel;
    initialize_word(&mpx_sel, 0);
    
    mpx_sel.bits[0] = control_bus->current_value.bits[CONTROL_BUS_MPX0_BIT_POSITION];
    mpx_sel.bits[1] = control_bus->current_value.bits[CONTROL_BUS_MPX1_BIT_POSITION];


    switch (word_to_int(mpx_sel)) {
        case 0: {
            publish_message_to(DIR_BUS_TOPIC_1, last_pc_output->current_value);
            break;
        }

        // case 1: { // NC
        //     break;
        // }

        case 2: {
            publish_message_to(DIR_BUS_TOPIC_1, ri_f->current_value);
            break;
        }

        case 3: {
            publish_message_to(DIR_BUS_TOPIC_1, ri_d->current_value);
            break;
        }
    }
}