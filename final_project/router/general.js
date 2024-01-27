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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookCollection = Object.values(books);
  const book = bookCollection.find(b => b.isbn === isbn);
  res.send(JSON.stringify(book,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookCollection = Object.values(books);
  const r = bookCollection.filter(b => b.author === author);
  res.send(JSON.stringify(r,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookCollection = Object.values(books);
  const r = bookCollection.filter(b => b.title === title);
  res.send(JSON.stringify(r,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookCollection = Object.values(books);
  const book = bookCollection.find(b => b.isbn === isbn);
  res.send(JSON.stringify(book.reviews,null,4));
});

public_users.delete("/custmer/auth/review/:isbn", (req, res) => {
    res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.general = public_users;
