const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes-notes";
let notes = [];

function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render(notesToRender = notes) {
  notesList.replaceChildren();

  if (notesToRender.length === 0 && searchInput.value.trim()) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No notes match your search.";
    notesList.append(emptyMessage);
  }

  notesToRender.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.className = `note-card ${getCategoryClass(note.category)}`;

    const header = document.createElement("div");
    header.className = "note-card-header";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "category-label";
    categoryLabel.textContent = note.category;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.noteId = note.id;

    const text = document.createElement("p");
    text.className = "note-text";
    text.textContent = note.text;

    const date = document.createElement("p");
    date.className = "note-date";
    date.textContent = note.createdAt;

    header.append(categoryLabel, deleteButton);
    noteItem.append(header, text, date);
    notesList.append(noteItem);
  });

  updateCount(notes.length);
}

function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  const note = {
    id: Date.now().toString(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.unshift(note);
  noteInput.value = "";
  errorMessage.textContent = "";
  saveNotes();
  render();
});

notesList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-button")) {
    return;
  }

  const noteId = event.target.dataset.noteId;
  notes = notes.filter((note) => note.id !== noteId);
  saveNotes();
  render();
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
  render(filteredNotes);
});

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  if (!savedNotes) {
    return;
  }

  try {
    const parsedNotes = JSON.parse(savedNotes);
    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes;
    }
  } catch {
    notes = [];
  }
}

loadNotes();
render();
