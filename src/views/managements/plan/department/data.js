export const ListPlanDMColumns = [
    {
        name: 'ID',
        sortable: false,
        maxWidth: '10%',
        selector: row => row.id,
        center: true
    },
    {
        name: 'Mã kế hoạch',
        sortable: false,
        maxWidth: '20%',
        selector: row => row.plan_code,
        center: true
    },
    {
        name: 'Tên kế hoạch',
        sortable: false,
        maxWidth: '40%',
        selector: row => row.plan_name,
        center: true
    },
    {
        name: 'Mô tả',
        sortable: false,
        maxWidth: '40%',
        selector: row => row.description,
        center: true
    }
]