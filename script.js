emailjs.init({ publicKey: "OYiBfQ7AdLarDYc6U" });

const form = document.getElementById("recruitmentForm");
const statusDiv = document.getElementById("status");
const storageKey = "opiniaPrzedAwansemFormData";

const fieldNames = [
  "employee",
  "client",
  "meetingHeld",
  "purposeClear",
  "informationAppropriate",
  "competent",
  "subjectKnowledge",
  "reliable",
  "appropriatelyDressed",
  "recommend",
  ...Array.from({ length: 10 }, (_, i) => `referral${i + 1}`),
];

function saveFormState() {
  const data = {};
  fieldNames.forEach((name) => {
    const fields = form.querySelectorAll(`[name="${name}"]`);
    if (!fields.length) return;

    if (fields[0].type === "radio") {
      data[name] = form.querySelector(`[name="${name}"]:checked`)?.value || "";
    } else {
      data[name] = fields[0].value;
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadFormState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    fieldNames.forEach((name) => {
      if (data[name] === undefined) return;
      const fields = form.querySelectorAll(`[name="${name}"]`);
      if (!fields.length) return;

      if (fields[0].type === "radio") {
        fields.forEach((field) => {
          field.checked = field.value === data[name];
        });
      } else {
        fields[0].value = data[name];
      }
    });
  } catch (error) {
    console.warn("Nie udało się odczytać zapisanych odpowiedzi.", error);
    localStorage.removeItem(storageKey);
  }
}

form.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", saveFormState);
  input.addEventListener("change", saveFormState);
});

window.addEventListener("load", loadFormState);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const referrals = Array.from({ length: 10 }, (_, i) => {
    const number = i + 1;
    return `${number}. ${form.elements[`referral${number}`].value.trim()}`;
  }).filter((entry) => !entry.endsWith(". "));

  const templateParams = {
    employee: form.elements.employee.value.trim(),
    client: form.elements.client.value.trim(),
    meetingHeld: form.querySelector('[name="meetingHeld"]:checked')?.value || "",
    purposeClear: form.querySelector('[name="purposeClear"]:checked')?.value || "",
    informationAppropriate:
      form.querySelector('[name="informationAppropriate"]:checked')?.value || "",
    competent: form.querySelector('[name="competent"]:checked')?.value || "",
    subjectKnowledge:
      form.querySelector('[name="subjectKnowledge"]:checked')?.value || "",
    reliable: form.querySelector('[name="reliable"]:checked')?.value || "",
    appropriatelyDressed:
      form.querySelector('[name="appropriatelyDressed"]:checked')?.value || "",
    recommend: form.querySelector('[name="recommend"]:checked')?.value || "",
    referrals: referrals.length ? referrals.join("\n") : "Nie podano",
    referral1: form.elements.referral1.value.trim(),
    referral2: form.elements.referral2.value.trim(),
    referral3: form.elements.referral3.value.trim(),
    referral4: form.elements.referral4.value.trim(),
    referral5: form.elements.referral5.value.trim(),
    referral6: form.elements.referral6.value.trim(),
    referral7: form.elements.referral7.value.trim(),
    referral8: form.elements.referral8.value.trim(),
    referral9: form.elements.referral9.value.trim(),
    referral10: form.elements.referral10.value.trim(),
  };

  statusDiv.className = "status";
  statusDiv.textContent = "Wysyłanie formularza...";
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    await emailjs.send("service_mksx71m", "template_he9snio", templateParams, {
      publicKey: "OYiBfQ7AdLarDYc6U",
    });

    statusDiv.className = "status success";
    statusDiv.textContent = "✔ Opinia została wysłana poprawnie.";
    form.reset();
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Błąd wysyłania przez EmailJS:", error);
    statusDiv.className = "status error";
    statusDiv.textContent =
      "✖ Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.";
  } finally {
    submitButton.disabled = false;
  }
});
