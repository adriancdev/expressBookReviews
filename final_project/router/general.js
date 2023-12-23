const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    res.send(JSON.stringify(books,null,4));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    res.send(books[isbn])
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    function getBooksByAuthor(author) {
      return Object.entries(books)
        .filter(([key, book]) => book.author === author)
        .map(([key, book]) => ({
          booksbyauthor: [{ isbn: parseInt(key), title: book.title, reviews: book.reviews }]
        }));
    }
    res.send(getBooksByAuthor(author))
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    function getBooksByTitle(title) {
      return Object.entries(books)
        .filter(([key, book]) => book.title === title)
        .map(([key, book]) => ({
          booksbytitle: [{ isbn: parseInt(key), author: book.author, reviews: book.reviews }]
        }));
    }
    res.send(getBooksByTitle(title))
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
