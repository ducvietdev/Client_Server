import { Button, Col, Row } from "reactstrap"
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Eye, MessageSquare, ShoppingBag } from "react-feather"
import illustration from '@src/assets/images/illustration/email.svg'
import '@styles/base/pages/dashboard-ecommerce.scss'
import { Fragment } from "react"
import { useNavigation } from "../../../utility/hooks/useNavigation"
import { useNavigate } from "react-router-dom"
import './style.scss'
import { useSelector } from "react-redux"

const HomeDashboard = () => {
    const FeaturedButton = [
        {
            id: 'home',
            content: <StatsVertical icon={<Eye size={21} />} color='info' stats='36.9k' statTitle='Hệ thống' />,
            url: '/managements/home/home_dashboard'
        },
        {
            id: 'users',
            content: <StatsVertical icon={<MessageSquare size={21} />} color='warning' stats='12k' statTitle='Người dùng' />,
            url: '/managements/users/user_list'
        },
        {
            id: 'students',
            content: <StatsVertical icon={<ShoppingBag size={21} />} color='danger' stats='97.8k' statTitle='Học viên' />,
            url: '/managements/students/student_list'
        },
        {
            id: 'organizations',
            content: <StatsVertical icon={<ShoppingBag size={21} />} color='danger' stats='97.8k' statTitle='Đơn vị' />,
            url: '/managements/organizations/organization_list'
        },
        {
            id: 'equipments',
            content: <StatsVertical icon={<ShoppingBag size={21} />} color='danger' stats='97.8k' statTitle='Trang bị' />,
            url: '/managements/equipments/equipment_list'
        },
        {
            id: 'training_plans',
            content: (<StatsVertical icon={<ShoppingBag size={21} />} color='danger' stats='97.8k' statTitle='Kế hoạch' />),
            url: '/managements/plans/time-table'
        }
    ]
    
    const { setNavigation } = useNavigation()
    const navigate = useNavigate()

    const handleNavigateMenu = (type, url) => {
        setNavigation(type)
        navigate(url)
    }

    const state = useSelector(state => state.auth)
    console.log(state)

    return (
        <Fragment>
            <Row className='match-height mb-2'>
                <img src={illustration} height='370px' />
            </Row>
            <Row className='match-height'>
                {FeaturedButton.map(item => {
                    return (
                        <Col key={item.id} xl='2' md='4' sm='6'>
                            <Button className="btn btn-featured" onClick={() => handleNavigateMenu(item.id, item.url)}>
                                {item.content}
                            </Button>
                        </Col>
                    )
                })}
            </Row>

        </Fragment>
    )
}

export default HomeDashboard