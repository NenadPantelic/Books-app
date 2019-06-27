import React, { Component } from 'react';
import axios from 'axios';

//import logo from './logo.svg';
//import './App.css';

import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader, ButtonToolbar, Label, Input, FormGroup } from 'reactstrap';
import { NONAME } from 'dns';
class App extends Component {

  state = {
    books: [],
    newBookModal: false,
    editBookModal: false,
    newBook: {
      title: '',
      rating: 0
    },
    editBook: {
      id: null,
      title: '',
      rating: 0
    }
  }

  toggleNewBook() {
    this.setState({ newBookModal: !this.state.newBookModal });

  }

  toggleEditBook() {
    this.setState({ editBookModal: !this.state.editBookModal });

  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    axios.get("http://localhost:3000/books/")
      .then(response => { this.setState({ books: response.data }) });
  }

  addBook() {
    axios.post("http://localhost:3000/books/", this.state.newBook).then(response => {
      let books = this.state.books;
      books.push(response.data);
      this.setState({ books: books, newBook: { title: '', rating: 0 } });
      //this.refreshList();
      this.toggleNewBook();

    });
  }

  editBook(id, title, rating) {
    this.setState({ editBook: { id: id, title: title, rating: rating } });
    this.toggleEditBook();

  }

  updateBook() {
    let { title, rating } = this.state.editBook;
    axios.put("http://localhost:3000/books/" + this.state.editBook.id, {
      title: title,
      rating: rating
    }).then(response => {
      this.refreshList();
      this.toggleEditBook();
      this.setState({ editBook: { id: null, title: '', rating: 0 } });


    });

  }

  deleteBook(id) {

    axios.delete("http://localhost:3000/books/" + id).then(response => {
      this.refreshList();
    })

  }
  render() {
    let books = this.state.books;

    return (
      <div className="App container">
        <h1> Books app</h1>
        <Button className="my-3" color="primary" onClick={this.toggleNewBook.bind(this)}>Add Book</Button>
        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBook.bind(this)} >
          <ModalHeader toggle={this.toggleNewBook.bind(this)}>Add a new book</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="text" name="title" id="title" placeholder="book title" value={this.state.newBook.title} onChange={(e) => {
                let newBookData = this.state.newBook;
                newBookData.title = e.target.value;
                this.setState({ newBook: newBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input type="text" name="rating" id="rating" placeholder="rating" value={this.state.newBook.rating} onChange={(e) => {
                let newBookData = this.state.newBook;
                newBookData.rating = e.target.value;
                this.setState({ newBook: newBookData });
              }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add book</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewBook.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBook.bind(this)} >
          <ModalHeader toggle={this.toggleEditBook.bind(this)}>Edit book</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="text" name="title" id="title" value={this.state.editBook.title} onChange={(e) => {
                let newBookData = this.state.editBook;
                newBookData.title = e.target.value;
                this.setState({ editBook: newBookData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input type="text" name="rating" id="rating" placeholder="rating" value={this.state.editBook.rating} onChange={(e) => {
                let newBookData = this.state.editBook;
                newBookData.rating = e.target.value;
                this.setState({ editBook: newBookData });
              }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBook.bind(this)}>Update book</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditBook.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Table>
          <thead>
            <tr>
              <th> #</th>
              <th> Title</th>
              <th> Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book =>
              <tr key={book.id}>

                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.rating}</td>
                <ButtonToolbar>
                  <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.rating)}>Edit</Button>
                  <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, book.id)}>Delete</Button>
                </ButtonToolbar>
              </tr>)}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default App;
