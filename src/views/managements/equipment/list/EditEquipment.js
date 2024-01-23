// ** React Imports
import { useState, useEffect } from 'react'
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
import { GetListEquipmentType, GetListEquipmentUnit, updateEquipment } from '../../../../api/equipmentAPI'
import { GetListState } from '../../../../api/stateAPI'
import { GetListOrganization } from '../../../../api/organizationAPI'

const statusOptions = [
    { value: 'HĐ', label: 'Hoạt động' },
    { value: 'KHĐ', label: 'Không hoạt động' },
    { value: 'BK', label: 'Bị khóa' }
]

const EditEquipment = ({ open, handleCloseModal, handleEditModal, editEquipment, getData }) => {
    // ** States
    const EditEquipmentFormSchema = yup.object().shape({
        code: yup.string().required("Đây là trường bắt buộc"),
        name: yup.string().required("Đây là trường bắt buộc"),
        equipment_UnitId: yup.object().required("Đây là trường bắt buộc"),
        equipment_TypeId: yup.object().required("Đây là trường bắt buộc"),
        organization_Id: yup.object().required("Đây là trường bắt buộc"),
        quality: yup.string().required("Đây là trường bắt buộc"),
        yearUse: yup.number().required("Đây là trường bắt buộc"),
    })
    const [listState, setListState] = useState([])

    // ** Hooks
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditEquipmentFormSchema),
    })

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
    
    const onSubmit = (data) => {
        console.log(data)
        const updatedData = {
            id: editEquipment.id,
            code: data.code,
            name: data.name,
            equipment_UnitId: data.equipment_UnitId.value,
            equipment_TypeId: data.equipment_TypeId.value,
            organization_Id: data.organization_Id.value,
            quality: data.quality,
            yearUse: data.yearUse
        }
        updateEquipment(updatedData).then(result => {
            if (result) {
                Swal.fire({
                    title: "Cập nhật người dùng thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    handleCloseModal()
                })
            }
            getData()
        }).catch(error => {
            console.log(error)
        })
    }
    console.log(editEquipment)

    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật danh mục trang thiết bị</h1>
                    <p>Danh mục trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='code'>
                            Mã danh mục
                        </Label>
                        <Controller
                            defaultValue={editEquipment?.code}
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
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='name'>
                            Tên danh mục
                        </Label>
                        <Controller
                            name='name'
                            defaultValue={editEquipment?.name}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='name' placeholder='Doe' invalid={errors.name && true} />
                            )}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='equipment_UnitId'>
                            Đơn vị tính
                        </Label>
                        <Controller
                            defaultValue={{ value: editEquipment?.unitId, label: editEquipment?.unitName }}
                            id='react-select'
                            control={control}
                            name='equipment_UnitId'
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn trạng thái..."
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
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='equipment_TypeId'>
                            Loại thiết bị
                        </Label>
                        <Controller
                            defaultValue={{ value: editEquipment?.typeId, label: editEquipment?.typeName }}
                            name='equipment_TypeId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn trạng thái..."
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
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='organization_Id'>
                            Đơn vị
                        </Label>
                        <Controller
                            defaultValue={{ value: editEquipment?.organizationId, label: editEquipment?.organizationName }}
                            name='organization_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn trạng thái..."
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
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='quality'>
                            Chất lượng
                        </Label>
                        <Controller
                            name='quality'
                            defaultValue={editEquipment?.quality}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='quality' placeholder='Doe' invalid={errors.quality && true} />
                            )}
                        />
                        {errors.quality && <FormFeedback>{errors.quality.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='yearUse'>
                            Năm sử dụng
                        </Label>
                        <Controller
                            name='yearUse'
                            defaultValue={editEquipment?.yearUse}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='yearUse' placeholder='Doe' invalid={errors.yearUse && true} />
                            )}
                        />
                        {errors.yearUse && <FormFeedback>{errors.yearUse.message}</FormFeedback>}
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

export default EditEquipment