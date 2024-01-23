import baseAxios from "./baseAxios";

/// Đơn vị tính
// Lấy danh sách học viên
export const GetListEquipmentUnit = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `EquipmentUnit/GetListEquipmentUnit?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Xóa vai trò
export const DeleteEquipmentUnit = async(equipment_unit_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `EquipmentUnit/DeleteEquipmentUnit/${equipment_unit_id}`
    })
    return res.data
}

/// Danh mục
// Danh sách danh mục
export const GetListEquipmentType = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `EquipmentType/GetListEquipmentType?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Thêm danh mục
export const addEquipmentType = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `EquipmentType/AddEquipmentType`,
        data: data
    })
    return res.data
}

// Cập nhật danh mục
export const updateEquipmentType = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `EquipmentType/UpdateEquipmentType`,
        data: data
    })
    return res.data
}

// Lấy danh mục theo Id
export const GetEquipmentTypeById = async(equipment_type_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `EquipmentType/GetEquipmentTypeById/${equipment_type_id}`,
        data: data
    })
    return res.data
}

// Xóa danh mục
export const DeleteEquipmentType = async(equipment_type_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `EquipmentType/DeleteEquipmentType/${equipment_type_id}`
    })
    return res.data
}

/// Trang thiết bị
// Danh sách thiết bị
export const GetListEquipment = async(pageSize, pageNumber, querySearch) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Equipment/GetListEquipment?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}`
    })
    return res.data
}

// Thêm thiết bị
export const addEquipment = async(data) => {
    const res = await baseAxios({
        method: 'POST',
        url: `Equipment/AddEquipment`,
        data: data
    })
    return res.data
}

export const updateEquipment = async(data) => {
    const res = await baseAxios({
        method: 'PUT',
        url: `Equipment/UpdateEquipment`,
        data: data
    })
    return res.data
}

// Xóa thiết bị
export const DeleteEquipment = async(equipment_type_id) => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `Equipment/DeleteEquipment/${equipment_type_id}`
    })
    return res.data
}

// Lấy thiết bị theo id đơn vị
export const GetListEquipmentByOrganizationId = async(pageSize, pageNumber, querySearch, organization_id) => {
    const res = await baseAxios({
        method: 'GET',
        url: `Equipment/GetListEquipmentByOrganizationId?pageSize=${pageSize}&pageNumber=${pageNumber}&querySearch=${querySearch}&id=${organization_id}`
    })
    return res.data
}