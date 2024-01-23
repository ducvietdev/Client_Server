// ** React Imports
import { useEffect, useState } from 'react'
// ** Reactstrap Imports
import {
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button
} from "reactstrap"

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { useRef } from 'react'
import Swal from 'sweetalert2'
import { addStudent } from '../../../api/studentAPI'
import { GetListCourse } from '../../../api/courseAPI'
import { GetListOrganizationLevel_3 } from '../../../api/organizationAPI'
import { GetListClassByOrganizationId } from '../../../api/classAPI'

const genderOptions = [
    { value: true, label: 'Nam' },
    { value: false, label: 'Nữ' }
]

const AddStudent = ({ open, handleAddModal, getData, pageSize, pageNumber }) => {
    // ** States
    const AddStudentFormSchema = yup.object().shape({
        student_id: yup.string().min(6, "Mã danh mục có ít nhất 8 ký tự").required("Đây là trường bắt buộc"),
        fullName: yup.string().required("Đây là trường bắt buộc"),
        birthday: yup.date().required("Đây là trường bắt buộc"),
        gender: yup.object().required("Đây là trường bắt buộc"),
        email: yup.string().required("Đây là trường bắt buộc"),
        phoneNumber: yup.string().required("Đây là trường bắt buộc"),
        address: yup.string().required("Đây là trường bắt buộc"),
        rank: yup.string().required("Đây là trường bắt buộc"),
        course_Id: yup.object().required("Đây là trường bắt buộc"),
        organization_Id: yup.object().required("Đây là trường bắt buộc"),
        class_Id: yup.object().required("Đây là trường bắt buộc"),
    })

    // ** Hooks
    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddStudentFormSchema)
    })

    const handleCloseModal = () => {
        handleAddModal()
        reset({
            student_id: '',
            fullName: '',
            email: '',
            birthday: '',
            gender: '',
            address: '',
            rank: '',
            phoneNumber: '',
            course_Id: '',
            organization_Id: '',
            class_Id: ''
        })
    }

    const onSubmit = data => {
        console.log(data)
        addStudent({
            address: data.address,
            birthday: data.birthday,
            class_Id: data.class_Id.value,
            course_Id: data.course_Id.value,
            email: data.email,
            fullName: data.fullName,
            gender: data.gender.value,
            organization_Id: data.organization_Id.value,
            phoneNumber: data.phoneNumber,
            rank: data.rank,
            student_id: data.student_id
        }).then(result => {
            if (result) {
                Swal.fire({
                    title: "Thêm mới thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    }
                }).then((result) => {
                    console.log(result)
                    handleCloseModal()
                })
            }
            getData(pageSize, pageNumber)
        }).catch(error => {
            console.log(error)
        })
    }

    const [listOrganization, setListOrganization] = useState([])
    const [listClass, setListClass] = useState([])
    const [listCourse, setListCourse] = useState([])

    useEffect(() => {
        GetListOrganizationLevel_3().then(result => {
            const organizations = result?.map(item => {
                return {
                    value: item.id,
                    label: item.organizationName
                }

            })
            setListOrganization(organizations)
        })

        GetListCourse().then(result => {
            const courses = result?.map(item => {
                return {
                    value: item.id,
                    label: item.courseName
                }

            })
            setListCourse(courses)
        })
    }, [])

    const handleChangeOrganization = (value, option) => {
        if (value?.value !== null) {
            GetListClassByOrganizationId(value?.value).then(result => {
                const classes = result?.list.map(item => {
                    return {
                        value: item.id,
                        label: item.className
                    }

                })
                setListClass(classes)
            })
        }
        setValue('organization_Id', value)
    }

    return (
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleAddModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm học viên</h1>
                    <p>Danh sách học viên</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='student_id'>
                            Mã học viên
                        </Label>
                        <Controller
                            control={control}
                            name='student_id'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='student_id'
                                        placeholder='John'
                                        invalstudent_id={errors.student_id && true}
                                    />
                                )
                            }}
                        />
                        {errors.student_id && <FormFeedback>{errors.student_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='fullName'>
                            Họ tên
                        </Label>
                        <Controller
                            name='fullName'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='fullName' placeholder='Doe' invalid={errors.fullName && true} />
                            )}
                        />
                        {errors.fullName && <FormFeedback>{errors.fullName.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='birthday'>
                            Ngày sinh
                        </Label>
                        <Controller
                            name='birthday'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='birthday' placeholder='Doe' invalid={errors.birthday && true} />
                            )}
                        />
                        {errors.birthday && <FormFeedback>{errors.birthday.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='gender'>
                            Giới tính
                        </Label>
                        <Controller
                            id="react-select"
                            name='gender'
                            control={control}
                            render={({ field }) => (
                                // <Input {...field} id='gender' placeholder='Doe' invalid={errors.gender && true} />
                                <Select
                                    placeholder="Chọn giới tính"
                                    classNamePrefix='select'
                                    name='clear'
                                    options={genderOptions}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.gender && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.gender && <FormFeedback>{errors.gender.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='email'>
                            Email
                        </Label>
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='email' placeholder='Doe' invalid={errors.email && true} />
                            )}
                        />
                        {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='phoneNumber'>
                            Số điện thoại
                        </Label>
                        <Controller
                            name='phoneNumber'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='phoneNumber' placeholder='Doe' invalid={errors.phoneNumber && true} />
                            )}
                        />
                        {errors.phoneNumber && <FormFeedback>{errors.phoneNumber.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='rank'>
                            Cấp bậc
                        </Label>
                        <Controller
                            name='rank'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='rank' placeholder='john.doe.007' />
                            )}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='course_Id'>
                            Khóa học
                        </Label>
                        <Controller
                            name='course_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn khóa học..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listCourse}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.course_Id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.course_Id && <FormFeedback>{errors.course_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_Id'>
                            Đơn vị
                        </Label>
                        <Controller
                            name='organization_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn đơn vị..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganization}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_Id && true })}
                                    {...field}
                                    onChange={handleChangeOrganization}
                                // onInputChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        {errors.organization_Id && <FormFeedback>{errors.organization_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='class_Id'>
                            Lớp biên chế
                        </Label>
                        <Controller
                            name='class_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn lớp..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listClass}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.class_Idid && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.class_Id && <FormFeedback>{errors.class_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='address'>
                            Quê quán
                        </Label>
                        <Controller
                            name='address'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='address' placeholder='Doe' invalid={errors.address && true} />
                            )}
                        />
                        {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            Thêm
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={handleCloseModal}>
                            Hủy
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default AddStudent