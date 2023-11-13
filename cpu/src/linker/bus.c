#include <stdio.h>

#include "../lib/constants.h"
#include "../lib/pubsub.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static Bus_t *control_bus_next = NULL;
static Bus_t *last_bus_data = NULL;

static PubSubSubscription *control_bus_next_topic_subscription = NULL;
static PubSubSubscription *data_bus_topic_subscription = NULL;

void init_linker_bus(void) {
    control_bus_next = create_bus_data();
    last_bus_data = create_bus_data();

    control_bus_next_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC_NEXT, control_bus_next);
    data_bus_topic_subscription = subscribe_to(DATA_BUS_TOPIC, last_bus_data);
}

void shutdown_linker_bus(void) {
    unsubscribe_for(control_bus_next_topic_subscription);
    unsubscribe_for(data_bus_topic_subscription);

    destroy_bus_data(control_bus_next);
    destroy_bus_data(last_bus_data);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_data_bus(void) { return word_to_int(last_bus_data->next_value); }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_cfz(void) { return control_bus_next->next_value.bits[CONTROL_BUS_CFZ_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_cb(void) { return control_bus_next->next_value.bits[CONTROL_BUS_CB_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_ca(void) { return control_bus_next->next_value.bits[CONTROL_BUS_CA_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_cri(void) { return control_bus_next->next_value.bits[CONTROL_BUS_CRI_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_cpc(void) { return control_bus_next->next_value.bits[CONTROL_BUS_CPC_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_wr(void) { return control_bus_next->next_value.bits[CONTROL_BUS_WR_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_alu0(void) { return control_bus_next->next_value.bits[CONTROL_BUS_ALU0_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_alu1(void) { return control_bus_next->next_value.bits[CONTROL_BUS_ALU1_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_mpx0(void) { return control_bus_next->next_value.bits[CONTROL_BUS_MPX0_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_mpx1(void) { return control_bus_next->next_value.bits[CONTROL_BUS_MPX1_BIT_POSITION]; }

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_control_bus_next_selalu(void) {
    Word selalu_lb;
    initialize_word(&selalu_lb, 0);

    selalu_lb.bits[0] = control_bus_next->next_value.bits[CONTROL_BUS_ALU0_BIT_POSITION];
    selalu_lb.bits[1] = control_bus_next->next_value.bits[CONTROL_BUS_ALU1_BIT_POSITION];

    return word_to_int(selalu_lb);
}
