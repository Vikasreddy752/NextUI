// src/pages/Language.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Language() {
  const [languages, setLanguages] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const baseUrl = "http://localhost:7070/api/Language"; // Spring Boot API URL

  // Load languages on mount
  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = () => {
    axios
      .get(baseUrl)
      .then((res) => setLanguages(res.data))
      .catch((err) => console.error("Error loading languages:", err));
  };

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

  const handleSave = () => {
    if (!name.trim()) {
      toast("warning", "Language name required");
      return;
    }

    const data = { id, name };

    if (id === 0) {
      axios
        .post(baseUrl, data)
        .then(() => {
          toast("success", "Language added");
          resetForm();
          loadLanguages();
        })
        .catch((err) => console.error("Error adding language:", err));
    } else {
      axios
        .put(`${baseUrl}/${id}`, data)
        .then(() => {
          toast("success", "Language updated");
          resetForm();
          loadLanguages();
        })
        .catch((err) => console.error("Error updating language:", err));
    }
  };

  const handleEdit = (language) => {
    setId(language.id);
    setName(language.name);
  };

  const handleDelete = (langId) => {
    Swal.fire({
      title: "Delete language?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/${langId}`)
          .then(() => {
            toast("success", "Language deleted");
            loadLanguages();
          })
          .catch((err) => console.error("Error deleting language:", err));
      }
    });
  };

  const resetForm = () => {
    setId(0);
    setName("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Languages</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter language"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={handleSave}>
          {id === 0 ? "Add Language" : "Update Language"}
        </button>
        <button className="btn btn-secondary" onClick={resetForm}>
          Reset
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang) => (
            <tr key={lang.id}>
              <td>{lang.id}</td>
              <td>{lang.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(lang)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(lang.id)}
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

export default Language;
