import axios from 'axios';
import Cookies from 'js-cookie';
const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/register', userData);
        return response;
    } catch (error) {
        throw error;
    }
};

const verify = async (email, code) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/verify', {
            email: email,
            code: code
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/login', {
            email,
            password
        },
            {
                withCredentials: true
            });
        const { accessToken, refreshToken, userId } = response.data;

        Cookies.set('accessToken', accessToken, { expires: 1 / 24 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
        localStorage.setItem('userId', userId);

        return response.data;
    } catch (error) {
        throw error;
    }
};

const logOut = async (userId, accessToken) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/logOut', { userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true,
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error Log Out: ', error.response || error.message);
        throw error;
    }
};

const resetPassword = async (userId, password, passwordnew, accessToken) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/resetPassword', { userId, password, passwordnew }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true,
        });
        console.log(response)
    } catch (error) {
        console.error('Error in resetPassword function:', error);

        throw error.response?.data || {
            message: 'Không thể kết nối đến server',
            status: 500,
        };
    }
};

export { registerUser };
export { verify };
export { loginUser };
export { logOut };
export { resetPassword };