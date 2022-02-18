import React from 'react';

function Address() {
  return (
    <>
      <h1>Address</h1>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Authorized Address<br/>
              <small className="form-text text-muted">
                This address is allowed to use Probity (cannot be modified)
              </small>
            </label>
            <input className="form-control" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button
              onClick={() => {}}
              className="btn btn-outline-secondary"
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Address;
