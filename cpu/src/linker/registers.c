/*
 * File: /src/linker/registers.c
 * Project: cpu
 * File Created: Friday, 22nd April 2022 5:18:42 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Friday, 22nd April 2022 5:18:45 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#include "../lib/components/components.h"
#include "../lib/logger.h"
#include "../lib/watcher.h"
#include "../lib/pubsub.h"
#include "linker.h"

static Bus_t *fz_bus = NULL;
static PubSubSubscription *fz_subscription = NULL;

void init_linker_registers(void)
{
    fz_bus = create_bus_data();
    fz_subscription = subscribe_to(ALU_FZ_OUTPUT_BUS_TOPIC, fz_bus);
}

void shutdown_linker_registers(void)
{
    unsubscribe_for(fz_subscription);
    destroy_bus_data(fz_bus);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_fz(void)
{
    return fz_bus->next_value.bits[0];
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_ri_C0(void)
{
    return word_to_int(get_register(WATCHER_TYPE_RI_C0)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_ri_F(void)
{
    return word_to_int(get_register(WATCHER_TYPE_RI_F)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_ri_D(void)
{
    return word_to_int(get_register(WATCHER_TYPE_RI_D)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_ri(void)
{
    Word ri;
    initialize_word(&ri, 0);

    Word ri_d = get_register(WATCHER_TYPE_RI_D)->value;
    Word ri_f = get_register(WATCHER_TYPE_RI_F)->value;
    Word ri_c0 = get_register(WATCHER_TYPE_RI_C0)->value;

    for (int i = 0; i < 7; i++)
    {
        ri.bits[i] = ri_d.bits[i];
    }

    for (int i = 0; i < 7; i++)
    {
        ri.bits[i + 7] = ri_f.bits[i];
    }

    for (int i = 0; i < 2; i++)
    {
        ri.bits[i + 14] = ri_c0.bits[i];
    }

    return word_to_int(ri);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_pc(void)
{
    return word_to_int(get_register(WATCHER_TYPE_PC)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_alu_ra(void)
{
    return word_to_int(get_register(WATCHER_TYPE_ALU_RA)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int get_register_alu_rb(void)
{
    return word_to_int(get_register(WATCHER_TYPE_ALU_RB)->value);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void set_register_pc(int value)
{
    get_register(WATCHER_TYPE_PC)->value = int_to_word(value);

    publish_message_to(PC_OUTPUT_BUS_TOPIC, get_register(WATCHER_TYPE_PC)->value); // set pc output bus to let know addsub new pc value

    get_update_ui_fn()();
}