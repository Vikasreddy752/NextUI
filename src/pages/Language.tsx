function Language() {
  return (
    <div className="container">
      <h2>Manage Language</h2>
      <form>
        <div className="row">
          <div className="col">
            <input type="text" placeholder="Enter Language Name" className="form-control" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Language