import axios from 'axios';
import { EXPRESS_BACKEND } from '../config/configuration';
import { getReviewsByASIN } from './reviewService';

export const createNewBook = async (data) => {
    try {
        const response = await axios.post(`${EXPRESS_BACKEND}/api/metaBooks`, data);
        return response;
    } catch(err) {
        console.log(err);
    }
}

export const getAllBooks = async () => {
    try {
         const response = await axios.get(`${EXPRESS_BACKEND}/api/metaBooks/100`);
         return response;
    } catch(err) {
        console.log(err);
    }
}

export const findBookByAsin = async (asin) => {
    try {
        const response = await axios.get(`${EXPRESS_BACKEND}/api/metaBooks/${asin}`);
        return response;
    } catch(err) {
        console.log(err);
    }
}

export const findBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`${EXPRESS_BACKEND}/api/metaBooksSearchByTitle?title=${title}`);
        return response;
    } catch(err) {
        console.log(err);
    }
}

const calculateAvgReviewsScore = (reviews) => {
    if (!reviews) {
        return;
    }
    if (reviews.length === 0) {
        return 0;
    }
    let total = 0;
    for (let review of reviews) {
        total += review.overall;
    }
    return total / reviews.length;
}

export const sortBooks = async (books, order) => {
    let books_with_reviews = [];
    try {
        for (let book of books) {
            const response = await getReviewsByASIN(book.asin);
            if (response.status === 200) {
                book.reviews = response.data;
                books_with_reviews.push(book);
            }
        }
        return order === "asc" ? books_with_reviews.sort((a, b) => calculateAvgReviewsScore(a.reviews) - calculateAvgReviewsScore(b.reviews)) : books.sort((a, b) => calculateAvgReviewsScore(b.reviews) - calculateAvgReviewsScore(a.reviews));
    } catch(err) {
        console.log(err);
    } 
}

export const findAllCategories = (books) => {
    if (!books) {
        return;
    }
    let all_categories = {};
    for (let book of books) {
        if (book.categories.length !== 0) {
            if (!all_categories[book.categories]) {
                all_categories[book.categories] = 1;
            } else {
                all_categories[book.categories] += 1;
            }
        }
    }
    return all_categories;
}

export const filterBooksByCategory = (books, category) => {
    if (!books) {
        return;
    }
    return books.filter((book) => book.categories.length !== 0 && book.categories[0][0] === category);
}
