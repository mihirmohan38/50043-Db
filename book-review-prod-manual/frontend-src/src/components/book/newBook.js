import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { createNewBook } from '../../services/bookService';

export default function NewBook() {
    const { register, handleSubmit, errors } = useForm();
    const [loggedIn, setLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('account')) {
            setLoggedIn(true);
        }
    }, [])

    const submitBook = async (data) => {
        try {
            let response = await createNewBook(data);
            if (response.status === 201) {
                alert("New book added to the database, thank you for contributing!");
                history.push('/');
            }
        } catch(err) {
            console.log(err);
            alert("Adding new book failed, please try again");
        } finally {
            history.go(0);
        }
    }

    return (
        <div className="container">
            <h2>New Book</h2>
            { loggedIn ?
                        <form onSubmit={handleSubmit(submitBook)}>
                            <div className="form-group">
                                <lablel>asin:</lablel>
                                <br/>
                                <input name="asin" ref={register({ required: {value: true, message: "Must input book's asin"}})} />
                                {errors.asin && errors.asin.type === "required" && (
                                    <div className="error text-danger">{errors.asin.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <br/>
                                <input name="title" ref={register({ required: {value: true, message: "Must input book's title"}})} />
                                {errors.title && errors.title.type === "required" && (
                                    <div className="error text-danger">{errors.title.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <br/>
                                <input name="price" ref={register({ required: {value: true, message: "Must input book's price"}})} />
                                {errors.price && errors.price.type === "required" && (
                                    <div className="error text-danger">{errors.price.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Brand:</label>
                                <br/>
                                <input name="brand" ref={register({ required: {value: true, message: "Must input book's brand"}})} />
                                {errors.brand && errors.brand.type === "required" && (
                                    <div className="error text-danger">{errors.brand.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Category:</label>
                                <br/>
                                <input name="categories" ref={register({ required: {value: true, message: "Must input book's category"}})} />
                                {errors.categories && errors.categories.type === "required" && (
                                    <div className="error text-danger">{errors.categories.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Image (Please provide URL):</label>
                                <br/>
                                <input name="imUrl" ref={register({maxLength: { value: 255, message: "The image url is too long" }})} />
                                {errors.imUrl && errors.imUrl.type === "maxLength" && (
                                    <div className="error text-danger">{errors.imUrl.message}</div>
                                )}
                            </div>
                            <input type="submit" className="btn btn-primary" />
                        </form>
                        :
                        <p>Please login to add a new book to the database!</p>
            }
        </div>
    );
}