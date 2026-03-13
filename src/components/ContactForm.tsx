"use client";

export default function ContactForm() {
  return (
    <div className="glass-card rounded-2xl p-8">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-text-muted"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-border-card bg-background/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-body/50 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-text-muted"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            className="w-full rounded-xl border border-border-card bg-background/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-body/50 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-text-muted"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Your message..."
            className="w-full resize-none rounded-xl border border-border-card bg-background/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-body/50 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-accent-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-blue/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-blue/30"
        >
          Send Message
        </button>

        <p className="text-center text-xs text-text-body/60">
          This form is for demonstration only. Please reach out via email or
          LinkedIn.
        </p>
      </form>
    </div>
  );
}
