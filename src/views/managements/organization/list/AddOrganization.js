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
import { GetHigherLevelOrganizations, GetListOrganizationLevel, GetListOrganizationType, addOrganization } from '../../../../api/organizationAPI'

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]

const AddOrganization = ({ open, handleAddModal, getData }) => {
    // ** States
    const AddOrganizationFormSchema = yup.object().shape({
        organizationCode: yup.string().required("Đây là trường bắt buộc"),
        organizationName: yup.string().required("Đây là trường bắt buộc"),
        organization_TypeId: yup.object().required("Đây là trường bắt buộc"),
        organization_LevelId: yup.object().required("Đây là trường bắt buộc"),
        organization_ParentId: yup.object().required("Đây là trường bắt buộc")
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
        resolver: yupResolver(AddOrganizationFormSchema)
    })

    const handleCloseModal = () => {
        handleAddModal()
        reset({
            organizationCode: '',
            organizationName: '',
            organization_TypeId: '',
            organization_LevelId: '',
            organization_ParentId: ''
        })
    }

    const onSubmit = data => {
        console.log(data.organization_LevelId.value)
        addOrganization({
            organizationCode: data.organizationCode,
            organizationName: data.organizationName,
            organization_TypeId: data.organization_TypeId.value,
            organization_LevelId: data.organization_LevelId.value,
            organization_ParentId: data.organization_ParentId.value,
            description: data.description,
            address: data.address
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

    const [listOrganizationType, setListOrganizationType] = useState([])
    const [listOrganizationLevel, setListOrganizationLevel] = useState([])
    const [listOrganizationHigherLevel, setListOrganizationHigherLevel] = useState([])

    useEffect(() => {
        GetListOrganizationType(10, 1, '').then(result => {
            const types = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.description
                }
            })
            setListOrganizationType(types)
        })

        GetListOrganizationLevel().then(result => {
            const levels = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListOrganizationLevel(levels)
        })
    }, [])

    const handleChangeOrganizationLevel = (value) => {
        GetHigherLevelOrganizations(value?.value).then(result => {
            const higherLevels = result?.map(item => {
                return {
                    value: item.organizationLevelId,
                    label: item.organizationName
                }
            })
            setListOrganizationHigherLevel(higherLevels)
        })
        setValue('organization_LevelId', value)
    }

    return (
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleAddModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm đơn vị</h1>
                    <p>Đơn vị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organizationCode'>
                            Mã đơn vị
                        </Label>
                        <Controller
                            control={control}
                            name='organizationCode'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='organizationCode'
                                        placeholder='John'
                                        invalid={errors.organizationCode && true}
                                    />
                                )
                            }}
                        />
                        {errors.organizationCode && <FormFeedback>{errors.organizationCode.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organizationName'>
                            Tên đơn vị
                        </Label>
                        <Controller
                            name='organizationName'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='organizationName' placeholder='Doe' invalid={errors.organizationName && true} />
                            )}
                        />
                        {errors.organizationName && <FormFeedback>{errors.organizationName.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_TypeId'>
                            Loại đơn vị
                        </Label>
                        <Controller
                            name='organization_TypeId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn loại..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganizationType}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_TypeId && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.organization_TypeId && <FormFeedback>{errors.organization_TypeId.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_LevelId'>
                            Cấp đơn vị
                        </Label>
                        <Controller
                            name='organization_LevelId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn cấp..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganizationLevel}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_LevelId && true })}
                                    {...field}
                                    onChange={handleChangeOrganizationLevel}
                                />
                            )}
                        />
                        {errors.organization_LevelId && <FormFeedback>{errors.organization_LevelId.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='address'>
                            Vị trí
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
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_ParentId'>
                            Đơn vị cấp trên
                        </Label>
                        <Controller
                            name='organization_ParentId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn cấp..."
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganizationHigherLevel}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_ParentId && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.organization_ParentId && <FormFeedback>{errors.organization_ParentId.message}</FormFeedback>}
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

export default AddOrganization