// TODO: fix eslint import sort
import AddAssociationCompany from "pages/dashboard/AddAssociationCompany"
import AddAssociationCustomer from "pages/dashboard/AddAssociationCustomer"
import AddOrUpdateCompany from "pages/dashboard/AddOrUpdateCompany"
import AddOrUpdateCustomer from "pages/dashboard/AddOrUpdateCustomer"
import DetailCompany from "pages/dashboard/DetailCompany"
import DetailCustomer from "pages/dashboard/DetailCustomer"
import Customer from "pages/dashboard/index"
import SendEmail from "pages/dashboard/SendEmail"
import Login from "pages/login/login"
import Register from "pages/register/Register"
import Welcome from "pages/welcome"
import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"

import { UserQuery } from "./hooks/user"

type IPrivateRoute = {
  path: string
  autheticated: boolean
  nonAuthenticatedRedirect: string
  children: React.ReactNode
}

const PrivateRoute = ({ path, autheticated, nonAuthenticatedRedirect, children }: IPrivateRoute) => {
  if (!autheticated) {
    return <Route render={() => <Redirect to={nonAuthenticatedRedirect} />} />
  }

  return (
    <Route exact path={path}>
      {children}
    </Route>
  )
}

function RouterProvider(): JSX.Element {
  const { loading, data } = UserQuery()

  const authenticated = Boolean(data?.user?.id)

  if (loading) {
    return <b>loading</b>
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />

        <PrivateRoute
          autheticated={authenticated}
          nonAuthenticatedRedirect="/"
          path="/dashboard/company/association/:companyId"
        >
          <AddAssociationCompany user={data?.user} />
        </PrivateRoute>
        <PrivateRoute
          autheticated={authenticated}
          nonAuthenticatedRedirect="/"
          path="/dashboard/customer/association/:customerId"
        >
          <AddAssociationCustomer user={data?.user} />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/customer/send-email">
          <SendEmail />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/add-customer">
          <AddOrUpdateCustomer />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/update-customer">
          <AddOrUpdateCustomer />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/add-company">
          <AddOrUpdateCompany />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/update-company">
          <AddOrUpdateCompany />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/customer/:customerId">
          <DetailCustomer user={data?.user} />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/company/:companyId">
          <DetailCompany user={data?.user} />
        </PrivateRoute>
        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard/:currentTab">
          <Customer user={data?.user} />
        </PrivateRoute>

        <PrivateRoute autheticated={authenticated} nonAuthenticatedRedirect="/" path="/dashboard">
          <Customer user={data?.user} />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

export default RouterProvider
