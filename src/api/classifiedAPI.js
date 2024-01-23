import baseAxios from "./baseAxios"

export const AverageScore = async(year_id, semester_id, organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `ClassifiedStudent/GetStudentScoresWithDynamicSubjects?year_id=${year_id}&semester_id=${semester_id}&organization_id=${organization_id}`
    })
    return res.data
}

export const ClassifiedStudent = async(year_id, semester_id, organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `ClassifiedStudent/GetStudentAverageScore?year_id=${year_id}&semester_id=${semester_id}&organization_id=${organization_id}`
    })
    return res.data
}