import baseAxios from "./baseAxios"

export const GetScoreByStudentId = async(student_id, pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `ScoreSubject/GetScoreByStudentId/${student_id}&pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const GetScore = async(organization_id, year_id, semester_id, subject_id, class_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `ScoreSubject/GetScore?organization_id=${organization_id}&year_id=${year_id}&semester_id=${semester_id}&subject_id=${subject_id}&class_id=${class_id}`
    })
    return res.data
}