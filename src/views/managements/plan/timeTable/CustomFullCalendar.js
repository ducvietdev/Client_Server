import { createPlugin } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';

export const CustomFullCalendar = () => {
    const [monthCells, setMonthCells] = useState([0]);

    // Hàm tạo danh sách các ngày trong tháng
    const generateMonthCells = (year, month) => {
        var monthIndex = month - 1; // 0..11 instead of 1..12
        var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var date = new Date(year, monthIndex, 1);
        var result = [];
        while (date.getMonth() == monthIndex) {
            result.push(date.getDate() + '-' + names[date.getDay()]);
            date.setDate(date.getDate() + 1);
        }
        return result;
    }

    useEffect(() => {
        const calendarApi = calendarRef.current.getApi().getDate()
        const year = new Date(calendarApi).getFullYear()
        const month = new Date(calendarApi).getMonth()
        const cells = generateMonthCells(year, month);
        setMonthCells(cells);
    }, [calendarApi])

    return (
        <>
            {monthCells && monthCells != [] && <ReactSortable
                list={monthCells}
                setList={setMonthCells}
                group={{ name: 'shared-badge-group-2', pull: 'clone', put: true }}
                // className={classnames('demo-inline-spacing sortable', {
                //   'flex-row-reverse': isRtl
                // })}
                className={classnames('sortable', {
                    'flex-row-reverse': isRtl
                })}
            >
                <FullCalendar
                    plugins={[CustomPlugin, interactionPlugin]}
                    initialView='custom'
                    ref={calendarRef}
                    customButtons={{
                        myCustomButton: {
                            text: 'Prev',
                            click: function () {
                                alert('clicked the custom button!');
                                // this will move the calendar backwards
                                calendar.prev({

                                })
                            }
                        }
                    }}
                    headerToolbar={{
                        left: 'prev,next, title, myCustomButton',
                        right: ''
                    }}
                    editable={false}
                    selectable={false}
                    titleFormat={{
                        year: 'numeric',
                        month: '2-digit'
                    }}
                />
            </ReactSortable>
            }
        </>
    )
}


const CustomViewConfig = {

    classNames: ['custom-view'],

    content: function () {
        const html =
            monthCells.map(cell => {
                return (
                    `<div style="border: 1px solid #ccc; flex: 0 0 calc(100%/7); display: flex; align-items: center; justify-content: center;">${cell}</div>`
                )
            })
        return { html: html.join(' ') }
    }
}

export default createPlugin({
    views: {
        custom: CustomViewConfig
    }
});