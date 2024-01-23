import baseAxios from "./baseAxios"

// Lấy danh sách lớp theo đơn vị
export const GetListCourse = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Course/GetListCourse`
    })
    return res.data
}