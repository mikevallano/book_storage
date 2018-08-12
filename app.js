
const bookForm = document.getElementById('book-form'),
      titleInput = document.getElementById('title'),
      authorInput = document.getElementById('author'),
      isbnInput = document.getElementById('isbn'),
      bookTable = document.getElementById('book-list');
let errorDiv;
let allBooks;

// Book constructor
function Book(obj){
  this.title = obj.title;
  this.author = obj.author;
  this.isbn = obj.isbn;
}

// UI constructor
function Ui(book){
  this.book = book
}

document.addEventListener('DOMContentLoaded', function(){
  if (localStorage.getItem('books') != null) {
    allBooks = JSON.parse(localStorage.getItem('books'))
    addBooksFromStorage(allBooks)
  } else {
    allBooks = {}
  }
})


addBooksFromStorage = function(books){
  Object.keys(books).forEach(function(key, index){
    ui = new Ui(books[key])
    ui.addBookToTable()
  })
}

// Ui prototype
Ui.prototype.addBookToTable = function(){
  // let newRow = bookTable.insertRow(),
  //     newCell,
  //     cellContents
  // Object.keys(book).forEach(function(key, index) {
  //   newCell = newRow.insertCell(index);
  //   cellContents = document.createTextNode(book[key])
  //   newCell.appendChild(cellContents)
  // });

  let row = document.createElement('tr')
  row.id = this.book.isbn
  row.innerHTML = `
    <td>${this.book.title}</td>
    <td>${this.book.author}</td>
    <td>${this.book.isbn}</td>
    <td><a href='#' class='delete'>x</a></td>
  `
  bookTable.appendChild(row)
}

Ui.prototype.addBookToAllBooks = function(){
  allbooks[this.book.isbn] = this.book
  localStorage.setItem('books', JSON.stringify(allBooks))
}

Ui.prototype.removeBookFromAllBooks = function(isbn){
  delete allBooks[isbn]
  localStorage.setItem('books', JSON.stringify(allBooks))
  console.log('book removed. allbooks: ', allBooks)
}

Ui.prototype.removeRowFromTable = function(row) {
  row.parentElement.removeChild(row)
}

Ui.prototype.clearInputs = function(){
  bookForm.reset()
}

Ui.prototype.validateInput = function(){
  let inputs = bookForm.getElementsByTagName('input')
  let invalidInputs = Array.from(inputs).filter(function(input){
    return input.value.length < 1
  })
  invalidInputs.forEach(function(input){
    input.classList.add('input-error')
  })
  let invalidInputNames = invalidInputs.map(function(input){
    return input.previousElementSibling.innerText
  })
  if (invalidInputs.length > 0) {
    this.addErrorMessage(`Please enter data for misisng fields: ${invalidInputNames.join(', ')}`)
    return false
  } else {
    let isbns = Object.keys(allBooks)
    if (isbns.includes(isbnInput.value)) {
      this.addErrorMessage('ISBN already in the database.')
      return false
    }
    return true
  }
}

Ui.prototype.addErrorMessage = function(message){
  errorDiv = document.createElement('div')
  errorDiv.classList = 'error'
  errorDiv.innerText = message
  bookForm.parentNode.insertBefore(errorDiv, bookForm);
}

// Event listeners
bookForm.addEventListener('keyup', function(e){
  let input = e.target
  if (input.value.length > 0) {
    input.classList.remove('input-error')
    if (typeof errorDiv != 'undefined'){
      errorDiv.remove()
    }
  }
})

bookForm.addEventListener('submit', function(e){
  e.preventDefault()
  let title = titleInput.value,
      author = authorInput.value,
      isbn = isbnInput.value

  let newBook = new Book({'title': title, 'author': author, 'isbn': isbn})

  let ui = new Ui(newBook)
  let isValid = ui.validateInput()
  if (isValid){
    ui.addBookToTable()
    ui.addBookToAllBooks()
    ui.clearInputs()
  }
})

bookTable.addEventListener('click', function(e){
  if (e.target.classList.contains('delete')) {
    e.preventDefault()
    let rowToRemove = e.target.closest('tr');
    let isbn = rowToRemove.id
    let ui = new Ui(allBooks[isbn])
    ui.removeRowFromTable(rowToRemove)
    ui.removeBookFromAllBooks(isbn)
  }
})
