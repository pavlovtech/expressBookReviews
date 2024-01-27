const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username; // Assuming the username is in the request body
    const password = req.body.password; // Assuming the password is also in the request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).send("The username already exists. Please choose another one.");
    }

    users.push({"username":req.body.username,"password":req.body.password});
    res.send("The user" + (' ')+ (req.body.username) + " Has been registered!")
});

function getBooks() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(books), 1000); // Simulating async operation with setTimeout
    });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks()
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books", error: error });
        });
});

// Get book details based on ISBN
function getBookByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let bookCollection = Object.values(books);
            const book = bookCollection.find(b => b.isbn === isbn);
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 1000); // Simulating async operation with setTimeout
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    getBookByIsbn(isbn)
        .then(book => {
            res.json(book);
        })
        .catch(error => {
            res.status(404).json({ message: error });
        });
});
  
// Get book details based on author
function getBooksByAuthor(author) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let bookCollection = Object.values(books);
            const booksByAuthor = bookCollection.filter(b => b.author === author);
            resolve(booksByAuthor);
        }, 1000); // Simulating async operation with setTimeout
    });
}

// Get book details based on Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    getBooksByAuthor(author)
        .then(books => {
            if (books.length > 0) {
                res.json(books);
            } else {
                res.status(404).json({ message: "No books found by this author." });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books", error: error });
        });
});

function getBooksByTitle(title) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let bookCollection = Object.values(books);
            const booksByTitle = bookCollection.filter(b => b.title === title);
            resolve(booksByTitle);
        }, 1000); // Simulating async operation with setTimeout
    });
}

// Get book details based on Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    getBooksByTitle(title)
        .then(books => {
            if (books.length > 0) {
                res.json(books);
            } else {
                res.status(404).json({ message: "No books found with this title." });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books", error: error });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookCollection = Object.values(books);
  const book = bookCollection.find(b => b.isbn === isbn);
  res.send(JSON.stringify(book.reviews,null,4));
});


module.exports.general = public_users;
