import axios from 'axios';
import { FLASK_BACKEND } from '../config/configuration';

export const analyticalJob = async () => {
    try {   
        const response = await axios.get(`${FLASK_BACKEND}/spark`);
        return response;
    } catch(err) {
        console.log(err);
    }
}