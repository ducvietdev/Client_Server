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
import { GetListPlanType, updateTrainingPlan } from '../../../../api/planAPI'
import { GetListSemesterByYearId } from '../../../../api/semesterAPI'
import { GetListSubjectBySemesterId } from '../../../../api/subjectAPI'
import { GetListOrganization } from '../../../../api/organizationAPI'
import { GetListEquipment } from '../../../../api/equipmentAPI'
import { GetListYear } from '../../../../api/yearAPI'

const genderOptions = [
    { value: true, label: 'Nam' },
    { value: false, label: 'Nữ' }
]

const EditTrainingPlan = ({ open, handleCloseModal, handleEditModal, editTrainingPlan, getData }) => {
    // ** States
    const EditTrainingPlanFormSchema = yup.object().shape({
        title: yup.string().required("Đây là trường bắt buộc"),
        soTiet: yup.number().required("Đây là trường bắt buộc"),
        start: yup.string().required("Đây là trường bắt buộc"),
        timeEnd: yup.string().required("Đây là trường bắt buộc"),
        location: yup.string().required("Đây là trường bắt buộc"),
        description: yup.string().required("Đây là trường bắt buộc"),
        tongSoBuoi: yup.number().required("Đây là trường bắt buộc"),
        year_Id: yup.object().required("Đây là trường bắt buộc"),
        type_Id: yup.object().required("Đây là trường bắt buộc"),
        semester_Id: yup.object().required("Đây là trường bắt buộc"),
        organization_Id: yup.object().required("Đây là trường bắt buộc"),
        equipment_Id: yup.object().required("Đây là trường bắt buộc"),
        subject_Id: yup.object().required("Đây là trường bắt buộc")
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
        resolver: yupResolver(EditTrainingPlanFormSchema)
    })

    // const handleCloseModal = () => {
    //     handleEditModal()
    //     reset({
    //         soTiet: '',
    //         timeStart: '',
    //         description: '',
    //         timeEnd: '',
    //         gender: '',
    //         type_Id: '',
    //         semester_Id: '',
    //         year_Id: '',
    //         organization_Id: '',
    //         equipment_Id: '',
    //         subject_Id: ''
    //     })
    // }

    const onSubmit = data => {
        const updatedData = {
            id: editTrainingPlan.id,
            title: data.title,
            soTiet: data.soTiet,
            start: data.start,
            timeEnd: data.timeEnd,
            location: data.location,
            description: data.description,
            tongSoBuoi: data.tongSoBuoi,
            year_Id: data.year_Id.value,
            type_Id: data.type_Id.value,
            semester_Id: data.semester_Id.value,
            organization_Id: data.organization_Id.value,
            equipment_Id: data.equipment_Id.value,
            subject_Id: data.subject_Id.value
        }
        updateTrainingPlan(updatedData).then(result => {
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
                getData()
            }
        })
    }

    const [listYear, setListYear] = useState([])
    const [listPlanType, setListPlanType] = useState([])
    const [listEquipment, setListEquipment] = useState([])
    const [listSemester, setListSemester] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [listSubject, setListSubject] = useState([])
    useEffect(() => {
        GetListYear().then(result => {
            const years = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.yearName
                }
            })
            setListYear(years)
        })

        GetListPlanType(100, 1, '').then(result => {
            const types = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListPlanType(types)
        })

        GetListEquipment(100, 1, '').then(result => {
            const equipments = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListEquipment(equipments)
        })

        GetListOrganization(100, 1, '').then(result => {
            const organizations = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.organizationName
                }
            })
            setListOrganization(organizations)
        })
    }, [])

    const handleChangeYear = (value) => {
        GetListSemesterByYearId(value.value).then(result => {
            const semesters = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.semesterName
                }
            })
            setListSemester(semesters)
        })
        setValue('year_Id', value)
    }

    const handleChangeSemester = (value) => {
        GetListSubjectBySemesterId(value?.value).then(result => {
            const subjects = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListSubject(subjects)
        })
        setValue('semester_Id', value)
    }

    console.log(editTrainingPlan)
    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật kế hoạch huấn luyện</h1>
                    <p>Kế hoạch huấn luyện</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='title'>
                            Chủ đề
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.title}
                            control={control}
                            name='title'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='title'
                                        placeholder='John'
                                        invalid={errors.title && true}
                                    />
                                )
                            }}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='soTiet'>
                            Số tiết
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.soTiet}
                            control={control}
                            name='soTiet'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='soTiet'
                                        placeholder='John'
                                        invalid={errors.soTiet && true}
                                    />
                                )
                            }}
                        />
                        {errors.soTiet && <FormFeedback>{errors.soTiet.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='start'>
                            Thời gian bắt đầu
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.start}
                            name='start'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='start' placeholder='Doe' invalid={errors.start && true} />
                            )}
                        />
                        {errors.start && <FormFeedback>{errors.start.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='timeEnd'>
                            Thời gian kết thúc
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.timeEnd}
                            name='timeEnd'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='timeEnd' placeholder='Doe' invalid={errors.timeEnd && true} />
                            )}
                        />
                        {errors.timeEnd && <FormFeedback>{errors.timeEnd.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='location'>
                            Vị trí
                        </Label>
                        <Controller
                            id="react-select"
                            defaultValue={editTrainingPlan?.location}
                            name='location'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='location' placeholder='Doe' invalid={errors.location && true} />
                                // <Select
                                //     placeholder="Chọn giới tính"
                                //     classNamePrefix='select'
                                //     name='clear'
                                //     options={genderOptions}
                                //     isClearable
                                //     className={classnames('react-select', { 'is-invalid': errors.location && true })}
                                //     {...field}
                                // />
                            )}
                        />
                        {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.description}
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Doe' invalid={errors.description && true} />
                            )}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='tongSoBuoi'>
                            Tổng số buổi
                        </Label>
                        <Controller
                            defaultValue={editTrainingPlan.sobuoi}
                            name='tongSoBuoi'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='tongSoBuoi' placeholder='Doe' invalid={errors.tongSoBuoi && true} />
                            )}
                        />
                        {errors.tongSoBuoi && <FormFeedback>{errors.tongSoBuoi.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='year_Id'>
                            Năm học
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.yearId, label: editTrainingPlan?.yearName }}
                            name='year_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn năm học..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listYear}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.year_Id && true })}
                                    {...field}
                                    onChange={handleChangeYear}
                                />
                            )}
                        />
                        {errors.year_Id && <FormFeedback>{errors.year_Id.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='semester_Id'>
                            Kỳ học
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.semesterId, label: editTrainingPlan?.semesterName }}
                            name='semester_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn kỳ học..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listSemester}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.semester_Id && true })}
                                    {...field}
                                    onChange={handleChangeSemester}
                                />
                            )}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_Id'>
                            Đơn vị
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.organizationId, label: editTrainingPlan?.organzationName    }}
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
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.organization_Id && <FormFeedback>{errors.organization_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='equipment_Id'>
                            Trang thiết bị
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.equipmentId, label: editTrainingPlan?.equipmentName }}
                            name='equipment_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn thiết bị..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listEquipment}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.equipment_Id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                // onInputChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        {errors.equipment_Id && <FormFeedback>{errors.equipment_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='subject_Id'>
                            Môn học
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.subjectId, label: editTrainingPlan?.subjectName }}
                            name='subject_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn môn..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listSubject}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.subject_Id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.subject_Id && <FormFeedback>{errors.subject_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='type_Id'>
                            Loại kế hoạch
                        </Label>
                        <Controller
                            defaultValue={{ value: editTrainingPlan?.typeId, label: editTrainingPlan?.typeName }}
                            name='type_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn loại KH..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listPlanType}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.type_Id && true })}
                                    {...field}
                                // onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.type_Id && <FormFeedback>{errors.type_Id.message}</FormFeedback>}
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

export default EditTrainingPlan