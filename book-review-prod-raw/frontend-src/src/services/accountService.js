import axios from 'axios';
import { EXPRESS_BACKEND } from '../config/configuration';

export const signIn = async (data) => {
        try {
            let attempt = await axios.post(`${EXPRESS_BACKEND}/api/auth/signin`, data);
            return attempt;
        } catch(err) {
            console.log(err);
        }
}

export const signUp = async (data) => {
    try {
        let attempt = await axios.post(`${EXPRESS_BACKEND}/api/auth/signup`, data);
        return attempt;
    } catch(err) {
        console.log(err);
    }
}

export const logout = () => {
    if (localStorage.getItem('account')) {
        localStorage.removeItem('account');
        return true;
    }
    return false;
}