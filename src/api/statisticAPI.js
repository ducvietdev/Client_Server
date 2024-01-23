import baseAxios from "./baseAxios"

export const GetTotalStudentsByAllCourses = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Statistic/GetTotalStudentsByAllCourses`
    })
    return res.data
}

export const GetTotalMonitorsByAllCourses = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Statistic/GetTotalMonitorsByAllCourses`
    })
    return res.data
}
