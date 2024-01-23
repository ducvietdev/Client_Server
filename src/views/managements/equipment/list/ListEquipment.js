// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Edit, Trash } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'
import Select from 'react-select'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, Button, Badge, UncontrolledTooltip } from 'reactstrap'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useNavigation } from '../../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { DeleteEquipment, GetListEquipment, GetListEquipmentByOrganizationId } from '../../../../api/equipmentAPI'
import AddEquipment from './AddEquipment'
import EditEquipment from './EditEquipment'
import { GetOgDoubleById } from '../../../../api/permission'
import { useSelector } from 'react-redux'

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}

const ListEquipment = () => {
    const actions = {
        name: 'Thao tác',
        sortable: false,
        maxWidth: '10%',
        selector: row => row.status,
        cell: row => {
            return (
                <div className='d-flex'>
                    <Trash onClick={() => handleDeleteModal(row.id)} className="me-1" color="#ed2e2f" size={15} id="btn-trash" />
                    <UncontrolledTooltip placement='top' target='btn-trash'>
                        Xóa
                    </UncontrolledTooltip>
                    <Edit onClick={() => handleEditModal(row)} className="" size={15} id="btn-edit" />
                    <UncontrolledTooltip placement='top' target='btn-edit'>
                        Sửa
                    </UncontrolledTooltip>
                </div>
            )
        },
        center: true
    }
    // ** Data
    const ListEquipmentColumns = [
        {
            name: 'STT',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.id,
            cell: (row, index) => <span>{(dataPage.pageNumber - 1) * (dataPage.pageSize) + index + 1}</span>,
            center: true
        },
        {
            name: 'Tên thiết bị viết tắt',
            sortable: false,
            maxWidth: '15%',
            selector: row => row.code,
            center: true
        },
        {
            name: 'Tên thiết bị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.name,
            center: true
        },
        {
            name: 'Chất lượng',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.quality,
            center: true
        },
        {
            name: 'Năm sử dụng',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.yearUse,
            center: true
        },
        {
            name: 'Đơn vị tính',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.unitName,
            center: true
        },
    
    ]

    // ** State
    const ogRef = useRef()
    const dataLogin = useSelector(state => state.auth)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    
    const handleAddModal = () => setAddModal(!addModal)
    
    const [listEquipment, setListEquipment] = useState([])
    const [editEquipment, setEditEquipment] = useState({})
    const [listOrganization, setListOrganization] = useState([])
    const [valueOg, setValueOg] = useState({})
    dataLogin.userData.organizationId === valueOg ? ListEquipmentColumns.push(actions) : ListEquipmentColumns
    const handleEditModal = (data) => {
        setEditEquipment(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditEquipment(null)
        setEditModal(false)
    }
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: '',
        organizationId: dataLogin?.userData.organizationId
    })

    const getData = () => {
        // GetListEquipment(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
        //     setListEquipment(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        GetListEquipmentByOrganizationId(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch, dataPage.organizationId).then(result => {
            setListEquipment(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
        GetOgDoubleById(dataLogin?.userData.organizationId, dataLogin?.userData.levelId).then(result => {
            const organizations = result?.map(item => {
                return {
                    value: item.id,
                    label: item.organization_Name
                }
            })
            // organizations.unshift({ value: 0, label: 'Tất cả' })
            setListOrganization(organizations)
        }).catch(error => {
            console.log(error)
        })
    }, [dataPage, dataLogin])

    const handleDeleteModal = (id) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa thiết bị này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                DeleteEquipment(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa thiết bị thành công!',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    }
                    getData()
                }).catch(error => {
                    console.log(error)
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không xóa thiết bị!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })
    }

    // ** Hooks
    const { t } = useTranslation()

    // ** Function to handle pagination
    const handlePagination = page => {
        const currentPage = page.selected + 1
        setDataPage({
            ...dataPage, pageNumber: currentPage
        })
    }

    const handleChangeSearch = (e) => {
        const querySearch = e.target.value
        // GetListEquipmentByOrganizationId(dataPage.pageSize, dataPage.pageNumber, querySearch, dataLogin.userData.organizationId).then(result => {
        //     setListEquipment(result)
        //     setFilteredData(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        setDataPage({ ...dataPage, querySearch: querySearch })
    }

    const handleChangeOrganization = (value) => {
        if (value.value !== 0) {
            setValueOg(value.value)
            GetListEquipmentByOrganizationId(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch, value.value).then(result => {
                setListEquipment(result)
                setDataPage({...dataPage, organizationId: value.value})
            }).catch(error => {
                console.log(error)
            })
            // return dataLogin.userData.organizationId === value.value ? ListEquipmentColumns.push(actions) : ListEquipmentColumns
        }
        //  else {
        //     return getData()
        // }
    }
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        const status = {
            1: { title: 'Current', color: 'light-primary' },
            2: { title: 'Professional', color: 'light-success' },
            3: { title: 'Rejected', color: 'light-danger' },
            4: { title: 'Resigned', color: 'light-warning' },
            5: { title: 'Applied', color: 'light-info' }
        }

        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.post.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.email.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.age.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
                    status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.full_name.toLowerCase().includes(value.toLowerCase()) ||
                    item.post.toLowerCase().includes(value.toLowerCase()) ||
                    item.email.toLowerCase().includes(value.toLowerCase()) ||
                    item.age.toLowerCase().includes(value.toLowerCase()) ||
                    item.salary.toLowerCase().includes(value.toLowerCase()) ||
                    item.start_date.toLowerCase().includes(value.toLowerCase()) ||
                    status[item.status].title.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }

    // ** Pagination Previous Component
    const Previous = () => {
        return (
            <Fragment>
                <span className='align-middle d-none d-md-inline-block'>{t('Trước')}</span>
            </Fragment>
        )
    }

    // ** Pagination Next Component
    const Next = () => {
        return (
            <Fragment>
                <span className='align-middle d-none d-md-inline-block'>{t('Sau')}</span>
            </Fragment>
        )
    }

    // ** Custom Pagination Component
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel={<Previous size={15} />}
            nextLabel={<Next size={15} />}
            forcePage={dataPage.pageNumber - 1}
            onPageChange={page => handlePagination(page)}
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listEquipment.count / 10) || 1}
            pageCount={Math.ceil(listEquipment.count / 10)}
            breakLabel={'...'}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName={'active'}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName={'pagination react-paginate pagination-sm justify-content-end pe-1 mt-1'}
        />
    )

    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }
    return (
        <>
            <Breadcrumb className='breadcrumb__page'>
                <BreadcrumbItem>
                    <Button className='btn breadcrumb__btn' onClick={handleNavigationHome}>Trang chủ</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='#'> Trang thiết bị </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Danh mục </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__equipment'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách trang thiết bị</CardTitle>
                    {dataLogin.userData.organizationId === valueOg ? (
                        <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={handleAddModal}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm trang thiết bị</span>
                        </Button>
                    </div>
                    ) : <div></div>}
                </CardHeader>
                <Row className='justify-content-end mx-0 input__features'>
                    <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__select' md='4' sm='12'>
                        <Label className='me-1 label__select'>
                            Đơn vị
                        </Label>
                        <Select
                            ref={ogRef}
                            defaultValue={valueOg}
                            className='react-select'
                            classNamePrefix='select'
                            options={listOrganization}
                            placeholder="Chọn đơn vị ..."
                            onChange={handleChangeOrganization}
                        />
                    </Col>
                    <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search' md='4' sm='12'>
                        <Label className='me-1 label__search' for='search-input-1'>
                            {t('Tìm kiếm')}
                        </Label>
                        <Input
                            className='dataTable-filter'
                            type='text'
                            bsSize='sm'
                            id='search-input-1'
                            value={dataPage.querySearch}
                            onChange={(e) => handleChangeSearch(e)}
                        />
                    </Col>
                </Row>
                <div className='react-dataTable whole-table__equipment'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListEquipmentColumns}
                        className='react-dataTable table__equipment'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // data={dataPage.querySearch.length ? filteredData.list : listEquipment.list}            
                        data={listEquipment.list}
                    />
                </div>
            </Card>
            <AddEquipment open={addModal} handleAddModal={handleAddModal} getData={getData} />
            {editEquipment && <EditEquipment open={editModal} handleCloseModal={handleCloseModal} handleEditModal={handleEditModal} editEquipment={editEquipment} getData={getData} />}
        </>
    )
}

export default ListEquipment

