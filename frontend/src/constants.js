/**
 * Copyright 2024 CloudDetail
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getServiceErrorInstancesLogsApi,
  getServiceLogLogsApi,
  getServiceTraceLogsApi,
} from 'src/core/api/serviceInfo'

export const DelaySourceTimeUnit = {
  self: '自身',
  dependency: '依赖',
  unknown: '未知',
}

export const MetricsLineChartColor = {
  latency: 'rgba(212, 164, 235, 1)',
  p90: 'rgba(212, 164, 235, 1)',
  successRate: 'rgba(144, 202, 140, 1)',
  errorRate: 'rgba(255, 99, 132, 1)',
  tps: 'rgba(55, 162,235, 1)',
  logs: 'rgba(255, 158, 64, 1)',
}

export const StatusColorMap = {
  normal: '#24d160',
  warning: '#f9bb07',
  critical: '#ff3366',
  success: '#24d160',
  error: '#ff3366',
  unknown: '',
  ok: '#24d160',
  err: '#ff3366',
}

export const TimeLineTypeApiMap = {
  errorLogs: getServiceErrorInstancesLogsApi,
  logsInfo: getServiceLogLogsApi,
  traceLogs: getServiceTraceLogsApi,
}
export const TimeLineTypeTitleMap = {
  errorLogs: '错误日志',
  logsInfo: '故障现场日志',
  traceLogs: '故障现场Trace',
}

export const DelayLineChartTitleMap = {
  latency: '平均响应时间',
  p90: '90分位数',
  errorRate: '错误率',
  logs: '日志错误数量',
  tps: '吞吐量',
}

export const YValueMinInterval = {
  latency: 0.01,
  p90: 0.01,
  errorRate: 0.01,
  logs: 1,
  tps: 0.01,
}
export const ChartColorList = [
  '#4992ff',
  '#7cffb2',
  '#fddd60',
  '#ff6e76',
  '#58d9f9',
  '#05c091',
  '#ff8a45',
  '#8d48e3',
  '#dd79ff',
  '#73bf69',
  '#f2cc0c',
  '#8ab8ff',
  '#ff780a',
  '#f2495c',

  '#5794f2',
  '#b877d9',
  '#705DA0',
  '#37872d',

  '#fade2a',
  '#447EBC',
  '#C15C17',
  '#890F02',

  '#0A437C',
  '#6D1F62',
  '#584477',

  '#b7dbab',
  '#f4d598',
  '#3274D9',
  '#8C564B',
]

export const TableType = {
  logs: '日志',
  trace: '链路',
  k8s: 'Kubernetes事件',
  topology: '拓扑图',
  other: '其他',
}

export const RuleGroupMap = {
  app: '应用指标',
  infra: '主机相关',
  network: '网络相关',
  container: '容器相关',
}

export const AlertSeverityMapList = [
  {
    name: 'unknow',
    color: '',
  },
  {
    name: 'info',
    color: '#24d160',
  },
  {
    name: 'warning',
    color: '#f9bb07',
  },
  {
    name: 'error',
    color: '#ff3366',
  },
  {
    name: 'critical',
    color: '#ff3366',
  },
]
export const AlertStatusMapList = [
  {
    name: 'resolved',
    color: '#24d160',
  },
  {
    name: 'firing',
    color: '#ff3366',
  },
]
// 故障现场trace
export const DefaultTraceFilters = {
  namespace: {
    key: 'namespace',
    parentField: 'labels',
    dataType: 'string',
  },
  duration: {
    key: 'duration',
    parentField: '',
    dataType: 'uint64',
  },
  slow: {
    key: 'is_slow',
    parentField: 'flags',
    dataType: 'bool',
  },
  error: {
    key: 'is_error',
    parentField: 'flags',
    dataType: 'bool',
  },
}

export const ThemeColor = {
  green: '#73bf69',
  red: '#f3485c',
  gray: '#ADABAB',
  deepRed: '#7A242E',
}

export const ThemeStyle = {
  light: {
    colors: {
      text: { primary: '#ffffff' },
      background: { primary: '#181B1F' },
    },
  },
  dark: {
    colors: {
      text: { primary: '#ffffff' },
      background: { primary: '#181B1F' },
    },
  },
}
