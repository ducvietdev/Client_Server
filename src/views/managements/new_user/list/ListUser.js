// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Edit, RefreshCcw, Trash } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, Button, Badge, UncontrolledTooltip } from 'reactstrap'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import AddUser from './AddUser'
// import DeleteUser from './DeleteUser'
import EditUser from './EditUser'
import { useNavigation } from '../../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { DeleteUserLogin, GetListUserLogin } from '../../../../api/userAPI'

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}

const ListUser = () => {
    // ** Data
    const ListUserColumns = [
        {
            name: 'STT',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.index,
            cell: (row, index) => <span>{(dataPage.pageNumber - 1) * (dataPage.pageSize) + index + 1}</span>,
            center: true
        },
        {
            name: 'ID',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.id,
            center: true
        },
        {
            name: 'CCCD',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.creditCard,
            center: true
        },
        {
            name: 'Họ tên',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.fullName,
            center: true
        },
        {
            name: 'Tên đăng nhập',
            sortable: false,
            maxWidth: '15%',
            selector: row => row.userName,
            center: true
        },
        {
            name: 'Đơn vị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.organizationName,
            center: true
        },
        {
            name: 'Vai trò',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.roleName,
            center: true
        },
        {
            name: 'Trạng thái',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.stateId,
            cell: (row) => {
                if (row.stateId === 1) {
                    return <span>Hoạt động</span>
                } else if (row.stateId === 3) {
                    return <span>Bị khóa</span>
                } else {
                    return <span>Không hoạt động</span>
                }
            },
            center: true
        },
        {
            name: 'Thao tác',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.action,
            cell: row => {
                return (
                    <div className='d-flex'>
                        <Trash onClick={() => handleDeleteModal(row.id)} className="me-1" color="#ed2e2f" size={15} id="btn-trash" />
                        <UncontrolledTooltip placement='top' target='btn-trash'>
                            Xóa
                        </UncontrolledTooltip>
                        <RefreshCcw className="me-1" color="#fa881c" size={15} id="btn-change" />
                        <UncontrolledTooltip placement='top' target='btn-change'>
                            Thay đổi
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
    ]

    // ** State
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const handleAddModal = () => setAddModal(!addModal)
    const [editUserLogin, setEditUserLogin] = useState({})
    const handleEditModal = (data) => {
        setEditUserLogin(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditUserLogin(null)
        setEditModal(false)
    }
    const [listUserLogin, setListUserLogin] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const getData = () => {
        GetListUserLogin(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
            setListUserLogin(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
    }, [dataPage])

    const handleDeleteModal = (id) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa người dùng này không?',
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
                DeleteUserLogin(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa người dùng thành công!',
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
                    text: 'Không xóa người dùng!',
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
        // GetListUserLogin(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
        //     setListUserLogin(result)
        //     setFilteredData(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        setDataPage({...dataPage, querySearch: querySearch})
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
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listUserLogin.count / 10) || 1}
            pageCount={Math.ceil(listUserLogin.count / 10) || 1}
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
                    <Link to='#'> Người dùng </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Danh sách </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__list'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách người dùng</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={handleAddModal}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm người dùng</span>
                        </Button>
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
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
                <div className='react-dataTable whole-table__list'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListUserColumns}
                        className='react-dataTable table__list'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // data={dataPage.querySearch.length ? filteredData.list : listUserLogin.list}
                        data={listUserLogin.list}
                    />
                </div>
            </Card>
            <AddUser open={addModal} handleAddModal={handleAddModal} getData={getData} />
            {editUserLogin && <EditUser open={editModal} handleCloseModal={handleCloseModal} handleEditModal={handleEditModal} editUserLogin={editUserLogin} getData={getData} />}
            {/* <DeleteUser open={deleteModal} handleDeleteModal={handleDeleteModal} /> */}
        </>
    )
}

export default ListUser