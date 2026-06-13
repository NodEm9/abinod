const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-contact-status]");

function setStatus(message, state) {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Sending message...", "loading");

  const submitButton = form.querySelector("button[type='submit']");
  submitButton?.setAttribute("disabled", "true");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "The message could not be sent.");
    }

    form.reset();
    setStatus(data.message || "Thanks. Your message has been received.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});
