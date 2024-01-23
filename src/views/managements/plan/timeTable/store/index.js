// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { GetListPlanType } from '../../../../../api/planAPI'

export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars) => {
    // const response = await axios.get('/apps/calendar/events', { calendars })
    // return response.data
    // const currentState = getState();
    // console.log(currentState)
    console.log(calendars)
    const response = await axios.get(`https://localhost:7154/api/TrainingPlan/GetTrainingPlanById?id=`, {calendars})
    return response.data.list
})

export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event, { dispatch, getState }) => {
    //   await axios.post('/apps/calendar/add-event', { event })
    await axios.post(`https://localhost:7154/api/TrainingPlan/AddTrainingPlan`, event)
    await dispatch(fetchEvents(getState().timetables.selectedCalendars))
    // await dispatch(fetchEvents(getState().calendar.selectedCalendars))
    return event
})

export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event, { dispatch, getState }) => {
    await axios.post('/apps/calendar/update-event', { event })
    await dispatch(fetchEvents(getState().calendar.selectedCalendars))
    return event
})

export const updateFilter = createAsyncThunk('appCalendar/updateFilter', async (filter, { dispatch, getState }) => {
    if (getState().calendar.selectedCalendars.includes(filter)) {
        await dispatch(fetchEvents(getState().calendar.selectedCalendars.filter(i => i !== filter)))
    } else {
        await dispatch(fetchEvents([...getState().calendar.selectedCalendars, filter]))
    }
    return filter
})

export const updateAllFilters = createAsyncThunk('appCalendar/updateAllFilters', async (value, { dispatch }) => {
    if (value === true) {
        await dispatch(fetchEvents(['Personal', 'Business', 'Family', 'Holiday', 'ETC']))
    } else {
        await dispatch(fetchEvents([]))
    }
    return value
})

export const removeEvent = createAsyncThunk('appCalendar/removeEvent', async id => {
    await axios.delete('/apps/calendar/remove-event', { id })
    return id
})

export const appTimeTableSlice = createSlice({
    name: 'appCalendar',
    initialState: {
        events: [],
        selectedEvent: {},
        // selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
        selectedCalendars: [{lable: 'Học tập', value: 1}, {label: 'Huấn luyện', value: 2}, {label: 'Tổ chức sự kiện', value: 3}, {label: 'Lao động', value: 4}]
    },
    reducers: {
        selectEvent: (state, action) => {
            state.selectedEvent = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload
            })
            .addCase(updateFilter.fulfilled, (state, action) => {
                if (state.selectedCalendars.includes(action.payload)) {
                    state.selectedCalendars.splice(state.selectedCalendars.indexOf(action.payload), 1)
                } else {
                    state.selectedCalendars.push(action.payload)
                }
            })
            .addCase(updateAllFilters.fulfilled, (state, action) => {
                const value = action.payload
                let selected = []
                if (value === true) {
                    selected = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
                } else {
                    selected = []
                }
                state.selectedCalendars = selected
            })
    }
})

export const { selectEvent } = appTimeTableSlice.actions

export default appTimeTableSlice.reducer
