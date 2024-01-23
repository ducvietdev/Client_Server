import axios from "axios"
export default class Auth {
    static saveToken(token) {
        window.localStorage.setItem('accessToken', token)
    }

    static removeToken() {
        window.localStorage.removeItem('accessToken')
    }

    static async refreshToken() {
        // this.removeToken()
        const refreshToken = window.localStorage.getItem('refreshToken')
        const accessToken = window.localStorage.getItem('accessToken')
        try {
            const refreshRes = await axios.post('https://localhost:7154/api/UserLogin/RenewToken', {
                refreshToken: refreshToken.replace(/\\/g, '').replace(/"/g, ''),
                accessToken: accessToken.replace(/\\/g, '').replace(/"/g, '')
            })
            const newToken = refreshRes?.data?.accessToken
            if (!newToken) {
                return false
            }
            this.saveToken(newToken)
            return true
        } catch (e) {
            // this.removeToken()
            // window.location.href = '/login'
            // window.location.href = '/'
            console.log(e)
        }
    }
}