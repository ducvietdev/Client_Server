// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'

// ** Table Columns
import { data } from '../../../tables/data-tables/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Edit, Trash } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'
import Flatpickr from 'react-flatpickr'
import { Link, useNavigate } from 'react-router-dom'
import { useNavigation } from '../../../../utility/hooks/useNavigation'

// ** Reactstrap Imports
import Select from 'react-select'
import { UncontrolledTooltip, Card, CardHeader, CardTitle, Label, Row, Col, Breadcrumb, BreadcrumbItem, Button, Badge, CardBody } from 'reactstrap'
import './style.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

// ** Antd Imports
import { Cascader } from 'antd'
import { GetListTrainingPlan, GetListTrainingPlanByOrganizationId, deleteTrainingPlan } from '../../../../api/planAPI'
import Swal from 'sweetalert2'
import AddTrainingPlan from './AddTrainingPlan'
import EditTrainingPlan from './EditTrainingPlan'
import { GetSubordinatesAndSuperior } from '../../../../api/organizationAPI'
import { useSelector } from 'react-redux'

const status = {
    1: { title: 'Không hoạt động', color: 'light-primary' },
    2: { title: 'Đang hoạt động', color: 'light-success' },
    3: { title: 'Bị khóa', color: 'light-danger' },
    4: { title: 'Resigned', color: 'light-warning' },
    5: { title: 'Applied', color: 'light-info' }
}

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                    {
                        value: 'xiasha',
                        label: 'Xia Sha',
                        disabled: true,
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua men',
                    },
                ],
            },
        ],
    },
];

