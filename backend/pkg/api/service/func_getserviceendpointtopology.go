// Copyright 2024 CloudDetail
// SPDX-License-Identifier: Apache-2.0

package service

import (
	"net/http"

	"github.com/CloudDetail/apo/backend/pkg/code"
	"github.com/CloudDetail/apo/backend/pkg/core"
	"github.com/CloudDetail/apo/backend/pkg/model/request"
)

// GetServiceEndpointTopology 获取服务上下游拓扑
// @Summary 获取服务上下游拓扑
// @Description 获取服务上下游拓扑
// @Tags API.service
// @Accept application/x-www-form-urlencoded
// @Produce json
// @Param startTime query uint64 true "查询开始时间"
// @Param endTime query uint64 true "查询结束时间"
// @Param service query string true "查询服务名"
// @Param endpoint query string true "查询Endpoint"
// @Param entryService query string false "入口服务名"
// @Param entryEndpoint query string false "入口Endpoint"
// @Param Authorization header string false "Bearer accessToken"
// @Success 200 {object} response.GetServiceEndpointTopologyResponse
// @Failure 400 {object} code.Failure
// @Router /api/service/topology [get]
func (h *handler) GetServiceEndpointTopology() core.HandlerFunc {
	return func(c core.Context) {
		req := new(request.GetServiceEndpointTopologyRequest)
		if err := c.ShouldBindQuery(req); err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.ParamBindError,
				code.Text(code.ParamBindError)).WithError(err),
			)
			return
		}

		resp, err := h.serviceInfoService.GetServiceEndpointTopology(req)
		if err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.GetServiceUrlTopologyError,
				code.Text(code.GetServiceUrlTopologyError)).WithError(err),
			)
			return
		}
		c.Payload(resp)
	}
}
