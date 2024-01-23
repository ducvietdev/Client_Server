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
import { getStudentById, updateStudent } from '../../../api/studentAPI'
import { GetListOrganizationLevel_3 } from '../../../api/organizationAPI'
import { GetListCourse } from '../../../api/courseAPI'
import { GetListClassByOrganizationId } from '../../../api/classAPI'

const genderOptions = [
    { value: true, label: 'Nam' },
    { value: false, label: 'Nữ' }
]

const EditStudent = ({ open, handleCloseModal, handleEditModal, editStudent, getData }) => {
    // ** States
    const EditStudentFormSchema = yup.object().shape({
        student_id: yup.string().min(6, "Mã danh mục có ít nhất 8 ký tự").required("Đây là trường bắt buộc"),
        fullName: yup.string().required("Đây là trường bắt buộc"),
        birthday: yup.date().required("Đây là trường bắt buộc"),
        gender: yup.object().required("Đây là trường bắt buộc"),
        email: yup.string().required("Đây là trường bắt buộc"),
        phoneNumber: yup.string().required("Đây là trường bắt buộc"),
        address: yup.string().required("Đây là trường bắt buộc"),
        rank: yup.string().required("Đây là trường bắt buộc"),
        course_id: yup.object().required("Đây là trường bắt buộc"),
        organization_id: yup.object().required("Đây là trường bắt buộc"),
        class_id: yup.object().required("Đây là trường bắt buộc")
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
        resolver: yupResolver(EditStudentFormSchema)
    })

    // const handleCloseModal = () => {
    //     handleEditModal()
    //     reset({
    //         student_id: '',
    //         fullName: '',
    //         email: '',
    //         birthday: '',
    //         gender: '',
    //         address: '',
    //         rank: '',
    //         phoneNumber: '',
    //         course_id: '',
    //         organization_id: '',
    //         class_id: ''
    //     })
    // }

    const onSubmit = data => {
        const updatedData = {
            student_Id: data.student_id,
            fullName: data.fullName,
            address: data.address,
            gender: data.gender.value,
            email: data.email,
            phoneNumber: data.phoneNumber,
            birthday: data.birthday,
            rank: data.rank,
            organization_Id: data.organization_id.value,
            course_Id: data.course_id.value,
            class_Id: data.class_id.value
        }
        updateStudent(updatedData).then(result => {
            if (result) {
                Swal.fire({
                    title: "Cập nhật thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    console.log(result)
                    handleCloseModal()
                })
            }
            getData()
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
        setValue('organization_id', value)
    }
    console.log(editStudent)

    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật học viên</h1>
                    <p>Học viên</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='student_id'>
                            Mã học viên
                        </Label>
                        <Controller
                            defaultValue={editStudent.id}
                            control={control}
                            name='student_id'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='student_id'
                                        placeholder='John'
                                        invalid={errors.student_id && true}
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
                            defaultValue={editStudent.fullName}
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
                            defaultValue={editStudent.birthday}
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
                            defaultValue={{value: editStudent?.gender, label: editStudent?.gender === true ? 'Nam' : 'Nữ'}}
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
                            defaultValue={editStudent.email}
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
                            defaultValue={editStudent.phoneNumber}
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
                            defaultValue={editStudent.rank}
                            name='rank'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='rank' placeholder='john.doe.007' />
                            )}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='course_id'>
                            Khóa học
                        </Label>
                        <Controller
                            defaultValue={{value: editStudent?.courseId, label: editStudent?.courseName}}
                            name='course_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn khóa học..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listCourse}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.course_id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.course_id && <FormFeedback>{errors.course_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_id'>
                            Đơn vị
                        </Label>
                        <Controller
                            defaultValue={{ value: editStudent?.organizationId, label: editStudent?.organizationName }}
                            name='organization_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn đơn vị..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganization}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_id && true })}
                                    {...field}
                                    onChange={handleChangeOrganization}
                                // onInputChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        {errors.organization_id && <FormFeedback>{errors.organization_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='class_id'>
                            Lớp biên chế
                        </Label>
                        <Controller
                            defaultValue={{ value: editStudent?.classId, label: editStudent?.className }}
                            name='class_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn lớp..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listClass}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.class_id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.class_id && <FormFeedback>{errors.class_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='address'>
                            Quê quán
                        </Label>
                        <Controller
                            defaultValue={editStudent.address}
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
                            Cập nhật
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

export default EditStudent