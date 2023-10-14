#include <stdio.h>

#include "../constants.h"
#include "../electronic/bus.h"
#include "../pubsub.h"
#include "../watcher.h"
#include "components.h"

static Bus_t *last_bus_data = NULL;
static Bus_t *control_bus = NULL;

static PubSubSubscription *bus_data_subscription = NULL;
static PubSubSubscription *control_bus_topic_subscription = NULL;

static Register a_reg = {.bit_length = ALU_A_REG_SIZE_BIT};
static RegisterWatcher a_reg_watcher = {.reg = &a_reg, .type = WATCHER_TYPE_ALU_RA};


void init_alu_a_reg(void)
{
    last_bus_data = create_bus_data();
    control_bus = create_bus_data();

    bus_data_subscription = subscribe_to(DATA_BUS_TOPIC, last_bus_data);
    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);

    register_watcher(&a_reg_watcher);
}

void shutdown_alu_a_reg(void)
{
    unregister_watcher(&a_reg_watcher);

    unsubscribe_for(bus_data_subscription);
    unsubscribe_for(control_bus_topic_subscription);

    destroy_bus_data(last_bus_data);
    destroy_bus_data(control_bus);
}

void run_alu_a_reg(void)
{
    update_bus_data(last_bus_data);
    update_bus_data(control_bus);

    Word ca_lb;
    initialize_word(&ca_lb, 0);
    ca_lb.bits[0] = control_bus->current_value.bits[CONTROL_BUS_CA_BIT_POSITION];

    if (word_to_int(ca_lb) == 1)
    {
        // load
        for (size_t i = 0; i < 16; i++)
        {
            a_reg.value.bits[i] = last_bus_data->current_value.bits[i];
        }
    }

    publish_message_to(ALU_A_BUS_TOPIC, a_reg.value); // publish current value
}