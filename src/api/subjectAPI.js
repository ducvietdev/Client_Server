import baseAxios from "./baseAxios"

// Lấy danh sách lớp theo đơn vị
export const GetListSubjectBySemesterId = async(semester_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Subject/GetListSubjectBySemesterId/${semester_id}`
    })
    return res.data
}