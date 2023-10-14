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

static Register b_reg = {.bit_length = ALU_B_REG_SIZE_BIT};
static RegisterWatcher b_reg_watcher = {.reg = &b_reg, .type = WATCHER_TYPE_ALU_RB};

void init_alu_b_reg(void)
{
    last_bus_data = create_bus_data();
    control_bus = create_bus_data();

    bus_data_subscription = subscribe_to(DATA_BUS_TOPIC, last_bus_data);
    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);

    register_watcher(&b_reg_watcher);
}

void shutdown_alu_b_reg(void)
{
    unregister_watcher(&b_reg_watcher);

    unsubscribe_for(bus_data_subscription);
    unsubscribe_for(control_bus_topic_subscription);

    destroy_bus_data(last_bus_data);
    destroy_bus_data(control_bus);
}

void run_alu_b_reg(void)
{
    update_bus_data(last_bus_data);
    update_bus_data(control_bus);

    Word cb_lb;
    initialize_word(&cb_lb, 0);
    cb_lb.bits[0] = control_bus->current_value.bits[CONTROL_BUS_CB_BIT_POSITION];

    publish_message_to(ALU_B_BUS_TOPIC, b_reg.value); // publish current value

    if (word_to_int(cb_lb) == 1)
    {
        // load
        for (size_t i = 0; i < 16; i++)
        {
            b_reg.value.bits[i] = last_bus_data->current_value.bits[i];
        }
    }
}