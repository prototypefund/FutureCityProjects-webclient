import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"
import Router from "next/router"
import React, { useState } from "react" // { useEffect, useRef, useState }
import { connect, ConnectedProps } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { AnyAction, Dispatch } from "redux"

import { ICredentials, IProject, IUser, MembershipRole, ProjectProgress } from "api/schema"
import BaseLayout from "components/BaseLayout"
import PageError from "components/common/PageError"
import Redirect from "components/common/Redirect"
import LoginForm from "components/user/LoginForm"
import { loginAction } from "redux/actions/auth"
import { AppState } from "redux/reducer"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  doLogin: (credentials: ICredentials, actions: any) =>
    dispatch(loginAction(credentials, actions)),
})

const mapStateToProps = (state: AppState) => ({
  request: state.requests.userOperation,
  token: state.auth,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type PageProps = ConnectedProps<typeof connector> & WithTranslation & {
  redirectBack?: string,
}

const LoginPage: I18nPage<PageProps> = (props: PageProps) => {
  // prevent redirecting to the profile when the state changes while a login is running
  const [loggingIn, setLoggingIn] = useState(false)

  if (!loggingIn && props.token) {
    return <Redirect route={Routes.USER_PROFILE} />
  }

  const onSubmit = (credentials: ICredentials, actions: any) => {
    actions.success = (user: IUser) => {
      if (props.redirectBack) {
        Router.push(props.redirectBack)
        return
      }

      if (user.createdProjects) {
        const newProject = user.createdProjects
          .filter((p) => p.progress === ProjectProgress.CREATING_PROFILE && !p.name)
          .shift()

        const membership = newProject && user.projectMemberships
          .filter((m) => (m.project as IProject).id === newProject.id && m.role !== MembershipRole.APPLICANT)
          .shift()

        // if the user has created a project without a name and is still a member
        // -> directly redirect to the profile
        if (newProject && membership) {
          Router.push(Routes.PROJECT_PROFILE_EDIT, routeWithParams(Routes.PROJECT_PROFILE_EDIT,
            { slug: newProject.id }))
          return
        }
      }

      Router.push(Routes.MY_PROJECTS)
    }

    setLoggingIn(true)
    props.doLogin(credentials, actions)
  }

  const { request, t } = props

  return <BaseLayout pageTitle={t("page.user.login.title")}>
    <Row>
      <Col sm={8}>
        <Card>
          <CardHeader>{t("page.user.login.heading")}</CardHeader>
          <CardBody>
            <PageError error={request.loadingError} />
            <LoginForm onSubmit={onSubmit} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </BaseLayout>
}

LoginPage.getInitialProps = async ({ query }: NextJSContext) => ({
  namespacesRequired: includeDefaultNamespaces(),
  redirectBack: query.redirectBack,
})

export default connector(withTranslation(includeDefaultNamespaces())(LoginPage))
