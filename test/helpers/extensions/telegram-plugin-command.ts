import { vi } from "vitest";

export const pluginCommandMocks = {
  getPluginCommandSpecs: vi.fn(() => []),
  matchPluginCommand: vi.fn(() => null),
  executePluginCommand: vi.fn(async () => ({ text: "ok" })),
  subscribePluginCommandRegistry: vi.fn(() => () => {}),
};

vi.mock("openclaw/plugin-sdk/plugin-runtime", () => ({
  getPluginCommandSpecs: pluginCommandMocks.getPluginCommandSpecs,
  matchPluginCommand: pluginCommandMocks.matchPluginCommand,
  executePluginCommand: pluginCommandMocks.executePluginCommand,
  subscribePluginCommandRegistry: pluginCommandMocks.subscribePluginCommandRegistry,
}));

export function resetPluginCommandMocks() {
  pluginCommandMocks.getPluginCommandSpecs.mockClear();
  pluginCommandMocks.getPluginCommandSpecs.mockReturnValue([]);
  pluginCommandMocks.matchPluginCommand.mockClear();
  pluginCommandMocks.matchPluginCommand.mockReturnValue(null);
  pluginCommandMocks.executePluginCommand.mockClear();
  pluginCommandMocks.executePluginCommand.mockResolvedValue({ text: "ok" });
  pluginCommandMocks.subscribePluginCommandRegistry.mockClear();
  pluginCommandMocks.subscribePluginCommandRegistry.mockReturnValue(() => {});
}
