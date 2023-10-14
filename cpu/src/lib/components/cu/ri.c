#include <stdio.h>
#include "../../constants.h"
#include "../components.h"
#include "../../watcher.h"
#include "../../pubsub.h"
#include "../../logger.h"

static Register ri_c0_reg = {.bit_length = RI_C0_REG_SIZE_BIT};
static Register ri_f_reg = {.bit_length = RI_F_REG_SIZE_BIT};
static Register ri_d_reg = {.bit_length = RI_D_REG_SIZE_BIT};

static PubSubSubscription *data_bus_topic_subscription = NULL;
static PubSubSubscription *control_bus_topic_subscription = NULL;

RegisterWatcher ri_c0_reg_watcher = {.reg = &ri_c0_reg, .type = WATCHER_TYPE_RI_C0};
RegisterWatcher ri_f_reg_watcher = {.reg = &ri_f_reg, .type = WATCHER_TYPE_RI_F};
RegisterWatcher ri_d_reg_watcher = {.reg = &ri_d_reg, .type = WATCHER_TYPE_RI_D};

static Bus_t *last_data_bus = NULL;
static Bus_t *control_bus = NULL;

void init_cu_ri(void)
{
    initialize_word(&ri_c0_reg.value, 0);
    initialize_word(&ri_f_reg.value, 0);
    initialize_word(&ri_d_reg.value, 0);

    last_data_bus = create_bus_data();
    control_bus = create_bus_data();

    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);
    data_bus_topic_subscription = subscribe_to(DATA_BUS_TOPIC, last_data_bus);

    register_watcher(&ri_c0_reg_watcher);
    register_watcher(&ri_f_reg_watcher);
    register_watcher(&ri_d_reg_watcher);
}

void shutdown_cu_ri(void)
{
    unregister_watcher(&ri_c0_reg_watcher);
    unregister_watcher(&ri_f_reg_watcher);
    unregister_watcher(&ri_d_reg_watcher);

    unsubscribe_for(data_bus_topic_subscription);
    unsubscribe_for(control_bus_topic_subscription);

    destroy_bus_data(last_data_bus);
    destroy_bus_data(control_bus);
}

void run_cu_ri(void)
{
    // todo get CRI from control bus
    update_bus_data(last_data_bus);
    update_bus_data(control_bus);

    Word cri_lb;
    initialize_word(&cri_lb, 0);
    cri_lb.bits[0] = control_bus->current_value.bits[CONTROL_BUS_CRI_BIT_POSITION];

    Word ri_c0_0, ri_c0_1;
    initialize_word(&ri_c0_0, 0);
    initialize_word(&ri_c0_1, 0);

    ri_c0_0.bits[0] = ri_c0_reg.value.bits[0];
    ri_c0_1.bits[0] = ri_c0_reg.value.bits[1];

    publish_message_to(RI_OUTPUT_C0_0_BUS_TOPIC, ri_c0_0);
    publish_message_to(RI_OUTPUT_C0_1_BUS_TOPIC, ri_c0_1);


    publish_message_to(RI_F_REG_BUS_TOPIC, ri_f_reg.value);
    publish_message_to(RI_D_REG_BUS_TOPIC, ri_d_reg.value);

    if (word_to_int(cri_lb) == 1)
    {

        // CO F D
        for (size_t i = 0; i < 7; i++) // D - 7 bits
        {
            ri_d_reg.value.bits[i] = last_data_bus->current_value.bits[i];
        }

        for (size_t i = 0; i < 7; i++) // F - 7 bits
        {
            ri_f_reg.value.bits[i] = last_data_bus->current_value.bits[7 + i];
        }

        for (size_t i = 0; i < 2; i++) // C0 - 2 bits
        {
            ri_c0_reg.value.bits[i] = last_data_bus->current_value.bits[14 + i];
        }
    }
}
