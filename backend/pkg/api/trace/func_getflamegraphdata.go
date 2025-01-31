// Copyright 2024 CloudDetail
// SPDX-License-Identifier: Apache-2.0

package trace

import (
	"github.com/CloudDetail/apo/backend/pkg/model/request"
	"net/http"

	"github.com/CloudDetail/apo/backend/pkg/code"
	"github.com/CloudDetail/apo/backend/pkg/core"
)

// GetFlameGraphData 获取指定时间段指定条件的火焰图数据
// @Summary 获取指定时间段指定条件的火焰图数据
// @Description 获取指定时间段指定条件的火焰图数据
// @Tags API.trace
// @Accept application/x-www-form-urlencoded
// @Produce json
// @Param sampleType query string true "采样类型"
// @Param pid query uint64 true "进程id"
// @Param tid query uint64 true "线程id"
// @Param nodeName query string false "主机名称"
// @Param startTime query int64 true "开始时间"
// @Param endTime query int64 true "结束时间"
// @Param spanId query string true "span id"
// @Param traceId query string true "trace id"
// @Success 200 {object} response.GetFlameDataResponse
// @Failure 400 {object} code.Failure
// @Router /api/trace/flame [get]
func (h *handler) GetFlameGraphData() core.HandlerFunc {
	return func(c core.Context) {
		req := new(request.GetFlameDataRequest)
		if err := c.ShouldBindQuery(req); err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.ParamBindError,
				code.Text(code.ParamBindError)).WithError(err),
			)
			return
		}
		resp, err := h.traceService.GetFlameGraphData(req)
		if err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.GetFlameGraphError,
				code.Text(code.GetFlameGraphError)).WithError(err),
			)
			return
		}
		c.Payload(resp)
	}
}
