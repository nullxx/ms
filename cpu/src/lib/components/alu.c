/*
 * File: /src/lib/components/alu.c
 * Project: cpu
 * File Created: Tuesday, 29th March 2022 10:28:57 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Tuesday, 29th March 2022 10:29:23 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "alu.h"

#include <stdio.h>
#include <assert.h>

#include "../constants.h"
#include "../electronic/bus.h"
#include "../electronic/adder.h"
#include "../electronic/xor.h"
#include "../error.h"
#include "../pubsub.h"
#include "../utils.h"
#include "components.h"
#include "../logger.h"
static Bus_t *control_bus = NULL;
static Bus_t *alu_a_bus = NULL;
static Bus_t *alu_b_bus = NULL;

static PubSubSubscription *control_bus_topic_subscription = NULL;
static PubSubSubscription *alu_a_bus_topic_subscription = NULL;
static PubSubSubscription *alu_b_bus_topic_subscription = NULL;

static PubSubMiddleware *fz_mid = NULL;

static int enable_fz(Word value)
{
    if (control_bus->current_value.bits[CONTROL_BUS_CFZ_BIT_POSITION] == 1)
    {
        publish_message_to(ALU_FZ_OUTPUT_BUS_TOPIC, int_to_word(word_to_int(value) == 0));
    }
    return 1;
}

void init_alu(void)
{
    control_bus = create_bus_data();
    alu_a_bus = create_bus_data();
    alu_b_bus = create_bus_data();

    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);
    alu_a_bus_topic_subscription = subscribe_to(ALU_A_BUS_TOPIC, alu_a_bus);

    alu_b_bus_topic_subscription = subscribe_to(ALU_B_BUS_TOPIC, alu_b_bus);

    fz_mid = add_topic_middleware(ALU_OUTPUT_BUS_TOPIC, enable_fz);
}

void shutdown_alu(void)
{
    rm_topic_middleware(fz_mid);

    unsubscribe_for(control_bus_topic_subscription);
    unsubscribe_for(alu_a_bus_topic_subscription);
    unsubscribe_for(alu_b_bus_topic_subscription);

    destroy_bus_data(control_bus);
    destroy_bus_data(alu_a_bus);
    destroy_bus_data(alu_b_bus);
}

void run_alu(void)
{
    update_bus_data(control_bus);
    update_bus_data(alu_a_bus);
    update_bus_data(alu_b_bus);

    Word alu_sel;
    initialize_word(&alu_sel, 0);
    alu_sel.bits[0] = control_bus->current_value.bits[CONTROL_BUS_ALU0_BIT_POSITION];
    alu_sel.bits[1] = control_bus->current_value.bits[CONTROL_BUS_ALU1_BIT_POSITION];

    Word res;
    initialize_word(&res, 0);

    switch (word_to_int(alu_sel)) // MPX
    {

    case ADD:
    {
        unsigned int result;
        unsigned int carry;

        adder_16(word_to_int(alu_a_bus->current_value), word_to_int(alu_b_bus->current_value),
                 &result, &carry);
        res = int_to_word(result);
        break;
    }

    case CMP:
    {
        res = int_to_word(
            XOR_16(word_to_int(alu_a_bus->current_value),
                   word_to_int(alu_b_bus->current_value)));

        break;
    }

    case TRANSPARENT:
    {
        res = alu_b_bus->current_value;
        break;
    }

    case NC:
    { // NC
        return;
        break;
    }

    default:
    {
        Error err = {.show_errno = 0, .type = NOTICE_ERROR, .message = "Invalid ALU selection"};
        return throw_error(err);
        break;
    }
    }

    publish_message_to(ALU_OUTPUT_BUS_TOPIC, res);
}
