import { Edit, RefreshCcw, Trash } from "react-feather"
import { Badge, UncontrolledTooltip } from "reactstrap"

export const ListEquipmentUnitColumns = [
    {
        name: 'ID',
        sortable: false,
        maxWidth: '5%',
        selector: row => row.id,
        center: true
    },
    {
        name: 'Mã đơn vị tính',
        sortable: false,
        maxWidth: '20%',
        selector: row => row.unit_code,
        center: true
    },
    {
        name: 'Tên đơn vị tính',
        sortable: false,
        maxWidth: '40%',
        selector: row => row.unit_name,
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
        maxWidth: '5%',
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