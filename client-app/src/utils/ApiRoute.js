
// Utility function for making API requests
export const BASE_URL = 'http://localhost:8000'; // Replace with your actual API URL
const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

const apiRequest = async (url, method = 'GET', data = null,token=true) => {
    const headers = {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        'Authorization':'Bearer '+localStorage.getItem("Auth")
    };
    const options = {
        method,
        headers,
    };
    if(data) {
        if (data instanceof FormData) {
            options.body = data;
        } else {
            options.body = JSON.stringify(data);
        }
    }
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error; // Ensure the calling code receives the error
    }
};

// login
export const Login = (data) => apiRequest('/user/login', 'POST', data);
export const Register = (data) => apiRequest('/user/register', 'POST', data);
export const getCurrentUser = () => apiRequest('/user/get', 'GET');

//chat 
export const Listuser = () => apiRequest('/user/list', 'GET');
export const connectUser = (id) => apiRequest(`/user/connect/${id}`, 'GET');
export const connectList = () => apiRequest(`/user/connectlist`, 'GET');

//message Add
export const addMessage = (data) => apiRequest('/message/add', 'POST', data);
export const listMessage = (nodeID) => apiRequest('/message/list/'+nodeID, 'GET');


