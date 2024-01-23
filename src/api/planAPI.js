import baseAxios from "./baseAxios";

/// Loại kế hoạch
// Lấy danh sách loại kế hoạch
export const GetListPlanType = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `PlanType/GetListPlanType?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

/// Danh sách kế hoạch huấn luyện

export const GetListTrainingPlan = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `TrainingPlan/GetListTrainingPlan?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

/// Danh sách kế hoạch theo id đơn vị
export const GetListTrainingPlanByOrganizationId = async(pageSize, pageNumber, querySearch, organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `TrainingPlan/GetListTrainingPlanByOrganizationId/${organization_id}?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

/// Thêm kế hoạch
export const addTrainingPlan = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `TrainingPlan/AddTrainingPlan`,
        data: data
    })
    return res.data
}

// Cập nhật
export const updateTrainingPlan = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `TrainingPlan/UpdateTrainingPlan`,
        data: data
    })
    return res.data
}

// Xóa
export const deleteTrainingPlan = async(plan_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `TrainingPlan/DeleteTrainingPlan/${plan_id}`
    })
    return res.data
}

/// Lấy kế hoạch theo loại
export const GetTrainingPlans = async(type_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `TrainingPlan/GetTrainingPlanById?id=${type_id}`
    })
    return res.data
}
