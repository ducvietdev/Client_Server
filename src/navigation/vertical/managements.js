// ** Icons Import
import { BarChart, Calendar, Clipboard, Home, Layers, Settings, Shield, Square, User, UserPlus } from 'react-feather'

const children_equipments = [
  {
    id: 'equipment_unit',
    title: 'Đơn vị tính',
    icon: <Square />,
    navLink: '/managements/equipments/equipment_unit'
  },
  {
    id: 'equipment_type',
    title: 'Danh mục',
    icon: <Square />,
    navLink: '/managements/equipments/equipment_type'
  },
  {
    id: 'equipment_list',
    title: 'Trang thiết bị',
    icon: <Square />,
    navLink: '/managements/equipments/equipment_list'
  }
]

const children_users = [
  {
    id: 'user_list',
    title: 'Người dùng',
    icon: <Square />,
    navLink: '/managements/users/user_list',
  },
  {
    id: 'user_role',
    title: 'Vai trò',
    icon: <Square />,
    navLink: '/managements/users/user_role'
  },
]

const children_systems = [
  {
    id: 'user_history',
    title: 'Lịch sử đăng nhập',
    icon: <Square />,
    navLink: '/managements/systems/user_history'
  }
]

const children_organizations = [
  {
    id: 'organization_type',
    title: 'Danh mục',
    icon: <Square />,
    navLink: '/managements/organizations/organization_type'
  },
  {
    id: 'organization_list',
    title: 'Đơn vị',
    icon: <Square />,
    navLink: '/managements/organizations/organization_list'
  },
  {
    id: 'organization_tree',
    title: 'Cây đơn vị',
    icon: <Square />,
    navLink: '/managements/organizations/organization_tree'
  }
]

const children_plans = [
  {
    id: 'plan_type',
    title: 'Danh mục',
    icon: <Square />,
    navLink: '/managements/plans/plan_type'
  },
  {
    id: 'plan_list',
    title: 'Danh sách',
    icon: <Square />,
    navLink: '/managements/plans/plan_list'
  },
  {
    id: 'time-table',
    title: 'Thời khóa biểu',
    icon: <Square />,
    navLink: '/managements/plans/time-table'
  }
]

const children_practice_plans = [
  {
    id: 'attendance',
    title: 'Điểm danh',
    icon: <Square />,
    navLink: '/managements/practice_plans/attendance'
  },
  {
    id: 'result_attendance',
    title: 'Kết quả ĐD',
    icon: <Square />,
    navLink: '/managements/practice_plans/result_attendance'
  }
]

const children_statistic = [
  {
    id: 'statistic_student_year',
    title: 'Học viên - Năm học',
    icon: <Square />,
    navLink: '/managements/statistic/statistic_student_year'
  },
  {
    id: 'statistic_monitor_student',
    title: 'Cán bộ - Học viên',
    icon: <Square />,
    navLink: '/managements/statistic/statistic_monitor_student'
  }
]

const children_scores = [
  {
    id: 'score_subject',
    title: 'Điểm môn học',
    icon: <Square />,
    navLink: '/managements/scores/score_subject'
  },
  {
    id: 'classified_student',
    title: 'Xếp loại',
    icon: <Square />,
    navLink: '/managements/scores/classified_student'
  },
  {
    id: 'score_interface',
    title: 'Test điểm',
    icon: <Square />,
    navLink: '/managements/scores/score_interface'
  }
]

export default [
  {
    id: 'home',
    title: 'Trang chủ',
    icon: <Home size={20} />,
    navLink: '/managements/home/home_dashboard'
  },
  {
    header: 'Quản lý chung'
  },
  {
    id: 'equipments',
    title: 'Trang thiết bị',
    icon: <Shield size={20} />,
    badge: 'light-danger',
    badgeText: children_equipments.length,
    children: children_equipments
  },
  {
    id: 'users',
    title: 'Người dùng',
    icon: <User size={20} />,
    badge: 'light-danger',
    badgeText: children_users.length,
    children: children_users
  },
  {
    id: 'systems',
    title: 'Hệ thống',
    icon: <Settings size={20} />,
    children: children_systems
  },
  {
    id: 'organizations',
    title: 'Đơn vị',
    icon: <Layers size={20} />,
    badge: 'light-danger',
    badgeText: children_organizations.length,
    children: children_organizations
  },
  {
    id: 'training_plans',
    title: 'Kế hoạch ',
    icon: <Calendar size={20} />,
    badge: 'light-danger',
    badgeText: children_plans.length,
    children: children_plans,
  },
  {
    id: 'practice_plans',
    title: 'Thực hành KH',
    icon: <Calendar size={20} />,
    badge: 'light-danger',
    badgeText: children_practice_plans.length,
    children: children_practice_plans,
  },
  {
    id: 'scores',
    title: 'Điểm',
    icon: <Clipboard size={20} />,
    badge: 'light-danger',
    badgeText: children_scores.length,
    children: children_scores,
  },
  {
    id: 'students',
    title: 'Học viên',
    icon: <UserPlus size={20} />,
    navLink: '/managements/students/student_list'
  },
  {
    id: 'monitors',
    title: 'Cán bộ',
    icon: <UserPlus size={20} />,
    navLink: '/managements/monitors/monitor_list'
  },
  {
    header: 'Thống kê nội dung'
  },
  {
    id: 'statistic',
    title: 'Thống kê',
    icon: <BarChart size={20} />,
    badge: 'light-danger',
    badgeText: children_statistic.length,
    children: children_statistic
  },
]
