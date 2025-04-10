import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {  isBillingStaffHOD, } from '../Authentication/Index'




export default function HODBillingRoutes() {

  let auth = {"token": isBillingStaffHOD()}


  return (
   auth.token ? <Outlet/> : <Navigate to="/dashboard"/>
  )
}
