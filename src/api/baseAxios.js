import axios from 'axios';
import queryString from 'query-string'
import Auth from './auth'

function getAuthToken() {
    console.log(window.localStorage.getItem("accessToken"))
    return window.localStorage.getItem("accessToken")  ?? ""
  }

const baseAxios = axios.create({
    // baseURL: `${process.env.REACT_APP_URL}`,
    baseURL: `https://localhost:7154/api/`,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params)
});

baseAxios.interceptors.request.use(
    config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

// baseAxios.interceptors.response.use((response) => {
//     if (response && response.data) {
//         return response
//     }

//     return response
// }, (error) => {
//     const status = error.response ? error.response.status : null
//     const originalConfig = error.config
//     console.log("error", error)
//     // Access Token was expired
//     if (status === 401) {
//         return Auth.refreshToken().then(res => {
//             error.config.headers['Authorization'] = `Bearer ${getAuthToken()}`
//             return baseAxios(error.config)
//         })
//     }
//     if (status === 408) {
//         window.localStorage.clear()
//         window.location.href = '/login'
//         window.location.href = '/'
//     }
//     return Promise.reject(error)
// })

export default baseAxios;