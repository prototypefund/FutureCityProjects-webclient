import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Link from "next/link"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"

import { ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import ImpactView from "components/project/plan/ImpactView"
import OutcomeView from "components/project/plan/OutcomeView"
import ResultsView from "components/project/plan/ResultsView"
import SelfAssessment from "components/project/plan/SelfAssessment"
import TargetGroupsView from "components/project/plan/TargetGroupsView"
import TasksView from "components/project/plan/TasksView"
import UtilizationView from "components/project/plan/UtilizationView"
import { AnyAction, Dispatch } from "redux"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateProject: (project, actions) =>
    dispatch(updateModelAction(EntityType.PROJECT, project, actions))
})

const mapStateToProps = (state: AppState, { slug }) => ({
  project: selectMyProjectByIdentifier(state, slug),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const ProjectPlanPage: I18nPage<PageProps> = ({ project, request, t, updateProject }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked || project.progress === ProjectProgress.CREATING_PROFILE)) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    updateProject(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.plan.index.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.plan.index.heading", { projectName: project.name })}</h1>
        <p><TranslatedHtml content="page.projects.plan.index.intro" /></p>

        <Link
          href={Routes.MY_PROJECTS}
          as={Routes.MY_PROJECTS + "#project-" + project.id}
        >
          <a className="btn btn-secondary btn-sm">{t("goto.myProjects")}</a>
        </Link>
        {request.isLoading && <Spinner />}
      </Col>
    </Row>

    {!request.isLoading &&
      <Row>
        <Col lg>
          <TargetGroupsView project={project} />
          <ResultsView project={project} />
          <ImpactView project={project} />
          <OutcomeView project={project} />
          <UtilizationView project={project} />
        </Col>
        <Col lg>
          <TasksView project={project} />
          <SelfAssessment project={project} onSubmit={onSubmit} />
        </Col>
      </Row>
    }
  </BaseLayout >
}

ProjectPlanPage.getInitialProps = ({ store, query }: NextJSContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectPlanPage),
  ),
  UserRole.USER,
)