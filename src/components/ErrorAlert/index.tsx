import React from 'react'

function ErrorAlert({ error }: { error: any }) {
  return (
    error && (
      <div className="alert alert-danger alert-dismissible fade show overflow-auto w-100" role="alert">
        <div className="text-break" style={{ maxHeight: 100 }}>{error.reason || error.data?.message || error.message}</div>
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  )
}

export default ErrorAlert