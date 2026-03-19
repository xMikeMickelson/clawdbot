import {
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
} from "../../../extensions/matrix/src/matrix/thread-bindings.js";
import type { PluginRuntimeChannel } from "./types-channel.js";

export function createRuntimeMatrix(): PluginRuntimeChannel["matrix"] {
  return {
    threadBindings: {
      setIdleTimeoutBySessionKey: setMatrixThreadBindingIdleTimeoutBySessionKey,
      setMaxAgeBySessionKey: setMatrixThreadBindingMaxAgeBySessionKey,
    },
  };
}
