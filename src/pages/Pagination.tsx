import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function StudentManager() {
  // ---------- State ----------
  const [students, setStudents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [genderId, setGenderId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" }
  ];

  const baseUrl = "http://localhost:7070/api/Students";

  // ---------- API Calls ----------
  const loadStudents = async () => {
    const res = await axios.get(
      `${baseUrl}/paginated?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    setStudents(res.data.data);
    setTotalRecords(res.data.totalRecords);
  };

  const loadCountries = async () => {
    const res = await axios.get("http://localhost:7070/Country");
    setCountries(res.data);
  };

  const loadStates = async () => {
    const res = await axios.get("http://localhost:7070/State");
    setStates(res.data);
  };

  const loadDistricts = async () => {
    const res = await axios.get("http://localhost:7070/Districts");
    setDistricts(res.data);
  };

  // ---------- Form ----------
  const resetForm = () => {
    setId(0);
    setName("");
    setEmail("");
    setMobile("");
    setCountryId("");
    setStateId("");
    setDistrictId("");
    setGenderId(0);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id,
      name,
      email,
      mobile,
      countryId: countryId ? Number(countryId) : null,
      stateId: stateId ? Number(stateId) : null,
      districtId: districtId ? Number(districtId) : null,
      genderId: genderId ? Number(genderId) : null,
    };

    if (id && id > 0) {
      await axios.put(`${baseUrl}/students`, payload);
      Swal.fire("Updated!", "Student record has been updated.", "success");
    } else {
      await axios.post(`${baseUrl}/students`, payload);
      Swal.fire("Added!", "New student has been added.", "success");
    }
    resetForm();
    loadStudents();
  };

  const handleEdit = (std) => {
    setId(std.id);
    setName(std.name || "");
    setEmail(std.email || "");
    setMobile(std.mobile || "");
    setCountryId(std.countryId || "");
    setStateId(std.stateId || "");
    setDistrictId(std.districtId || "");
    setGenderId(std.genderId || 0);
    setShowForm(true);
  };

  const handleDelete = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/students/${studentId}`);
        loadStudents();
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    });
  };

  // ---------- Search ----------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadStudents();
      return;
    }
    const res = await axios.get(`${baseUrl}/by-name?query=${searchTerm}`);
    setStudents(res.data);
    setTotalRecords(res.data.length);
  };

  // ---------- Effects ----------
  useEffect(() => {
    loadStudents();
    // loadCountries();
    // loadStates();
    // loadDistricts();
  }, [currentPage]);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(totalRecords / pageSize);

  // ---------- JSX ----------
  return (
    <div className="container mt-4">
      <h2>Student Management</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {/* Add Button */}
      <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
        Add Student
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">{id ? "Edit Student" : "Add New Student"}</h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row mb-2">
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="email"
                      placeholder="Email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Mobile"
                      className="form-control"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col">
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <select
                      className="form-select"
                      value={districtId}
                      onChange={(e) => setDistrictId(e.target.value)}
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="me-3">
                    <strong>Gender:</strong>
                  </label>
                  {genders.map((g) => (
                    <div className="form-check form-check-inline" key={g.id}>
                      <input
                        type="radio"
                        name="gender"
                        value={g.id}
                        checked={genderId === g.id}
                        onChange={() => setGenderId(g.id)}
                        className="form-check-input"
                      />
                      <label className="form-check-label">{g.name}</label>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Save"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Country</th>
            <th>State</th>
            <th>District</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((std) => (
            <tr key={std.id}>
              <td>{std.name}</td>
              <td>{std.email}</td>
              <td>{std.mobile}</td>
              <td>{countries.find((c) => c.id === std.countryId)?.name}</td>
              <td>{states.find((s) => s.id === std.stateId)?.name}</td>
              <td>{districts.find((d) => d.id === std.districtId)?.name}</td>
              <td>{genders.find((g) => g.id === std.genderId)?.name}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(std)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(std.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-light me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ◀
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-light"} me-1`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-light ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
