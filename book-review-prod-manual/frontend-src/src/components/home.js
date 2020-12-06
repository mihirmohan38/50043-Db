import React, { useState, useEffect } from 'react'
import Pagination from 'react-js-pagination';
import { useHistory } from 'react-router-dom';
import Book from './book/book';
import { getAllBooks, sortBooks, findAllCategories, filterBooksByCategory } from '../services/bookService';
import '../styles/home.scss';

export default function Home() {

    const [books, setBooks] = useState([]);
    const [booksCopy, setBooksCopy] = useState([]);

    const [categories, setCategories] = useState({});

    const [activePage, setActivePage] = useState(1);

    const [itemPerPage, setItemPerPage] = useState(6);

    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllBooks();
                if (response.status === 200) {
                    setBooksCopy(response.data);
                    setBooks(response.data);
                    setCategories(findAllCategories(response.data));
                }
            } catch(err) {
                console.log(err);
            }
        })()
    }, [])

    const truncateText = (text) => {
        if (text.length > 50) {
            return text.substring(0, 51) + '...';
        }
        return text;
    }

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    const handleCategoryChange = (e) => {
        setBooks(filterBooksByCategory(booksCopy, e.target.value));
        setActivePage(1);
    }

    let end = itemPerPage * activePage;
    let start = end - (itemPerPage - 1);
    let allBooks = [];
    if (end > books.length) {
        end = (end- itemPerPage) + (itemPerPage - (end - books.length));
    }
    for (let i = start - 1; i < end; i++) {
        allBooks.push(books[i]);
    }

    return (
        <div className="container home-section">
                {allBooks.length > 0 ? 
                    <div className="container">
                        <div className="d-flex flex row">
                            <p className="text-dark mr-2">Sort By: </p>
                            <p 
                            className="text-info mr-4" 
                            style={{cursor: "pointer"}} 
                            onClick={async () => {
                                setBooks( await sortBooks(books, "asc"));
                                history.push('/'); 
                                }}
                            >
                                Reviews (Low To High)
                            </p>
                            <p 
                            className="text-info mr-4" 
                            style={{cursor: "pointer"}} 
                            onClick={async () => { 
                                setBooks( await sortBooks(books, "desc"));
                                history.push('/');
                            }}
                            >
                                Reviews (High To Low)
                            </p>
                        </div>
                        <div className="d-flex flex row">
                            <p className="text-dark mr-2">Category: </p>
                            <p className="text-info mr-4" style={{cursor: "pointer"}} onClick={() => history.go(0)}>All</p>
                            <div className="form-group">
                            <select className="mdb-select md-form" onChange={handleCategoryChange}>
                            {categories && Object.keys(categories).length > 0 && (
                                Object.keys(categories).map((category, key) => {
                                    return <option 
                                            key={key} 
                                            value={category}
                                            >
                                                    {truncateText(category)} ({categories[category]})
                                            </option>
                                })
                            )}
                            </select>
                            </div>
                        </div>
                        <div className="pagination-button">
                            <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemPerPage}
                                totalItemsCount={books.length}
                                pageRangeDisplayed={2}
                                linkClass="page-link"
                                onChange={handlePageChange}
                                
                            />
                        </div>
                    </div>
                    :
                    <div className="container-fluid">
                        <br/>
                        <h2 style={{textAlign: "center"}}>
                            “For victory in life, we’ve got to keep focused on the goal, and the goal is Heaven.” 
                            <br/>
                            — Lou Holtz
                        </h2>
                    </div>
                }
            <div className="review-list">
                {allBooks.map((item, key) => 
                    <Book key={key} detail={item} />
                )} 
            </div>
        </div>
    )
}