/*
 * File: /src/lib/watcher.h
 * Project: cpu
 * File Created: Thursday, 7th April 2022 4:24:29 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Thursday, 7th April 2022 4:24:31 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#ifndef watcher_h
#define watcher_h
#include "components/components.h"

typedef enum {
    WATCHER_TYPE_FZ,
    WATCHER_TYPE_PC,
    WATCHER_TYPE_RI_C0,
    WATCHER_TYPE_RI_F,
    WATCHER_TYPE_RI_D,
    WATCHER_TYPE_ALU_RA,
    WATCHER_TYPE_ALU_RB,
} WatcherType;

typedef struct {
    Register* reg;
    WatcherType type;
} RegisterWatcher;

void register_watcher(RegisterWatcher* reg);
int unregister_watcher(RegisterWatcher *reg_watcher);

Register* get_register(WatcherType type);
#endif