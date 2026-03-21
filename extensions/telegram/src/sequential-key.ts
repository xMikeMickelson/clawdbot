import { type Message, type UserFromGetMe } from "@grammyjs/types";
import { isCommandMessage } from "openclaw/plugin-sdk/command-auth";
import { isAbortRequestText } from "openclaw/plugin-sdk/reply-runtime";
import { isBtwRequestText } from "openclaw/plugin-sdk/reply-runtime";
import { resolveTelegramForumThreadId } from "./bot/helpers.js";

export type TelegramSequentialKeyContext = {
  chat?: { id?: number };
  me?: UserFromGetMe;
  message?: Message;
  channelPost?: Message;
  editedChannelPost?: Message;
  update?: {
    message?: Message;
    edited_message?: Message;
    channel_post?: Message;
    edited_channel_post?: Message;
    callback_query?: { message?: Message };
    message_reaction?: { chat?: { id?: number } };
  };
};

function buildTelegramChatSequentialKey(params: {
  chatId?: number;
  threadId?: number | null;
  suffix?: string;
}): string {
  if (typeof params.chatId !== "number") {
    return params.suffix ? `telegram:${params.suffix}` : "telegram:unknown";
  }
  const base =
    params.threadId != null
      ? `telegram:${params.chatId}:topic:${params.threadId}`
      : `telegram:${params.chatId}`;
  return params.suffix ? `${base}:${params.suffix}` : base;
}

export function getTelegramSequentialKey(ctx: TelegramSequentialKeyContext): string {
  const reaction = ctx.update?.message_reaction;
  if (reaction?.chat?.id) {
    return `telegram:${reaction.chat.id}`;
  }
  const msg =
    ctx.message ??
    ctx.channelPost ??
    ctx.editedChannelPost ??
    ctx.update?.message ??
    ctx.update?.edited_message ??
    ctx.update?.channel_post ??
    ctx.update?.edited_channel_post ??
    ctx.update?.callback_query?.message;
  const chatId = msg?.chat?.id ?? ctx.chat?.id;
  const rawText = msg?.text ?? msg?.caption;
  const botUsername = ctx.me?.username;
  if (isAbortRequestText(rawText, botUsername ? { botUsername } : undefined)) {
    return buildTelegramChatSequentialKey({ chatId, suffix: "control" });
  }
  if (isBtwRequestText(rawText, botUsername ? { botUsername } : undefined)) {
    const messageId = msg?.message_id;
    if (typeof chatId === "number" && typeof messageId === "number") {
      return `telegram:${chatId}:btw:${messageId}`;
    }
    if (typeof chatId === "number") {
      return `telegram:${chatId}:btw`;
    }
    return "telegram:btw";
  }
  const isGroup = msg?.chat?.type === "group" || msg?.chat?.type === "supergroup";
  const messageThreadId = msg?.message_thread_id;
  const isForum = msg?.chat?.is_forum;
  const threadId = isGroup
    ? resolveTelegramForumThreadId({ isForum, messageThreadId })
    : messageThreadId;
  if (rawText && isCommandMessage(rawText)) {
    // Keep command-only updates off the chat/model lane so deterministic plugin/native
    // commands can execute while a long-running reply is still in progress.
    return buildTelegramChatSequentialKey({ chatId, threadId, suffix: "command" });
  }
  return buildTelegramChatSequentialKey({ chatId, threadId });
}
