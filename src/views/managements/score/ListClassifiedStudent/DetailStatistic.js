import { ArrowLeft, Award } from "react-feather"
import { Button } from "reactstrap"

const DetailStatistic = ({ stepper }) => {
    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <p> Giỏi: 12</p>
                    <p> Khá: 75</p>
                    <p> Trung bình: 0</p>
                    <p>Tổng: 87</p>
                </div>
                <div>
                    <p>Điểm trung bình cao nhất</p>
                    <p>Nguyễn Việt Đức - 9.2</p>
                    <Award />
                </div>
            </div>
            <Button color='primary' className='btn-next' onClick={() => stepper.previous()}>
                <span className='align-middle d-sm-inline-block d-none'>Biểu đồ</span>
                <ArrowLeft size={14} className='align-middle ms-sm-25 ms-0'></ArrowLeft>
            </Button>
        </>
    )
}

export default DetailStatistic