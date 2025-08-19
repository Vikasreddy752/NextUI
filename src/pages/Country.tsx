function Country() {
  return (
    <div className="container">
      <h2>Manage Country</h2>
      <form>
        <div className="row mb-3">
          <div className="col">
            <input type="text" placeholder="Enter Name" className="form-control" />
          </div>
        </div>
        <div className="row mb-3 text-center">
          <div className="col">
            <button className="btn btn-primary">Add Country</button>
          </div>
        </div>        
      </form>
    </div>
  );
}

export default Country