import axios from 'axios';

export default class Api {
    constructor(credential) {
        this.apiUrl = import.meta.env.VITE_SERVER_URL;
        this.credential = credential;
        let headers = {
            Accept: 'application/json',
        };
        if (this.credential) {
            headers.Authorization = `Bearer ${this.credential}`;
        }
        this.client = axios.create({
            baseURL: this.apiUrl,
            timeout: 31000,
            headers: headers,
        });
    };

    // example get request
    getExample = () => {
        return this.client.get('/example');
    };
}