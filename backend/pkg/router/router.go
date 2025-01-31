// Copyright 2024 CloudDetail
// SPDX-License-Identifier: Apache-2.0

package router

import (
	"errors"
	"github.com/CloudDetail/apo/backend/pkg/repository/cache"
	"github.com/CloudDetail/apo/backend/pkg/repository/jaeger"

	"go.uber.org/zap"

	"github.com/CloudDetail/apo/backend/config"
	internal_database "github.com/CloudDetail/apo/backend/internal/repository/database"
	"github.com/CloudDetail/apo/backend/pkg/core"
	"github.com/CloudDetail/apo/backend/pkg/repository/clickhouse"
	pkg_database "github.com/CloudDetail/apo/backend/pkg/repository/database"
	"github.com/CloudDetail/apo/backend/pkg/repository/kubernetes"
	"github.com/CloudDetail/apo/backend/pkg/repository/polarisanalyzer"
	"github.com/CloudDetail/apo/backend/pkg/repository/prometheus"
)

type resource struct {
	mux         *core.Mux
	logger      *zap.Logger
	ch          clickhouse.Repo
	prom        prometheus.Repo
	pol         polarisanalyzer.Repo
	internal_db internal_database.Repo
	pkg_db      pkg_database.Repo
	cache       cache.Repo

	k8sApi             kubernetes.Repo
	deepflowClickhouse clickhouse.Repo
	jaegerRepo         jaeger.JaegerRepo
}

type Server struct {
	Mux *core.Mux
}

func NewHTTPServer(logger *zap.Logger) (*Server, error) {
	if logger == nil {
		return nil, errors.New("logger required")
	}
	mux, err := core.New(logger)
	if err != nil {
		panic(err)
	}

	r := new(resource)
	r.logger = logger
	r.mux = mux

	// 初始化 Database
	dbRepo, err := internal_database.New(logger)
	if err != nil {
		logger.Fatal("new database err", zap.Error(err))
	}
	r.internal_db = dbRepo

	//初始化 sqlite
	pkgRepo, err := pkg_database.New(logger)
	if err != nil {
		logger.Fatal("new database err", zap.Error(err))
	}
	r.pkg_db = pkgRepo

	// 初始化 ClickHouse
	cfg := config.Get().ClickHouse
	chRepo, err := clickhouse.New(logger, []string{cfg.Address}, cfg.Database, cfg.Username, cfg.Password)
	if err != nil {
		logger.Fatal("new clickhouse err", zap.Error(err))
	}
	r.ch = chRepo

	deepflowCfg := config.Get().DeepFlow
	// 没有配置时，默认采用 apo 的 ClickHouse
	if deepflowCfg.ChAddress == "" {
		r.deepflowClickhouse = chRepo
	} else {
		deepflowChRepo, err := clickhouse.New(logger, []string{deepflowCfg.ChAddress},
			"default", deepflowCfg.ChUsername, deepflowCfg.ChPassword)
		if err != nil {
			logger.Fatal("new deepflow clickhouse err", zap.Error(err))
		}
		r.deepflowClickhouse = deepflowChRepo
	}

	// 初始化 Prometheus
	promCfg := config.Get().Promethues
	promRepo, err := prometheus.New(logger, promCfg.Address, promCfg.Storage)
	if err != nil {
		logger.Fatal("new promethues err", zap.Error(err))
	}
	r.prom = promRepo

	// 初始化 PolarisAnalyzer
	polRepo, err := polarisanalyzer.New()
	if err != nil {
		logger.Fatal("new polarisanalyzer err", zap.Error(err))
	}
	r.pol = polRepo

	// 初始化 cache
	cacheRepo, err := cache.New()
	if err != nil {
		logger.Fatal("new cache err", zap.Error(err))
	}
	r.cache = cacheRepo

	k8sCfg := config.Get().Kubernetes
	k8sApi, err := kubernetes.New(logger,
		k8sCfg.AuthType, k8sCfg.AuthFilePath,
		k8sCfg.MetadataSettings)
	if err != nil {
		logger.Fatal("new kubernetes api err", zap.Error(err))
	}
	r.k8sApi = k8sApi

	jaegerRepo, err := jaeger.New()
	r.jaegerRepo = jaegerRepo

	// 设置 API 路由
	setApiRouter(r)

	s := new(Server)
	s.Mux = mux
	return s, nil
}
