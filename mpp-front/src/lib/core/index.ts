import type { MppCore, UIUpdateCallbackFn } from "./types";
import libmppModule from "./files/libmpp";
import { emptyMppCore } from "./types";
import toast from "react-hot-toast";

let moduleInstance: any;
export let mppCore: MppCore | null;

const uiUpdatesSubscriptions = new Set<UIUpdateCallbackFn>();

const exportedMethods: {
  name: keyof MppCore;
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
    name: "set_memory_value",
    returnType: null,
    typeArgs: ["number", "number"],
  },

  {
    name: "get_register_acum",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_acum",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_fc",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_fz",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_b",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_c",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_d",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_e",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_h",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_l",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_2op",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_pch",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_pcl",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_pc",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_sp",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "get_register_ri",
    returnType: "number",
    typeArgs: [],
  },
  {
    name: "set_register_pc",
    returnType: null,
    typeArgs: ["number"],
  },

  {
    name: "run_clock_cycle",
    returnType: "number",
    typeArgs: [],
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
    name: "print_hello",
    returnType: null,
    typeArgs: [],
  },
  {
    name: "linker_set_update_ui",
    returnType: null,
    typeArgs: [],
  },
];

export function getCConsoleHandle() {
  return {
    print: (...args: unknown[]) => {
      console.log.bind(console, ...args);
    },
    printErr: (...args: unknown[]) => {
      toast.error(args.join(' '), {
        style: {
          border: '1px solid #713200',
          padding: '10px',
          color: '#713200',
        },
      });
    }
  }
}

export async function loadInstance(): Promise<void> {
  moduleInstance = await libmppModule(getCConsoleHandle());
  const tmpMppCore = emptyMppCore();

  for (const method of exportedMethods) {
    const { name, returnType, typeArgs } = method;
    tmpMppCore[name as keyof MppCore] = moduleInstance.cwrap(
      name,
      returnType,
      typeArgs
    );
  }

  mppCore = tmpMppCore;
}
export function setCConsoleLogger() {
  moduleInstance["print"] = (...args: any[]) => {
    console.log("ALGO", ...args);
  };

  moduleInstance["printErr"] = (...args: any[]) => {
    console.log("ALGO", ...args);
  };
}
export async function connectBackend() {
  if (mppCore) {
    console.warn("MppCore already loaded");
    return;
  }

  await loadInstance();
  if (!mppCore) throw new Error("MppCore not loaded");
  console.info("MppCore loaded");

  setCConsoleLogger();

  execute("init");

  console.info("MppCore initialized");

  createUpdateUICallback();
  console.info("MppCore UI callback connected");
}

export async function disconnectBackend() {
  if (!mppCore) {
    console.warn("MppCore not loaded");
    return;
  }

  execute("shutdown");
  mppCore = null;
}

export function getCore() {
  if (!mppCore) throw new Error("MppCore not loaded");
  return mppCore;
}

export function execute(method: keyof MppCore, ...args: unknown[]) {
  if (!mppCore) throw new Error("MppCore not loaded");
  const response = (mppCore[method as keyof MppCore] as Function)(...args);
  return response;
}

export function subscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.add(callback);
}

export function unsubscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.delete(callback);
}

export function createUpdateUICallback() {
  const fnPtr = moduleInstance.addFunction(() => {
    uiUpdatesSubscriptions.forEach((callback) => callback());
  }, "v");

  mppCore?.linker_set_update_ui(fnPtr);
}
