import { Table, Input, Tag, Popconfirm, Space, Switch, TreeSelect } from "antd"
import React, { useState, useEffect, useRef, useContext } from "react"
import {
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Button,
    Row,
    Col,
    FormFeedback,
    UncontrolledTooltip,
    Breadcrumb,
    BreadcrumbItem,
    CardHeader,
    CardTitle,
    Card
} from "reactstrap"
import { AbilityContext } from '@src/utility/context/Can'
// import { Plus, X } from "react-feather"
// import { DeleteOutlined, EditOutlined, LockOutlined, SearchOutlined } from "@ant-design/icons"
import "./style.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { addAttributeToTree } from "../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
// import { getOrganizationType } from "../../../../api/organizationTypes"
// import { getOrganizationLevel } from "../../../../api/organizationLevels"
// import { listAllOrganizationPC } from "../../../../api/organizations"
import { GetOrganizationHierarchy } from "../../../../api/organizationAPI"
import { Link, useNavigate } from "react-router-dom"
import { useNavigation } from "../../../../utility/hooks/useNavigation"
const { SHOW_PARENT } = TreeSelect

const ListOrganizationTree = () => {
    const ability = useContext(AbilityContext)
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(1000)
    const [search, setSearch] = useState("")
    //   const [isAdd, setIsAdd] = useState(false)
    //   const [isEdit, setIsEdit] = useState(false)
    //   const [listTypes, setListTypes] = useState([])
    //   const [listLevels, setListLevels] = useState([])
    //   const [info, setInfo] = useState()
    //   const [listOrgans, setListOrgans] = useState([])
    //   const [value, setValue] = useState('')
    const [treeData, setTreeData] = useState()
    const getData = () => {
        GetOrganizationHierarchy()
            .then((res) => {
                // setData(res.newlist)
                setData(res.organizations)
                // setCount(res.count)
                const temp = res.organizations
                addAttributeToTree(temp[0], 'key', 'id')
                setTreeData(temp)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        getData()
    }, [])

    console.log(treeData)

    //   useEffect(() => {
    //     getOrganizationType({
    //       params: {
    //         page: 1,
    //         limit: 100,
    //       },
    //     })
    //       .then((res) => {
    //         const temp = res.list?.map((single, index) => {
    //           return {
    //             value: single.ID,
    //             label: single.OrganizationTypeName
    //           }
    //         })
    //         setListTypes(temp)
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //     getOrganizationLevel({
    //       params: {
    //         page: 1,
    //         limit: 100,
    //       },
    //     })
    //       .then((res) => {
    //         const temp = res.list?.map((single, index) => {
    //           return {
    //             value: single.ID,
    //             label: single.OrganizationLevelName
    //           }
    //         })
    //         setListLevels(temp)
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   }, [])

    //   const handleModal = () => {
    //     setIsAdd(false)
    //     setIsEdit(false)
    //     setInfo(null)
    //   }
    //   const CloseBtn = (
    //     <X className="cursor-pointer" size={15} onClick={handleModal} />
    //   )
    //   const handleEdit = (record) => {
    //     setInfo(record)
    //     setIsEdit(true)
    //   }

    //   const handleDelete = (record) => {
    //     deleteOrganization({
    //       params: {
    //         organizationID: record?.id,
    //         organizationRelationID: record?.OrganRelationID
    //       }
    //     })
    //       .then((res) => {
    //         MySwal.fire({
    //           title: "Xóa đơn vị thành công",
    //           icon: "success",
    //           customClass: {
    //             confirmButton: "btn btn-success",
    //           },
    //         }).then((result) => {
    //           if (currentPage === 1) {
    //             getData(1, rowsPerPage)
    //           } else {
    //             setCurrentPage(1)
    //           }
    //         })
    //       })
    //       .catch((error) => {
    //         MySwal.fire({
    //           title: "Xóa đơn vị thất bại",
    //           icon: "error",
    //           customClass: {
    //             confirmButton: "btn btn-danger",
    //           },
    //         })
    //         console.log(error)
    //       })
    //   }

    // search
    //   const [searchText, setSearchText] = useState('')
    //   const [searchedColumn, setSearchedColumn] = useState('')
    //   const searchInput = useRef(null)
    //   const handleSearch = (selectedKeys, confirm, dataIndex) => {
    //     confirm()
    //     setSearchText(selectedKeys[0])
    //     setSearchedColumn(dataIndex)
    //   }
    //   const handleReset = (clearFilters) => {
    //     clearFilters()
    //     setSearchText('')
    //   }
    //   const getColumnSearchProps = (dataIndex) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    //       <div
    //         style={{
    //           padding: 8,
    //         }}
    //         onKeyDown={(e) => e.stopPropagation()}
    //       >
    //         <Input
    //           ref={searchInput}
    //           placeholder={`Search ${dataIndex}`}
    //           value={selectedKeys[0]}
    //           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //           style={{
    //             marginBottom: 8,
    //             display: 'block',
    //           }}
    //         />
    //         <Space>
    //           <Button
    //             type="primary"
    //             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //             icon={<SearchOutlined />}
    //             size="small"
    //             style={{
    //               width: 90,
    //             }}
    //           >
    //             Search
    //           </Button>
    //           <Button
    //             onClick={() => clearFilters && handleReset(clearFilters)}
    //             size="small"
    //             style={{
    //               width: 90,
    //             }}
    //           >
    //             Reset
    //           </Button>
    //           <Button
    //             type="link"
    //             size="small"
    //             onClick={() => {
    //               confirm({
    //                 closeDropdown: false,
    //               })
    //               setSearchText(selectedKeys[0])
    //               setSearchedColumn(dataIndex)
    //             }}
    //           >
    //             Filter
    //           </Button>
    //           <Button
    //             type="link"
    //             size="small"
    //             onClick={() => {
    //               close()
    //             }}
    //           >
    //             close
    //           </Button>
    //         </Space>
    //       </div>
    //     ),
    //     filterIcon: (filtered) => (
    //       <SearchOutlined
    //         style={{
    //           color: filtered ? '#1677ff' : undefined,
    //         }}
    //       />
    //     ),
    //     onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    //     onFilterDropdownOpenChange: (visible) => {
    //       if (visible) {
    //         setTimeout(() => searchInput.current?.select(), 100)
    //       }
    //     },
    //     render: (text) => (searchedColumn === dataIndex ? (
    //         <Highlighter
    //           highlightStyle={{
    //             backgroundColor: '#ffc069',
    //             padding: 0,
    //           }}
    //           searchWords={[searchText]}
    //           autoEscape
    //           textToHighlight={text ? text.toString() : ''}
    //         />
    //       ) : (
    //         text
    //       )),
    //   })

    // ====
    const columns = [
        // {
        //   title: "STT",
        //   dataIndex: "stt",
        //   width: 30,
        //   align: "center",
        //   render: (text, record, index) => (
        //     <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
        //   ),
        // },
        {
            title: "Mã đơn vị",
            dataIndex: "organization_code",
            width: "180px",
            key: 'organization_code',
        },
        {
            title: "Tên đơn vị",
            dataIndex: "organization_name",
            key: "organization_name",
            // width: 250,
        },
        {
            title: "Loại đơn vị",
            dataIndex: "organization_typeId",
            key: "organization_typeId",
        },
        {
            title: "Cấp đơn vị",
            dataIndex: "organization_levelId",
            key: "organization_levelId",
        },
        {
            title: "Địa điểm",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Đơn vị cấp trên",
            dataIndex: "organization_parentId",
            key: "organization_parentId",
        },
        {
            title: "Ghi chú",
            dataIndex: "description",
            key: "description",
        },
        // {
        //   title: "Thao tác",
        //   width: 100,
        //   align: "center",
        //   render: (record) => (
        //     <div style={{ display: "flex", justifyContent: "center" }}>
        //       {ability.can('update', 'DM_DON_VI') &&
        //         <>
        //           <EditOutlined
        //             id={`tooltip_edit${record.ID}`}
        //             style={{ color: "#036CBF", cursor: 'pointer' }}
        //             className="me-1"
        //             onClick={(e) => {
        //               e.stopPropagation()
        //               handleEdit(record)
        //             }}
        //           />
        //           <UncontrolledTooltip placement="top" target={`tooltip_edit${record.ID}`}>
        //             Chỉnh sửa
        //           </UncontrolledTooltip>
        //         </>}
        //       {ability.can('delete', 'DM_DON_VI') &&
        //         <Popconfirm
        //           title="Bạn chắc chắn xóa?"
        //           onConfirm={() => handleDelete(record)}
        //           cancelText="Hủy"
        //           okText="Đồng ý"
        //         >
        //           <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`}/>
        //           <UncontrolledTooltip placement="top" target={`tooltip_delete${record.ID}`}>
        //             Xóa
        //           </UncontrolledTooltip>
        //         </Popconfirm>}
        //     </div>
        //   ),
        // },
    ]

    console.log(data)
    const { setNavigation } = useNavigation()
    const navigate = useNavigate()
    const handleNavigationHome = () => {
        setNavigation('home')
        navigate('/managements/home/home_dashboard')
    }

    return (
        <>
            <Breadcrumb className='breadcrumb__page'>
                <BreadcrumbItem>
                    <Button className='btn breadcrumb__btn' onClick={handleNavigationHome}>Trang chủ</Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='#'> Đơn vị </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Cây đơn vị </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card className='card__organization__tree'
            // title="Danh sách đơn vị"
            // style={{ backgroundColor: "white", width: "100%", height: "100%" }}
            >
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Danh sách cây đơn vị</CardTitle>
                </CardHeader>
                {/* <Row style={{ justifyContent: "space-between" }}>

                    <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Label
                            className=""
                            style={{
                                width: "100px",
                                fontSize: "14px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Tìm kiếm
                        </Label>
                        <Input
                            type="text"
                            placeholder="Tìm kiếm"
                            style={{ height: "34px" }}
                        // onChange={(e) => {
                        //   if (e.target.value === "") {
                        //     setSearch("")
                        //   }
                        // }}
                        // onKeyPress={(e) => {
                        //   if (e.key === "Enter") {
                        //     setSearch(e.target.value)
                        //     setCurrentPage(1)
                        //   }
                        // }}
                        />
                    </Col>
                    {ability.can('create', 'DM_DON_VI') &&
                        <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                //   onClick={(e) => setIsAdd(true)}
                                color="primary"
                                className="addBtn"
                                style={{
                                    width: '100px',
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Col>}
                </Row> */}
                <div className='react-dataTable whole-table__organization__tree'>
                    {
                        data?.length > 0 ? <Table
                            className='table__organization__tree mt-1'
                            key='organizations'
                            columns={columns}
                            dataSource={data}
                            bordered
                            expandable={{
                                defaultExpandAllRows: true,
                                columnWidth: 180
                            }}
                            columnWidth={150}
                            expandedRowClassName={(record) => "test"}
                            pagination={{
                                current: 1,
                                pageSize: 10,
                                defaultPageSize: 10,
                                showSizeChanger: false,
                                // pageSizeOptions: ["10", "20", "30", '100'],
                                total: count,
                                locale: { items_per_page: "/ trang" },
                                showTotal: (total, range) => <span>Tổng số: {total}</span>,
                                // onShowSizeChange: (current, pageSize) => {
                                //   setCurrentPage(current)
                                //   setRowsPerpage(pageSize)
                                // },
                                // onChange: (pageNumber) => {
                                //   setCurrentPage(pageNumber)
                                // }
                            }}
                        /> : <></>
                    }
                </div>

                {/* <AddNewModal open={isAdd} handleModal={handleModal} getData={getData} listTypes={listTypes} setCurrentPage={setCurrentPage} listOrgans={data} currentPage={currentPage} rowsPerPage={rowsPerPage} listLevels={listLevels} treeData={treeData} />
      {
        <EditModal open={isEdit} handleModal={handleModal} getData={getData} infoEdit={info} listTypes={listTypes} setCurrentPage={setCurrentPage} listOrgans={data} currentPage={currentPage} rowsPerPage={rowsPerPage} listLevels={listLevels} treeData={treeData} />
      } */}
            </Card>
        </>
    )
}

// const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
// const EditModal = React.lazy(() => import("./modal/EditModal"))
export default ListOrganizationTree
