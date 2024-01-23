import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Table } from 'antd';
import { ChevronDown, Trash } from 'react-feather'
import { Row, Col, Card, CardHeader, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label, UncontrolledTooltip, Input } from 'reactstrap';
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useNavigation } from '../../../../utility/hooks/useNavigation';
import DataTable from 'react-data-table-component';
import { GetListOrganization, GetOgAndSubOgs } from '../../../../api/organizationAPI';
import { GetListStudentByOrganizationId } from '../../../../api/studentAPI';
import { GetScoreByStudentId } from '../../../../api/scoreAPI';
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
const ListScoreInterface = () => {
    const ListOrganizationColumns = [
        {
            name: 'Đơn vị',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.organizationName,
            center: true,
            cell: (row, index) => (
                <Button className='btnTableOg' onClick={() => handleButtonTableOg(row, index)} style={{ width: '100%', borderRadius: 0, backgroundColor: '#fff' }}>{row.organizationName}</Button>
            )
        }
    ]

    const ListStudentColumns = [
        {
            name: 'Học viên',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.fullName,
            center: true,
            cell: (row, index) => (
                <Button className='btnTableSt' onClick={() => handleButtonTableSt(row, index)} style={{ width: '100%', borderRadius: 0, backgroundColor: '#fff' }}>{row.fullName}</Button>
            )
        }
    ]

    const ListScoreColumns = [
        {
            name: 'Điểm CC',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.diemchuyencan,
            center: true
        },
        {
            name: 'Điểm TX',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.diemthuongxuyen,
            center: true
        },
        {
            name: 'Điểm thi',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.diemthi,
            center: true
        },
        {
            name: 'Điểm TBM',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.diemtbmon,
            center: true
        },
        {
            name: 'Số tín chỉ',
            sortable: false,
            maxWidth: '5%',
            selector: row => row.sotinchi,
            center: true
        }
    ]


    const handleButtonTableOg = (row, index) => {
        const btnTableOgs = document.querySelectorAll('.btnTableOg')
        btnTableOgs.forEach((btn) => {
            btn.style.setProperty('background-color', '', 'important');
        });
        btnTableOgs[index].style.setProperty('background-color', 'rgb(244 248 98)', 'important')
        GetListStudentByOrganizationId(dataPageSt.pageSize, dataPageSt.pageNumber, dataPageSt.querySearch, row.id).then(result => {
            setListStudentByOrganizationId(result)
            setListScoreByStudentId([])
        })
    }

    const handleButtonTableSt = (row, index) => {
        const btnTableSts = document.querySelectorAll('.btnTableSt')
        btnTableSts.forEach((btn) => {
            btn.style.setProperty('background-color', '', 'important');
        });
        btnTableSts[index].style.setProperty('background-color', 'rgb(244 248 98)', 'important')
        GetScoreByStudentId(row.id, dataPageSt.pageSize, dataPageSt.pageNumber, dataPageSt.querySearch).then(result => {
            setListScoreByStudentId(result)
        })
    }

    // ** Hooks
    const { t } = useTranslation()
    const btnRef = useRef()
    const dataLogin = useSelector(state => state.auth)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [dataPageOg, setDataPageOg] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: '',
        organizationId: dataLogin?.userData.organizationId
    })
    const [dataPageSt, setDataPageSt] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })
    const [dataPageSc, setDataPageSc] = useState({
        pageSize: 10,
        pageNumber: 1,
        querySearch: ''
    })

    const [listOrganization, setListOrganization] = useState([])
    const [listStudentByOrganizationId, setListStudentByOrganizationId] = useState([])
    const [listScoreByStudentId, setListScoreByStudentId] = useState([])

    useEffect(() => {
        // GetListStudentByOrganizationId(dataPageOg.pageSize, dataPageOg.pageNumber, dataPageOg.querySearch, dataPageOg.organizationId).then(result => {
        //     setListOrganization(result)
        // }).catch(error => {
        //     console.log(error)
        // })
        GetOgAndSubOgs(dataPageOg.organizationId, dataPageOg.pageSize, dataPageOg.pageNumber, dataPageOg.querySearch).then(result => {
            // const organizations = result?.map(item => {
            //     return {
            //         value: item.id,
            //         label: item.organization_Name
            //     }
            // })
            setListOrganization(result)
        }).catch(error => {
            console.log(error)
        })
    }, [dataLogin])

    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }

    // const handleClickRow = (row, id) => {
    //     console.log(row, id)
    // }

    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    const handleChangeSearchOg = (e) => {
        const querySearch = e.target.value
        GetListOrganization(dataPageOg.pageSize, dataPageOg.pageNumber, querySearch).then(result => {
            setListOrganization(result)
        }).catch(error => {
            console.log(error)
        })
        setDataPageOg({ ...dataPageOg, querySearch: querySearch })
    }

    const handleChangeSearchSt = (e) => {
        const querySearch = e.target.value
        GetListStudentByOrganizationId(dataPageSt.pageSize, dataPageSt.pageNumber, querySearch, 3).then(result => {
            setListStudentByOrganizationId(result)
        }).catch(error => {
            console.log(error)
        })
        setDataPageSt({ ...dataPageSt, querySearch: querySearch })
    }

    // const handleChangeSearchSc = (e) => {
    //     const querySearch = e.target.value
    //     GetScoreByStudentId('11111100', dataPageSc.pageSize, dataPageSc.pageNumber, querySearch).then(result => {
    //         setListScoreByStudentId(result)
    //     }).catch(error => {
    //         console.log(error)
    //     })
    //     setDataPageSc({ ...dataPageSc, querySearch: querySearch })
    // }

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
            forcePage={dataPageOg.pageNumber - 1}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(listOrganization.count / 10) || 1}
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

    return (
        <>
            <Breadcrumb className='breadcrumb__page'>
                <BreadcrumbItem>
                    <Button className='btn breadcrumb__btn' onClick={handleNavigationHome}>Trang chủ</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='#'> Điểm </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Giao diện điểm </span>
                </BreadcrumbItem>
            </Breadcrumb>

            <Card className='card__score__interface flex-row'>
                {/* <Row className="justify-content-end align-items-end mx-0"> */}
                    <Col className='d-flex align-items-center justify-content-start mt-1 mb-1' md='3' sm='12'>
                        <div className='react-dataTable whole-table__score__interface'  >
                            <Row className='justify-content-end mx-0 row__score__interface'>
                                <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search' md='4' sm='12'>
                                    <Label className='me-1 label__search' for='search-input-1'>
                                        {t('Tìm kiếm')}
                                    </Label>
                                    <Input
                                        className='dataTable-filter'
                                        type='text'
                                        bsSize='sm'
                                        id='search-input-1'
                                        value={dataPageOg.querySearch}
                                        onChange={(e) => handleChangeSearchOg(e)}
                                    />
                                </Col>
                            </Row>
                            <DataTable
                                noHeader
                                pagination
                                selectableRowsNoSelectAll
                                columns={ListOrganizationColumns}
                                className='react-dataTable table__score__interface__btn'
                                paginationPerPage={10}
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={dataPageOg.pageNumber}
                                paginationComponent={CustomPagination}
                                data={listOrganization.list}
                            // onRowClicked={handleClickRow}
                            />
                        </div>
                    </Col>
                    <Col className='d-flex align-items-center justify-content-start mt-1 mb-1' md='3' sm='12'>
                        <div className='react-dataTable whole-table__score__interface'>
                            <Row className='justify-content-end mx-0 row__score__interface'>
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
                                className='react-dataTable table__score__interface__btn'
                                paginationPerPage={10}
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={dataPageOg.pageNumber}
                                paginationComponent={CustomPagination}
                                data={listStudentByOrganizationId.list}
                            // onRowClicked={handleClickRow}
                            />
                        </div>
                    </Col>
                    <Col className='d-flex align-items-center justify-content-start mt-1 mb-1' md='6' sm='12'>
                        <div className='react-dataTable whole-table__score__interface'>
                            {/* <Row className='justify-content-end mx-0 row__score__interface'>
                            <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 col__search' md='4' sm='12'>
                                <Label className='me-1 label__search' for='search-input-1'>
                                    {t('Tìm kiếm')}
                                </Label>
                                <Input
                                    className='dataTable-filter'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input-1'
                                    value={dataPageSc.querySearch}
                                    onChange={(e) => handleChangeSearchSc(e)}
                                />
                            </Col>
                        </Row> */}
                            <DataTable
                                noHeader
                                pagination
                                selectableRowsNoSelectAll
                                columns={ListScoreColumns}
                                className='react-dataTable table__score__interface'
                                paginationPerPage={7}
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={currentPage + 1}
                                paginationComponent={CustomPagination}
                                data={searchValue.length ? filteredData : listScoreByStudentId.list}
                            // onRowClicked={handleClickRow}
                            />
                        </div>
                    </Col>
                {/* </Row> */}
            </Card>
        </>
    )
}
export default ListScoreInterface