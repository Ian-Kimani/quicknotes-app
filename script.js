const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();

  notes.forEach((note) => {
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

  const note = {
    id: Date.now().toString(),
    text: noteInput.value.trim(),
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.unshift(note);
  noteInput.value = "";
  render();
});

render();
