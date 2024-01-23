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
import Swal from 'sweetalert2'
import { GetListMonitorType, addMonitor } from '../../../api/monitorAPI'
import { GetListOrganization, GetListOrganizationLevel_3 } from '../../../api/organizationAPI'
import { GetListClassByOrganizationId } from '../../../api/classAPI'
import { GetListCourse } from '../../../api/courseAPI'

const genderOptions = [
    { value: true, label: 'Nam' },
    { value: false, label: 'Nữ' }
]

const AddMonitor = ({ open, handleAddModal, getData, pageSize, pageNumber }) => {
    // ** States
    const AddMonitorFormSchema = yup.object().shape({
        monitor_Id: yup.string().min(6, "Mã danh mục có ít nhất 8 ký tự").required("Đây là trường bắt buộc"),
        fullName: yup.string().required("Đây là trường bắt buộc"),
        birthday: yup.date().required("Đây là trường bắt buộc"),
        gender: yup.object().required("Đây là trường bắt buộc"),
        email: yup.string().required("Đây là trường bắt buộc"),
        phoneNumber: yup.string().required("Đây là trường bắt buộc"),
        address: yup.string().required("Đây là trường bắt buộc"),
        rank: yup.string().required("Đây là trường bắt buộc"),
        course_id: yup.object().required("Đây là trường bắt buộc"),
        organization_id: yup.object().required("Đây là trường bắt buộc"),
        class_id: yup.object().required("Đây là trường bắt buộc"),
        monitor_TypeId: yup.object().required("Đây là trường bắt buộc"),
    })

    // ** Hooks
    const {
        reset,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddMonitorFormSchema)
    })

    const handleCloseModal = () => {
        handleAddModal()
        reset({
            monitor_Id: '',
            fullName: '',
            email: '',
            birthday: '',
            gender: '',
            address: '',
            rank: '',
            phoneNumber: '',
            course_id: '',
            organization_id: '',
            class_id: '',
            monitor_TypeId: ''
        })
    }

    const onSubmit = data => {
        console.log(data)
        addMonitor({
            address: data.address,
            birthday: data.birthday,
            class_id: data.class_id.value,
            course_id: data.course_id.value,
            email: data.email,
            fullName: data.fullName,
            gender: data.gender.value,
            organization_id: data.organization_id.value,
            phoneNumber: data.phoneNumber,
            rank: data.rank,
            monitor_Id: data.monitor_Id,
            monitor_TypeId: data.monitor_TypeId.value
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
    const [listMonitorType, setListMonitorType] = useState([])

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

        GetListMonitorType().then(result => {
            console.log(result)
            const monitorTypes = result?.map(item => {
                return {
                    value: item.id,
                    label: item.monitorTypeName
                }
            })
            setListMonitorType(monitorTypes)
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

    return (
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleAddModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm cán bộ</h1>
                    <p>Danh sách cán bộ</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='monitor_Id'>
                            Mã cán bộ
                        </Label>
                        <Controller
                            control={control}
                            name='monitor_Id'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='monitor_Id'
                                        placeholder='John'
                                        invalmonitor_Id={errors.monitor_Id && true}
                                    />
                                )
                            }}
                        />
                        {errors.monitor_Id && <FormFeedback>{errors.monitor_Id.message}</FormFeedback>}
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
                    <Col sm={6} xs={12}>
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
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='monitor_TypeId'>
                            Loại cán bộ
                        </Label>
                        <Controller
                            name='monitor_TypeId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn loại CB..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listMonitorType}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.monitor_TypeId && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='course_id'>
                            Khóa học
                        </Label>
                        <Controller
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

export default AddMonitor