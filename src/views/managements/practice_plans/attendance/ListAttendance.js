import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Table } from 'antd';
import { ChevronDown, Trash, CheckCircle } from 'react-feather'
import { Row, Col, Card, CardHeader, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label, UncontrolledTooltip, Input } from 'reactstrap';
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useNavigation } from '../../../../utility/hooks/useNavigation';
import DataTable from 'react-data-table-component';
import { GetListTrainingPlan, GetListTrainingPlanByOrganizationId } from '../../../../api/planAPI';
import { GetTraineesByTrainingPlanId, MarkAttendance } from '../../../../api/attendance';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { GetOgDoubleById } from '../../../../api/permission';

const { Column, ColumnGroup } = Table;
const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]
const data = [
    {
        key: '1',
        index: '1',
        firstName: 'John',
        lastName: 'Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        index: '2',
        firstName: 'Jim',
        lastName: 'Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        index: '3',
        firstName: 'Joe',
        lastName: 'Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];
const ListAttendance = () => {
    const ListTrainingPlanColumns = [
        {
            name: 'Đơn vị',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.organzationName,
            center: true
        },
        {
            name: 'Kế hoạch huấn luyện',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.title,
            center: true,
            cell: (row, index) => (
                <Button className='btnTableTl' onClick={() => handleButtonTableTl(row, index)} style={{ width: '100%', borderRadius: 0, backgroundColor: '#fff', border: 'none' }}>{row.title}</Button>
            )
        }
    ]

    const ListStudentColumns = [
        {
            name: 'Mã học viên',
            sortable: false,
            maxWidth: '10px',
            selector: row => row.id,
            center: true
        },
        {
            name: 'Họ tên',
            sortable: false,
            maxWidth: '50px',
            selector: row => row.fullName,
            center: true
        },
        {
            name: 'Mã kế hoạch',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.plan_Id,
            center: true
        },
        {
            name: 'Tổng số buổi',
            sortable: false,
            maxWidth: '20%',
            selector: row => row.tongSoBuoi,
            center: true
        },
        {
            name: 'Lớp',
            sortable: false,
            maxWidth: '30%',
            selector: row => row.className,
            center: true
        },
        {
            name: 'Thao tác',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.actions,
            center: true,
            cell: row => {
                return (
                    <div className='d-flex'>
                        <CheckCircle onClick={() => handleAttendance(row)} className="me-1" color="#ed2e2f" size={15} id="btn-check" />
                        <UncontrolledTooltip placement='top' target='btn-check'>
                            Điểm danh
                        </UncontrolledTooltip>
                    </div>
                )
            }
        }
    ]

    const handleButtonTableTl = (row, index) => {
        const btnTableTls = document.querySelectorAll('.btnTableTl')
        btnTableTls.forEach((btn) => {
            btn.style.setProperty('background-color', '', 'important');
        });
        btnTableTls[index].style.setProperty('background-color', 'rgb(244 248 98)', 'important')
        GetTraineesByTrainingPlanId(row.id, dataPageSt.pageSize, dataPageSt.pageNumber, dataPageSt.querySearch).then(result => {
            setListStudentByTrainingPlanId(result)
        })
    }

    // ** Hooks
    const { t } = useTranslation()
    const btnRef = useRef()
    const dataLogin = useSelector(state => state.auth)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [dataPageTl, setDataPageTl] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: '',
        organization_id: dataLogin?.userData.organizationId
    })
    const [dataPageSt, setDataPageSt] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const [listTrainingPlan, setListTrainingPlan] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [listStudentByTrainingPlanId, setListStudentByTrainingPlanId] = useState([])

    useEffect(() => {
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
    }, [dataLogin])

    // console.log(listTrainingPlan)

    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }

    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    const handleChangeSearchTl = (e) => {
        const querySearch = e.target.value
        setDataPageTl({ ...dataPageTl, querySearch: querySearch })
    }

    const handleChangeSearchSt = (e) => {
        const querySearch = e.target.value
        setDataPageSt({ ...dataPageSt, querySearch: querySearch })
    }

    const handleAttendance = (data) => {
        MarkAttendance(data.plan_Id, data.id).then(result => {
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Điểm danh!',
                    text: 'Điểm danh thành công!',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

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
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(data.length / 7) || 1}
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

    const handleChangeOrganization = (value) => {
        if (value.value !== 0) {
            GetListTrainingPlanByOrganizationId(dataPageTl.pageSize, dataPageTl.pageNumber, dataPageTl.querySearch, value.value).then(result => {
                setListTrainingPlan(result)
                setDataPageTl({...dataPageTl, organization_id: value.value})
            }).catch(error => {
                console.log(error)
            })
        } else {
            return getData()
        }
    }

    return (
        <>
            <Breadcrumb className='breadcrumb__page'>
                <BreadcrumbItem>
                    <Button className='btn breadcrumb__btn' onClick={handleNavigationHome}>Trang chủ</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='#'> Thực hành huấn luyện </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Điểm danh </span>
                </BreadcrumbItem>
            </Breadcrumb>

            <Card className='card__attendance flex-row'>
                {/* <Row className="justify-content-start align-items-end mx-0"> */}

                <Col className='d-flex align-items-center justify-content-start mt-1 mb-1' md='4' sm='12'>
                    <div className='react-dataTable whole-table__attendance'  >
                        <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__select' sm='12'>
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
                        <Row className='justify-content-end mx-0 row__attendance'>
                            <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search' md='4' sm='12'>
                                <Label className='me-1 label__search' for='search-input-1'>
                                    {t('Tìm kiếm')}
                                </Label>
                                <Input
                                    className='dataTable-filter'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input-1'
                                    value={dataPageTl.querySearch}
                                    onChange={(e) => handleChangeSearchTl(e)}
                                />
                            </Col>
                        </Row>
                        <DataTable
                            noHeader
                            pagination
                            selectableRowsNoSelectAll
                            columns={ListTrainingPlanColumns}
                            className='react-dataTable table__attendance'
                            paginationPerPage={10}
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={dataPageTl.pageNumber}
                            paginationComponent={CustomPagination}
                            data={listTrainingPlan.list}
                        // onRowClicked={handleClickRow}
                        />
                    </div>
                </Col>
                <Col className='d-flex align-items-center justify-content-start mt-1 mb-1' md='8' sm='12'>
                    <div className='react-dataTable whole-table__attendance'>
                        <Row className='justify-content-end mx-0 row__attendance'>
                            <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search' md='4' sm='12'>
                                <Label className='me-1 label__search' for='search-input-1'>
                                    {t('Tìm kiếm')}
                                </Label>
                                <Input
                                    className='dataTable-filter'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input-1'
                                    value={dataPageSt.querySearch}
                                    onChange={(e) => handleChangeSearchSt(e)}
                                />
                            </Col>
                        </Row>
                        <DataTable
                            noHeader
                            pagination
                            selectableRowsNoSelectAll
                            columns={ListStudentColumns}
                            className='react-dataTable table__attendance'
                            paginationPerPage={10}
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={dataPageSt.pageNumber}
                            paginationComponent={CustomPagination}
                            data={listStudentByTrainingPlanId}
                        // onRowClicked={handleClickRow}
                        />
                    </div>
                </Col>
                {/* </Row> */}
            </Card>
        </>
    )
}
export default ListAttendance