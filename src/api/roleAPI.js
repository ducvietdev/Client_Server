import baseAxios from "./baseAxios";

// Lấy danh sách học viên
export const GetListRole = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Role/GetListRole?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Xóa vai trò
export const DeleteRole = async(role_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `Role/DeleteRole/${role_id}`
    })
    return res.data
}