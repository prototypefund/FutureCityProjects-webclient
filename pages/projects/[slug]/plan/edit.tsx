import { NextPageContext } from "next"
import { WithTranslation } from "next-i18next"
import Router from "next/router"
import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { ProjectProgress, UserRole } from "api/schema"
import BaseLayout from "components/BaseLayout"
import StatusCode from "components/common/StatusCode"
import TranslatedHtml from "components/common/TranslatedHtml"
import ErrorPage from "components/ErrorPage"
import { withAuth } from "components/hoc/withAuth"
import ProjectPlanForm from "components/project/plan/ProjectPlanForm"
import { loadMyProjectsAction } from "redux/actions/myProjects"
import { updateModelAction } from "redux/helper/actions"
import { AppState } from "redux/reducer"
import { EntityType } from "redux/reducer/data"
import { selectIsProjectMember, selectMyProjectByIdentifier } from "redux/reducer/myProjects"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  updateProject: (project, actions) =>
    dispatch(updateModelAction(EntityType.PROJECT, project, actions))
})

const mapStateToProps = (state: AppState, { slug }) => ({
  isMember: selectIsProjectMember(state, slug),
  project: selectMyProjectByIdentifier(state, slug),
  request: state.requests.projectsLoading,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  slug: string,
}

const ProjectPlanEditPage: I18nPage<PageProps> = ({ isMember, project, request, t, updateProject }) => {
  // @todo custom error message "project not found or no permission" etc.
  if (!request.isLoading && (!project || project.isLocked
    || project.progress === ProjectProgress.CREATING_PROFILE
    || !isMember)
  ) {
    return <StatusCode statusCode={404}>
      <ErrorPage statusCode={404} error={request.loadingError} />
    </StatusCode>
  }

  const onSubmit = (values, actions) => {
    actions.success = () => {
      Router.push(Routes.PROJECT_PLAN,
        routeWithParams(Routes.PROJECT_PLAN, { slug: project.slug || project.id }))
    }

    updateProject(values, actions)
  }

  return <BaseLayout pageTitle={t("page.projects.plan.edit.title")}>
    <Row>
      <Col>
        <h1>{t("page.projects.plan.edit.heading")}</h1>
        {request.isLoading
          ? <Spinner />
          : <p><TranslatedHtml content="page.projects.plan.edit.intro" params={{ projectName: project.name }} /></p>
        }
      </Col>
    </Row>

    <Row>
      <Col>
        {!request.isLoading &&
          <ProjectPlanForm onSubmit={onSubmit} project={project} />
        }
      </Col>
    </Row>
  </BaseLayout>
}

ProjectPlanEditPage.getInitialProps = ({ store, query }: NextPageContext) => {
  // slug could also be the ID
  const slug: string = typeof query.slug === "string" ? query.slug : null
  if (slug && !selectMyProjectByIdentifier(store.getState(), slug)) {
    store.dispatch(loadMyProjectsAction())
  }

  return { slug, namespacesRequired: includeDefaultNamespaces() }
}

export default withAuth(
  connector(
    withTranslation(includeDefaultNamespaces())(ProjectPlanEditPage),
  ),
  UserRole.USER,
)
