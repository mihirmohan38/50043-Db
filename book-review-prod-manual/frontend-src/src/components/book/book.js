import React from 'react';
import '../../styles/home.scss';
import { Link } from 'react-router-dom';

export default function Book({detail}) {
    return (
        <div className="book">
            <Link to={{pathname:"/reviews", state: {bookAsin: detail.asin}}} className="book-details">
             { detail.imUrl.length < 10 ? 
                <img src="book_icon.png" alt="book" width="100" height="100"/>
                :
                <img src={detail.imUrl} alt="book" width="100" height="100"/>
              }   
            <h3>{detail.title}</h3>
            <p>
                {detail.asin}
            </p>
            <p>Price: {detail.price ? detail.price : 0} SGD</p>
            {/* <p>Brand: {detail.brand}</p> */}
            {/* <p>Category: {detail.categories}</p> */}
            </Link>
        </div>
    );
}