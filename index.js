const STORAGE_KEY = "ejercicio-02-contacts";
const contactForm = document.querySelector("#contact-form");
const contactList = document.querySelector("#contact-list");
const emptyState = document.querySelector("#empty-state");
const contactCount = document.querySelector("#contact-count");

function loadContacts() {
  try {
    const savedContacts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedContacts) ? savedContacts : [];
  } catch {
    return [];
  }
}

let contacts = loadContacts();

function saveContacts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}

function createContactElement(contact) {
  const item = document.createElement("li");
  item.className = "contact-card";

  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = contact.name.trim().charAt(0).toUpperCase();

  const details = document.createElement("div");
  details.className = "contact-details";

  const name = document.createElement("p");
  name.className = "contact-name";
  name.textContent = contact.name;

  const meta = document.createElement("p");
  meta.className = "contact-meta";
  meta.textContent = contact.email
    ? `${contact.phone} · ${contact.email}`
    : contact.phone;

  const removeButton = document.createElement("button");
  removeButton.className = "remove-button";
  removeButton.type = "button";
  removeButton.textContent = "Eliminar";
  removeButton.setAttribute("aria-label", `Eliminar a ${contact.name}`);
  removeButton.addEventListener("click", () => {
    contacts = contacts.filter((savedContact) => savedContact.id !== contact.id);
    saveContacts();
    renderContacts();
  });

  details.append(name, meta);
  item.append(avatar, details, removeButton);
  return item;
}

function renderContacts() {
  contactList.replaceChildren(...contacts.map(createContactElement));
  emptyState.hidden = contacts.length > 0;
  contactCount.textContent = String(contacts.length);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const contact = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    email: formData.get("email").trim(),
  };

  contacts.push(contact);
  saveContacts();
  renderContacts();
  contactForm.reset();
  contactForm.elements.name.focus();
});

renderContacts();
