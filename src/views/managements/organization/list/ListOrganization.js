// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Edit, Plus } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Breadcrumb, BreadcrumbItem, UncontrolledTooltip, Button } from 'reactstrap'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import DeleteOrganization from './DeleteOrganization'
import EditOrganization from './EditOrganization'
import AddOrganization from './AddOrganization'
import { useNavigation } from '../../../../utility/hooks/useNavigation'
import Swal from 'sweetalert2'
import { GetListOrganization, GetOrganizationHierarchy, deleteOrganization } from '../../../../api/organizationAPI'
import { useSelector } from 'react-redux'

const ListOrganization = () => {
    // ** Data
    const ListOrganizationColumns = [
        {
            name: 'ID',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.id,
            center: true
        },
        {
            name: 'Mã đơn vị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.organizationCode,
            center: true
        },
        {
            name: 'Tên đơn vị',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.organizationName,
            center: true
        },
        {
            name: 'Loại đơn vị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.organizationTypeId,
            center: true
        },
        {
            name: 'Cấp đơn vị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.organizationLevelId,
            center: true
        },
        {
            name: 'Đóng quân',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.address,
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
            name: 'Đơn vị cấp trên',
            sortable: false,
            maxWidth: '40%',
            selector: row => row.organizationParentId,
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

    // const ExpandableTable = () => {
    //     return (
    //         <Card className='card__organization'>
    //             <Row className='justify-content-center mx-0'>
    //                 <h5 className='title__organization__children'>Danh sách đơn vị cấp dưới</h5>
    //             </Row>
    //             <Row className='justify-content-start flex-nowrap'>
    //                 <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search__children' md='3' sm='12'>
    //                     <Label className='me-1 label__search' for='search-input-1-children'>
    //                         {t('Tìm kiếm')}
    //                     </Label>
    //                     <Input
    //                         ref={inputRef}
    //                         className='dataTable-filter'
    //                         type='text'
    //                         bsSize='sm'
    //                         id='search-input-1-children'
    //                         value={searchValueChildren}
    //                         onChange={handleFilterChildren}
    //                     />
    //                 </Col>
    //                 <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__btn__children' md='9' sm='12'>
    //                     <Button onClick={handleAddModal} color='primary' className='btn'>Thêm đơn vị</Button>
    //                 </Col>
    //             </Row>
    //             <div className='react-dataTable whole-table__organization'>
    //                 <DataTable
    //                     noHeader
    //                     pagination
    //                     selectableRowsNoSelectAll
    //                     columns={ListOrganizationColumns}
    //                     className='react-dataTable table__organization'
    //                     paginationPerPage={7}
    //                     sortIcon={<ChevronDown size={10} />}
    //                     paginationDefaultPage={currentPage + 1}
    //                     paginationComponent={CustomPagination}
    //                     data={searchValueChildren.length ? filteredDataChildren : data}
    //                     expandOnRowClicked
    //                     expandableRowsComponent={ExpandableTable}
    //                 />
    //             </div>
    //         </Card>
    //     )
    // }

    // ** State
    const dataLogin = useSelector(state => state.auth   )
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchValueChildren, setSearchValueChildren] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [filteredDataChildren, setFilteredDataChildren] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const inputRef = useRef()

    const handleAddModal = () => setAddModal(!addModal)
    const [editOrganization, setEditOrganization] = useState({})
    const handleEditModal = (data) => {
        setEditOrganization(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditOrganization(null)
        setEditModal(false)
    }

    const [listOrganization, setListOrganization] = useState([])
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const getData = () => {
        GetListOrganization(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
            setListOrganization(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
        GetOrganizationHierarchy().then(result => {
            setListOrganizationTree(result)
        })
    }, [dataPage])

    console.log(listOrganizationTree)

    const handleDeleteModal = (id) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa đơn vị này không?',
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
                deleteOrganization(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa đơn vị thành công!',
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
                    text: 'Không xóa đơn vị!',
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
        // GetListOrganization(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
        //     setListOrganization(result)
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

    const handleFilterChildren = e => {
        inputRef.current.focus
        const value = e.target.value
        let updatedData = []
        setSearchValueChildren(value)

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
            setFilteredDataChildren(updatedData)
            setSearchValueChildren(value)
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
            // pageCount={dataPage.querySearch.length ? Math.ceil(filteredData.count / 10) : Math.ceil(listOrganization.count / 10) || 1}
            pageCount={Math.ceil(listOrganization.count / 10)}
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
                    <Link to='#'> Đơn vị </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Danh sách </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__organization'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách đơn vị</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button onClick={handleAddModal} className='ms-2' color='primary'>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm đơn vị</span>
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
                <div className='react-dataTable whole-table__organization'>
                    <DataTable
                        noHeader
                        pagination
                        // expandableRows
                        selectableRowsNoSelectAll
                        columns={ListOrganizationColumns}
                        className='react-dataTable table__organization'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        // expandOnRowClicked
                        // expandableRowsComponent={ExpandableTable}
                        // data={dataPage.querySearch.length ? filteredData.list : listOrganization.list}
                        data={listOrganization.list}
                    />
                </div>
            </Card>
            <AddOrganization open={addModal} handleAddModal={handleAddModal} getData={getData} />
            {editOrganization && <EditOrganization open={editModal} handleEditModal={handleEditModal} handleCloseModal={handleCloseModal} editOrganization={editOrganization} getData={getData} />}
            {/* <DeleteOrganization open={deleteModal} handleDeleteModal={handleDeleteModal} /> */}
        </>
    )
}

export default ListOrganization

