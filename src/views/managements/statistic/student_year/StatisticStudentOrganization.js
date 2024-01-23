// ** Third Party Components
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ArrowDown } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import { GetListCourse } from '../../../../api/courseAPI'
import { GetTotalStudentsByAllCourses } from '../../../../api/statisticAPI'

const StatisticStudentOrganization = () => {
  const [listCourse, setListCourse] = useState([])
  const [studentByCourse, setStudentByCourse] = useState([])

  useEffect(() => {
    GetListCourse().then(result => {
      const courseNames = result.map(item => item.courseName)
      setListCourse(courseNames)
    })

    GetTotalStudentsByAllCourses().then(result => {
      const studentsByCourse = result.map(item => item.quantity)
      setStudentByCourse(studentsByCourse)
    })
  }, [])
  // ** Chart Options
  const options = {
    chart: {
      zoom: {
        enabled: false
      },
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },

    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      strokeColors: ['#fff'],
      colors: ['#ff9f43']
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    colors: ['#ff9f43'],
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      custom(data) {
        return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
            </div>`
      }
    },
    xaxis: {
      categories: listCourse
    }
  }

  // ** Chart Series
  const series = [
    {
      data: studentByCourse
    }
  ]

  return (
    <Card>
      <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            Biểu đồ thống kê
          </CardTitle>
          <CardSubtitle className='text-muted'>Số lượng học viên theo từng khóa học</CardSubtitle>
        </div>
        <div className='d-flex align-items-center flex-wrap mt-sm-0 mt-1'>
          <h5 className='fw-bolder mb-0 me-1'>$ 100,000</h5>
          <Badge color='light-secondary'>
            <ArrowDown size={13} className='text-danger' />
            <span className='align-middle ms-25'>20%</span>
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='line' height={400} />
      </CardBody>
    </Card>
  )
}

export default StatisticStudentOrganization
