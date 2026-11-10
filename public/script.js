// Store books retrieved from the database
let allBooks = [];


// ==========================================
// 1. FETCH BOOKS FROM MYSQL
// ==========================================

async function loadBooks() {
    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const books = await response.json();

        allBooks = books;

        displayBooks(books);
        updateDashboard(books);

    } catch (error) {
        console.error("Error loading books:", error);
        alert("Unable to load books from the database.");
    }
}


// ==========================================
// 2. DISPLAY BOOKS IN THE TABLE
// ==========================================

function displayBooks(books) {

    const tableBody = document.querySelector("#bookTable tbody");

    tableBody.innerHTML = "";

    books.forEach(book => {

        const issued = Number(book.quantity) - Number(book.available);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.book_id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category || "-"}</td>
            <td>${book.quantity}</td>
            <td>${book.available}</td>

            <td>
                <button onclick="editBook(${book.book_id})">
                    Edit
                </button>

                <button onclick="deleteBook(${book.book_id})">
                    Delete
                </button>

                <button
                    onclick="issueBook(${book.book_id})"
                    ${Number(book.available) === 0 ? "disabled" : ""}>
                    Issue
                </button>

                <button
                    onclick="returnBook(${book.book_id})"
                    ${issued === 0 ? "disabled" : ""}>
                    Return
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ==========================================
// 3. UPDATE DASHBOARD STATISTICS
// ==========================================

function updateDashboard(books) {

    const total = books.reduce(
        (sum, book) => sum + Number(book.quantity), 0
    );

    const available = books.reduce(
        (sum, book) => sum + Number(book.available), 0
    );

    const issued = total - available;

    document.getElementById("totalBooks").textContent = total;

    document.getElementById("availableBooks").textContent = available;

    document.getElementById("issuedBooks").textContent = issued;
}


// ==========================================
// 4. ADD A NEW BOOK
// ==========================================

async function addBook(event) {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();

    const author = document.getElementById("author").value.trim();

    const category = document.getElementById("category").value.trim();

    const quantity = Number(
        document.getElementById("quantity").value
    );

    if (
        !title ||
        !author ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        alert("Please enter valid book details!");
        return;
    }

    const bookData = {
        title,
        author,
        category,
        quantity
    };

    try {

        const response = await fetch("/api/books", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookData)

        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result.error || "Failed to add book.");
            return;
        }

        alert("Book added successfully!");

        document.getElementById("bookForm").reset();

        await loadBooks();

    } catch (error) {

        console.error("Error adding book:", error);

        alert("Something went wrong while adding the book!");
    }
}


// ==========================================
// 5. EDIT AN EXISTING BOOK
// ==========================================

async function editBook(id) {

    try {

        const book = allBooks.find(
            b => Number(b.book_id) === Number(id)
        );

        if (!book) {
            alert("Book not found!");
            return;
        }

        const title = prompt("Enter Book Title:", book.title);

        if (title === null) return;

        const author = prompt("Enter Author Name:", book.author);

        if (author === null) return;

        const category = prompt(
            "Enter Category:", book.category || ""
        );

        if (category === null) return;

        const quantityInput = prompt(
            "Enter Total Quantity:", book.quantity
        );

        if (quantityInput === null) return;

        const quantity = Number(quantityInput);

        if (
            !title.trim() ||
            !author.trim() ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            alert("Please enter valid book details!");
            return;
        }

        const response = await fetch(`/api/books/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title.trim(),
                author: author.trim(),
                category: category.trim(),
                quantity
            })

        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result.error || "Update failed!");
            return;
        }

        alert("Book updated successfully!");

        await loadBooks();

    } catch (error) {

        console.error("Error updating book:", error);

        alert("Something went wrong while updating the book!");
    }
}


// ==========================================
// 6. DELETE A BOOK
// ==========================================

async function deleteBook(id) {

    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {

        const response = await fetch(`/api/books/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result.error || "Unable to delete book.");
            return;
        }

        alert("Book deleted successfully!");

        await loadBooks();

    } catch (error) {

        console.error("Error deleting book:", error);

        alert("Something went wrong while deleting the book!");
    }
}


// ==========================================
// 7. ISSUE A BOOK
// ==========================================

async function issueBook(id) {

    if (!confirm("Are you sure you want to issue this book?")) {
        return;
    }

    try {

        const response = await fetch(`/api/books/${id}/issue`, {

            method: "POST"

        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result.error || "Unable to issue book.");
            return;
        }

        alert(result.message);

        await loadBooks();

    } catch (error) {

        console.error("Error issuing book:", error);

        alert("Something went wrong while issuing the book!");
    }
}


// ==========================================
// 8. RETURN A BOOK
// ==========================================

async function returnBook(id) {

    if (!confirm("Are you sure you want to return this book?")) {
        return;
    }

    try {

        const response = await fetch(`/api/books/${id}/return`, {

            method: "POST"

        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result.error || "Unable to return book.");
            return;
        }

        alert(result.message);

        await loadBooks();

    } catch (error) {

        console.error("Error returning book:", error);

        alert("Something went wrong while returning the book!");
    }
}


// ==========================================
// 9. SEARCH BOOKS
// ==========================================

function searchBooks() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filteredBooks = allBooks.filter(book => {

        return (
            book.title.toLowerCase().includes(searchValue) ||

            book.author.toLowerCase().includes(searchValue) ||

            (book.category || "").toLowerCase().includes(searchValue)
        );

    });

    displayBooks(filteredBooks);
}


// ==========================================
// 10. INITIALIZE APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Load books when the page opens
    loadBooks();

    // Connect Add Book form
    const bookForm = document.getElementById("bookForm");

    if (bookForm) {
        bookForm.addEventListener("submit", addBook);
    }

    // Connect Search functionality
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", searchBooks);
    }

});