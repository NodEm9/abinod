const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-contact-status]");
const contactEmail = "abinod@online.de";

function setStatus(message, state) {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function cleanValue(value) {
  return String(value || "").trim();
}

function buildMailtoUrl(payload) {
  const mailto = new URL(`mailto:${contactEmail}`);
  mailto.searchParams.set(
    "subject",
    `Abinod contact: ${payload.topic || "General"}`,
  );
  mailto.searchParams.set(
    "body",
    [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Topic: ${payload.topic}`,
      "",
      payload.message,
    ].join("\n"),
  );

  return mailto.toString();
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: cleanValue(formData.get("name")),
    email: cleanValue(formData.get("email")),
    topic: cleanValue(formData.get("topic")),
    message: cleanValue(formData.get("message")),
    website: cleanValue(formData.get("website")),
  };

  if (payload.website) {
    form.reset();
    return;
  }

  if (!payload.name || !payload.email || !payload.topic || !payload.message) {
    setStatus("Please complete every required field before sending.", "error");
    return;
  }

  window.location.href = buildMailtoUrl(payload);
  setStatus("Your email app should open with the message ready to send.", "success");
});
