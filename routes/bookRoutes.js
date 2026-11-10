const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ==========================================
// 1. GET ALL BOOKS
// ==========================================

router.get("/", (req, res) => {

    db.query("SELECT * FROM books", (err, results) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);

    });

});


// ==========================================
// 2. ADD A NEW BOOK
// ==========================================

router.post("/", (req, res) => {

    const { title, author, category, quantity } = req.body;

    if (
        !title ||
        !author ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        return res.status(400).json({
            message: "Enter valid book details."
        });
    }

    const sql = `
        INSERT INTO books
        (title, author, category, quantity, available)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, author, category, quantity, quantity],
        (err, result) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Book added successfully!",
                bookId: result.insertId
            });

        }
    );

});


// ==========================================
// 3. UPDATE BOOK DETAILS
// ==========================================

router.put("/:id", (req, res) => {

    const bookId = req.params.id;

    const { title, author, category, quantity } = req.body;

    if (
        !title ||
        !author ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        return res.status(400).json({
            message: "Enter valid book details."
        });
    }

    db.query(
        "SELECT quantity, available FROM books WHERE book_id = ?",
        [bookId],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Book not found."
                });
            }

            const issued =
                results[0].quantity - results[0].available;

            if (quantity < issued) {
                return res.status(400).json({
                    message: "Quantity cannot be less than issued books."
                });
            }

            const available = quantity - issued;

            const sql = `
                UPDATE books
                SET title = ?, author = ?, category = ?,
                    quantity = ?, available = ?
                WHERE book_id = ?
            `;

            db.query(
                sql,
                [title, author, category, quantity, available, bookId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Book updated successfully!"
                    });

                }
            );

        }
    );

});


// ==========================================
// 4. ISSUE A BOOK
// ==========================================

router.post("/:id/issue", (req, res) => {

    const bookId = req.params.id;

    const sql = `
        UPDATE books
        SET available = available - 1
        WHERE book_id = ? AND available > 0
    `;

    db.query(sql, [bookId], (err, result) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {

            return db.query(
                "SELECT * FROM books WHERE book_id = ?",
                [bookId],
                (err, rows) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (rows.length === 0) {
                        return res.status(404).json({
                            message: "Book not found."
                        });
                    }

                    return res.status(400).json({
                        message: "No available copies to issue."
                    });

                }
            );

        }

        res.json({
            message: "Book issued successfully!"
        });

    });

});


// ==========================================
// 5. RETURN A BOOK
// ==========================================

router.post("/:id/return", (req, res) => {

    const bookId = req.params.id;

    const sql = `
        UPDATE books
        SET available = available + 1
        WHERE book_id = ? AND available < quantity
    `;

    db.query(sql, [bookId], (err, result) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {

            return db.query(
                "SELECT * FROM books WHERE book_id = ?",
                [bookId],
                (err, rows) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (rows.length === 0) {
                        return res.status(404).json({
                            message: "Book not found."
                        });
                    }

                    return res.status(400).json({
                        message: "No issued copies available to return."
                    });

                }
            );

        }

        res.json({
            message: "Book returned successfully!"
        });

    });

});


// ==========================================
// 6. DELETE A BOOK
// ==========================================

router.delete("/:id", (req, res) => {

    const bookId = req.params.id;

    db.query(
        "SELECT quantity, available FROM books WHERE book_id = ?",
        [bookId],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Book not found."
                });
            }

            const issued =
                results[0].quantity - results[0].available;

            if (issued > 0) {
                return res.status(400).json({
                    message: "Cannot delete this book because copies are issued."
                });
            }

            db.query(
                "DELETE FROM books WHERE book_id = ?",
                [bookId],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Book deleted successfully!"
                    });

                }
            );

        }
    );

});


module.exports = router;