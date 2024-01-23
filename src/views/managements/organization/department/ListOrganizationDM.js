// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Edit } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, UncontrolledTooltip, Button } from 'reactstrap'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import EditOrganizationDM from './EditOrganizationDM'
import { useNavigation } from '../../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { DeleteOrganizationType, GetListOrganizationType } from '../../../../api/organizationAPI'

const ListOrganizationDM = () => {
    // ** Data
    const ListOrganizationDMColumns = [
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
            selector: row => row.name,
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
    ]

    // ** State
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [editModal, setEditModal] = useState(false)

    const [editOrganizationType, setEditOrganizationType] = useState({})
    const handleEditModal = (data) => {
        console.log(data)
        setEditOrganizationType(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditOrganizationType(null)
        setEditModal(false)
    }

    const [listOrganizationType, setListOrganizationType] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const getData = () => {
        GetListOrganizationType(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
            setListOrganizationType(result)
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
            text: 'Bạn có muốn xóa danh mục này không?',
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
                DeleteOrganizationType(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa danh mục thành công!',
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
                    text: 'Không xóa danh mục!',
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
        // GetListOrganizationType(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
        //     setListOrganizationType(result)
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
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listOrganizationType.count / 10) || 1}
            pageCount={Math.ceil(listOrganizationType.count / 10)}
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
            <Card className='card__organizationDM'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách danh mục đơn vị</CardTitle>
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
                <div className='react-dataTable whole-table__organizationDM'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListOrganizationDMColumns}
                        className='react-dataTable table__organizationDM'
                        paginationPerPage={7}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // data={dataPage.querySearch.length ? filteredData.list : listOrganizationType.list}            
                        data={listOrganizationType.list}            
                    />
                </div>
            </Card>
            {editOrganizationType && <EditOrganizationDM open={editModal} handleCloseModal={handleCloseModal} handleEditModal={handleEditModal} editOrganizationType={editOrganizationType} getData={getData} />}
            {/* <DeleteOrganizationDM open={deleteModal} handleDeleteModal={handleDeleteModal} /> */}
        </>
    )
}

export default ListOrganizationDM

