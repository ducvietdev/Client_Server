import baseAxios from "./baseAxios"

// Lấy danh sách học kỳ theo năm
export const GetListSemesterByYearId = async(year_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Semester/GetListSemesterByYearId/${year_id}`
    })
    return res.data
}