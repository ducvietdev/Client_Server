import baseAxios from "./baseAxios";

// Lấy danh sách cán bộ
export const GetListState = async() => {
    const res = await baseAxios({
        method: 'GET',
        url: `State/GetListState`
    })
    return res.data
}