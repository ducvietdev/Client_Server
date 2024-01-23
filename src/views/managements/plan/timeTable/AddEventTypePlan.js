// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { X } from 'react-feather'
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
import Select, { components } from 'react-select' // eslint-disable-line
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'

// ** Reactstrap Imports
import { Button, Modal, ModalHeader, ModalBody, Label, Input, Form } from 'reactstrap'

// ** Utils
import { selectThemeColors, isObjEmpty } from '@utils'

// ** Avatar Images
import img1 from '@src/assets/images/avatars/1-small.png'
import img2 from '@src/assets/images/avatars/3-small.png'
import img3 from '@src/assets/images/avatars/5-small.png'
import img4 from '@src/assets/images/avatars/7-small.png'
import img5 from '@src/assets/images/avatars/9-small.png'
import img6 from '@src/assets/images/avatars/11-small.png'

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { GetListYear } from '../../../../api/yearAPI'
import { GetListPlanType, addTrainingPlan } from '../../../../api/planAPI'
import { GetListEquipment } from '../../../../api/equipmentAPI'
import { GetListSemesterByYearId } from '../../../../api/semesterAPI'
import { GetListOrganization } from '../../../../api/organizationAPI'
import { GetListSubjectBySemesterId } from '../../../../api/subjectAPI'

