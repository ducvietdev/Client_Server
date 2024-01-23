// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Table Columns
import { data } from '../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Edit, Plus } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'
import Select from 'react-select'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, UncontrolledTooltip, Button } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import EditStudent from './EditStudent'
import AddStudent from './AddStudent'
import { useNavigation } from '../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { GetListStudent, DeleteStudent, getStudentById, GetListStudentByOrganizationId, SearchStudent } from '../../../api/studentAPI'
import { GetListOrganization } from '../../../api/organizationAPI'

// ** SCSS
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { GetOgDoubleById } from '../../../api/permission'
import { useSelector } from 'react-redux'

const ListStudent = () => {
    const actions =
    {
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
    const ListStudentColumns = [
        {
            name: 'STT',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.index,
            center: true,
            cell: (row, index) => <span>{(dataPage.pageNumber - 1) * (dataPage.pageSize) + index + 1}</span>
        },
        {
            name: 'Mã học viên',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.id,
            center: true
        },
        {
            name: 'Tên học viên',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.fullName,
            center: true
        },
        {
            name: 'Ngày sinh',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.birthday,
            center: true
        },
        {
            name: 'Giới tính',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.gender === true ? "Nam" : "Nữ",
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
            name: 'Email',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.email,
            center: true
        },
        {
            name: 'Số điện thoại',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.phoneNumber,
            center: true
        }
    ]


    // ** State
    const dataLogin = useSelector(state => state.auth)
    dataLogin.userData.roleName === 'ADc' ? ListStudentColumns.push(actions) : ListStudentColumns
    // const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const handleAddModal = () => setAddModal(!addModal)
    const handleEditModal = (data) => {
        setEditStudent(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditStudent(null)
        setEditModal(false)
    }

    const [listStudent, setListStudent] = useState([])
    const [editStudent, setEditStudent] = useState({})
    const [listOrganization, setListOrganization] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: '',
        organizationId: dataLogin?.userData.organizationId
    })

    const getData = () => {
        // GetListStudent(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
        //     setListStudent(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        GetListStudentByOrganizationId(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch, dataPage.organizationId).then(result => {
            setListStudent(result)
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
    }, [dataLogin, dataPage])

    const handleDeleteModal = (id) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa học viên này không?',
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
                DeleteStudent(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa học viên thành công!',
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
                    text: 'Không xóa học viên!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })
    }

    const handleChangeOrganization = (value) => {
        if (value.value !== 0) {
            GetListStudentByOrganizationId(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch, value.value).then(result => {
                setListStudent(result)
                setDataPage({...dataPage, organizationId: value.value})
            }).catch(error => {
                console.log(error)
            })
        } else {
            return getData()
        }
    }

    // const handleSearch = (e) => {
    //     const value = e.target.value
    //     SearchStudent(value, dataPage.pageSize, dataPage.pageNumber).then(result => {
    //         setListStudent(result)

    //     }).catch(error => {
    //         console.log(error)
    //     })
    // }

    // ** Hooks
    const { t } = useTranslation()

    // ** Function to handle pagination
    const handlePagination = (page) => {
        const currentPage = page.selected + 1
        setDataPage({
            ...dataPage, pageNumber: currentPage
        })
    }

    const handleChangeSearch = (e) => {
        const querySearch = e.target.value
        // GetListStudent(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
        //     setListStudent(result)
        //     setFilteredData(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        setDataPage({ ...dataPage, querySearch: querySearch })
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
            onPageChange={(page) => handlePagination(page)}
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listStudent.count / 10) || 1}
            pageCount={Math.ceil(listStudent.count / 10)}
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
                    <Link to='#'> Học viên </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Danh sách </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__student'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách học viên</CardTitle>
                    {dataLogin.userData.roleName === 'ADc' ? <div className='d-flex mt-md-0 mt-1'>
                        <Button onClick={handleAddModal} className='ms-2' color='primary'>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm học viên</span>
                        </Button>
                    </div> : <div></div>}
                </CardHeader>
                <Row className='justify-content-end mx-0 input__features' >
                    <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__select' md='4' sm='12'>
                        <Label className='me-1 label__select'>
                            Đơn vị
                        </Label>
                        <Select
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
                <div className='react-dataTable whole-table__student'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListStudentColumns}
                        className='react-dataTable table__student'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // data={dataPage.querySearch.length ? filteredData.list : listStudent.list}
                        data={listStudent.list}
                    />
                </div>
            </Card>
            <AddStudent open={addModal} handleAddModal={handleAddModal} getData={getData} pageSize={dataPage.pageSize} pageNumber={dataPage.pageNumber} />
            {editStudent && <EditStudent open={editModal} handleCloseModal={handleCloseModal} handleEditModal={handleEditModal} editStudent={editStudent} getData={getData} pageSize={dataPage.pageSize} pageNumber={dataPage.pageNumber} />}
            {/* <DeleteStudent open={deleteModal} handleDeleteModal={handleDeleteModal} /> */}
        </>
    )
}

export default ListStudent

