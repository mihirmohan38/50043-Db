import axios from 'axios';
import { EXPRESS_BACKEND } from '../config/configuration';

export const getAllReviews = async () => {
    try {
        const response = await axios.get(`${EXPRESS_BACKEND}/api/reviews`);
        return response;
    } catch(err) {
        console.log(err);
    }
}

export const filterReviewsByAsin = (reviews, asin) => {
    return reviews.filter((review) => review.asin === asin);
}

export const getReviewsByASIN = async (asin) => {
    try {
        const response = await axios.get(`${EXPRESS_BACKEND}/api/reviewsByAsin/?asin=${asin}`);
        return response;
    } catch(err) {
        console.log(err);
    }
}

const processReview = (data, reviewerID, reviewerName) => {
    data.reviewerID = reviewerID;
    data.reviewerName = reviewerName;
    // data.unixReviewTime = new Date().getTime();
    // let currentDate = new Date();
    // data.reviewTime = `${currentDate.getMonth() + 1} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    return data;
}

export const postReview = async (data) => {
    const accessToken = JSON.parse(localStorage.getItem('account')).accessToken;
    const reviewerID = JSON.parse(localStorage.getItem('account')).reviewerID;
    const reviewerName = JSON.parse(localStorage.getItem('account')).username;
    data = processReview(data, reviewerID, reviewerName);
    const config = {
        headers: {
            "x-access-token": accessToken
        }
    }
    try {
        let response = await axios.post(`${EXPRESS_BACKEND}/api/reviews`, data, config);
        return response;
    } catch(err) {
        console.log(err);
    }
}