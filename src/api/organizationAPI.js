import baseAxios from "./baseAxios";

// Lấy danh sách đơn vị
export const GetListOrganization = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetListOrganization?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

export const GetListOrganizationLevel_3 = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetListOrganizationLevel3`
    })
    return res.data
}

export const addOrganization = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `Organization/AddOrganization`,
        data: data
    })
    return res.data
}

export const updateOrganization = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `Organization/UpdateOrganization`,
        data: data
    })
    return res.data
}

export const deleteOrganization = async(organization_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `Organization/DeleteOrganization/${organization_id}`
    })
    return res.data
}

/// Danh mục 
// Lấy danh sách học viên
export const GetListOrganizationType = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `OrganizationType/GetListOrganizationType?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Thêm danh mục
export const addOrganizationType = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `OrganizationType/AddOrganizationType`,
        data: data
    })
    return res.data
}

// Cập nhật danh mục
export const updateOrganizationType = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `OrganizationType/UpdateOrganizationType`,
        data: data
    })
    return res.data
}

// Lấy danh mục theo id
export const GetOrganizationTypeById = async(organization_type_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `OrganizationType/GetOrganizationTypeById/${organization_type_id}`,
        data: data
    })
    return res.data
}

// Xóa danh mục
export const DeleteOrganizationType = async(organization_type_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `OrganizationType/DeleteOrganizationType/${organization_type_id}`
    })
    return res.data
}

/// Lấy đơn vị cấp cao hơn
export const GetHigherLevelOrganizations = async(organization_level_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetHigherLevelOrganizations/${organization_level_id}`
    })
    return res.data
}

/// OrganizationTree
export const GetOrganizationHierarchy = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetOrganizationHierarchy`
    })
    return res.data
}

/// OrganizationLevel
export const GetListOrganizationLevel = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `OrganizationLevel/GetListOrganizationLevel`
    })
    return res.data
}

// Lấy ra cấp trên trực tiếp và cấp dưới của đơn vị
export const GetSubordinatesAndSuperior = async(organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetSubordinatesAndSuperior/${organization_id}`
    })
    return res.data
}

/// Lấy ra cấp đv theo id đơn vị
export const GetListLevelByOrganizationId = async(organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `OrganizationLevel/GetListLevelByOrganizationId/${organization_id}`
    })
    return res.data
}

// Lấy ra đơn vị mình và đơn vị cấp dưới theo id đơn vị mình
export const GetOgAndSubOgs = async(organization_id, pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetOgAndSubOgs/${organization_id}?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Lấy ra đơn vị mình và đơn vị cấp dưới tất cả và cấp trên trực tiếp
export const GetParentOgAndOgAndSubOgs = async(organization_id, pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Organization/GetParentOgAndOgAndSubOgs/${organization_id}?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}
