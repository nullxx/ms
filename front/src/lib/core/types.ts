export interface MSCoreExtension {
  getValue: (ptr: any, type?: string) => any;
}

export interface MSCore {
  linker_set_update_ui(fnptr: number): void;

  init(): void;
  shutdown(): void;

  get_memory_size(): number;
  get_memory_value_size_bits(): number;
  get_memory_value(offset: number): number;
  get_memory_dir_bus(): number;
  set_memory_value(offset: number, value: number): void;

  get_register_fz(): number;
  get_register_ri(): number;
  get_register_ri_C0(): number;
  get_register_ri_F(): number;
  get_register_ri_D(): number;
  get_register_pc(): number;
  set_register_pc(value: number): void;
  get_register_alu_ra(): number;
  get_register_alu_rb(): number;

  get_alu_output(): number;

  get_data_bus(): number;
  get_control_bus_next_cfz(): number;
  get_control_bus_next_cb(): number;
  get_control_bus_next_ca(): number;
  get_control_bus_next_cri(): number;
  get_control_bus_next_cpc(): number;
  get_control_bus_next_wr(): number;
  get_control_bus_next_alu0(): number;
  get_control_bus_next_alu1(): number;
  get_control_bus_next_mpx(): number;
  get_control_bus_next_selalu(): number;

  get_rom_pos(): number;
  get_processed_state(): number;

  run_clock_cycle(updateUI: boolean): number;
  get_state(): number;
  get_next_state(): number;
  reset_control(): void;
}

export type UIUpdateCallbackFn = () => void;

function throwUninitializedError(fnName: keyof (MSCore & MSCoreExtension)): never {
  throw new Error(
    `Cannot call function ${fnName} because core is not initialized`
  );
}
export function emptyMSCore(): MSCore & MSCoreExtension {
  return {
    get_processed_state: () => {
      throwUninitializedError("get_processed_state");
    },

    get_rom_pos: () => {
      throwUninitializedError("get_rom_pos");
    },

    getValue: (ptr: any, type?: string) => {
      throwUninitializedError("getValue");
    },

    linker_set_update_ui: (fnptr: number) => {
      throwUninitializedError("linker_set_update_ui");
    },

    init: () => {
      throwUninitializedError("init");
    },

    shutdown: () => {
      throwUninitializedError("shutdown");
    },

    get_memory_size: () => {
      throwUninitializedError("get_memory_size");
    },

    get_memory_value_size_bits: () => {
      throwUninitializedError("get_memory_value_size_bits");
    },

    get_memory_value: (offset: number) => {
      throwUninitializedError("get_memory_value");
    },

    get_memory_dir_bus: () => {
      throwUninitializedError("get_memory_dir_bus");
    },

    get_register_fz: () => {
      throwUninitializedError("get_register_fz");
    },

    get_register_ri: () => {
      throwUninitializedError("get_register_ri");
    },

    get_register_ri_C0: () => {
      throwUninitializedError("get_register_ri_C0");
    },

    get_register_ri_F: () => {
      throwUninitializedError("get_register_ri_F");
    },

    get_register_ri_D: () => {
      throwUninitializedError("get_register_ri_D");
    },

    get_register_pc: () => {
      throwUninitializedError("get_register_pc");
    },

    get_register_alu_ra: () => {
      throwUninitializedError("get_register_alu_ra");
    },

    get_register_alu_rb: () => {
      throwUninitializedError("get_register_alu_rb");
    },

    get_alu_output: () => {
      throwUninitializedError("get_alu_output");
    },

    get_data_bus: () => {
      throwUninitializedError("get_data_bus");
    },

    get_control_bus_next_cfz: () => {
      throwUninitializedError("get_control_bus_next_cfz");
    },

    get_control_bus_next_cb: () => {
      throwUninitializedError("get_control_bus_next_cb");
    },

    get_control_bus_next_ca: () => {
      throwUninitializedError("get_control_bus_next_ca");
    },

    get_control_bus_next_cri: () => {
      throwUninitializedError("get_control_bus_next_cri");
    },

    get_control_bus_next_cpc: () => {
      throwUninitializedError("get_control_bus_next_cpc");
    },

    get_control_bus_next_wr: () => {
      throwUninitializedError("get_control_bus_next_wr");
    },

    get_control_bus_next_alu0: () => {
      throwUninitializedError("get_control_bus_next_alu0");
    },

    get_control_bus_next_alu1: () => {
      throwUninitializedError("get_control_bus_next_alu1");
    },

    get_control_bus_next_mpx: () => {
      throwUninitializedError("get_control_bus_next_mpx");
    },

    get_control_bus_next_selalu: () => {
      throwUninitializedError("get_control_bus_next_selalu");
    },

    run_clock_cycle: () => {
      throwUninitializedError("run_clock_cycle");
    },

    get_state: () => {
      throwUninitializedError("get_state");
    },

    get_next_state: () => {
      throwUninitializedError("get_next_state");
    },

    set_memory_value: (offset: number, value: number) => {
      throwUninitializedError("set_memory_value");
    },

    set_register_pc: (value: number) => {
      throwUninitializedError("set_register_pc");
    },

    reset_control: () => {
      throwUninitializedError("reset_control");
    },
  };
}
