import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Table } from 'antd';
import { Row, Col, Card, CardHeader, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label } from 'reactstrap';
import Select from 'react-select'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useNavigation } from '../../../../utility/hooks/useNavigation';
import ModalStatistic from './ModalStatistic';
import { Activity } from 'react-feather';
import { GetListYear } from '../../../../api/yearAPI';
import { GetListSemesterByYearId } from '../../../../api/semesterAPI';
import { AverageScore, ClassifiedStudent } from '../../../../api/classifiedAPI';
import { GetOgAndSubOgs } from '../../../../api/organizationAPI';
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
const ListClassifiedStudent = () => {
    const [show, setShow] = useState(false)
    const handleShowModal = () => {
        setShow(!show)
    }

    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }

    const dataLogin = useSelector(state => state.auth)
    const [listYear, setListYear] = useState([])
    const [listSemester, setListSemester] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [dataId, setDataId] = useState({
        yearId: 0,
        semesterId: 0,
        organizationId: 0
    })
    const [avarageScore, setAverageScore] = useState([])
    const [classifiedStudent, setClassifiedStudent] = useState([])
    const semesterRef = useRef()
    const ogRef = useRef()

    useEffect(() => {
        GetListYear().then(result => {
            const years = result.list.map(item => {
                return {
                    value: item.id,
                    label: item.yearName
                }
            })
            setListYear(years)
        }).catch(error => {
            console.log(error)
        })

        // GetOgAndSubOgs(dataLogin?.userData.organizationId, 100, 1, '').then(result => {
        //     const organizations = result?.list.map(item => {
        //         return {
        //             value: item.id,
        //             label: item.organizationName
        //         }
        //     })
        //     setListOrganization(organizations)
        // })
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
    }, [])

    const handleChangeYear = (value) => {
        if (value.value !== 0) {
            setDataId({...dataId, yearId: value.value})
            GetListSemesterByYearId(value.value).then(result => {
                const semesters = result?.list.map(item => {
                    return {
                        value: item.id,
                        label: item.semesterName
                    }
                })
                setListSemester(semesters)
                semesterRef.current.clearValue()
            }).catch(error => {
                console.log(error)
            })
        }
    }

    const handleChangeSemester = (value) => {
        if (value?.value !== 0) {
            setDataId({...dataId, semesterId: value?.value})
        }
    }

    const handleChangeOrganization = (value) => {
        if (value?.value !== 0) {
            setDataId({...dataId, organizationId: value?.value})
        }
    }

    const handleClassifiedStudent = () => {
        AverageScore(dataId.yearId, dataId.semesterId, dataId.organizationId).then(result => {
            setAverageScore(result)
        })

        ClassifiedStudent(dataId.yearId, dataId.semesterId, dataId.organizationId).then(result => {
            setClassifiedStudent(result)
        })
    }

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
                    <span> Điểm môn học </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__score__subject'>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách xếp loại học viên</CardTitle>
                </CardHeader>
                <Row className='justify-content-end align-items-end mx-0 options__score'>
                    <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
                        <Label className='form-label'>
                            Năm học
                        </Label>
                        <Select
                            className='react-select'
                            classNamePrefix='select'
                            options={listYear}
                            placeholder="Chọn năm ..."
                            onChange={handleChangeYear}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
                        <Label className='form-label'>
                            Kỳ học
                        </Label>
                        <Select
                            ref={semesterRef}
                            className='react-select'
                            classNamePrefix='select'
                            options={listSemester}
                            placeholder="Chọn kỳ ..."
                            onChange={handleChangeSemester}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
                        <Label className='form-label'>
                            Đơn vị
                        </Label>
                        <Select
                            ref={ogRef}
                            className='react-select'
                            classNamePrefix='select'
                            options={listOrganization}
                            placeholder="Chọn đơn vị ..."
                            onChange={handleChangeOrganization}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1' md='1' sm='12'>
                        <Button style={{fontSize: '12px'}} onClick={handleClassifiedStudent} className='btn btn-warning modal-btn'>Kết quả</Button>
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1 col__btn' md='1' sm='12'>
                        <Button onClick={handleShowModal} className='btn btn-warning modal-btn'><Activity /></Button>
                    </Col>
                </Row>
                <div className='react-dataTable whole-table__score__subject'>

                    <Table dataSource={avarageScore} className='table__score__subject'>
                        <Column width="20%" title="Mã học viên" dataIndex="studentId" key="studentId" />
                        <Column title="Họ và tên" dataIndex="studentName" key="studentName" />
                        <Column title="Ngày sinh" dataIndex="birthday" key="birthday" />
                        <ColumnGroup className='ant-table-cell_group' title="Điểm môn học">
                            <Column width="5%" className='ant-table-cell_extra_1' title="Tiếng Anh" dataIndex="subject1" key="subject1" />
                            <Column width="5%" className='ant-table-cell_extra_2' title="Quản trị mạng" dataIndex="subject2" key="subject2" />
                            <Column width="5%" className='ant-table-cell_extra_3' title="Hiệu năng mạng" dataIndex="subject3" key="subject3" />
                            <Column width="5%" className='ant-table-cell_extra_4' title="QLDA" dataIndex="mng_proj_score" key="mng_proj_score" />
                            <Column width="5%" className='ant-table-cell_extra_5' title="Client - Server" dataIndex="cs_score" key="cs_score" />
                            <Column width="5%" className='ant-table-cell_extra_6' title="CTĐ - CTCT" dataIndex="plt_score" key="plt_score" />
                            {/* <Column width="5%" className='ant-table-cell_extra_7' title="KT_CNTT" dataIndex="tech_it_score" key="tech_it_score" />
                            <Column width="5%" className='ant-table-cell_extra_8' title="TT_CNTT" dataIndex="prac_score" key="finalScore" /> */}
                        </ColumnGroup>
                        {/* <Column width="10%" title="Trung bình chung" dataIndex="avarageScore" key="avarageScore" />
                        <Column width="10%" title="Xếp loại" dataIndex="classifiedAward" key="classifiedAward" /> */}
                    </Table>
                    <Table dataSource={classifiedStudent} className='table__score__subject'>    
                        <Column width="20%" title="Mã học viên" dataIndex="studentId" key="studentId" />
                        <Column width="40%" title="Trung bình chung" dataIndex="averageScore2" key="averageScore2" />
                        <Column width="40%" title="Xếp loại" dataIndex="classifiedStudent" key="classifiedStudent" />
                    </Table>
                </div>
            </Card>
            <ModalStatistic show={show} handleShowModal={handleShowModal} />
        </>
    )
}
export default ListClassifiedStudent