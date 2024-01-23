// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Table Columns

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Trash } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, Button, Badge, UncontrolledTooltip } from 'reactstrap'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useNavigation } from '../../../utility/hooks/useNavigation'
import { DeleteAllHistory, GetListUserHistory } from '../../../api/systemAPI'
import Swal from 'sweetalert2'

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}

const ListUserHistory = () => {
    const ListUserHistoryColumns = [
        {
            name: 'ID',
            sortable: false,
            maxWidth: '10%',
            selector: row => row.id,
            center: true
        },
        {
            name: 'Mã người dùng',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.userId,
            center: true
        },
        {
            name: 'Ngày thực hiện',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.actionTime,
            center: true
        },
        {
            name: 'Nội dung',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.actionContent,
            center: true
        },
        {
            name: 'Trạng thái',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.state === true ? 'Thành công' : 'Thất bại',
            center: true
        }
    ]

    // ** State
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const [listUserHistory, setListUserHistory] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
    })

    const getData = () => {
        GetListUserHistory(dataPage.pageSize, dataPage.pageNumber).then(result => {
            setListUserHistory(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
    }, [dataPage])

    // ** Hooks
    const { t } = useTranslation()

    // ** Function to handle pagination
    const handlePagination = page => {
        const currentPage = page.selected + 1
        setDataPage({
            ...dataPage, pageNumber: currentPage
        })
    }

    const handleDeleteAllHistory = () => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa lịch sử không?',
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
                DeleteAllHistory().then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa lịch sử thành công!',
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
                    text: 'Không xóa lịch sử!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })
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
            // forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(listUserHistory.count / 10)}
            // pageCount={searchValue.length ? Math.ceil(filteredData.length / 10) : Math.ceil(0 / 10) || 1}
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
                    <Link to='#'> Hệ thống </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Lịch sử đăng nhập </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__history'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách lịch sử đăng nhập hệ thống</CardTitle>
                    <Button onClick={handleDeleteAllHistory} className='ms-2' color='primary'>
                        <Plus size={15} />
                        <span className='align-middle ms-50'>Xóa lịch sử</span>
                    </Button>
                </CardHeader>
                {/* <Row className='justify-content-end mx-0'>
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
                            // onChange={handleFilter}
                            onChange={(e) => handleChangeSearch(e)}
                        />
                    </Col>
                </Row> */}
                <div className='react-dataTable whole-table__history mt-1'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListUserHistoryColumns}
                        className='react-dataTable table__history'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        // paginationDefaultPage={currentPage + 1}
                        paginationComponent={CustomPagination}
                        data={listUserHistory.list}
                    />
                </div>
            </Card>
        </>
    )
}

export default ListUserHistory

