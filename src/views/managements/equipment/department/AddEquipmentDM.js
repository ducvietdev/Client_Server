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
import { addEquipmentType } from '../../../../api/equipmentAPI'
import { GetListState } from '../../../../api/stateAPI'

const statusOptions = [
    { value: 'HĐ', label: 'Hoạt động' },
    { value: 'KHĐ', label: 'Không hoạt động' },
    { value: 'BK', label: 'Bị khóa' }
]

const AddEquipmentDM = ({ open, handleAddModal, getData }) => {
    // ** States
    const AddEquipmentDMFormSchema = yup.object().shape({
        code: yup.string().required("Đây là trường bắt buộc"),
        name: yup.string().required("Đây là trường bắt buộc"),
        isActive: yup.object().required("Đây là trường bắt buộc")
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
        resolver: yupResolver(AddEquipmentDMFormSchema)
    })

    const handleCloseModal = () => {
        handleAddModal()
        reset({
            code: '',
            name: '',
            isActive: ''
        })
    }

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

    const onSubmit = data => {
        addEquipmentType({
            code: data.code,
            name: data.name,
            isActive: data.isActive.label,
            description: data.description
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
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleAddModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm danh mục</h1>
                    <p>Danh mục trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='code'>
                            Mã danh mục
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
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên danh mục
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
                    <Col xs={12}>
                        <Label className='form-label' for='isActive'>
                            Trạng thái
                        </Label>
                        <Controller
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
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Description
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

export default AddEquipmentDM