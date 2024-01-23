import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button, Form, FormFeedback, Input, Label, FormGroup } from "reactstrap"
import Flatpickr from 'react-flatpickr'
import Swal from "sweetalert2"
import classnames from 'classnames'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

const FormValidation = () => {
    const FormSchema = yup.object().shape({
        firstName: yup.string().min(6, "Tên người dùng phải có ít nhất 6 ký tự").required("Tên người dùng là trường bắt buộc"),
        userName: yup.string().min(6, "Tên đăng nhập phải có ít nhất 6 ký tự").required("Tên đăng nhập là trường bắt buộc"),
        birthday: yup.array().required("Ngày sinh là trường bắt buộc")
    })

    const defaultValues = {
        reactFlatpickr: null
    }
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(FormSchema),
        defaultValues: defaultValues
    })
    const [data, setData] = useState(null)

    const onSubmit = (data) => {
        setData(data)
        if (data) {
            Swal.fire({
                title: "Thêm mới thành công",
                text: "Yêu cầu đã được phê duyệt!",
                icon: "success",
                customClass: {
                    confirmButton: "btn btn-success",
                },
            }).then((result) => {
                console.log(result)
                reset({
                    firstName: '',
                    userName: ''
                })
            })
        }
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <Label className="form-label" for='firstName'>Tên người dùng</Label>
                <Controller
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="First Name"
                            invalid={errors.firstName && true}
                        />
                    )}
                />
                {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label className="form-label" for='userName'>Tên đăng nhập</Label>
                <Controller
                    control={control}
                    name="userName"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Username"
                            invalid={errors.userName && true}
                        />
                    )}
                />
                {errors.userName && <FormFeedback>{errors.userName.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label className="form-label" for='react-flatpickr'>Ngày sinh</Label>
                <Controller
                    control={control}
                    id='react-flatpickr'
                    name="birthday"
                    render={({ field }) => (
                        <Flatpickr
                            {...field}
                            placeholder='YYYY-MM-DD'
                            options={{ allowInput: false }}
                            defaultValue={['2023-08-30', '2023-09-30']}
                            className={classnames('form-control', {
                                'is-invalid': errors.birthday
                            })}
                        />
                    )}
                />
                {errors.birthday && (<FormFeedback>{errors.birthday?.message}</FormFeedback>)}
            </FormGroup>
            <Button className="btn mt-1" title="Submit">Click</Button>
        </Form>
    )
}

export default FormValidation