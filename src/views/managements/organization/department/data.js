import { Edit, RefreshCcw, Trash } from "react-feather"
import { Badge, UncontrolledTooltip } from "reactstrap"

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}


export const ListOrganizationDMColumns = [
    {
        name: 'ID',
        sortable: false,
        maxWidth: '10%',
        selector: row => row.id,
        center: true
    },
    {
        name: 'Tên danh mục đơn vị',
        sortable: false,
        maxWidth: '40%',
        selector: row => row.organization_name,
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
        name: 'Thao tác',
        sortable: false,
        maxWidth: '10%',
        selector: row => row.status,
        cell: row => {
            return (
                <div className='d-flex'>
                    <Trash className="me-1" color="#ed2e2f" size={15} id="btn-trash" />
                    <UncontrolledTooltip placement='top' target='btn-trash'>
                        Xóa
                    </UncontrolledTooltip>
                    <Edit className="" size={15} id="btn-edit" />
                    <UncontrolledTooltip placement='top' target='btn-edit'>
                        Sửa
                    </UncontrolledTooltip>
                </div>
            )
        },
        center: true
    }
]