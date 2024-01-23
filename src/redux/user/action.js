import axios from 'axios'
function getAuthToken() {
  return window.localStorage.getItem("access_token") ?? ""
}
// ** Get all Data
const getListUserLogin = (pageSize, pageNumber, querySearch) => {
  const url = process.env.REACT_APP_URL
  return async dispatch => {
    await axios.get(`${url}/UserLogin/GetListUserLogin?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch({
        type: 'GET_USER',
        data: response.data
      })
    })
  }
}

export {
    getListUserLogin
}