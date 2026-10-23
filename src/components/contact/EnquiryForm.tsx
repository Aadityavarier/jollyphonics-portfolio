"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { contact } from "@/content/contact";
import { branches } from "@/content/branches";
import { buildEnquiryMessage, whatsappUrl } from "@/lib/contact";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { TypeOut } from "@/components/motion/TypeOut";
import { WhatsAppIcon } from "./WhatsAppLink";

const STEPS = 4;
const FIELD =
  "rounded-[0.75rem] border border-ink/15 bg-paper px-4 py-3 outline-none transition-colors duration-[var(--dur-ui)] focus-visible:border-red";

interface Answers {
  topic: string;
  branch: string;
  name: string;
  note: string;
}

function Chip({ name, value, checked, onChange, children }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; children: string }) {
  return (
    <label className="enq-chip">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span>{children}</span>
    </label>
  );
}

/**
 * Enquiry as a short conversation: one question per step, progress shown as sound tiles lighting up, and at the
 * end the answers turn into the WhatsApp message (typed into a chat bubble) with one "Send on WhatsApp" button.
 * Every question is optional, so the shortest path is one tap. "Show all fields" is the plain form. No backend:
 * the button is a wa.me link. Without JavaScript the <noscript> form is a single message box that GETs wa.me.
 */
