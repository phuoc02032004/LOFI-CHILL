import axios from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api';

const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { loginUser };