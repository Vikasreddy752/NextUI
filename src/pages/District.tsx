import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function District() {
  const [districts, setDistricts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);

  const baseUrl = "http://localhost:7070/api/Districts";
  const countryUrl = "http://localhost:7070/api/Country";
  const stateUrl = "http://localhost:7070/api/State";

  // Load data
  const loadCountries = useCallback(async () => {
    const res = await axios.get(countryUrl);
    setCountries(res.data);
  }, [countryUrl]);

  const loadStates = useCallback(async () => {
    const res = await axios.get(stateUrl);
    setStates(res.data);
  }, [stateUrl]);

  const loadDistricts = useCallback(async () => {
    const res = await axios.get(baseUrl);
    setDistricts(res.data);
  }, [baseUrl]);

  useEffect(() => {
    loadCountries();
    loadStates();
    loadDistricts();
  }, [loadCountries, loadStates, loadDistricts]);

  // Toast
  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  };

  // Add or Update
  const handleSave = async () => {
    if (!name.trim() || countryId === 0 || stateId === 0) {
      Swal.fire("Validation Error", "All fields are required", "warning");
      return;
    }

    const data = { id, name, countryId: parseInt(countryId), stateId: parseInt(stateId) };

    if (id === 0) {
      await axios.post(baseUrl, data);
      toast("success", "District added successfully!");
    } else {
      await axios.put(baseUrl, data);
      toast("success", "District updated successfully!");
    }

    resetForm();
    loadDistricts();
  };

  // Edit
  const handleEdit = (district) => {
    setId(district.id);
    setName(district.name);
    setCountryId(district.countryId);
    setStateId(district.stateId);
  };

  // Delete
  const handleDelete = (districtId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/${districtId}`);
        toast("success", "District deleted successfully!");
        loadDistricts();
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setId(0);
    setName("");
    setCountryId(0);
    setStateId(0);
  };

  // JSX
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Districts</h2>

      <div className="mb-3">
        <select
          className="form-select mb-2"
          value={countryId}
          onChange={(e) => { setCountryId(parseInt(e.target.value)); setStateId(0); }}
        >
          <option value={0}>Select Country</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select
          className="form-select mb-2"
          value={stateId}
          onChange={(e) => setStateId(parseInt(e.target.value))}
          disabled={countryId === 0}
        >
          <option value={0}>Select State</option>
          {states.filter(s => s.countryId === countryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter District Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {id === 0 ? "Add District" : "Update District"}
          </button>
          <button className="btn btn-secondary" onClick={resetForm}>Reset</button>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Country</th>
            <th>State</th>
            <th>District</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {districts.length === 0 && <tr><td colSpan="5" className="text-center">No districts found.</td></tr>}
          {districts.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{countries.find(c => c.id === d.countryId)?.name}</td>
              <td>{states.find(s => s.id === d.stateId)?.name}</td>
              <td>{d.name}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(d)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default District;
