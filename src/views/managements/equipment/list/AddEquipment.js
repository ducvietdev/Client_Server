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
import { GetListEquipmentType, GetListEquipmentUnit, addEquipment, addEquipmentType } from '../../../../api/equipmentAPI'
import { GetListOrganization } from '../../../../api/organizationAPI'

const statusOptions = [
    { value: 'HĐ', label: 'Hoạt động' },
    { value: 'KHĐ', label: 'Không hoạt động' },
    { value: 'BK', label: 'Bị khóa' }
]

const AddEquipment = ({ open, handleAddModal, getData }) => {
    // ** States
    const AddEquipmentFormSchema = yup.object().shape({
        code: yup.string().required("Đây là trường bắt buộc"),
        name: yup.string().required("Đây là trường bắt buộc"),
        equipment_UnitId: yup.object().required("Đây là trường bắt buộc"),
        equipment_TypeId: yup.object().required("Đây là trường bắt buộc"),
        organization_Id: yup.object().required("Đây là trường bắt buộc"),
        quality: yup.string().required("Đây là trường bắt buộc"),
        yearUse: yup.number().required("Đây là trường bắt buộc"),
    })

    // ** Hooks
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddEquipmentFormSchema)
    })

    const handleCloseModal = () => {
        handleAddModal()
        reset({
            code: '',
            name: '',
            equipment_UnitId: '',
            equipment_TypeId: '',
            organization_Id: '',
            quality: '',
            yearUse: ''
        })
    }

    const [listEquipmentUnit, setListEquipmentUnit] = useState([])
    const [listEquipmentType, setListEquipmentType] = useState([])
    const [listOrganization, setListOrganization] = useState([])

    useEffect(() => {
        GetListEquipmentUnit(100, 1, '').then(result => {
            const equipmentUnits = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListEquipmentUnit(equipmentUnits)
        })
        GetListEquipmentType(100, 1, '').then(result => {
            const equipmentTypes = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListEquipmentType(equipmentTypes)
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
    
    console.log(listOrganization)
    const onSubmit = data => {
        console.log(data)
        addEquipment({
            code: data.code,
            name: data.name,
            equipment_UnitId: data.equipment_UnitId.value,
            equipment_TypeId: data.equipment_TypeId.value,
            organization_Id: data.organization_Id.value,
            quality: data.quality,
            yearUse: data.yearUse
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
            getData()
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleAddModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm thiết bị</h1>
                    <p>Danh sách trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='code'>
                            Mã thiết bị
                        </Label>
                        <Controller
                            control={control}
                            name='code'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='code'
                                        placeholder='John'
                                        invalid={errors.code && true}
                                    />
                                )
                            }}
                        />
                        {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='name'>
                            Tên thiết bị
                        </Label>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='name' placeholder='Doe' invalid={errors.name && true} />
                            )}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='equipment_UnitId'>
                            Đơn vị tính
                        </Label>
                        <Controller
                            name='equipment_UnitId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn đv tính ..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listEquipmentUnit}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.equipment_UnitId && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.equipment_UnitId && <FormFeedback>{errors.equipment_UnitId.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='equipment_TypeId'>
                            Loại thiết bị
                        </Label>
                        <Controller
                            name='equipment_TypeId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn danh mục ..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listEquipmentType}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.equipment_TypeId && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.equipment_TypeId && <FormFeedback>{errors.equipment_TypeId.message}</FormFeedback>}
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
                                    placeholder="Chọn đơn vị ..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganization}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_Id && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.organization_Id && <FormFeedback>{errors.organization_Id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='quality'>
                            Chất lượng
                        </Label>
                        <Controller
                            name='quality'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='quality' placeholder='Doe' invalid={errors.quality && true} />
                            )}
                        />
                        {errors.quality && <FormFeedback>{errors.quality.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='yearUse'>
                            Năm sử dụng
                        </Label>
                        <Controller
                            name='yearUse'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='yearUse' placeholder='Doe' invalid={errors.yearUse && true} />
                            )}
                        />
                        {errors.yearUse && <FormFeedback>{errors.yearUse.message}</FormFeedback>}
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

export default AddEquipment