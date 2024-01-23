import { X } from "react-feather"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

const DeleteOrganizationDM = ({ open, handleDeleteModal }) => {
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleDeleteModal} />
    return (
        <Modal
            isOpen={open}
            toggle={handleDeleteModal}
            className='sidebar-sm modal-add__user'
            contentClassName='pt-0'
            modalClassName="modal-danger"
        >
            <ModalHeader className='mb-1' toggle={handleDeleteModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>Xóa danh mục đơn vị</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <p>Bạn có muốn xóa danh mục này không?</p>
            </ModalBody>
            <ModalFooter>
                <Button className='me-1' color='danger' title='Submit'>
                    Xóa
                </Button>
                <Button color='secondary' onClick={handleDeleteModal} outline>
                    Hủy
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default DeleteOrganizationDM