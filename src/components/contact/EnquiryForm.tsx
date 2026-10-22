"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/contact";
import { branches } from "@/content/branches";
import { whatsappUrl } from "@/lib/contact";

/** Builds a prefilled WhatsApp message from the form fields — no backend, nothing is stored. */
export function EnquiryForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState<string>(contact.enquireAbout[0]);
  const [branch, setBranch] = useState(branches[0].name);
  const [note, setNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lines = [
      `Hi, I'd like to enquire about ${topic}.`,
      `Name: ${name || "—"}`,
      `Preferred branch: ${branch}`,
      note.trim() && `Note: ${note.trim()}`,
    ].filter(Boolean);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[var(--radius-panel)] bg-surface p-6 sm:p-8">
      <div className="grid gap-2">
        <label htmlFor="enq-name" className="text-small font-bold">
          Your name
        </label>
        <input
          id="enq-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-[0.75rem] border border-ink/15 bg-paper px-4 py-3 outline-none transition-colors duration-[var(--dur-ui)] focus-visible:border-red"
          placeholder="e.g. Priya Sharma"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="enq-topic" className="text-small font-bold">
          I'm enquiring about
        </label>
        <select
          id="enq-topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-[0.75rem] border border-ink/15 bg-paper px-4 py-3 outline-none transition-colors duration-[var(--dur-ui)] focus-visible:border-red"
        >
          {contact.enquireAbout.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="enq-branch" className="text-small font-bold">
          Preferred branch
        </label>
        <select
          id="enq-branch"
          name="branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="rounded-[0.75rem] border border-ink/15 bg-paper px-4 py-3 outline-none transition-colors duration-[var(--dur-ui)] focus-visible:border-red"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="enq-note" className="text-small font-bold">
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="enq-note"
          name="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="resize-none rounded-[0.75rem] border border-ink/15 bg-paper px-4 py-3 outline-none transition-colors duration-[var(--dur-ui)] focus-visible:border-red"
          placeholder="Child's age, class, or any question"
        />
      </div>

      <button type="submit" className="cta cta-whatsapp cta-primary justify-self-start">
        <span>Send on WhatsApp</span>
      </button>
    </form>
  );
}
