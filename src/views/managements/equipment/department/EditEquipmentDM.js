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
import { updateEquipmentType } from '../../../../api/equipmentAPI'
import { GetListState } from '../../../../api/stateAPI'

const statusOptions = [
    { value: 'HĐ', label: 'Hoạt động' },
    { value: 'KHĐ', label: 'Không hoạt động' },
    { value: 'BK', label: 'Bị khóa' }
]

const EditEquipmentDM = ({ open, handleCloseModal, handleEditModal, editEquipmentType, getData }) => {
    // ** States
    const EditEquipmentDMFormSchema = yup.object().shape({
        code: yup.string().required("Đây là trường bắt buộc"),
        name: yup.string().required("Đây là trường bắt buộc"),
        isActive: yup.object().required("Đây là trường bắt buộc"),
        description: yup.string().required("Đây là trường bắt buộc"),
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
        resolver: yupResolver(EditEquipmentDMFormSchema),
    })

    useEffect(() => {
        GetListState().then(result => {
            const stateOptions = result.map(item => {
                return {
                    value: item.stateCode,
                    label: item.stateName
                }
            })
            setListState(stateOptions)
        }).catch(error => {
            console.log(error)
        })
    }, [])
    
    const onSubmit = (data) => {
        const updatedData = {
            id: editEquipmentType.id,
            code: data.code,
            name: data.name,
            isActive: data.isActive.label,
            description: data.description
        }
        updateEquipmentType(updatedData).then(result => {
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

    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật danh mục trang thiết bị</h1>
                    <p>Danh mục trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='code'>
                            Mã danh mục
                        </Label>
                        <Controller
                            defaultValue={editEquipmentType?.code}
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
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên danh mục
                        </Label>
                        <Controller
                            name='name'
                            defaultValue={editEquipmentType?.name}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='name' placeholder='Doe' invalid={errors.name && true} />
                            )}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='isActive'>
                            Trạng thái
                        </Label>
                        <Controller
                            defaultValue={{ value: editEquipmentType?.isActive, label: editEquipmentType?.isActive }}
                            id='react-select'
                            control={control}
                            name='isActive'
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn trạng thái..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listState}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.isActive && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.isActive && <FormFeedback>{errors.isActive.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={editEquipmentType?.description}
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

export default EditEquipmentDM