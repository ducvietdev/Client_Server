import baseAxios from "./baseAxios"

export const GetListUserHistory = async(pageSize, pageNumber) => {
    const res = await baseAxios({
        method: 'GET',
        url: `UserHistory/UserHistory?pageSize=${pageSize}&pageNumber=${pageNumber}`
    })
    return res.data
}

export const DeleteAllHistory = async() => {
    const res = await baseAxios({
        method: 'DELETE',
        url: `UserHistory/DeleteAll`
    })
    return res.data
}