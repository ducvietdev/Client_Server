// ** Third Party Components
import Chart from 'react-apexcharts'
import { ArrowRight } from 'react-feather'
import { Button } from 'reactstrap'

const ChartStatistic = ({ stepper }) => {
    const donutColors = {
        series1: '#ffe700',
        series2: '#00d4bd',
        series3: '#826bf8',
        series4: '#2b9bf4',
        series5: '#FFA1A1'
    }

    // ** Chart Options
    const options = {
        colors: [donutColors.series1, donutColors.series2, donutColors.series4],
        plotOptions: {
            radialBar: {
                size: 185,
                hollow: {
                    size: '25%'
                },
                track: {
                    margin: 15
                },
                dataLabels: {
                    name: {
                        fontSize: '2rem',
                        fontFamily: 'Montserrat'
                    },
                    value: {
                        fontSize: '1rem',
                        fontFamily: 'Montserrat'
                    },
                    total: {
                        show: true,
                        fontSize: '1rem',
                        label: 'Giỏi',
                        formatter() {
                            return '80%'
                        }
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -35,
                bottom: -30
            }
        },
        legend: {
            show: true,
            position: 'bottom'
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Giỏi', 'Khá', 'Trung bình']
    }
    return (
        <>
            <Chart options={options} series={[80, 50, 35]} type='radialBar' height={350} />
            <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
                <span className='align-middle d-sm-inline-block d-none'>Chi tiết</span>
                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>
        </>
    )
}

export default ChartStatistic