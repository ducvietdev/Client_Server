// ** React Import
import { useEffect, useRef, memo, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

// ** Third Party Components
import toast from 'react-hot-toast'
import { Menu } from 'react-feather'
import { Badge, Card, CardBody } from 'reactstrap'
import classnames from 'classnames'
import { ReactSortable } from 'react-sortablejs'
import './style.scss'

const TimeTable = props => {
  // ** Refs
  const calendarRef = useRef(null)

  // ** Props
  const {
    store,
    isRtl,
    dispatch,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleAddEventSidebar,
    blankEvent,
    toggleSidebar,
    selectEvent,
    updateEvent
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** State
  const [events, setEvents] = useState([])

  // ** calendarOptions(Props)
console.log(store.events)
  const calendarOptions = {
    // events: store.events.length ? store.events : events,
    events: store.events,
    // events: events,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title, today',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    themeSystem: 'bootstrap5',
    buttonIcons: {
      today: 'chevrons-right'
    },
    buttonText: {
      // today: 'Ngày hiện tại'
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent))
      handleAddEventSidebar()

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },

    dateClick(info) {
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      dispatch(selectEvent(ev))
      handleAddEventSidebar()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent))
      toast.success('Event Updated')
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent))
      toast.success('Event Updated')
    },

    ref: calendarRef,
    droppable: true,

    // Get direction from app state (store)
    direction: isRtl ? 'rtl' : 'ltr'
  }


  // ** State
  const source1 = [
      {
          text: 'Youtube',
          color: 'light-secondary'
      },
      {
          text: 'Facebook',
          color: 'light-primary'
      },
      {
          text: 'Google',
          color: 'light-success'
      },
      {
          text: 'Instagram',
          color: 'light-danger'
      },
      {
          text: 'Twitter',
          color: 'light-info'
      },
      {
          text: 'Discord',
          color: 'light-warning'
      }
  ]

  const [list, setList] = useState(source1)
  
  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    // Định nghĩa phần tử ngoài lịch cho việc kéo và thả sự kiện
    const containerEl = document.getElementById('external-events')

    // Khởi tạo việc kéo và thả từ bên ngoài vào lịch
    new Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText
        };
      }
    });

    // Cấu hình lịch
    calendarApi.setOption('droppable', true);

    calendarApi.on('drop', (event) => {
      // Xử lý sự kiện khi kéo và thả xảy ra trong lịch
      setEvents(...events, event)
    });

    console.log(events)

    // Xử lý today button
    // const todayBtn = document.querySelector('.fc-today-button')
    
  }, []);

  return (
    <Card className='shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='pb-0'>
        <ReactSortable
          list={list}
          setList={setList}
          group={{ name: 'shared-badge-group', pull: 'clone', put: true }}
          className={classnames('demo-inline-spacing sortable mb-1', {
            'flex-row-reverse': isRtl
          })}
          id='external-events'
        >
          {list.map((item, index) => {
            return (
              <Badge className='draggable fc-event' key={`${item.text}-${index}`} color={item.color}>
                {item.text}
              </Badge>
            )
          })}
        </ReactSortable>
        <FullCalendar
          // ref={calendarRef}
          // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // editable={true}
          // initialView="dayGridMonth"
          {...calendarOptions}
        />
      </CardBody>
    </Card>
  )
}

export default memo(TimeTable)
