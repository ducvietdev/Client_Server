// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Row, Col, Label, Button } from 'reactstrap'
import { GetListYear } from '../../../../api/yearAPI'
import { AverageScore, ClassifiedStudent } from '../../../../api/classifiedAPI'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import '@styles/react/libs/react-select/_react-select.scss'
import './style.scss'
import { GetListSemesterByYearId } from '../../../../api/semesterAPI'
import { GetOgDoubleById } from '../../../../api/permission'
import { useSelector } from 'react-redux'

const StatisticStudentYear = () => {
  const donutColors = {
    series1: '#ffe700',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#2b9bf4',
    series5: '#FFA1A1'
  }

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: ['Giỏi', 'Khá', 'Trung bình'],

    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return `${parseInt(val)}`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Xếp loại',
              formatter() {
                return '0%'
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  const dataLogin = useSelector(state => state.auth)
  const [listYear, setListYear] = useState([])
  const [listSemester, setListSemester] = useState([])
  const [dataId, setDataId] = useState({
    yearId: 0,
    semesterId: 0,
    organizationId: 0
  })
  const [avarageScore, setAverageScore] = useState([])
  const [listOrganization, setListOrganization] = useState([])
  const [classifiedStudent, setClassifiedStudent] = useState([])

  useEffect(() => {
    GetListYear().then(result => {
      const years = result.list.map(item => {
        return {
          value: item.id,
          label: item.yearName
        }
      })
      setListYear(years)
    }).catch(error => {
      console.log(error)
    })

    // AverageScore(dataId.yearId, dataId.semesterId).then(result => {
    //   setAverageScore(result)
    // })

    // ClassifiedStudent(dataId.yearId, dataId.semesterId).then(result => {
    //   setClassifiedStudent(result)
    // })

    GetOgDoubleById(dataLogin?.userData.organizationId, dataLogin?.userData.levelId).then(result => {
      const organizations = result?.map(item => {
        return {
          value: item.id,
          label: item.organization_Name
        }
      })
      // organizations.unshift({ value: 0, label: 'Tất cả' })
      setListOrganization(organizations)
    }).catch(error => {
      console.log(error)
    })
  }, [dataId])

  const mergeArray = avarageScore?.map(item1 => {
    const item2 = classifiedStudent?.find(item2 => item2.id === item1.id)
    return {
      ...item1,
      ...item2,
    };
  })

  const handleChangeYear = (value) => {
    if (value.value !== 0) {
      setDataId({ ...dataId, yearId: value.value })
      GetListSemesterByYearId(value.value).then(result => {
        const semesters = result?.list.map(item => {
          return {
            value: item.id,
            label: item.semesterName
          }
        })
        setListSemester(semesters)
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const handleChangeSemester = (value) => {
    if (value.value !== 0) {
      setDataId({ ...dataId, semesterId: value.value })
    }
  }

  const count = mergeArray.filter(item => item.classifiedStudent === 'Giỏi')
  const count1 = mergeArray.filter(item => item.classifiedStudent === 'Khá')
  const count2 = mergeArray.filter(item => item.classifiedStudent === 'Trung bình')
  // ** Chart Series
  const series = [count.length, count1.length, count2.length]

  const handleChangeOrganization = (value) => {
    if (value?.value !== 0) {
      setDataId({ ...dataId, organizationId: value?.value })
    }
  }

  const handleClassifiedStudent = () => {
    AverageScore(dataId.yearId, dataId.semesterId, dataId.organizationId).then(result => {
        setAverageScore(result)
    })

    ClassifiedStudent(dataId.yearId, dataId.semesterId, dataId.organizationId).then(result => {
        setClassifiedStudent(result)
    })
}

  return (
    <Card>
      <CardHeader>
        {/* <div>
          <CardTitle className='mb-75' tag='h4'>
            Biểu đồ thống kê
          </CardTitle>
          <CardSubtitle className='text-muted'>Xếp loại học viên theo kỳ học</CardSubtitle>
        </div> */}
        <Row style={{ flex: 1 }} className='justify-content-end align-items-end mx-0 options__statistic'>
          <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
            <Label className='form-label'>
              Năm học
            </Label>
            <Select
              className='react-select'
              classNamePrefix='select'
              options={listYear}
              placeholder="Chọn năm ..."
              onChange={handleChangeYear}
            />
          </Col>
          <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
            <Label className='form-label'>
              Kỳ học
            </Label>
            <Select
              className='react-select'
              classNamePrefix='select'
              options={listSemester}
              placeholder="Chọn kỳ ..."
              onChange={handleChangeSemester}
            />
          </Col>
          <Col className='d-flex flex-column mt-1 mb-1' md='3' sm='12'>
            <Label className='me-1 label__select'>
              Đơn vị
            </Label>
            <Select
              className='react-select'
              classNamePrefix='select'
              options={listOrganization}
              placeholder="Chọn đơn vị ..."
              onChange={handleChangeOrganization}
            />
          </Col>
          <Col className='d-flex flex-column mt-1 mb-1' md='2' sm='12'>
            <Button style={{ fontSize: '12px' }} onClick={handleClassifiedStudent} className='btn btn-warning modal-btn'>Kết quả</Button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={dataId.yearId !== 0 && dataId.semesterId ? series : [1, 1, 1]} type='donut' height={350} />
      </CardBody>
    </Card>
  )
}

export default StatisticStudentYear