const AddEventTypePlan = props => {
  // ** Props
  const {
    open,
    store,
    dispatch,
    addEvent,
    calendarApi,
    selectEvent,
    updateEvent,
    removeEvent,
    refetchEvents,
    calendarsColor,
    handleAddEventSidebar
  } = props

  // ** Vars & Hooks
  const selectedEvent = store.selectedEvent,
    {
      control,
      setError,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors }
    } = useForm({
      defaultValues: { title: '', soTiet: null, start: '', timeEnd: '', location: '', description: '', tongSoBuoi: null, year_id: null, semester_id: null, type_id: null, organization_id: null, equipment_id: null, subject_id: null }
    })

  // ** States
  const [soTiet, setSoTiet] = useState(null)
  const [start, setStart] = useState(new Date())
  const [timeEnd, setTimeEnd] = useState(new Date())
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [tongSoBuoi, setTongSoBuoi] = useState(null)
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [typeId, setTypeId] = useState(null)
  const [organizationId, setOrganizationId] = useState(null)
  const [equipmentId, setEquipmentId] = useState(null)
  const [subjectId, setSubjectId] = useState(null)

  // ** Select Options
  const options = [
    { value: 'Business', label: 'Business', color: 'primary' },
    { value: 'Personal', label: 'Personal', color: 'danger' },
    { value: 'Family', label: 'Family', color: 'warning' },
    { value: 'Holiday', label: 'Holiday', color: 'success' },
    { value: 'ETC', label: 'ETC', color: 'info' }
  ]

  const guestsOptions = [
    { value: 'Donna Frank', label: 'Donna Frank', avatar: img1 },
    { value: 'Jane Foster', label: 'Jane Foster', avatar: img2 },
    { value: 'Gabrielle Robertson', label: 'Gabrielle Robertson', avatar: img3 },
    { value: 'Lori Spears', label: 'Lori Spears', avatar: img4 },
    { value: 'Sandy Vega', label: 'Sandy Vega', avatar: img5 },
    { value: 'Cheryl May', label: 'Cheryl May', avatar: img6 }
  ]

  // ** Custom select components
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <span className={`bullet bullet-${data.color} bullet-sm me-50`}></span>
        {data.label}
      </components.Option>
    )
  }

  const GuestsComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 me-1' size='sm' img={data.avatar} />
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }

  // ** Adds New Event
  // const handleAddEvent = () => {
  //   const obj = {
  //     title: getValues('title'),
  //     start: startPicker,
  //     end: endPicker,
  //     allDay,
  //     display: 'block',
  //     extendedProps: {
  //       calendar: calendarLabel[0].label,
  //       url: url.length ? url : undefined,
  //       guests: guests.length ? guests : undefined,
  //       location: location.length ? location : undefined,
  //       desc: desc.length ? desc : undefined
  //     }
  //   }
  //   dispatch(addEvent(obj))
  //   refetchEvents()
  //   handleAddEventSidebar()
  //   toast.success('Event Added')
  // }

  const handleAddEvent = () => {
    const data = {
      title: getValues('title'),
      soTiet: getValues('soTiet'),
      start: getValues('start'),
      timeEnd: getValues('timeEnd'),
      location: getValues('location'),
      description: getValues('description'),
      tongSoBuoi: getValues('tongSoBuoi'),
      year_Id: getValues('year_id')?.value,
      type_Id: getValues('plan_type')?.value,
      semester_Id: getValues('semester_id')?.value,
      organization_Id: getValues('organization_id')?.value,
      equipment_Id: getValues('equipment_id')?.value,
      subject_Id: getValues('subject_id')?.value
    }

    // addTrainingPlan(data).then(result => {
    //   console.log(result)
    //   // console.log(data)
    // }).catch(error => {
    //   console.log(error)
    // })
    dispatch(addEvent(data))
    refetchEvents()
    handleAddEventSidebar()
    toast.success('Event Added')
  }

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    // dispatch(selectEvent({}))
    // setValue('title', '')
    // setAllDay(false)
    // setUrl('')
    // setLocation('')
    // setDesc('')
    // setGuests({})
    // setCalendarLabel([{ value: 'Business', label: 'Business', color: 'primary' }])
    // setStartPicker(new Date())
    // setEndPicker(new Date())
  }

  // ** Set sidebar fields
  const handleSelectedEvent = () => {
    if (!isObjEmpty(selectedEvent)) {
      const calendar = selectedEvent.extendedProps

      console.log(selectedEvent)
      const resolveLabel = () => {
        if (calendar.length) {
          return { label: calendar, value: calendar, color: calendarsColor[calendar] }
        } else {
          return { value: 'Business', label: 'Business', color: 'primary' }
        }
      }
      setValue('title', selectedEvent.title || getValues('title'))
      setSoTiet(selectedEvent.extendedProps.soTiet || soTiet)
      setStart(selectedEvent.extendedProps.start || start)
      setTimeEnd(selectedEvent.extendedProps.timeEnd || timeEnd)
      setLocation(selectedEvent.extendedProps.location || location)
      setDescription(selectedEvent.extendedProps.description || description)
      setYearId(selectedEvent.extendedProps.yearId || yearId)
      setTypeId(selectedEvent.extendedProps.typeId || typeId)
      setSemesterId(selectedEvent.extendedProps.semesterId || semesterId)
      setOrganizationId(selectedEvent.extendedProps.organizationId || organizationId)
      setEquipmentId(selectedEvent.extendedProps.equipmentId || equipmentId)
      setSubjectId(selectedEvent.extendedProps.subjectId || subjectId)
    }
  }

  // ** (UI) updateEventInCalendar
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendarApi.getEventById(updatedEventData.id)

    // ** Set event properties except date related
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // ** dateRelatedProps => ['start', 'end', 'allDay']
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // ** Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(new Date(updatedEventData.start), new Date(updatedEventData.end), {
      allDay: updatedEventData.allDay
    })

    // ** Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  // ** Updates Event in Store
  const handleUpdateEvent = () => {
    if (getValues('title').length) {
      const eventToUpdate = {
        id: selectedEvent.id,
        title: getValues('title'),
        allDay,
        start: startPicker,
        end: endPicker,
        url,
        display: allDay === false ? 'block' : undefined,
        extendedProps: {
          location,
          description: desc,
          guests,
          calendar: calendarLabel[0].label
        }
      }

      const propsToUpdate = ['id', 'title', 'url']
      const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']
      dispatch(updateEvent(eventToUpdate))
      updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)

      handleAddEventSidebar()
      toast.success('Event Updated')
    } else {
      setError('title', {
        type: 'manual'
      })
    }
  }

  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }

  const handleDeleteEvent = () => {
    dispatch(removeEvent(selectedEvent.id))
    removeEventInCalendar(selectedEvent.id)
    handleAddEventSidebar()
    toast.error('Event Removed')
  }

  // ** Event Action buttons
  const EventActions = () => {
    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button className='me-1' type='submit' color='primary'>
            Add
          </Button>
          <Button color='secondary' type='reset' onClick={handleAddEventSidebar} outline>
            Cancel
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button className='me-1' color='primary' onClick={handleUpdateEvent}>
            Update
          </Button>
          <Button color='danger' onClick={handleDeleteEvent} outline>
            Delete
          </Button>
        </Fragment>
      )
    }
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />

  const [listYear, setListYear] = useState([])
  const [listPlanType, setListPlanType] = useState([])
  const [listEquipment, setListEquipment] = useState([])
  const [listSemester, setListSemester] = useState([])
  const [listOrganization, setListOrganization] = useState([])
  const [listSubject, setListSubject] = useState([])
  useEffect(() => {
    GetListYear().then(result => {
      const years = result?.list.map(item => {
        return {
          value: item.id,
          label: item.yearName
        }
      })
      setListYear(years)
    })

    GetListPlanType(100, 1, '').then(result => {
      const types = result?.list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      setListPlanType(types)
    })

    GetListEquipment(100, 1, '').then(result => {
      const equipments = result?.list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      setListEquipment(equipments)
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

  const handleChangeYear = (value) => {
    GetListSemesterByYearId(value.value).then(result => {
      const semesters = result?.list.map(item => {
        return {
          value: item.id,
          label: item.semesterName
        }
      })
      setListSemester(semesters)
    })
    setValue('year_id', value)
  }

  const handleChangeSemester = (value) => {
    GetListSubjectBySemesterId(value?.value).then(result => {
      const subjects = result?.list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      setListSubject(subjects)
    })
    setValue('semester_id', value)
  }


  return (
    <Modal
      isOpen={open}
      className='sidebar-lg'
      toggle={handleAddEventSidebar}
      onOpened={handleSelectedEvent}
      onClosed={handleResetInputValues}
      contentClassName='p-0 overflow-hidden'
      modalClassName='modal-slide-in event-sidebar modal__time-table'
    >
      <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>
          {selectedEvent && selectedEvent.title && selectedEvent.title.length ? 'Update' : 'Add'} Event
        </h5>
      </ModalHeader>
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
          <Form
            onSubmit={handleSubmit(data => {
              if (data.title.length) {
                if (isObjEmpty(errors)) {
                  if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                    handleAddEvent()
                  } else {
                    handleUpdateEvent()
                  }
                  handleAddEventSidebar()
                }
              } else {
                setError('title', {
                  type: 'manual'
                })
              }
            })}
            // onSubmit={handleSubmit}
          >
            <div className='mb-1'>
              <Label className='form-label' for='title'>
                Title <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input id='title' placeholder='Title' invalid={errors.title && true} {...field} />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='soTiet'>
                Số tiết
              </Label>
              <Controller
                defaultValue={soTiet}
                name='soTiet'
                control={control}
                render={({ field }) => (
                  <Input id='soTiet' placeholder='Số tiết' invalid={errors.soTiet && true} {...field} />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='location'>
                Vị trí
              </Label>
              {/* <Select
                id='label'
                value={calendarLabel}
                options={options}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                isClearable={false}
                onChange={data => setCalendarLabel([data])}
                components={{
                  Option: OptionComponent
                }}
              /> */}
              <Controller
                name='location'
                control={control}
                render={({ field }) => (
                  <Input id='location' placeholder='Vị trí' invalid={errors.location && true} {...field} />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='start'>
                Thời gian bắt đầu
              </Label>
              <Controller
                name='start'
                control={control}
                render={({ field }) => (
                  <Input id='start' placeholder='Mô tả' invalid={errors.start && true} {...field} />
                )}
              />
              {/* <Flatpickr
                required
                id='startDate'
                name='startDate'
                className='form-control'
                onChange={date => setStartPicker(date[0])}
                value={startPicker}
                options={{
                  enableTime: allDay === false,
                  dateFormat: 'Y-m-d H:i'
                }}
              /> */}
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='timeEnd'>
                Thời gian kết thúc
              </Label>
              <Controller
                name='timeEnd'
                control={control}
                render={({ field }) => (
                  <Input id='timeEnd' placeholder='Mô tả' invalid={errors.timeEnd && true} {...field} />
                )}
              />
              {/* <Flatpickr
                required
                id='endDate'
                // tag={Flatpickr}
                name='endDate'
                className='form-control'
                onChange={date => setEndPicker(date[0])}
                value={endPicker}
                options={{
                  enableTime: allDay === false,
                  dateFormat: 'Y-m-d H:i'
                }}
              /> */}
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='description'>
                Mô tả
              </Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Input id='description' placeholder='Mô tả' invalid={errors.description && true} {...field} />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='tongSoBuoi'>
                Tổng số buổi
              </Label>
              <Controller
                name='tongSoBuoi'
                control={control}
                render={({ field }) => (
                  <Input id='tongSoBuoi' placeholder='Tổng số buổi' invalid={errors.tongSoBuoi && true} {...field} />
                )}
              />
            </div>

            <div className='mb-1' style={{ zIndex: 999 }}>
              <Label className='form-label' for='year_id'>
                Năm học
              </Label>
              <Controller
                name='year_id'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn năm học..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listYear}
                    isClearable={false}
                    className={classnames('react-select', { 'is-invalid': errors.year_id && true })}
                    {...field}
                    onChange={handleChangeYear}
                  />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='semester_id'>
                Kỳ học
              </Label>
              <Controller
                name='semester_id'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn kỳ học..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listSemester}
                    isClearable
                    className={classnames('react-select', { 'is-invalid': errors.semester_id && true })}
                    {...field}
                    onChange={handleChangeSemester}
                  />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='plan_type'>
                Loại kế hoạch
              </Label>
              <Controller
                name='plan_type'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn loại KH..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listPlanType}
                    isClearable
                    className={classnames('react-select', { 'is-invalid': errors.plan_type && true })}
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='organization_id'>
                Đơn vị
              </Label>
              <Controller
                name='organization_id'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn đơn vị..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listOrganization}
                    isClearable
                    className={classnames('react-select', { 'is-invalid': errors.organization_id && true })}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='equipment_id'>
                Thiết bị
              </Label>
              <Controller
                name='equipment_id'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn thiết bị..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listEquipment}
                    isClearable
                    className={classnames('react-select', { 'is-invalid': errors.equipment_id && true })}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='subject_id'>
                Môn học
              </Label>
              <Controller
                name='subject_id'
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Chọn thiết bị..."
                    theme={selectThemeColors}
                    classNamePrefix='select'
                    name='clear'
                    options={listSubject}
                    isClearable
                    className={classnames('react-select', { 'is-invalid': errors.subject_id && true })}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='d-flex mb-1'>
              <EventActions />
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default AddEventTypePlan
