import React, { useEffect, useState } from 'react';
import ReviewCard from './reviewCard';
import { getReviewsByASIN } from '../../services/reviewService';

export default function Reviews(props) {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await getReviewsByASIN(props.location.state.bookAsin);
                if (response.status === 200) {
                    setReviews(response.data);
                }
            } catch(err) {
                console.log(err);
            }
        })();
    }, [])

    return (
        <div className="container">
            <h2>Reviews:</h2>
            {reviews.length > 0  ? 
                reviews.map((item, key) => {
                    return <ReviewCard key={key} detail={item} />
                })
                :
                <p>No reviews for this book</p>
            }
        </div>
    );
}