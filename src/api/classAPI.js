import baseAxios from "./baseAxios"

// Lấy danh sách lớp theo đơn vị
export const GetListClassByOrganizationId = async(organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Class/GetListClassByOrganizationId/${organization_id}`
    })
    return res.data
}