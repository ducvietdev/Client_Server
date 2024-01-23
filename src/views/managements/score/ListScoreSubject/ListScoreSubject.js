import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Table } from 'antd';
import { Row, Col, Card, CardHeader, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label, UncontrolledTooltip, Toast } from 'reactstrap';
import Select from 'react-select'
import './style.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useNavigation } from '../../../../utility/hooks/useNavigation';
import { GetListOrganizationLevel_3, GetOgAndSubOgs } from '../../../../api/organizationAPI';
import { GetListClassByOrganizationId } from '../../../../api/classAPI';
import { GetListYear } from '../../../../api/yearAPI';
import { GetListSemesterByYearId } from '../../../../api/semesterAPI';
import { GetListSubjectBySemesterId } from '../../../../api/subjectAPI';
import { GetScore } from '../../../../api/scoreAPI';
import { useSelector } from 'react-redux';
import { GetOgDoubleById } from '../../../../api/permission';
import { Edit, Trash } from 'react-feather';

const { Column, ColumnGroup } = Table;
const ListScoreSubject = () => {
    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }

    const dataLogin = useSelector(state => state.auth)
    const [listScore, setListScore] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [listClass, setListClass] = useState([])
    const [listYear, setListYear] = useState([])
    const [listSemester, setListSemester] = useState([])
    const [listSubject, setListSubject] = useState([])
    const [dataId, setDataId] = useState({
        yearId: 0,
        semesterId: 0,
        subjectId: 0,
        organizationId: 0,
        classId: 0
    })

    const classRef = useRef()
    const semeterRef = useRef()
    const subjectRef = useRef()

    useEffect(() => {
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
    }, [])

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
            setDataId({ ...dataId, organizationId: value.value })
            GetListClassByOrganizationId(value.value).then(result => {
                const classes = result?.list.map(item => {
                    return {
                        value: item.id,
                        label: item.className
                    }
                })
                setListClass(classes)
                classRef.current.clearValue()
            }).catch(error => {
                console.log(error)
            })
        }
    }

    const handleChangeClass = (value) => {
        if (value?.value !== 0) {
            console.log(value)
            setDataId({ ...dataId, classId: value?.value })
        }
    }

    const handleChangeYear = (value) => {
        if (value?.value !== 0) {
            setDataId({ ...dataId, yearId: value?.value })
            GetListSemesterByYearId(value?.value).then(result => {
                const semesters = result?.list.map(item => {
                    return {
                        value: item.id,
                        label: item.semesterName
                    }
                })
                setListSemester(semesters)
                // semeterRef.current.clearValue()
                subjectRef.current.clearValue()
            }).catch(error => {
                console.log(error)
            })
        }
    }

    const handleChangeSemester = (value) => {
        if (value?.value !== 0) {
            setDataId({ ...dataId, semesterId: value?.value })
            GetListSubjectBySemesterId(value?.value).then(result => {
                const subjects = result?.list.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                setListSubject(subjects)
                subjectRef.current.clearValue()
            }).catch(error => {
                console.log(error)
            })
        }
    }

    const handleChangeSubject = (value) => {
        if (value?.value !== 0) {
            console.log(value)
            setDataId({ ...dataId, subjectId: value?.value })
        }
    }

    const handleSearchScore = () => {
        GetScore(dataId.organizationId, dataId.yearId, dataId.semesterId, dataId.subjectId, dataId.classId).then(result => {
            if (result) {
                setListScore(result)
            } else {
                Toast('Không có thông tin về điểm!!!')
            }
        }).catch(error => {
            console.log(error)
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
                    <CardTitle tag='h4'>Danh sách điểm học viên</CardTitle>
                </CardHeader>
                <Row className='justify-content-end align-items-end mx-0 options__score'>
                    <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
                        <Label className='form-label'>
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
                    <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
                        <Label className='form-label'>
                            Lớp
                        </Label>
                        <Select
                            ref={classRef}
                            className='react-select'
                            classNamePrefix='select'
                            options={listClass}
                            placeholder="Chọn lớp ..."
                            onChange={handleChangeClass}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
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
                    <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
                        <Label className='form-label'>
                            Kỳ học
                        </Label>
                        <Select
                            ref={semeterRef}
                            className='react-select'
                            classNamePrefix='select'
                            options={listSemester}
                            placeholder="Chọn kỳ ..."
                            onChange={handleChangeSemester}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
                        <Label className='form-label'>
                            Môn học
                        </Label>
                        <Select
                            ref={subjectRef}
                            className='react-select'
                            classNamePrefix='select'
                            options={listSubject}
                            placeholder="Chọn môn..."
                            onChange={handleChangeSubject}
                        />
                    </Col>
                    <Col className='d-flex flex-column mt-1 mb-1 col__btn' md='2' sm='12'>
                        <Button className='btn btn-primary btn__search' onClick={handleSearchScore}>Tìm kiếm</Button>
                    </Col>
                </Row>
                <div className='react-dataTable whole-table__score__subject'>

                    <Table dataSource={listScore.list} className='table__score__subject'>
                        <Column width="3%" title="STT" dataIndex="id" key="id" />
                        <Column title="Họ và tên" dataIndex="studentName" key="studentName" />
                        <Column title="Ngày sinh" dataIndex="birthday" key="birthday" />
                        <ColumnGroup className='ant-table-cell_group' title="Điểm">
                            <Column width="10%" title="Chuyên cần" dataIndex="diemchuyencan" key="diemchuyencan" />
                            <Column width="10%" title="Thường xuyên" dataIndex="diemthuongxuyen" key="diemthuongxuyen" />
                            <Column width="10%" className='ant-table-cell_extra_3' title="Điểm thi" dataIndex="diemthi" key="diemthi" />
                        </ColumnGroup>
                        <Column width="10%" title="Trung bình môn" dataIndex="diemtbmon" key="diemtbmon" />
                        <Column width="10%" title="Số tín chỉ" dataIndex="sotinchi" key="sotinchi" />
                        {/* <Column
                            title="Action"
                            key="action"
                            render={(_, record) => (
                                <div className='d-flex'>
                                    <Trash onClick={() => handleDeleteModal(record.id)} className="me-1" color="#ed2e2f" size={15} id="btn-trash" />
                                    <UncontrolledTooltip placement='top' target='btn-trash'>
                                        Xóa
                                    </UncontrolledTooltip>
                                    <Edit onClick={() => handleEditModal(record)} className="" size={15} id="btn-edit" />
                                    <UncontrolledTooltip placement='top' target='btn-edit'>
                                        Sửa
                                    </UncontrolledTooltip>
                                </div>
                            )}
                            align='center'
                        /> */}
                    </Table>
                </div>
            </Card>
        </>
    )
}
export default ListScoreSubject