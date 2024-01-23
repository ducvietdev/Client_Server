// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import { selectThemeColors } from '../../../../utility/Utils'
import { User, Mail, Calendar, DollarSign, X } from 'react-feather'
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import classnames from 'classnames'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form, FormFeedback } from 'reactstrap'
import Select from 'react-select'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Swal from 'sweetalert2'
import { addUserLogin } from '../../../../api/userAPI'
import { GetListState } from '../../../../api/stateAPI'
import { GetListLevelByOrganizationId, GetListOrganization, GetListOrganizationLevel } from '../../../../api/organizationAPI'
import { GetListRole } from '../../../../api/roleAPI'

const colorOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isFixed: true },
    { value: 'purple', label: 'Purple', color: '#5243AA', isFixed: true },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: false },
    { value: 'orange', label: 'Orange', color: '#FF8B00', isFixed: false },
    { value: 'yellow', label: 'Yellow', color: '#FFC400', isFixed: false }
]

const AddUser = ({ open, handleAddModal, getData }) => {
    const AddUserFormSchema = yup.object().shape({
        user_Id: yup.string().required("Tên người dùng là trường bắt buộc"),
        fullName: yup.string().required("Tên người dùng là trường bắt buộc"),
        userName: yup.string().min(6, "Tên đăng nhập phải có ít nhất 6 ký tự").required("Tên đăng nhập là trường bắt buộc"),
        password: yup.string().required("Đây là trường bắt buộc"),
        creditCard: yup.string().max(12, "Căn cước công dân có 12 ký tự").required("Đây là trường bắt buộc"),
        state_Id: yup.object().required("Đây là trường bắt buộc"),
        organization_Id: yup.object().required("Đây là trường bắt buộc"),
        role_Id: yup.object().required("Đây là trường bắt buộc"),
        level_Id: yup.object().required("Đây là trường bắt buộc")
    })

    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddUserFormSchema),
    })
    // ** State
    const handleCloseModal = () => {
        handleAddModal()
        reset({
            fullName: '',
            userName: '',
            password: '',
            creditCard: '',
            state_Id: {},
            organization_Id: {},
            role_Id: {},
            level_Id: {}
        })
    }

    // ** Custom close btn
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleCloseModal} />

    const onSubmit = (data) => {
        addUserLogin({
            user_Id: data.user_Id,
            fullName: data.fullName,
            userName: data.userName,
            password: data.password,
            creditCard: data.creditCard,
            state_Id: data.state_Id.value,
            organization_Id: data.organization_Id.value,
            role_Id: data.role_Id.value,
            level_Id: data.level_Id.value
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

    const [listState, setListState] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [listRole, setListRole] = useState([])
    const [listOgLevel, setListOgLevel] = useState([])

    useEffect(() => {
        GetListState().then(result => {
            const states = result?.map(item => {
                return {
                    value: item.id,
                    label: item.stateName
                }
            })
            setListState(states)
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

        GetListRole(100, 1, '').then(result => {
            const roles = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListRole(roles)
        })

        GetListOrganizationLevel().then(result => {
            const levels = result?.list.map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListOgLevel(levels)
        })
    }, [])

    const handleChangeOrganization = (value) => {
        if (value.value !== 0) {
            GetListLevelByOrganizationId(value.value).then(result => {
                const level = {value: result.id, label: result.name}
                setValue('level_Id', level)
                // console.log(level)
            })
        }
        setValue('organization_Id', value)
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleAddModal}
            className='sidebar-sm modal-add__user'
            modalClassName='modal-slide-in'
            contentClassName='pt-0'
        >
            <ModalHeader className='mb-1' toggle={handleAddModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>Người dùng mới</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-1'>
                        <Label className='form-label' for='user_Id'>
                            Mã người dùng
                        </Label>
                        <Controller
                            control={control}
                            id='userId'
                            name='user_Id'
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupText>
                                        <User size={15} />
                                    </InputGroupText>
                                    <Input
                                        {...field}
                                        placeholder='Bruce Wayne'
                                        invalid={errors.user_Id && true}
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.user_Id && <FormFeedback>{errors.user_Id.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='creditCard'>
                            Căn cước công dân
                        </Label>
                        <Controller
                            control={control}
                            id='creditCard'
                            name='creditCard'
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupText>
                                        <User size={15} />
                                    </InputGroupText>
                                    <Input
                                        {...field}
                                        placeholder='Bruce Wayne'
                                        invalid={errors.creditCard && true}
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.creditCard && <FormFeedback>{errors.creditCard.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='full-name'>
                            Họ tên
                        </Label>
                        <Controller
                            control={control}
                            id='full-name'
                            name='fullName'
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupText>
                                        <User size={15} />
                                    </InputGroupText>
                                    <Input
                                        {...field}
                                        placeholder='Bruce Wayne'
                                        invalid={errors.fullName && true}
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.fullName && <FormFeedback>{errors.fullName.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='user-name'>
                            Tên đăng nhập
                        </Label>
                        <Controller
                            control={control}
                            id='user-name'
                            name='userName'
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupText>
                                        <User size={15} />
                                    </InputGroupText>
                                    <Input
                                        {...field}
                                        placeholder='Bruce Wayne'
                                        invalid={errors.userName && true}
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.userName && <FormFeedback>{errors.userName.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='password'>
                            Mật khẩu
                        </Label>
                        <Controller
                            control={control}
                            id='pass-word'
                            name='password'
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupText>
                                        <Mail size={15} />
                                    </InputGroupText>
                                    <Input
                                        {...field}
                                        placeholder='********'
                                        invalid={errors.password && true}
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='organization_Id'>
                            Đơn vị
                        </Label>
                        <Controller
                            id='react-select'
                            control={control}
                            name='organization_Id'
                            render={({ field }) => (
                                <InputGroup className='flex-nowrap'>
                                    <InputGroupText>
                                        <Calendar size={15} />
                                    </InputGroupText>
                                    <Select
                                        theme={selectThemeColors}
                                        classNamePrefix='select'
                                        name='clear'
                                        options={listOrganization}
                                        isClearable
                                        className={classnames('react-select', { 'is-invalid': errors.organization_Id && true })}
                                        {...field}
                                        onChange={handleChangeOrganization}
                                    />
                                </InputGroup>
                            )}
                        />
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='role_Id'>
                            Vai trò
                        </Label>
                        <Controller
                            id='react-select'
                            control={control}
                            name='role_Id'
                            render={({ field }) => (
                                <InputGroup className='flex-nowrap'>
                                    <InputGroupText>
                                        <DollarSign size={15} />
                                    </InputGroupText>
                                    <Select
                                        theme={selectThemeColors}
                                        classNamePrefix='select'
                                        name='clear'
                                        options={listRole}
                                        isClearable
                                        className={classnames('react-select', { 'is-invalid': errors.role_Id && true })}
                                        {...field}
                                    />
                                </InputGroup>
                            )}
                        />
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='level_Id'>
                            Cấp đơn vị
                        </Label>
                        <Controller
                            id='react-select'
                            control={control}
                            name='level_Id'
                            render={({ field }) => (
                                <InputGroup className='flex-nowrap'>
                                    <InputGroupText>
                                        <DollarSign size={15} />
                                    </InputGroupText>
                                    <Select
                                        theme={selectThemeColors}
                                        classNamePrefix='select'
                                        name='clear'
                                        options={listOgLevel}
                                        isClearable
                                        className={classnames('react-select', { 'is-invalid': errors.level_Id && true })}
                                        {...field}
                                    />
                                </InputGroup>
                            )}
                        />
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='state_Id'>
                            Trạng thái
                        </Label>
                        <Controller
                            id='react-select'
                            control={control}
                            name='state_Id'
                            render={({ field }) => (
                                <InputGroup className='flex-nowrap'>
                                    <InputGroupText>
                                        <DollarSign size={15} />
                                    </InputGroupText>
                                    <Select
                                        theme={selectThemeColors}
                                        classNamePrefix='select'
                                        name='clear'
                                        options={listState}
                                        isClearable
                                        className={classnames('react-select', { 'is-invalid': errors.state_Id && true })}
                                        {...field}
                                    />
                                </InputGroup>
                            )}
                        />
                    </div>
                    <Button className='me-1' color='primary' title='Submit'>
                        Thêm
                    </Button>
                    <Button color='secondary' onClick={handleCloseModal} outline>
                        Hủy
                    </Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default AddUser
