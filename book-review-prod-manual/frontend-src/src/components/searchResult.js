import React from 'react';
import Book from './book/book';

export default function SearchResult(props) {
    return (
        <div className="container">
            <h2>Search Result:</h2>
            {props.location.state && props.location.state.found && props.location.state.detail && props.location.state.detail.length > 0 ?
                 props.location.state.detail.map((book, key) => {
                     return <Book detail={book} key={key} />
                 })
                :
                <p>No book matches the title, please try again</p>
            }
        </div>
    );
}