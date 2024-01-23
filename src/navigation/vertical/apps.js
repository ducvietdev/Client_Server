// ** Icons Import
import { Mail, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, User, Shield, Home, Users, Gift, Layers, Sun, BarChart} from 'react-feather'

export default [
  {
    header: 'Apps & Pages'
  },
  {
    id: 'home',
    title: 'Trang chủ',
    icon: <Home size={20} />,
    navLink: '/apps/home'
  },
  {
    id: 'users',
    title: 'Khách hàng',
    icon: <Users size={20} />,
    navLink: '/apps/users'
  },
  {
    id: 'products',
    title: 'Sản phẩm',
    icon: <Gift size={20} />,
    navLink: '/apps/products'
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    icon: <Layers size={20} />,
    children: [
      {
        id: 'preparing',
        title: 'Đang chuẩn bị',
        icon: <Circle />,
        navLink: '/apps/orders/preparing'
      },
      {
        id: 'shipping',
        title: 'Đang giao hàng',
        icon: <Circle />,
        navLink: '/apps/orders/shipping'
      },
      {
        id: 'done',
        title: 'Đã hoàn thành',
        icon: <Circle />,
        navLink: '/apps/orders/done'
      },
      {
        id: 'cancel',
        title: 'Đã hủy',
        icon: <Circle />,
        navLink: '/apps/orders/cancel'
      }
    ]
  },
  {
    id: 'promotion',
    title: 'Khuyến mãi',
    icon: <Sun size={20} />,
    navLink: '/apps/promotion'
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: <FileText size={20} />,
    navlink: '/apps/feedback'
  },
  {
    id: 'statistic',
    title: 'Thống kê',
    icon: <BarChart size={20} />,
    children: [
      {
        id: 'statistic_users',
        title: 'Khách hàng',
        icon: <Circle />,
        navLink: '/apps/statistic/preparing'
      },
      {
        id: 'statistic_orders',
        title: 'Đơn hàng',
        icon: <Circle />,
        navLink: '/apps/statistic/oders'
      }
    ]
  }
]
