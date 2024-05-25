import { 
    SceneApp,
    SceneAppPage,
    SceneTimeRange,
    VariableValueSelectors,
    SceneVariableSet,
    SceneControlsSpacer,
    SceneTimePicker,
    SceneRefreshPicker,
    DataSourceVariable,
    QueryVariable,
} from '@grafana/scenes';
import { ROUTES } from '../../constants';
import React, { useMemo } from 'react';
import { prefixRoute } from 'utils/utils.routing';
import { getPodsScene } from './tabs/Pods/Pods';
import { getDeploymentsScene } from './tabs/Deployments/Deployments';
import { getStatefulSetsScene } from './tabs/StatefulSets/StatefulSets';
import { getDaemonSetsScene } from './tabs/DaemonSets/DaemonSets';
import { getPodPage } from './pages/PodPage';
import { getCronJobsScene } from './tabs/CronJobs/CronJobs';
import { getJobsScene } from './tabs/Jobs/Jobs';
import { getOverviewScene } from './tabs/Overview/Overview';
import { usePluginProps } from 'utils/utils.plugin';
import { getDeploymentPage } from './pages/DeploymentPage';
import { getStatefulSetPage } from './pages/StatefulSetPage';
import { createTimeRange, createTopLevelVariables } from './variableHelpers';

function getScene({ datasource }: { datasource: string }) {

    const variables = createTopLevelVariables({ datasource })
    const timeRange = createTimeRange()

    return new SceneApp({
        pages: [
          new SceneAppPage({
            title: 'Workloads',
            url: prefixRoute(`${ROUTES.Workloads}`),
            $timeRange: timeRange,
            controls: [
                new VariableValueSelectors({}),
                new SceneControlsSpacer(),
                new SceneTimePicker({ isOnCanvas: true }),
                new SceneRefreshPicker({
                    intervals: ['5s', '1m', '1h'],
                    isOnCanvas: true,
                }),
            ],
            $variables: variables,
            tabs: [
                new SceneAppPage({
                    title: 'Overview',
                    url: prefixRoute(`${ROUTES.Workloads}/overview`),
                    getScene: getOverviewScene,
                }),
                new SceneAppPage({
                    title: 'Pods',
                    url: prefixRoute(`${ROUTES.Workloads}/pods`),
                    getScene: () => getPodsScene([], true, true),
                }),
                new SceneAppPage({
                    title: 'Deployments',
                    url: prefixRoute(`${ROUTES.Workloads}/deployments`),
                    getScene: getDeploymentsScene,
                }),
                new SceneAppPage({
                    title: 'StatefulSets',
                    url: prefixRoute(`${ROUTES.Workloads}/statefulsets`),
                    getScene: getStatefulSetsScene,
                }),
                new SceneAppPage({
                    title: 'DaemonSets',
                    url: prefixRoute(`${ROUTES.Workloads}/daemonsets`),
                    getScene: getDaemonSetsScene,
                }),
                new SceneAppPage({
                    title: 'Jobs',
                    url: prefixRoute(`${ROUTES.Workloads}/jobs`),
                    getScene: getJobsScene,
                }),
                new SceneAppPage({
                    title: 'CronJobs',
                    url: prefixRoute(`${ROUTES.Workloads}/cronjobs`),
                    getScene: getCronJobsScene,
                }),
            ],
            getScene: getOverviewScene,
            drilldowns: [
                {
                    routePath: prefixRoute(`${ROUTES.Workloads}/pods/:name`),
                    getPage(routeMatch, parent) {
                        return getPodPage(routeMatch, parent);
                    }
                },
                {
                    routePath: prefixRoute(`${ROUTES.Workloads}/deployments/:name`),
                    getPage(routeMatch, parent) {
                        return getDeploymentPage(routeMatch, parent);
                    }
                },
                {
                    routePath: prefixRoute(`${ROUTES.Workloads}/statefulsets/:name`),
                    getPage(routeMatch, parent) {
                        return getStatefulSetPage(routeMatch, parent);
                    }
                },
            ]
        }),
        ]
    })
}

export const Workloads = () => {
    const props = usePluginProps();
    const scene = useMemo(() => getScene({
        datasource: props?.meta.jsonData?.datasource || 'prometheus',
    }), [props?.meta.jsonData?.datasource]);

    return <scene.Component model={scene} />;
};
