/// Student
import baseAxios from "./baseAxios"

// Lấy danh sách đơn vị là mình và cấp nhỏ hơn
export const GetOgDoubleById = async(organization_id, organization_levelId) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetOgByDoubleId?organization_id=${organization_id}&organization_levelId=${organization_levelId}`
    })
    return res.data
}