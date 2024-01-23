import baseAxios from "./baseAxios"

// Lấy danh sách lớp theo đơn vị
export const GetTraineesByTrainingPlanId = async(plan_id, pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `PracticePlans/GetTraineesByTrainingPlanId/${plan_id}?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const GetListResultAttendance = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `PracticePlans/GetListResultAttendance?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const GetListResultAttendanceById = async(plan_id, pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `PracticePlans/GetListResultAttendanceById/${plan_id}?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const MarkAttendance = async(plan_id, student_id) => {
    const res = await baseAxios({
        method: 'POST',
        url: `PracticePlans/MarkAttendance?plan_id=${plan_id}&student_id=${student_id}`
    })
    return res.data
}