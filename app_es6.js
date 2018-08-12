const bookForm = document.getElementById('book-form'),
      titleInput = document.getElementById('title'),
      authorInput = document.getElementById('author'),
      isbnInput = document.getElementById('isbn'),
      bookTable = document.getElementById('book-list');
let messageDiv;
let allBooks;

class Book {
  constructor(obj){
    this.title = obj.title
    this.author = obj.author
    this.isbn = obj.isbn
  }
}

addBooksFromStorage = function(books){
  Object.keys(books).forEach(function(key, index){
    ui = new Ui(books[key])
    ui.addBookToTable('storage')
  })
}

class Ui {
  constructor(book){
    this.book = book
  }

  validateInput(){
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
      this.showMessage(`Please enter data for misisng fields: ${invalidInputNames.join(', ')}`, 'error')
      return false
    } else {
      let isbns = Object.keys(allBooks)
      if (isbns.includes(isbnInput.value)) {
        this.showMessage('ISBN already in the database.', 'error')
        return false
      }
      return true
    }
  }

  clearInputs(){
    bookForm.reset()
  }

  addBookToTable(trigger){
    let row = document.createElement('tr')
    row.id = this.book.isbn
    row.innerHTML = `
      <td>${this.book.title}</td>
      <td>${this.book.author}</td>
      <td>${this.book.isbn}</td>
      <td><a href='#' class='delete'>x</a></td>
    `
    bookTable.appendChild(row)
    if (trigger == 'form') {
      this.showMessage('Book successfully added.', 'success')
    }
  }

  addBookToAllBooks(){
    let key = this.book.isbn
    allBooks[key] = {author: this.book.author, title: this.book.title, isbn: this.book.isbn}
    localStorage.setItem('books', JSON.stringify(allBooks))
  }

  removeBookFromAllBooks(isbn){
    delete allBooks[isbn]
    localStorage.setItem('books', JSON.stringify(allBooks))
  }

  removeRowFromTable(row){
    row.parentElement.removeChild(row)
  }

  showMessage(message, msgClass){
    messageDiv = document.createElement('div')
    messageDiv.classList = msgClass
    messageDiv.innerText = message
    bookForm.parentNode.insertBefore(messageDiv, bookForm);
    setTimeout(function(){
      messageDiv.remove()
    }, 3000)
  }
}

bookForm.addEventListener('keyup', function(e){
  let input = e.target
  if (input.value.length > 0) {
    input.classList.remove('input-error')
    if (typeof errorDiv != 'undefined'){
      errorDiv.remove()
    }
  }
})

// Event listeners
document.addEventListener('DOMContentLoaded', function(){
  if (localStorage.getItem('books') != null) {
    allBooks = JSON.parse(localStorage.getItem('books'))
    addBooksFromStorage(allBooks)
  } else {
    allBooks = {}
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
    ui.addBookToTable('form')
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
