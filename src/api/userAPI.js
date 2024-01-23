import baseAxios from "./baseAxios";

// Lấy danh sách học viên
export const GetListUserLogin = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `UserLogin/GetListUserLogin?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const addUserLogin = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `UserLogin/AddUserLogin`,
        data: data
    })
    return res.data
}

export const updateUserLogin = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `UserLogin/UpdateUserLogin`,
        data: data
    })
    return res.data
}

// Xóa người dùng
export const DeleteUserLogin = async(role_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `UserLogin/DeleteUserLogin/${role_id}`
    })
    return res.data
}

// Đăng nhập
export const SignIn = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `UserLogin/Login`,
        data: data
    })
    return res.data
}