function TradeActivity() {
    return (
        <>
            <label htmlFor="from" className="form-label">From</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" id="from" />
                <span className="input-group-text">USD</span>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-light">
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>
            <label htmlFor="to" className="form-label">To</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" id="to" />
                <span className="input-group-text">LQO</span>
            </div>
        </>
    )
}

export default TradeActivity