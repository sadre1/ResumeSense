"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { X, MessageCircle, Bot, User } from "lucide-react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUser } from "@clerk/nextjs";

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const pathname = usePathname();
    const { user } = useUser();
    const [createMode, setCreateMode] = useState(false);

    const username = user?.firstName || "there";


    const { messages, sendMessage, status, error, stop } = useChat({
  id: `chat-${pathname}`,

  async onFinish({message,messages}) {
    if (pathname !== "/resumes" || !createMode) return;

    // ✅ Extract assistant text safely
    const assistantText =
      message.parts
        ?.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join(" ") ?? "";

    // ✅ Gate: only continue after JD confirmation
    if (!assistantText.includes("<<JD_RECEIVED>>")) {
      return;
    }

    // ✅ NOW use hook state `messages` (this is array)
    const collectedAnswers = messages
      .map((m) =>
        m.parts
          ?.filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ")
      )
      .join("\n");

    const res = await fetch("/api/resume/prefill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: collectedAnswers,
      }),
    });

    if (!res.ok) {
      console.error("Prefill failed");
      return;
    }

    const prefillData = await res.json();

    window.dispatchEvent(
      new CustomEvent("resumePrefill", {
        detail: prefillData,
      })
    );
  },
});


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage({
            text: input,
            metadata: {
                route: pathname,
                 createMode,
            },
            
        });

        setInput("");
    };



    return (
        <>

            {/* Floating Open Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2
    bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
    text-white px-5 py-3 rounded-full shadow-xl
    hover:shadow-2xl hover:scale-105
    transition-all duration-300"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">
                        Ask ResBuddy
                    </span>
                </button>

            )}

            {/* Centered Modal */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="w-[720px] h-[680px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div>
                                <h2 className="text-lg font-semibold">ResBuddy</h2>
                                <p className="text-xs text-zinc-500">
                                    {pathname === "/analyzer"
                                        ? "Resume Analyzer Assistant"
                                        : "Resume Builder Assistant"}
                                </p>
                            </div>

                            <button onClick={() => setOpen(false)}>
                                <X className="w-5 h-5 text-zinc-500 hover:text-zinc-800" />
                            </button>
                        </div>
                        {/* Messages */}
                        {
                            pathname === "/resumes" && (
                            <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input
      type="checkbox"
      checked={createMode}
      onChange={(e) => setCreateMode(e.target.checked)}
      className="accent-blue-600"
    />
    Let me build it for you
  </label>

  {createMode && (
    <p className="mt-1 text-xs text-zinc-500">
      I’ll generate a full resume draft and pre-fill the form for you.
    </p>
  )}
</div>)
                        }
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-zinc-50 dark:bg-zinc-900">
                            {error && (
                                <div className="text-red-500 text-sm">{error.message}</div>
                            )}
                            {messages.length === 0 && (
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-zinc-700 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-blue-600" />
                                    </div>

                                    <div className="max-w-[70%] rounded-lg px-4 py-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                        <p>
                                            Hi <strong>{username}</strong> 👋
                                        </p>
                                        <p className="mt-2">
                                            I’m <strong>ResBuddy</strong>, your AI resume assistant.
                                        </p>
                                        <p className="mt-2 text-zinc-500">
                                            {pathname === "/analyzer"
                                                ? "Select a resume and I’ll help improve it."
                                                : "Let’s build a strong, job-winning resume together."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {messages.map((message) => (

                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    {/* AI Avatar */}
                                    {message.role === "assistant" && (
                                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-zinc-700 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 text-sm leading-relaxed ${message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                                            }`}
                                    >
                                        {message.parts.map((part, index) =>
                                            part.type === "text" ? (
                                                <ReactMarkdown
                                                    key={index}
                                                    remarkPlugins={[remarkGfm]}

                                                >
                                                    {part.text}
                                                </ReactMarkdown>
                                            ) : null
                                        )}
                                    </div>

                                    {/* User Avatar */}
                                    {message.role === "user" && (
                                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {(status === "submitted" || status === "streaming") && (
                                <div className="text-xs text-zinc-500">AI is typing…</div>
                            )}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 bg-white dark:bg-zinc-900"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something about your resume..."
                                className="flex-1 px-4 py-2 text-sm rounded-md border bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {status === "streaming" ? (
                                <button
                                    type="button"
                                    onClick={stop}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Stop
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={status !== "ready"}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                                >
                                    Send
                                </button>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex justify-between bg-zinc-50 dark:bg-zinc-900">
                            <span>Created by Sadrealam ❤️</span>
                            <span>© {new Date().getFullYear() + "Resume Sense"} </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
