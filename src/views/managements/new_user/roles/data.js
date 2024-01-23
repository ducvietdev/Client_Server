import { Badge } from "reactstrap"

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}


export const ListUserRoleColumns = [
    {
        name: 'ID',
        sortable: false,
        maxWidth: '10%',
        selector: row => row.id,
        center: true
    },
    {
        name: 'Tên vai trò',
        sortable: false,
        maxWidth: '20%',
        selector: row => row.role_name,
        center: true
    },
    {
        name: 'Mô tả',
        sortable: false,
        maxWidth: '40%',
        selector: row => row.description,
        center: true
    },
    {
        name: 'Trạng thái',
        sortable: false,
        maxWidth: '30%',
        selector: row => row.status,
        cell: row => {
            return (
                <Badge color={status[row.status].color} pill>
                    {status[row.status].title}
                </Badge>
            )
        },
        center: true
    }
]