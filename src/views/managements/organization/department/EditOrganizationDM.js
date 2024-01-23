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
import { updateOrganizationType } from '../../../../api/organizationAPI'

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]

const EditOrganizationDM = ({ open, handleCloseModal, handleEditModal, editOrganizationType, getData }) => {
    // ** States
    const EditOrganizationDMFormSchema = yup.object().shape({
        name: yup.string().required("Đây là trường bắt buộc"),
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
        resolver: yupResolver(EditOrganizationDMFormSchema)
    })

    // const handleCloseModal = () => {
    //     handleEditModal()
    //     reset({
    //         code: '',
    //         name: '',
    //         equipmentDM_status: ''
    //     })
    // }

    const onSubmit = (data) => {
        const updatedData = {
            id: editOrganizationType.id,
            name: data.name,
            description: data.description
        }
        updateOrganizationType(updatedData).then(result => {
            if (result) {
                Swal.fire({
                    title: "Cập nhật danh mục thành công",
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
                    <h1 className='mb-1'>Cập nhật danh mục</h1>
                    <p>Danh mục đơn vị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    {/* <Col xs={12}>
                        <Label className='form-label' for='code'>
                            Mã danh mục
                        </Label>
                        <Controller
                            defaultValue={editOrganizationType.code}
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
                    </Col> */}
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên danh mục
                        </Label>
                        <Controller
                            defaultValue={editOrganizationType.name}
                            name='name'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='name' placeholder='Doe' invalid={errors.name && true} />
                            )}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={editOrganizationType.description}
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

export default EditOrganizationDM