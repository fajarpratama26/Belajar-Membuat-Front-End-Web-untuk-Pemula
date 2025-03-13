const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = +new Date();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookObject = { id, title, author, year, isComplete };

    books.push(bookObject);
    saveData();
    event.target.reset();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value.toLowerCase();
    refreshBookList(query);
  });

  refreshBookList();
});

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser tidak mendukung Local Storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const serializedData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, serializedData);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData).map((book) => ({
      ...book,
      year: Number(book.year), // Ensure year is a number
    }));
  }
}

function refreshBookList(query = '') {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books
    .filter((book) => book.title.toLowerCase().includes(query))
    .forEach((book) => {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
}

function makeBookElement({ id, title, author, year, isComplete }) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const bookTitle = document.createElement('h3');
  bookTitle.setAttribute('data-testid', 'bookItemTitle');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = `Tahun: ${year}`;

  const buttonContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => {
    toggleBookCompletion(id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    removeBook(id);
  });

  buttonContainer.append(toggleButton, deleteButton);

  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return bookContainer;
}

function toggleBookCompletion(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    refreshBookList();
  }
}

function removeBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveData();
  refreshBookList();
}
