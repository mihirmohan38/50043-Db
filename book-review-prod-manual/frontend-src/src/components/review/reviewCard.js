import React from 'react';
import '../../styles/home.scss';

export default function reviewCard({detail}) {
    /*
    const helpfulFormat = (helpful) => {
        return helpful[0] + '/' + helpful[helpful.length - 1];
    }

    const dateFormat = (date) => {
        if (date.includes(',')) {
            date = date.replace(',', '');
        }
        return date;
    }

    let formatedHelpful = helpfulFormat(detail.helpful);
    let formatedDate = dateFormat(detail.reviewTime);
    detail.helpful = formatedHelpful;
    detail.reviewTime = formatedDate;
    */

    return (
        <div className="review-card">
            <h3>{detail.reviewerName} </h3>
            <p>
                Overall Score: {detail.overall}
            </p>
            <p><i>"{detail.reviewText}"</i></p>
            <p>
                Summary: {detail.summary}
            </p>
            <p>
                Helpful: {detail.helpful}
            </p>
            {/*
            <p>
                Reviewed Date: {detail.reviewTime}
            </p>
            <p>{detail.unixReviewTime}</p> 
            */}
        </div>
    )
}
