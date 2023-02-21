import React from 'react'

import AdminLoginForm from "../components/Forms/AdminLoginForm"

// *****************************************************************************
// A) Component Code
// *****************************************************************************

const AdminLandingPage = (props) => {

  // ---------------------------------------------------------------------------
  // I) JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      <AdminLoginForm {...props}/>
    </>
    )
  }
  export default AdminLandingPage;