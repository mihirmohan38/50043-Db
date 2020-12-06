import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { postReview } from '../../services/reviewService';

export default function NewReview() {
    const { register, handleSubmit, errors } = useForm();
    const [loggedIn, setLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('account')) {
            setLoggedIn(true);
        }
    }, [])

    const submitReview = async (data) => {
        try {
            let response = await postReview(data);
            if (response.status === 200) {
                alert("New book's review added, thank you for contributing!");
                history.push('/');
            }
        } catch(err) {
            console.log(err);
            alert("Adding new review failed, please try again");
        } finally {
            history.go(0);
        }
    }

    return (
        <div className="container">
            <h2>New Review</h2>
            { loggedIn ?
                        <form onSubmit={handleSubmit(submitReview)}>
                            <div className="form-group">
                                <lablel>asin:</lablel>
                                <br/>
                                <input name="asin" ref={register({ required: {value: true, message: "Must input book's asin"}})} />
                                {errors.asin && errors.asin.type === "required" && (
                                    <div className="error text-danger">{errors.asin.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Helpful:</label>
                                <br/>
                                <input name="helpful" ref={register({ required: {value: true, message: "Must evaluate the helpfulness of the book"}})} />
                                {errors.helpful && errors.helpful.type === "required" && (
                                    <div className="error text-danger">{errors.helpful.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Review:</label>
                                <br/>
                                <textarea name="reviewText" ref={register({ required: {value: true, message: "Must input review text"}})} />
                                {errors.reviewText && errors.reviewText.type === "required" && (
                                    <div className="error text-danger">{errors.reviewText.message}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Overall:</label>
                                <br/>
                                <input name="overall" ref={register} />
                            </div>
                            <div className="form-group">
                                <label>Summary:</label>
                                <br/>
                                <textarea name="summary" ref={register} />
                            </div>
                            <input type="submit" className="btn btn-primary" />
                        </form>
                        :
                        <p>Please login to give review!</p>
            }
        </div>
    );
}