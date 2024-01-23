// ** Third Party Components
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import { useContext, useEffect, useState } from 'react'
import { GetTotalMonitorsByAllCourses, GetTotalStudentsByAllCourses } from '../../../../api/statisticAPI'

const StatisticMonitorStudent = () => {
    const { colors } = useContext(ThemeColors),
        { skin } = useSkin(),
        labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
        gridLineColor = 'rgba(200, 200, 200, 0.2)',
        lineChartPrimary = '#666ee8',
        lineChartDanger = '#ff4961',
        warningColorShade = '#ffbd1f'

    // ** Chart Options
    const options = {
        responsive: true,
        backgroundColor: false,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: labelColor },
                grid: {
                    borderColor: gridLineColor,
                    color: gridLineColor
                }
            },
            y: {
                min: 0,
                max: 10,
                scaleLabel: { display: true },
                ticks: {
                    stepSize: 1,
                    color: labelColor
                },
                grid: {
                    borderColor: gridLineColor,
                    color: gridLineColor
                }
            }
        },
        plugins: {
            legend: {
                align: 'start',
                position: 'top',
                labels: {
                    boxWidth: 10,
                    marginBottom: 25,
                    color: labelColor,
                    usePointStyle: true
                }
            }
        }
    }

    const [listStudentCourse, setListStudentCourse] = useState([])
    const [listMonitorCourse, setListMonitorCourse] = useState([])
    const [quantityStudent, setQuantityStudent] = useState([])
    const [quantityMonitor, setQuantityMonitor] = useState([])
    const [label, setLabel] = useState()

    useEffect(() => {
        GetTotalStudentsByAllCourses().then(result => {
            const students = result.map(item => item.quantity)
            const listStudentCourses = result.map(item => item.id)
            setQuantityStudent(students)
            setListStudentCourse(listStudentCourses)
        })

        GetTotalMonitorsByAllCourses().then(result => {
            const monitors = result.map(item => item.quantity)
            const listMonitorCourses = result.map(item => item.id)
            setQuantityMonitor(monitors)
            setListMonitorCourse(listMonitorCourses)
        })
    }, [])

    // ** Chart Data
    const data = {
        labels: listStudentCourse,
        datasets: [
            {
                data: quantityMonitor,
                fill: true,
                tension: 0.5,
                pointRadius: 1,
                label: 'Cán bộ',
                pointHoverRadius: 5,
                pointStyle: 'circle',
                pointHoverBorderWidth: 5,
                borderColor: lineChartDanger,
                pointBorderColor: 'transparent',
                backgroundColor: lineChartDanger,
                pointHoverBackgroundColor: lineChartDanger,
                onclick: (e) => console.log(e),
            },
            {
                data: quantityStudent,
                fill: true,
                tension: 0.5,
                label: 'Học viên',
                pointRadius: 1,
                pointHoverRadius: 5,
                pointStyle: 'circle',
                pointHoverBorderWidth: 5,
                borderColor: lineChartPrimary,
                pointBorderColor: 'transparent',
                backgroundColor: lineChartPrimary,
                pointHoverBackgroundColor: lineChartPrimary
            }
        ]
    }

    //** To add spacing between legends and chart
    const plugins = [
        {
            beforeInit(chart) {
                chart.legend.afterFit = function () {
                    this.height += 20
                }
            }
        }
    ]

    return (
        <Card>
            <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Statistics
                    </CardTitle>
                    <CardSubtitle>Commercial networks and enterprises</CardSubtitle>
                </div>
            </CardHeader>
            <CardBody>
                <div style={{ height: '450px' }}>
                    <Line data={data} options={options} height={450} plugins={plugins} />
                </div>
            </CardBody>
        </Card>
    )
}

export default StatisticMonitorStudent
