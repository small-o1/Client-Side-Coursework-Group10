const DEFAULT_BOOKS = [
    { id: 1,  title: "1984",                  author: "George Orwell",           year: 1949,  genre: "Dystopian Fiction",       isbn: "978-0451524935", copies: 3 },
    { id: 2,  title: "Dune",                  author: "Frank Herbert",           year: 1965,  genre: "Science Fiction",         isbn: "978-0441172719", copies: 2 },
    { id: 3,  title: "Pride and Prejudice",    author: "Jane Austen",             year: 1813,  genre: "Classic Literature",      isbn: "978-0141439518", copies: 4 },
    { id: 4,  title: "The Hobbit",             author: "J.R.R. Tolkien",          year: 1937,  genre: "Fantasy",                 isbn: "978-0547928227", copies: 5 },
    { id: 5,  title: "To Kill a Mockingbird",  author: "Harper Lee",              year: 1960,  genre: "Classic Fiction",         isbn: "978-0061120084", copies: 2 },
    { id: 6,  title: "The Great Gatsby",       author: "F. Scott Fitzgerald",     year: 1925,  genre: "Classic Fiction",         isbn: "978-0743273565", copies: 3 },
    { id: 7,  title: "Moby-Dick",              author: "Herman Melville",         year: 1851,  genre: "Adventure",               isbn: "978-0142437247", copies: 1 },
    { id: 8,  title: "Brave New World",        author: "Aldous Huxley",           year: 1932,  genre: "Dystopian Fiction",       isbn: "978-0060850524", copies: 2 },
    { id: 9,  title: "The Catcher in the Rye", author: "J.D. Salinger",           year: 1951,  genre: "Coming-of-Age Fiction",   isbn: "978-0316769488", copies: 3 },
    { id: 10, title: "Fahrenheit 451",         author: "Ray Bradbury",            year: 1953,  genre: "Dystopian Fiction",       isbn: "978-1451673319", copies: 2 },
    { id: 11, title: "The Lord of the Rings",  author: "J.R.R. Tolkien",          year: 1954,  genre: "Fantasy",                 isbn: "978-0544003415", copies: 4 },
    { id: 12, title: "Jane Eyre",              author: "Charlotte Brontë",        year: 1847,  genre: "Classic Literature",      isbn: "978-0141441146", copies: 2 },
    { id: 13, title: "Animal Farm",            author: "George Orwell",           year: 1945,  genre: "Political Satire",        isbn: "978-0451526342", copies: 3 },
    { id: 14, title: "The Alchemist",          author: "Paulo Coelho",            year: 1988,  genre: "Philosophical Fiction",   isbn: "978-0062315007", copies: 2 },
    { id: 15, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", year: 1997, genre: "Fantasy", isbn: "978-0439708180", copies: 6 },
    { id: 16, title: "The Hunger Games",       author: "Suzanne Collins",         year: 2008,  genre: "Young Adult Dystopian",   isbn: "978-0439023481", copies: 4 },
    { id: 17, title: "The Road",               author: "Cormac McCarthy",         year: 2006,  genre: "Post-Apocalyptic Fiction", isbn: "978-0307387899", copies: 1 },
    { id: 18, title: "Sapiens",                author: "Yuval Noah Harari",       year: 2011,  genre: "Non-Fiction / History",   isbn: "978-0062316110", copies: 2 },
    { id: 19, title: "A Brief History of Time", author: "Stephen Hawking",        year: 1988,  genre: "Non-Fiction / Science",   isbn: "978-0553380163", copies: 2 },
    { id: 20, title: "The Handmaid's Tale",    author: "Margaret Atwood",         year: 1985,  genre: "Dystopian Fiction",       isbn: "978-0385490818", copies: 3 }
];

function initCatalogue() {
    const stored = localStorage.getItem('libraryCatalogue');
    if (!stored) {
        localStorage.setItem('libraryCatalogue', JSON.stringify(DEFAULT_BOOKS));
    }
}

function getCatalogue() {
    const stored = localStorage.getItem('libraryCatalogue');
    return stored ? JSON.parse(stored) : DEFAULT_BOOKS;
}

function searchCatalogue(query) {
    const books = getCatalogue();
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(function(book) {
        return book.title.toLowerCase().includes(q) ||
               book.author.toLowerCase().includes(q) ||
               book.genre.toLowerCase().includes(q);
    });
}

function filterByGenre(genre) {
    const books = getCatalogue();
    if (!genre || genre === 'all') return books;
    return books.filter(function(book) { return book.genre === genre; });
}

function renderBookList(books, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (books.length === 0) {
        container.innerHTML = '<p class="no-results">No books found matching your search.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < books.length; i++) {
        var b = books[i];
        html += '<div class="book-card">';
        html += '  <div class="book-info">';
        html += '    <h3 class="book-title">' + b.title + '</h3>';
        html += '    <p class="book-author">by ' + b.author + '</p>';
        html += '    <p class="book-meta">' + b.genre + ' &middot; ' + b.year + ' &middot; ISBN: ' + b.isbn + '</p>';
        html += '    <p class="book-copies">Available copies: <span class="copy-count">' + b.copies + '</span></p>';
        html += '  </div>';
        html += '  <a href="reservations.html?book=' + encodeURIComponent(b.title) + '" class="btn-reserve">Reserve</a>';
        html += '</div>';
    }
    container.innerHTML = html;
}

function buildGenreFilters(containerId, onChangeCallback) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var books = getCatalogue();
    var genres = [];
    for (var i = 0; i < books.length; i++) {
        if (genres.indexOf(books[i].genre) === -1) {
            genres.push(books[i].genre);
        }
    }
    genres.sort();

    var html = '<button class="filter-btn active" data-genre="all">All</button>';
    for (var i = 0; i < genres.length; i++) {
        html += '<button class="filter-btn" data-genre="' + genres[i] + '">' + genres[i] + '</button>';
    }
    container.innerHTML = html;

    var buttons = container.querySelectorAll('.filter-btn');
    for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove('active');
                }
                btn.classList.add('active');
                if (typeof onChangeCallback === 'function') {
                    onChangeCallback(btn.getAttribute('data-genre'));
                }
            });
        })(buttons[i]);
    }
}

initCatalogue();