/**
 * Copyright 2024 CloudDetail
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react'
import StatusInfo from 'src/core/components/StatusInfo'
import BasicTable from 'src/core/components/Table/basicTable'
import { useNavigate } from 'react-router-dom'
import { convertTime } from 'src/core/utils/time'
import { getServiceDsecendantRelevanceApi } from 'core/api/serviceInfo'
import { useDispatch } from 'react-redux'
import { getStep } from 'src/core/utils/step'
import { DelaySourceTimeUnit } from 'src/constants'
import { Tooltip } from 'antd'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { useDebounce } from 'react-use'
import { showToast } from 'src/core/utils/toast'

function DependentTable(props) {
  const { serviceName, endpoint, startTime, endTime, storeDisplayData = false } = props
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const setDisplayData = (value) => {
    dispatch({ type: 'setDisplayData', payload: value })
  }
  const getTableData = () => {
    if (startTime && endTime) {
      setLoading(true)

      getServiceDsecendantRelevanceApi({
        startTime: startTime,
        endTime: endTime,
        service: serviceName,
        endpoint: endpoint,
        step: getStep(startTime, endTime),
      })
        .then((res) => {
          setData(res ?? [])
          setLoading(false)
          // console.log(res.slice(0, 5))
          if (storeDisplayData) setDisplayData((res ?? []).slice(0, 5))
        })
        .catch((error) => {
          setData([])
          setLoading(false)
        })
    }
  }
  useEffect(() => {
    return () => {
      if (storeDisplayData) setDisplayData(null)
    }
  }, [])
  //防抖避免跳转使用旧时间
  useDebounce(
    () => {
      if (serviceName && endpoint) getTableData()
    },
    300, // 延迟时间 300ms
    [startTime, endTime, serviceName, endpoint],
  )
  const column = [
    {
      title: '服务名',
      accessor: 'serviceName',
      customWidth: 150,
    },

    {
      title: '服务端点',
      accessor: 'endpoint',
      // Cell: (props) => {
      //   console.log(props)
      //   // const navigate = useNavigate()
      //   // toServiceInfo()
      //   // TODO encode

      //   return <a onClick={navigate(
      //     `/service/info?service-name=${encodeURIComponent(serviceName)}&endpoint=${encodeURIComponent(endpoint)}&breadcrumb-name=${encodeURIComponent(serviceName)}`,
      //   )} >{props.value}</a>
      //   // window.location.reload();
      //   // window.location.href = `/service/info?service-name=${serviceName}&url=${url}&&breadcrumb-name=${serviceName}`
      // },
    },
    {
      title: (
        <Tooltip
          title={
            <div>
              <div>自身：服务自身延时占比50%以上</div>
              <div>依赖：请求下游服务延时占比50%以上</div>
              <div>未知：未找到相关指标</div>
            </div>
          }
        >
          <div className="flex flex-row justify-center items-center">
            <div>
              <div className="text-center flex flex-row ">延时主要来源</div>
              <div className="block text-[10px]">(自身/依赖/未知)</div>
            </div>
            <AiOutlineInfoCircle size={16} className="ml-1" />
          </div>
        </Tooltip>
      ),
      accessor: 'delaySource',
      canExpand: false,
      customWidth: 112,
      Cell: ({ value }) => {
        return <>{DelaySourceTimeUnit[value]}</>
      },
    },
    {
      title: 'RED告警',
      accessor: `REDStatus`,

      Cell: (props) => {
        // eslint-disable-next-line react/prop-types
        const { value, row, column } = props
        const alertReason = row.original?.alertReason?.[column.id]
        return (
          <>
            <StatusInfo status={value} alertReason={alertReason} title={column.title} />
          </>
        )
      },
    },
    {
      title: '日志错误数量',
      accessor: `logsStatus`,
      Cell: (props) => {
        // eslint-disable-next-line react/prop-types
        const { value, row, column } = props
        const alertReason = row.original?.alertReason?.[column.id]
        return (
          <>
            <StatusInfo status={value} alertReason={alertReason} title={column.title} />
          </>
        )
      },
    },
    {
      title: '基础设施状态',
      accessor: `infrastructureStatus`,
      Cell: (props) => {
        // eslint-disable-next-line react/prop-types
        const { value, row, column } = props
        const alertReason = row.original?.alertReason?.[column.id]
        return (
          <>
            <StatusInfo status={value} alertReason={alertReason} title={column.title} />
          </>
        )
      },
    },
    {
      title: '网络质量状态',
      accessor: `netStatus`,
      Cell: (props) => {
        // eslint-disable-next-line react/prop-types
        const { value, row, column } = props
        const alertReason = row.original?.alertReason?.[column.id]
        return (
          <>
            <StatusInfo status={value} alertReason={alertReason} title={column.title} />
          </>
        )
      },
    },
    {
      title: 'K8s事件状态',
      accessor: `k8sStatus`,
      Cell: (props) => {
        // eslint-disable-next-line react/prop-types
        const { value, row, column } = props
        const alertReason = row.original?.alertReason?.[column.id]
        return (
          <>
            <StatusInfo status={value} alertReason={alertReason} title={column.title} />
          </>
        )
      },
    },
    {
      title: '末次部署或重启时间',
      accessor: `timestamp`,
      Cell: (props) => {
        const { value } = props
        return (
          <>
            {value !== null ? (
              convertTime(value, 'yyyy-mm-dd hh:mm:ss')
            ) : (
              <span className="text-slate-400">N/A</span>
            )}{' '}
          </>
        )
      },
    },
  ]
  const toServiceInfoPage = (props) => {
    if (props.isTraced) {
      navigate(
        `/service/info?service-name=${encodeURIComponent(props.serviceName)}&endpoint=${encodeURIComponent(props.endpoint)}&breadcrumb-name=${encodeURIComponent(props.serviceName)}`,
      )
    } else {
      showToast({ title: '该服务未被监控，无法跳转', color: 'info' })
    }
  }
  const tableProps = useMemo(() => {
    return {
      columns: column,
      data: data ?? [],

      loading: loading,
      clickRow: toServiceInfoPage,
    }
  }, [data, startTime, endTime, loading])
  return <>{data && <BasicTable {...tableProps} />}</>
}

export default DependentTable
