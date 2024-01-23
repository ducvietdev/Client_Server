import baseAxios from "./baseAxios";

// Lấy danh sách cán bộ
export const GetListMonitor = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Monitor/GetListMonitor?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Lấy danh sách cán bộ theo đơn vị
export const GetListMonitorByOrganizationId = async(organization_id, pageSize, pageNumber) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Monitor/GetListMonitorByOrganizationId?id=${organization_id}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    })
    return res.data
}

// Thêm mới cán bộ
export const addMonitor = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `Monitor/AddMonitor`,
        data: data
    })
    return res.data
}

// Cập nhật cán bộ
export const updateMonitor = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `Monitor/UpdateMonitor`,
        data: data
    })
    return res.data
}

// Lấy cán bộ theo id
export const getMonitorById = async(student_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Monitor/GetMonitorById/${student_id}`
    })
    return res.data
}

// Xóa cán bộ
export const DeleteMonitor = async(student_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `Monitor/DeleteMonitor/${student_id}`
    })
    return res.data
}


/// Lấy danh sách loại cán bộ
export const GetListMonitorType = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `MonitorType/GetListMonitorType`
    })
    return res.data
}
