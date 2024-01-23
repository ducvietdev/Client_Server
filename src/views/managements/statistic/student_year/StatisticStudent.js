// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import StatisticStudentYear from './StatisticStudentYear'
import StatisticStudentOrganization from './StatisticStudentOrganization'

const StatisticStudent = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'student-year',
      title: 'Xếp loại kỳ học',
      subtitle: 'Chọn kỳ học theo năm học',
      content: <StatisticStudentYear stepper={stepper} />
    },
    {
      id: 'student-organization',
      title: 'Số lượng học viên',
      subtitle: 'Thống kê theo khóa học',
      content: <StatisticStudentOrganization stepper={stepper} />
    }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard
        instance={el => setStepper(el)}
        ref={ref}
        steps={steps}
        options={{
          linear: false
        }} />
    </div>
  )
}

export default StatisticStudent