const ListTrainingPlan = () => {
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
    const ListTrainingPlanColumns = [
        {
            name: 'ID',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.id,
            center: true
        },
        {
            name: 'Tên KHHL',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.title,
            center: true
        },
        {
            name: 'Đơn vị',
            sortable: false,
            maxWidth: '15%',
            selector: row => row.organzationName,
            center: true
        },
        {
            name: 'Trang thiết bị',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.equipmentId,
            center: true
        },
        {
            name: 'Số tiết',
            sortable: false,
            maxWidth: '10%',
            selector: row => row.soTiet,
            center: true
        },
        {
            name: 'Thời gian bắt đầu',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.start,
            center: true
        },
        {
            name: 'Thời gian kết thúc',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.timeEnd,
            center: true
        },
        {
            name: 'Loại kế hoạch',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.typeName,
            center: true
        },
        {
            name: 'Vị trí',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.location,
            center: true
        },
        {
            name: 'Mô tả',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.description,
            center: true
        },
        {
            name: 'Năm học',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.yearName,
            center: true
        }
    ]

    // ** State
    const ogRef = useRef()
    const dataLogin = useSelector(state => state.auth)
    console.log(dataLogin)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const [editModal, setEditModal] = useState(false)

    // ** Hooks
    const { t } = useTranslation()

    const [editTrainingPlan, setEditTrainingPlan] = useState({})
    const [listOrganization, setListOrganization] = useState([])
    const [valueOg, setValueOg] = useState({})
    dataLogin.userData.organizationId === valueOg ? ListTrainingPlanColumns.push(actions) : ListTrainingPlanColumns
    const handleEditModal = (data) => {
        setEditTrainingPlan(data)
        setEditModal(true)
    }

    const handleCloseModal = () => {
        setEditTrainingPlan(null)
        setEditModal(false)
    }

    const [listTrainingPlan, setListTrainingPlan] = useState([])
    const [dataPage, setDataPage] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const getData = () => {
        GetListTrainingPlan(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch).then(result => {
            setListTrainingPlan(result)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getData()
        GetSubordinatesAndSuperior(dataLogin.userData.organizationId).then(result => {
            const organizations = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.organizationName
                }
            })
            setListOrganization(organizations)
        })
    }, [dataPage])

    // ** Function to handle pagination
    const handlePagination = page => {
        const currentPage = page.selected + 1
        setDataPage({
            ...dataPage, pageNumber: currentPage
        })
    }

    // const handleChangeSearch = (e) => {
    //     const querySearch = e.target.value
    //     GetListTrainingPlan(dataPage.pageSize, dataPage.pageNumber, querySearch).then(result => {
    //         setListTrainingPlan(result)
    //         setFilteredData(result)
    //     }).catch(error => {
    //         console.log(error)
    //     })
    //     setDataPage({...dataPage, querySearch: querySearch})
    // }

    const handleChangeOrganization = (value) => {
        if (value.value !== 0) {
            setValueOg(value.value)
            GetListTrainingPlanByOrganizationId(dataPage.pageSize, dataPage.pageNumber, dataPage.querySearch, value.value).then(result => {
                setListTrainingPlan(result)
            }).catch(error => {
                console.log(error)
            })
        } else {
            return getData()
        }
    }

    const handleDeleteModal = (id) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa kế hoạch này không?',
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
                deleteTrainingPlan(id).then(result => {
                    if (result) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Xóa kế hoạch thành công!',
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
                    text: 'Không xóa kế hoạch!',
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
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(listTrainingPlan.count / 10)}
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

    // Antd Casader
    const onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };
    const filter = (inputValue, path) => path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

    return (
        <>
            <Breadcrumb className='breadcrumb__page'>
                <BreadcrumbItem>
                    <Button className='btn breadcrumb__btn' onClick={handleNavigationHome}>Trang chủ</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='#'> Kế hoạch </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Danh sách </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__plan'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách kế hoạch huấn luyện</CardTitle>
                </CardHeader>
                <CardBody>
                    {/* <Row className='justify-content-center mx-0 mt-1 mb-1'>
                        <Col className='d-flex flex-column' md='4' sm='12'>
                            <Label className='form-label' for='start-picker'>
                                Thời gian bắt đầu
                            </Label>
                            <Flatpickr className='form-control' id='start-picker' />
                        </Col>
                        <Col className='d-flex flex-column' md='4' sm='12'>
                            <Label className='form-label' for='end-picker'>
                                Thời gian kết thúc
                            </Label>
                            <Flatpickr className='form-control' id='end-picker' />
                        </Col>
                        <Col className='d-flex flex-column justify-content-end' md='2' sm='12'>
                            <Button className='btn'>Tìm kiếm</Button>
                        </Col>
                    </Row> */}
                    <Row className='justify-content-center mx-0 mt-1 mb-1 input__features'>
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
                        {/* <Col md='4' sm='12'>
                            <Label className='form-label'>
                                Đơn vị
                            </Label>
                            <Cascader
                                options={options}
                                onChange={onChange} 
                                placeholder="Select..."
                                showSearch={{
                                    filter,
                                }}
                                onSearch={(value) => console.log(value)}
                                changeOnSelect
                            />
                        </Col>
                        <Col md='4' sm='12'>
                            <Label className='form-label'>
                                Trang thiết bị
                            </Label>
                            <Select
                                options={statusOptions}
                            />
                        </Col> */}
                    </Row>
                </CardBody>
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
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row> */}
                <div className='react-dataTable whole-table__plan'>
                    <DataTable
                        noHeader
                        pagination
                        selectableRowsNoSelectAll
                        columns={ListTrainingPlanColumns}
                        className='react-dataTable table__plan'
                        paginationPerPage={10}
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={dataPage.pageNumber}
                        paginationComponent={CustomPagination}
                        data={listTrainingPlan.list}
                    />
                </div>
            </Card>
            {/* <AddTrainingPlan open={addModal} handleAddModal={handleAddModal} getData={getData} /> */}
            {editTrainingPlan && <EditTrainingPlan open={editModal} handleEditModal={handleEditModal} handleCloseModal={handleCloseModal} editTrainingPlan={editTrainingPlan} getData={getData} />}
        </>
    )
}

export default ListTrainingPlan

