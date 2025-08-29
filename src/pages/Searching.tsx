import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const StudentManager = () => {
  // States
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

  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];

  const baseUrl = "http://localhost:7070/api/Students"; // e.g. http://localhost:7070/api

  // Load Students, Countries, States, Districts
  useEffect(() => {
    loadStudents();
    loadCountries();
    loadStates();
    loadDistricts();
  }, []);

  const loadStudents = async () => {
    const res = await axios.get("http://localhost:7070/api/Students");
    setStudents(res.data);
  };

  const loadCountries = async () => {
    const res = await axios.get("http://localhost:7070/api/Country");
    setCountries(res.data);
  };

  const loadStates = async () => {
    const res = await axios.get("http://localhost:7070/api/State");
    setStates(res.data);
  };

  const loadDistricts = async () => {
    const res = await axios.get("http://localhost:7070/api/Districts");
    setDistricts(res.data);
  };

  // ✅ LIVE TYPING (debounced) SEARCH
  useEffect(() => {
    const timer = setTimeout(async () => {
      const term = searchTerm.trim();
      if (!term) {
        // empty -> load all students
        loadStudents();
        return;
      }
      try {
        // matches your Step 7 endpoint
        const res = await axios.get(
          "http://localhost:7070/api/Students/by-name",{ params: { query: term } });
        setStudents(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 0); // debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]); // runs whenever you type

  // Reset Form
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

  // Add or Update Student
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
      await axios.put(`${baseUrl}/${id}`, payload);
      Swal.fire("Updated!", "Student record has been updated.", "success");
    } else {
      await axios.post(`${baseUrl}`, payload);
      Swal.fire("Added!", "New student has been added.", "success");
    }

    resetForm();
    loadStudents();
  };

  // Edit Student
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

  // Delete Student
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
        await axios.delete(`${baseUrl}/${studentId}`);
        Swal.fire("Deleted!", "Student has been deleted.", "success");
        loadStudents();
      }
    });
  };

  // Manual Search (optional – keeps your Step 7 button flow)
  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      loadStudents();
      return;
    }
    const res = await axios.get(`${baseUrl}/by-name`, {
      params: { query: term },
    });
    setStudents(res.data);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Student Management</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          + Add Student
        </button>
      </form>

      {/* Modal Form */}
      {showForm && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <form onSubmit={handleSubmit}>
                <h5 className="mb-3">{id ? "Edit Student" : "Add Student"}</h5>

                <div className="row mb-2">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
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
                        className="form-check-input"
                        name="gender"
                        value={g.id}
                        checked={genderId === g.id}
                        onChange={() => setGenderId(g.id)}
                      />
                      <label className="form-check-label">{g.name}</label>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <table className="table table-bordered mt-3">
        <thead className="table-light">
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
          {students.length > 0 ? (
            students.map((std) => (
              <tr key={std.id}>
                <td>{std.name}</td>
                <td>{std.email}</td>
                <td>{std.mobile}</td>
                <td>{countries.find((c) => c.id === std.countryId)?.name}</td>
                <td>{states.find((s) => s.id === std.stateId)?.name}</td>
                <td>{districts.find((d) => d.id === std.districtId)?.name}</td>
                <td>{genders.find((g) => g.id === std.genderId)?.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(std)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(std.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManager;
