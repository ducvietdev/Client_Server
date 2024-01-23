// ** React Imports
import { Fragment, useRef, useState } from 'react'

import Wizard from '../../../../@core/components/wizard'

// ** Reactstrap Imports
import {
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Third Party Components

// ** Utils

// ** Styles
import './modal.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import ChartStatistic from './ChartStatistic'
import DetailStatistic from './DetailStatistic'
import { FileText, User } from 'react-feather'

const ModalStatistic = ({ show, handleShowModal }) => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'step__chart',
      title: 'Biểu đồ',
      subtitle: 'Biểu đồ xếp loại',
      icon: <FileText size={18} />,
      content: <ChartStatistic stepper={stepper} type='wizard-modern' />
    },
    {
      id: 'step__details',
      title: 'Chi tiết',
      subtitle: 'Chi tiết xếp loại',
      icon: <User size={18} />,
      content: <DetailStatistic stepper={stepper} type='wizard-modern' />
    }
  ]

  return (
    <Fragment>
      <Modal isOpen={show} toggle={handleShowModal} className='modal-dialog-centered modal-md'>
        <ModalHeader className='bg-transparent' toggle={handleShowModal}></ModalHeader>
        <ModalBody className='px-sm-5 mx-20 pb-5'>
          <Wizard
            type='modern-horizontal'
            ref={ref}
            steps={steps}
            options={{
              linear: false
            }}
            instance={el => setStepper(el)}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ModalStatistic