export function EnquiryForm() {
  const [mode, setMode] = useState<"steps" | "all">("steps");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"f" | "b">("f");
  const [a, setA] = useState<Answers>({ topic: "", branch: "", name: "", note: "" });
  const [typingStep, setTypingStep] = useState<number | null>(null);
  const typing = typingStep === STEPS && step === STEPS;
  const stepRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const set = (k: keyof Answers) => (v: string) => setA((p) => ({ ...p, [k]: v }));
  const message = buildEnquiryMessage(a);
  const href = whatsappUrl(message);
  const answered = [a.topic, a.branch, a.name, a.note].filter((v) => v.trim());

  useEffect(() => {
    if (!moved.current) return;
    stepRef.current?.focus();
  }, [step, mode]);

  useEffect(() => {
    if (step !== STEPS) return;
    const t = window.setTimeout(() => setTypingStep(STEPS), answered.length ? 480 : 80);
    return () => clearTimeout(t);
    // The delay only depends on whether chips are flying in; recomputing it per keystroke would restart typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const go = (to: number) => {
    moved.current = true;
    setTypingStep(null);
    setDir(to >= step ? "f" : "b");
    setStep(to);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(Math.min(STEPS, step + 1));
  };

  return (
    <div className="enq">
      <noscript>
        <style>{".enq-js{display:none!important}"}</style>
        <form method="get" action={`https://wa.me/${contact.whatsappNumber}`} target="_blank" className="grid gap-4 rounded-[var(--radius-panel)] bg-surface p-6">
          <label htmlFor="enq-plain" className="text-small font-bold">
            Your message
          </label>
          <textarea id="enq-plain" name="text" rows={4} required className={`${FIELD} resize-none`} defaultValue="Hi, I'd like to know more about your classes." />
          <button type="submit" className="cta cta-whatsapp cta-primary justify-self-start">
            <WhatsAppIcon />
            <span>Send on WhatsApp</span>
          </button>
        </form>
      </noscript>

      <div className="enq-js rounded-[var(--radius-panel)] bg-surface p-5 sm:p-8">
        {mode === "all" ? (
          <div className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="enq-topic" className="text-small font-bold">
                I&rsquo;m enquiring about
              </label>
              <select id="enq-topic" value={a.topic} onChange={(e) => set("topic")(e.target.value)} className={FIELD}>
                <option value="">Select one</option>
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
              <select id="enq-branch" value={a.branch} onChange={(e) => set("branch")(e.target.value)} className={FIELD}>
                <option value="">No preference</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="enq-name" className="text-small font-bold">
                Your name <span className="font-normal text-muted">(optional)</span>
              </label>
              <input id="enq-name" type="text" autoComplete="name" value={a.name} onChange={(e) => set("name")(e.target.value)} className={FIELD} placeholder="e.g. Priya Sharma" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="enq-note" className="text-small font-bold">
                Anything else? <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea id="enq-note" rows={3} value={a.note} onChange={(e) => set("note")(e.target.value)} className={`${FIELD} resize-none`} placeholder="Child's age, class, or any question" />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={href} target="_blank" rel="noopener" className="cta cta-whatsapp cta-primary">
                <WhatsAppIcon />
                <span>Send on WhatsApp</span>
              </a>
              <button type="button" className="link-u" onClick={() => setMode("steps")}>
                Step by step instead
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: STEPS }, (_, i) => (
                  <span key={i} className="enq-tile" data-on={i <= step ? "" : undefined} style={{ "--c": PHONICS_TILES[i * 2 % PHONICS_TILES.length].bg } as CSSProperties} />
                ))}
              </div>
              <button type="button" className="link-u text-small" onClick={() => setMode("all")}>
                Show all fields
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {step < STEPS ? `Question ${step + 1} of ${STEPS}` : "Your message is ready"}
            </p>

            <div ref={stepRef} tabIndex={-1} key={step} data-dir={dir} className="enq-step grid gap-5 outline-none">
              {step === 0 && (
                <fieldset className="grid gap-3">
                  <legend className="mb-3 font-display text-lead font-bold">What would you like to know about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {contact.enquireAbout.map((t) => (
                      <Chip key={t} name="topic" value={t} checked={a.topic === t} onChange={set("topic")}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              )}
              {step === 1 && (
                <fieldset className="grid gap-3">
                  <legend className="mb-3 font-display text-lead font-bold">Which branch is closest to you?</legend>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((b) => (
                      <Chip key={b.id} name="branch" value={b.name} checked={a.branch === b.name} onChange={set("branch")}>
                        {b.name}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              )}
              {step === 2 && (
                <div className="grid gap-3">
                  <label htmlFor="enq-name" className="font-display text-lead font-bold">
                    What should we call you?
                  </label>
                  <input id="enq-name" type="text" autoComplete="name" value={a.name} onChange={(e) => set("name")(e.target.value)} className={`${FIELD} max-w-[24rem]`} placeholder="e.g. Priya Sharma" />
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-3">
                  <label htmlFor="enq-note" className="font-display text-lead font-bold">
                    Anything else? <span className="text-small font-normal text-muted">(optional)</span>
                  </label>
                  <textarea id="enq-note" rows={3} value={a.note} onChange={(e) => set("note")(e.target.value)} className={`${FIELD} resize-none`} placeholder="Child's age, class, or any question" />
                </div>
              )}
              {step === STEPS && (
                <div className="grid gap-4">
                  <h3 className="font-display text-lead font-bold">Your message is ready</h3>
                  {answered.length > 0 && (
                    <ul className="enq-fly flex flex-wrap gap-2" aria-hidden="true">
                      {answered.map((v) => (
                        <li key={v} className="rounded-full bg-paper px-3 py-1 text-small font-medium">
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="enq-bubble max-w-[28rem] whitespace-pre-line">
                    {typing ? <TypeOut text={message} speed={22} maxMs={1400} /> : <span className="sr-only">{message}</span>}
                    {!typing && <span aria-hidden="true" className="invisible whitespace-pre-line">{message}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a href={href} target="_blank" rel="noopener" className="cta cta-whatsapp cta-primary">
                      <WhatsAppIcon />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button type="button" className="link-u" onClick={() => go(0)}>
                      Change my answers
                    </button>
                  </div>
                </div>
              )}
            </div>

            {step < STEPS && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button type="submit" className="cta cta-ink">
                  {step === STEPS - 1 ? "See my message" : "Next"}
                </button>
                {step > 0 && (
                  <button type="button" className="link-u" onClick={() => go(step - 1)}>
                    Back
                  </button>
                )}
                {step > 0 && (
                  <button type="button" className="link-u text-muted" onClick={() => go(STEPS)}>
                    Skip to my message
                  </button>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
