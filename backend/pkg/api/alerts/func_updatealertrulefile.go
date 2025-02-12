// Copyright 2024 CloudDetail
// SPDX-License-Identifier: Apache-2.0

package alerts

import (
	"net/http"

	"github.com/CloudDetail/apo/backend/pkg/code"
	"github.com/CloudDetail/apo/backend/pkg/core"
	"github.com/CloudDetail/apo/backend/pkg/model/request"
)

// UpdateAlertRuleFile 更新基础告警规则
// @Summary 更新基础告警规则
// @Description 更新基础告警规则
// @Tags API.alerts
// @Accept json
// @Produce json
// @Param Request body request.UpdateAlertRuleRequest true "请求信息"
// @Param Authorization header string false "Bearer accessToken"
// @Success 200 string ok
// @Failure 400 {object} code.Failure
// @Router /api/alerts/rules/file [post]
func (h *handler) UpdateAlertRuleFile() core.HandlerFunc {
	return func(c core.Context) {
		req := new(request.UpdateAlertRuleConfigRequest)
		if err := c.ShouldBindJSON(req); err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.ParamBindError,
				code.Text(code.ParamBindError)).WithError(err),
			)
			return
		}

		err := h.alertService.UpdateAlertRuleFile(req)
		if err != nil {
			c.AbortWithError(core.Error(
				http.StatusBadRequest,
				code.UpdateAlertRuleError,
				code.Text(code.UpdateAlertRuleError)).WithError(err),
			)
			return
		}
		c.Payload("ok")
	}
}
