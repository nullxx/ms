import type { MSCore, UIUpdateCallbackFn } from "./types";
import libmsModule from "./files/libMaquinaSencilla";
import { emptyMSCore } from "./types";
import toast from "react-hot-toast";

let moduleInstance: any;
export let msCore: MSCore | null;

const uiUpdatesSubscriptions = new Set<UIUpdateCallbackFn>();

const exportedMethods: {
  name: keyof MSCore;
  returnType: "number" | "string" | "array" | null;
  typeArgs: ("number" | "string")[];
}[] = [
  {
    name: "init",
    returnType: null,
    typeArgs: [],
  },
  {
    name: "shutdown",
    returnType: null,
    typeArgs: [],
  },

  {
    name: "get_memory_size",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_memory_value_size_bits",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_memory_value",
    returnType: "number",
    typeArgs: ["number"],
  },
  {
    name: "get_memory_dir_bus",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "set_memory_value",
    returnType: null,
    typeArgs: ["number", "number"],
  },
  {
    name: "get_register_fz",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_ri",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_ri_C0",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_ri_F",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_ri_D",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_pc",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "set_register_pc",
    returnType: null,
    typeArgs: ["number"],
  },
  {
    name: "get_register_alu_ra",
    returnType: null,
    typeArgs: ["number"],
  },
  {
    name: "get_register_alu_rb",
    returnType: null,
    typeArgs: ["number"],
  },

  {
    name: "run_clock_cycle",
    returnType: "number",
    typeArgs: ["number"],
  },
  {
    name: "get_state",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_next_state",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_alu_output",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_data_bus",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_cfz",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_cb",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_ca",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_cri",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_cpc",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_wr",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_alu0",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_alu1",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_mpx",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_control_bus_next_selalu",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "reset_control",
    returnType: null,
    typeArgs: [],
  },
  {
    name: "linker_set_update_ui",
    returnType: null,
    typeArgs: [],
  },
  {
    name: "get_rom_pos",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_processed_state",
    returnType: "number",
    typeArgs: [],
  }
];

export function getCConsoleHandle() {
  return {
    print: (...args: unknown[]) => {
      console.log(...args);
    },
    printErr: (...args: unknown[]) => {
      if (process.env.NODE_ENV !== "production") {
        return console.error(...args);
      }

      toast.error(args.join(" "), {
        style: {
          border: "1px solid #713200",
          padding: "10px",
          color: "#713200",
        },
      });
    },
  };
}

export async function loadInstance(): Promise<void> {
  moduleInstance = await libmsModule(getCConsoleHandle());
  const tmpmsCore = emptyMSCore();

  for (const method of exportedMethods) {
    const { name, returnType, typeArgs } = method;
    tmpmsCore[name as keyof MSCore] = moduleInstance.cwrap(
      name,
      returnType,
      typeArgs
    );
  }

  msCore = tmpmsCore;
}

export async function connectBackend() {
  if (msCore) {
    console.warn("msCore already loaded");
    return;
  }

  await loadInstance();
  if (!msCore) throw new Error("msCore not loaded");
  console.info("msCore loaded");

  execute("init");

  console.info("msCore initialized");

  createUpdateUICallback();
  console.info("msCore UI callback connected");
}

export async function disconnectBackend() {
  if (!msCore) {
    console.warn("msCore not loaded");
    return;
  }

  execute("shutdown");
  msCore = null;
}

export function getCore() {
  if (!msCore) throw new Error("msCore not loaded");
  return msCore;
}

export function execute<T = any>(method: keyof MSCore, ...args: unknown[]) {
  if (!msCore) throw new Error("msCore not loaded");
  const response = (msCore[method as keyof MSCore] as Function)(...args);
  return response as T;
}

export function subscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.add(callback);
}

export function unsubscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.delete(callback);
}

export function notifyUpdateToSubscribers() {
  uiUpdatesSubscriptions.forEach((callback) => callback());
}

export function createUpdateUICallback() {
  const fnPtr = moduleInstance.addFunction(() => {
    notifyUpdateToSubscribers();
  }, "v");

  msCore?.linker_set_update_ui(fnPtr);
}
