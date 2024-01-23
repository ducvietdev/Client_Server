// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Edit, RefreshCcw, Trash } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'
import Select from 'react-select'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, Button, Badge, UncontrolledTooltip } from 'reactstrap'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { Link, useNavigate } from 'react-router-dom'
// import DeleteUser from './DeleteUser'
import { useNavigation } from '../../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { DeleteUserLogin } from '../../../../api/userAPI'
import { GetListResultAttendance, GetListResultAttendanceById } from '../../../../api/attendance'
import { GetListTrainingPlan } from '../../../../api/planAPI'

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}

const ListResultAttendance = () => {
    // ** Data
    const ListResultAttendanceColumns = [
        {
            name: 'STT',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.index,
            cell: (row, index) => <span>{(dataPage.pageNumber - 1) * (dataPage.pageSize) + index + 1}</span>,
            center: true
        },
        // {
        //     name: 'ID',
        //     sortable: false,
        //     maxWidth: '5%',
        //     selector: row => row.id,
        //     center: true
        // },
        {
            name: 'Mã kế hoạch',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.planId,
            center: true
        },
        {
            name: 'Tên kế hoạch',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.planName,
            center: true
        },
        {
            name: 'Mã học viên',
            sortable: false,
            maxWidth: '15%',
            selector: row => row.studentId,
            center: true
        },
        {
            name: 'Tên học viên',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.studentName,
            center: true
        },
        {
            name: 'Số buổi đi học',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.buoidihoc,
            center: true
        },
        {
            name: 'Phần trăm (%)',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.comat,
            center: true
        }
    ]

    // ** State
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const [listResultAttendance, setListResultAttendance] = useState([])
    const [listTrainingPlan, setListTrainingPlan] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const getData = () => {
        GetListResultAttendance(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
            setListResultAttendance(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
        GetListTrainingPlan(100, 1, '').then(result => {
            const plans = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.title
                }
            })
            setListTrainingPlan(plans)
        })
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

    // const handleChangeSearch = (e) => {
    //     const querySearch = e.target.value
    //     // GetListResultAttendanceLogin(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
    //     //     setListResultAttendanceLogin(result)
    //     //     setFilteredData(result)
    //     // }).catch(error => {
    //     //     console.log(error)
    //     // })
    //     setDataPage({...dataPage, querySearch: querySearch})
    // }

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

    const handleChangeTrainingPlan = (value) => {
        GetListResultAttendanceById(value?.value, 100, 1, '').then(result => {
            setListResultAttendance(result)
        }).catch(error => {
            console.log(error)
        })
    }

    // ** Custom Pagination Component
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel={<Previous size={15} />}
            nextLabel={<Next size={15} />}
            forcePage={dataPage.pageNumber - 1}
            onPageChange={page => handlePagination(page)}
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listUserLogin.count / 10) || 1}
            pageCount={Math.ceil(listResultAttendance.count / 10) || 1}
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
                    <Link to='#'> Điểm danh </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Kết quả </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__attendance'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách người dùng</CardTitle>
                    {/* <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={handleAddModal}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm người dùng</span>
                        </Button>
                    </div> */}
                </CardHeader>
                <Row className='justify-content-end mx-0 input__features'>
                    <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__select' md='4' sm='12'>
                        <Label className='me-1 label__select'>
                            Kế hoạch huấn luyện
                        </Label>
                        <Select
                            className='react-select'
                            classNamePrefix='select'
                            options={listTrainingPlan}
                            placeholder="Chọn đơn vị ..."
                            onChange={handleChangeTrainingPlan}
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
                            // value={dataPage.querySearch}
                            // onChange={(e) => handleChangeSearch(e)}
                        />
                    </Col>
                </Row>
                <div className='react-dataTable whole-table__attendance'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListResultAttendanceColumns}
                        className='react-dataTable table__attendance'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // data={dataPage.querySearch.length ? filteredData.list : listUserLogin.list}
                        data={listResultAttendance.list}
                    />
                </div>
            </Card>
        </>
    )
}

export default ListResultAttendance