// ** React Imports
import { useState } from 'react'
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

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]

const EditEquipmentUnit = ({ open, handleEditModal }) => {
    // ** States
    const EditEquipmentUnitFormSchema = yup.object().shape({
        equipment_unit_name: yup.string().required("Đây là trường bắt buộc"),
    })

    const [infoEquipmentUnit, setInfoEquipmentUnit] = useState({
        equipment_unit_name: 'Cái'
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
        resolver: yupResolver(EditEquipmentUnitFormSchema),
        defaultValues: infoEquipmentUnit
    })

    const handleCloseModal = () => {
        handleEditModal()
        reset({
            equipment_unit_name: ''
        })
    }

    const onSubmit = data => {
        if (data) {
            Swal.fire({
                title: "Cập nhật người dùng thành công",
                text: "Yêu cầu đã được phê duyệt!",
                icon: "success",
                customClass: {
                    confirmButton: "btn btn-success",
                },
            }).then((result) => {
                handleCloseModal()
                setInfoEquipmentUnit(null)
            })
        }
    }

    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleEditModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật đơn vị tính</h1>
                    <p>Đơn vị tính của trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='user_id'>
                            Mã đơn vị tính
                        </Label>
                        <Controller
                            disabled
                            control={control}
                            name='user_id'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='user_id'
                                        placeholder='John'
                                        invalid={errors.user_id && true}
                                    />
                                )
                            }}
                        />
                        {errors.user_id && <FormFeedback>{errors.user_id.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='equipment_unit_name'>
                            Tên đơn vị tính
                        </Label>
                        <Controller
                            name='equipment_unit_name'
                            defaultValue={infoEquipmentUnit?.equipment_unit_name}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='equipment_unit_name' placeholder='Doe' invalid={errors.equipment_unit_name && true} />
                            )}
                        />
                        {errors.equipment_unit_name && <FormFeedback>{errors.equipment_unit_name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input type='textarea' {...field} id='description' placeholder='john.doe.007' />
                            )}
                        />
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

export default EditEquipmentUnit