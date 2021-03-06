import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

class SearchPage extends Component {
  state = {
    query: '',
    searchResult: []
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() });
    const onShelf = this.props.curBooks;
    
    if (query.length === 0) {
      this.setState({searchResult: []});
    } else {
        BooksAPI.search(query)
        .then((books) => {
        if (!Array.isArray(books)) {
          books = [];
        }
        books.map((book, index) => {
          for (let shelfBook of onShelf) {
            if (book.id === shelfBook.id) {
              books[index] = shelfBook;
            }
          }
        });
        this.setState({searchResult: books});
        });
    }
  }

  render() {
    const query = this.state.query;
    const books = this.state.searchResult;
    const addBook = this.props.addNewBook;
    const onChangeShelf = this.props.onChangeShelf;
    
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/' className='close-search'>Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input 
              type="text" 
              placeholder="Search by title or author" 
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books.map((book) => (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover" 
                      style={book.imageLinks ? { width: 128, height: 193, backgroundImage: `url(${book.imageLinks.smallThumbnail})` } : 
                      { width: 128, height: 193, backgroundColor: 'white' }
                      }>
                    </div>
                    <div className="book-shelf-changer">
                      <select value={book.shelf ? book.shelf : 'none'} 
                        onChange={book.shelf ? (event) => onChangeShelf(book, event.target.value) : (event) => addBook(book, event.target.value)}>
                        <option value="move" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">{book.authors ? book.authors[0] : 'No author'}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchPage;