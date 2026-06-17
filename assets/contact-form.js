const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-contact-status]");
const fallbackEmail = "abinod@online.de";

function setStatus(message, state) {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function setFallbackStatus(message, mailto) {
  if (!status) return;
  status.textContent = "";
  status.dataset.state = "error";
  status.append(document.createTextNode(`${message} `));

  const link = document.createElement("a");
  link.href = mailto;
  link.textContent = "Send by email";
  status.append(link);
}

function buildFallbackMailto(payload, email = fallbackEmail) {
  const mailto = new URL(`mailto:${email}`);
  mailto.searchParams.set("subject", `Abinod contact: ${payload.topic || "General"}`);
  mailto.searchParams.set(
    "body",
    [
      `Name: ${payload.name || ""}`,
      `Email: ${payload.email || ""}`,
      `Topic: ${payload.topic || ""}`,
      "",
      payload.message || "",
    ].join("\n"),
  );

  return mailto.toString();
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Sending message...", "loading");

  const submitButton = form.querySelector("button[type='submit']");
  submitButton?.setAttribute("disabled", "true");
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || "The contact service is unavailable.");
      error.fallbackEmail = data.fallbackEmail || fallbackEmail;
      throw error;
    }

    form.reset();
    setStatus(data.message || "Thanks. Your message has been sent.", "success");
  } catch (error) {
    setFallbackStatus(
      error.message,
      buildFallbackMailto(payload, error.fallbackEmail || fallbackEmail),
    );
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});
