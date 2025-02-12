/**
 * Copyright 2024 CloudDetail
 * SPDX-License-Identifier: Apache-2.0
 */

import { CCard, CToast, CToastBody } from '@coreui/react'
import { Button, Card, Input, Popconfirm, Select, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { deleteRuleApi, getAlertRulesApi, getAlertRulesStatusApi } from 'core/api/alerts'
import LoadingSpinner from 'src/core/components/Spinner'
import BasicTable from 'src/core/components/Table/basicTable'
import { showToast } from 'src/core/utils/toast'
import { MdAdd, MdOutlineEdit } from 'react-icons/md'
import ModifyAlertRuleModal from './modal/ModifyAlertRuleModal'
import Tag from 'src/core/components/Tag/Tag'
import { useSelector } from 'react-redux'

export default function AlertsRule() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalInfo, setModalInfo] = useState(null)
  const [alertStateMap, setAlertStateMap] = useState(null)
  const { groupLabelSelectOptions } = useSelector((state) => state.groupLabelReducer)
  const [searchGroup, setSearchGroup] = useState([])
  const [searchAlert, setSearchAlert] = useState(null)
  const changeSearchGroup = (value) => {
    setSearchGroup(value)
    setPageIndex(1)
  }
  const getStateTagItem = (state) => {
    switch (state) {
      case 'firing':
        return {
          type: 'error',
          context: '告警中',
        }
      case 'pending':
        return {
          type: 'warning',
          context: '准备告警',
        }
      case 'inactive':
        return {
          type: 'success',
          context: '正常',
        }
      default:
        return {
          type: 'default',
          context: '未知',
        }
    }
  }
  const deleteAlertRule = (rule) => {
    setLoading(true)
    deleteRuleApi({
      group: rule.group,
      alert: rule.alert,
    })
      .then((res) => {
        showToast({
          title: '删除告警规则成功',
          color: 'success',
        })
        refreshTable()
      })
      .catch((error) => {
        setLoading(false)
      })
  }
  const column = [
    {
      title: '组名',
      accessor: 'group',
      customWidth: 120,
      justifyContent: 'left',
    },
    {
      title: '告警规则名',
      accessor: 'alert',
      justifyContent: 'left',
      customWidth: 300,
    },

    {
      title: '持续时间',
      accessor: 'for',
      customWidth: 100,
    },
    {
      title: '查询语句',
      accessor: 'expr',
      justifyContent: 'left',
      Cell: ({ value }) => {
        return <span className="text-gray-400">{value}</span>
      },
    },

    {
      title: '告警状态',
      accessor: 'state',
      customWidth: 150,
      Cell: (props) => {
        const row = props.row.original
        let state
        if (alertStateMap) {
          state = alertStateMap[row.group + '-' + row.alert]
        }
        const tagConfig = getStateTagItem(state)
        return <Tag type={tagConfig.type}>{tagConfig.context}</Tag>
      },
    },
    {
      title: '操作',
      accessor: 'action',
      customWidth: 200,
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex">
            <Button
              type="text"
              onClick={() => clickEditRule(row)}
              icon={<MdOutlineEdit className="text-blue-400 hover:text-blue-400" />}
            >
              <span className="text-blue-400 hover:text-blue-400">编辑</span>
            </Button>
            <Popconfirm
              title={
                <>
                  是否确定删除名为“<span className="font-bold ">{row.alert}</span>
                  ”的告警规则
                </>
              }
              onConfirm={() => deleteAlertRule(row)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" icon={<RiDeleteBin5Line />} danger>
                删除
              </Button>
            </Popconfirm>
          </div>
          // <div className=" cursor-pointer">
          //   <AiOutlineDelete color="#97242e" size={18} />
          //   删除
          // </div>
        )
      },
    },
  ]
  const clickAddRule = () => {
    setModalInfo(null)
    setModalVisible(true)
  }
  const clickEditRule = (ruleInfo) => {
    setModalInfo(ruleInfo)
    setModalVisible(true)
  }
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {
    try {
      setLoading(true)
      const [res1, res2] = await Promise.all([
        getAlertRulesApi({
          currentPage: 1,
          pageSize: 10000,
        }),
        getAlertRulesStatusApi({
          type: 'alert',
          exclude_alerts: true,
        }),
      ])
      setLoading(false)
      setData(res1.alertRules)
      setTotal(res1.pagination.total)
      let alertStateMap = {}
      res2.data.groups.forEach((group) => {
        group.rules.forEach((rule) => {
          // alertStateMap[rule.labels.group + '-' + rule.name] = rule.state
          alertStateMap[group.name + '-' + rule.name] = rule.state
        })
      })
      setAlertStateMap(alertStateMap)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('请求出错:', error)
    }
  }
  const handleTableChange = (props) => {
    if (props.pageSize && props.pageIndex) {
      setPageSize(props.pageSize), setPageIndex(props.pageIndex)
    }
  }
  const refreshTable = () => {
    fetchData()
    setPageIndex(1)
  }
  const tableProps = useMemo(() => {
    let paginatedData = data

    let groupNameList = (searchGroup ?? []).map((item) => item.label)
    paginatedData = paginatedData.filter((item) => {
      const matchSearchGroup = groupNameList.length > 0 ? groupNameList.includes(item.group) : true
      const matchAlertName = searchAlert ? item.alert.includes(searchAlert) : true
      return matchAlertName && matchSearchGroup
    })
    let total = paginatedData.length
    // 分页处理
    paginatedData = paginatedData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    return {
      columns: column,
      data: paginatedData,
      onChange: handleTableChange,
      pagination: {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageCount: Math.ceil(total / pageSize),
      },
      loading: false,
    }
  }, [data, pageIndex, pageSize, searchAlert, searchGroup])
  return (
    <Card
      style={{ height: 'calc(100vh - 60px)' }}
      styles={{
        body: {
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 24px',
        },
      }}
    >
      <LoadingSpinner loading={loading} />
      <div className="flex items-center justify-betweeen text-sm ">
        <Space className="flex-grow">
          <Space className="flex-1">
            <span className="text-nowrap">组名：</span>
            <Select
              options={groupLabelSelectOptions}
              labelInValue
              placeholder="选择组名"
              mode="multiple"
              allowClear
              className=" min-w-[200px]"
              value={searchGroup}
              onChange={changeSearchGroup}
            />
          </Space>
          <div className="flex flex-row items-center mr-5 text-sm">
            <span className="text-nowrap">告警规则名：</span>
            <Input
              value={searchAlert}
              onChange={(e) => {
                setSearchAlert(e.target.value)
                setPageIndex(1)
              }}
            />
          </div>
        </Space>

        <Button
          type="primary"
          icon={<MdAdd size={20} />}
          onClick={clickAddRule}
          className="flex-grow-0 flex-shrink-0"
        >
          <span className="text-xs">新增告警规则</span>
        </Button>
      </div>
      <div className="text-sm flex-1 overflow-auto">
        <div className="h-full text-xs justify-between">
          <BasicTable {...tableProps} />
        </div>
      </div>
      <ModifyAlertRuleModal
        modalVisible={modalVisible}
        ruleInfo={modalInfo}
        closeModal={() => setModalVisible(false)}
        refresh={refreshTable}
      />
    </Card>
  )
}
