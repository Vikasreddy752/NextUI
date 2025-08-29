import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function State() {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");

  const stateUrl = "http://localhost:7070/api/State";
  const countryUrl = "http://localhost:7070/api/Country";

  // useCallback ensures these functions are stable for useEffect
  const loadStates = useCallback(async () => {
    try {
      const res = await axios.get(stateUrl);
      setStates(res.data);
    } catch (err) {
      console.error("Error loading states", err);
    }
  }, [stateUrl]);

  const loadCountries = useCallback(async () => {
    try {
      const res = await axios.get(countryUrl);
      setCountries(res.data);
    } catch (err) {
      console.error("Error loading countries", err);
    }
  }, [countryUrl]);

  useEffect(() => {
    loadStates();
    loadCountries();
  }, [loadStates, loadCountries]); // now empty array is fine


  // Step 3: Toast Notifications
  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Step 4: Add or Update State
  const handleSave = async () => {
    if (!name.trim()) {
      toast("warning", "State name is required");
      return;
    }
    if (!countryId) {
      toast("warning", "Please select a country");
      return;
    }

    const data = { name, countryId: parseInt(countryId) };

    try {
      if (id === 0) {
        await axios.post(stateUrl, data);
        toast("success", "State added");
      } else {
        await axios.put(`${stateUrl}/${id}`, data);
        toast("success", "State updated");
      }
      resetForm();
      loadStates();
    } catch (err) {
      console.error("Error saving state", err);
      toast("error", "Something went wrong");
    }
  };

  // Step 5: Edit State
  const handleEdit = (state) => {
    setId(state.id);
    setName(state.name);
    setCountryId(state.countryId.toString());
  };

  // Step 6: Delete State
  const handleDelete = (stateId) => {
    Swal.fire({
      title: "Delete this state?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${stateUrl}/${stateId}`);
          toast("success", "State deleted");
          loadStates();
        } catch (err) {
          console.error("Error deleting state", err);
          toast("error", "Could not delete state");
        }
      }
    });
  };

  // Step 7: Reset Form
  const resetForm = () => {
    setId(0);
    setName("");
    setCountryId("");
  };

  // Step 8: JSX Form & Table
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage States</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter State"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="form-select mb-2"
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
        <button className="btn btn-primary me-2" onClick={handleSave}>
          {id === 0 ? "Add State" : "Update State"}
        </button>
        <button className="btn btn-secondary" onClick={resetForm}>
          Reset
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>State Name</th>
            <th>Country</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{countries.find((c) => c.id === s.countryId)?.name || ""}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default State;
