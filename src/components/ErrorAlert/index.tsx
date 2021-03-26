import React from 'react'

function ErrorAlert({ error }: { error: any }) {
  return (
    error && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error.data?.message || error.message}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  )
}

export default ErrorAlert