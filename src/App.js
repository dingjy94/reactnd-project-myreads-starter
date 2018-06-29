import React from 'react';
import * as BooksAPI from './BooksAPI';
import { Route } from 'react-router-dom';
import './App.css';
import SearchPage from './SearchPage.js';
import BookList from './BookList.js';

class BooksApp extends React.Component {
  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books });
    });
  }

  changeShelf = (book, value) => {
    const index = this.state.books.findIndex(cur => cur.id === book.id);
    const target = this.state.books.find(curBook => curBook.id === book.id);
    if (target.shelf) {
      target.shelf = value;
    }

    this.setState(state => ({
      books: state.books.slice(0, index).concat(state.books.slice(index + 1), [target])
    }));

    BooksAPI.update(book, value);
  }

  addBook = (book, value) => {
    BooksAPI.update(book, value);

    BooksAPI.get(book.id).then((book) => {
      this.setState(state => state.books.push(book));
    });
  }

  render() {
    return (
      <div className='app'>
        <Route exact path='/' render={() => (
          <BookList
            books={this.state.books}
            onChangeShelf={this.changeShelf}
          />
        )}/>
        <Route path='/search' render={() => (
          <SearchPage
            curBooks={this.state.books}
            addNewBook={this.addBook}
            onChangeShelf={this.changeShelf}
          />
        )}/>
      </div>
    );
  }
}

export default BooksApp;
