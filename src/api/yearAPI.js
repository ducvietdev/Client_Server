import baseAxios from "./baseAxios"

// Lấy danh sách lớp theo đơn vị
export const GetListYear = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Year/GetListYear`
    })
    return res.data
}