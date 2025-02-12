/**
 * Copyright 2024 CloudDetail
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'
import { CBadge } from '@coreui/react'
import { PiPath } from 'react-icons/pi'
import { LuFileText } from 'react-icons/lu'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FaRegBell } from 'react-icons/fa'
import { MdOutlineSettings } from 'react-icons/md'
import { IoIosTrendingUp, IoMdCloudOutline } from 'react-icons/io'
import { TbWaveSawTool } from 'react-icons/tb'
import { GrSystem } from 'react-icons/gr'

const commercialNav = []
const _nav = [
  { key: 'service', icon: <IoMdCloudOutline />, label: '服务概览', to: '/service' },
  {
    key: 'logs',
    label: '日志检索',
    // to: '/logs',
    icon: <LuFileText />,
    children: [
      { key: 'faultSite', label: '故障现场日志', to: '/logs/fault-site' },
      { key: 'full', label: '全量日志', to: '/logs/full' },
    ],
  },
  {
    key: 'trace',
    icon: <PiPath />,
    label: '链路追踪',
    children: [
      { key: 'faultSiteTrace', label: '故障现场链路', to: '/trace/fault-site' },
      { key: 'fullTrace', label: '全量链路', to: '/trace/full' },
    ],
  },
  {
    key: 'system',
    icon: <AiOutlineDashboard />,
    label: '全局资源大盘',
    abbreviation: '全局资源',
    to: '/system-dashboard',
  },
  {
    key: 'basic',
    icon: <AiOutlineDashboard />,
    label: '应用基础设施大盘',
    abbreviation: '基础设施',
    to: '/basic-dashboard',
  },
  {
    key: 'application',
    icon: <AiOutlineDashboard />,
    label: '应用指标大盘',
    abbreviation: '应用指标',
    to: '/application-dashboard',
  },
  {
    key: 'middleware',
    icon: <AiOutlineDashboard />,
    label: '中间件大盘',
    abbreviation: '中间件',
    to: '/middleware-dashboard',
  },
  {
    key: 'alerts',
    icon: <FaRegBell />,
    label: '告警管理',
    to: '/alerts',
    children: [
      { key: 'alertsRule', label: '告警规则', to: '/alerts/rule' },
      { key: 'alertsNotify', label: '告警通知', to: '/alerts/notify' },
    ],
  },
  {
    key: 'config',
    icon: <MdOutlineSettings />,
    label: '配置中心',
    to: '/config',
  },
  {
    key: 'manage',
    icon: <GrSystem />,
    label: '系统管理',
    children: [
      { key: 'userManage', label: '用户管理', to: '/system/user-manage' },
      { key: 'menuManage', label: '菜单管理', to: '/system/menu-manage' },
    ],
  },
]
const navIcon = {
  service: <IoMdCloudOutline />,
  logs: <LuFileText />,
  trace: <PiPath />,
  system: <AiOutlineDashboard />,
  basic: <AiOutlineDashboard />,
  application: <AiOutlineDashboard />,
  middleware: <AiOutlineDashboard />,
  config: <MdOutlineSettings />,
  manage: <GrSystem />,
  alerts: <FaRegBell />,
  mysql: <AiOutlineDashboard />,
  healthy: <TbWaveSawTool />,
}
export { _nav, commercialNav, navIcon }
