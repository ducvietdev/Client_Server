import { lazy } from 'react'
import { useSelector } from 'react-redux'
const ManageUserRole = lazy(() => import('../../views/managements/new_user/roles'))
const ManageUser = lazy(() => import('../../views/managements/new_user/list'))
const ManageOrganizationDM = lazy(() => import('../../views/managements/organization/department'))
const ManageOrganization = lazy(() => import('../../views/managements/organization/list'))
const ManageEquipmentUnit = lazy(() => import('../../views/managements/equipment/unit'))
const ManageEquipmentDM = lazy(() => import('../../views/managements/equipment/department'))
const ManageEquipment = lazy(() => import('../../views/managements/equipment/list'))
const ManageStudent = lazy(() => import('../../views/managements/student'))
const ManageMonitor = lazy(() => import('../../views/managements/monitor'))
const ManagePlanDM = lazy(() => import('../../views/managements/plan/department'))
const ManageTrainingPlan = lazy(() => import('../../views/managements/plan/list'))
const ManageTimeTable = lazy(() => import('../../views/managements/plan/timeTable'))
const HomeContainer = lazy(() => import('../../views/managements/home'))
const ManageStatisticStudent = lazy(() => import('../../views/managements/statistic/student_year'))
const ManageStatisticMonitorStudent = lazy(() => import('../../views/managements/statistic/monitor_student'))
const ManageScoreSubject = lazy(() => import('../../views/managements/score/ListScoreSubject'))
const ManageClassifiedStudent = lazy(() => import('../../views/managements/score/ListClassifiedStudent'))
const ManageScoreInterface = lazy(() => import('../../views/managements/score/ScoreInterface'))
const ManageUserHistory = lazy(() => import('../../views/managements/system'))
const ManageOrganizationTree = lazy(() => import('../../views/managements/organization/listTree'))
const ManageAttendance = lazy(() => import('../../views/managements/practice_plans/attendance'))
const ManageResultAttendance = lazy(() => import('../../views/managements/practice_plans/result_attendance'))

const ManagementRoutes = [
  {
    path: '/managements/home/home_dashboard',
    element: <HomeContainer />
  },
  {
    path: '/managements/users/user_role',
    element: <ManageUserRole />
  },
  {
    path: '/managements/users/user_list',
    element: <ManageUser />
  },
  {
    path: '/managements/organizations/organization_type',
    element: <ManageOrganizationDM />
  },
  {
    path: '/managements/organizations/organization_list',
    element: <ManageOrganization />
  },
  {
    path: '/managements/equipments/equipment_list',
    element: <ManageEquipment />
  },
  {
    path: '/managements/equipments/equipment_unit',
    element: <ManageEquipmentUnit />
  },
  {
    path: '/managements/equipments/equipment_type',
    element: <ManageEquipmentDM />
  },
  {
    path: '/managements/students/student_list',
    element: <ManageStudent />
  },
  {
    path: '/managements/monitors/monitor_list',
    element: <ManageMonitor />
  }, 
  {
    path: '/managements/plans/plan_type',
    element: <ManagePlanDM />
  },
  {
    path: '/managements/plans/plan_list',
    element: <ManageTrainingPlan />
  },
  {
    path: '/managements/statistic/statistic_student_year',
    element: <ManageStatisticStudent />
  },
  {
    path: '/managements/plans/time-table',
    element: <ManageTimeTable />
  },
  {
    path: '/managements/scores/score_subject',
    element: <ManageScoreSubject />
  },
  {
    path: '/managements/scores/classified_student',
    element: <ManageClassifiedStudent />
  },
  {
    path: '/managements/scores/score_interface',
    element: <ManageScoreInterface />
  }, 
  {
    path: '/managements/systems/user_history',
    element: <ManageUserHistory />
  },
  {
    path: '/managements/statistic/statistic_monitor_student',
    element: <ManageStatisticMonitorStudent />
  },
  {
    path: '/managements/organizations/organization_tree',
    element: <ManageOrganizationTree />
  },
  {
    path: '/managements/practice_plans/attendance',
    element: <ManageAttendance />
  },
  {
    path: '/managements/practice_plans/result_attendance',
    element: <ManageResultAttendance />
  }
]

export default ManagementRoutes
