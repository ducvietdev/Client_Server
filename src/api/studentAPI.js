import baseAxios from "./baseAxios";

// Lấy danh sách học viên
export const GetListStudent = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Student/GetListStudent?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Lấy danh sách học viên theo đơn vị
export const GetListStudentByOrganizationId = async(pageSize, pageNumber, querySearch, organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Student/GetListStudentByOrganizationId?id=${organization_id}&pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Thêm mới học viên
export const addStudent = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `Student/AddStudent`,
        data: data
    })
    return res.data
}

// Cập nhật học viên
export const updateStudent = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `Student/UpdateStudent`,
        data: data
    })
    return res.data
}

// Lấy học viên theo id
export const getStudentById = async(student_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Student/GetStudentById/${student_id}`
    })
    return res.data
}

// Xóa học viên
export const DeleteStudent = async(student_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `Student/DeleteStudent/${student_id}`
    })
    return res.data
}

// Tìm kiếm học viên
export const SearchStudent = async(search_query, pageSize, pageNumber) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Student/SearchStudent?searchQuery=${search_query}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    })
    return res.data
}