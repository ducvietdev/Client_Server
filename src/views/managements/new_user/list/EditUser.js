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
import { updateUserLogin } from '../../../../api/userAPI'
import { GetListState } from '../../../../api/stateAPI'
import { GetListLevelByOrganizationId, GetListOrganization, GetListOrganizationLevel } from '../../../../api/organizationAPI'
import { GetListRole } from '../../../../api/roleAPI'

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
]

const EditUser = ({ open, handleCloseModal, handleEditModal, editUserLogin, getData }) => {
    // ** States
    const EditUserFormSchema = yup.object().shape({
        user_id: yup.string().min(6, "Mã danh mục có ít nhất 6 ký tự").required("Đây là trường bắt buộc"),
        creditCard: yup.string().required("Đây là trường bắt buộc"),
        username: yup.string().required("Đây là trường bắt buộc"),
        fullName: yup.string().required("Đây là trường bắt buộc"),
        state_id: yup.object().required("Đây là trường bắt buộc"),
        organization_id: yup.object().required("Đây là trường bắt buộc"),
        role_id: yup.object().required("Đây là trường bắt buộc"),
        level_id: yup.object().required("Đây là trường bắt buộc")
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
        resolver: yupResolver(EditUserFormSchema),
    })

    // const handleCloseModal = () => {
    //     handleEditModal()
    //     reset({
    //         user_id: '',
    //         username1: '',
    //         fullName: ''
    //     })
    // }

    const onSubmit = data => {
        const updatedData = {
            id: editUserLogin.id,
            creditCard: data.creditCard,
            fullName: data.fullName,
            userName: data.username,
            password: editUserLogin.password,
            state_Id: data.state_id.value,
            organization_Id: data.organization_id.value,
            role_Id: data.role_id.value,
            level_Id: data.level_id.value
        }
        updateUserLogin(updatedData).then(result => {
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
                setValue('level_id', level)
            })
        }
        setValue('organization_id', value)
    }

    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật người dùng</h1>
                    <p>Danh mục trang thiết bị</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='user_id'>
                            Mã người dùng
                        </Label>
                        <Controller
                            defaultValue={editUserLogin?.id}
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
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='creditCard'>
                            Căn cước công dân
                        </Label>
                        <Controller
                            name='creditCard'
                            defaultValue={editUserLogin?.creditCard}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='creditCard' placeholder='Doe' invalid={errors.creditCard && true} />
                            )}
                        />
                        {errors.creditCard && <FormFeedback>{errors.creditCard.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='fullName'>
                            Họ tên người dùng
                        </Label>
                        <Controller
                            defaultValue={editUserLogin?.fullName}
                            name='fullName'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='fullName' placeholder='Doe' invalid={errors.fullName && true} />
                            )}
                        />
                        {errors.fullName && <FormFeedback>{errors.fullName.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='username'>
                            Tên đăng nhập
                        </Label>
                        <Controller
                            name='username'
                            defaultValue={editUserLogin?.userName}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='username' placeholder='Doe' invalid={errors.username && true} />
                            )}
                        />
                        {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='organization_id'>
                            Đơn vị
                        </Label>
                        <Controller
                            defaultValue={{ value: editUserLogin?.organizationId, label: editUserLogin?.organizationName }}
                            id='react-select'
                            control={control}
                            name='organization_id'
                            render={({ field }) => (
                                <Select
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOrganization}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.organization_id && true })}
                                    {...field}
                                    onChange={handleChangeOrganization}
                                />
                            )}
                        />
                        {errors.organization_id && <FormFeedback>{errors.organization_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='level_id'>
                            Cấp đơn vị
                        </Label>
                        <Controller
                            defaultValue={{ value: editUserLogin?.levelId, label: editUserLogin?.levelName }}
                            id='react-select'
                            control={control}
                            name='level_id'
                            render={({ field }) => (
                                <Select
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listOgLevel}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.level_id && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.level_id && <FormFeedback>{errors.level_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='role_id'>
                            Vai trò
                        </Label>
                        <Controller
                            defaultValue={{ value: editUserLogin?.roleId, label: editUserLogin?.roleName }}
                            id='react-select'
                            control={control}
                            name='role_id'
                            render={({ field }) => (
                                <Select
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listRole}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.role_id && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.role_id && <FormFeedback>{errors.role_id.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='state_id'>
                            Trạng thái
                        </Label>
                        <Controller
                            defaultValue={{ value: editUserLogin?.stateId, label: editUserLogin?.stateName }}
                            id='react-select'
                            control={control}
                            name='state_id'
                            render={({ field }) => (
                                <Select
                                    theme={selectThemeColors}
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listState}
                                    isClearable
                                    className={classnames('react-select', { 'is-invalid': errors.state_id && true })}
                                    {...field}
                                />
                            )}
                        />
                        {errors.state_id && <FormFeedback>{errors.state_id.message}</FormFeedback>}
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

export default EditUser