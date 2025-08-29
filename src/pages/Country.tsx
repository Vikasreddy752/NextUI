import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Country() {
    const[country,setCountries] = useState([]);
    const[id,setId] = useState(0);
    const[name,setName] = useState("");
    const baseUrl = "http://localhost:7070/api/Country";// Spring Boot API URL
     
    useEffect(()=>{
       loadCountries();
    },[]);
    const loadCountries = ()=>{
        axios
        .get(baseUrl)
        .then((res)=>setCountries(res.data))
        .catch((err) => console.log("Error loading countries", err));
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
                    toast("success", "Country added");
                    resetForm();
                    loadCountries();
                })
                .catch((err) => console.log("Error Adding Country", err))
        } else {
                axios.put(`${baseUrl}/${id}`, data)
                .then(() => {
                    toast("success", "Country updated");
                    resetForm();
                    loadCountries();
                })
                .catch((err) => console.log("Error adding country", err));        }
    };

    const handleEdit =(country)=>{
        setId(country.id);
        setName(country.name);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Country?",
            text: "This cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${baseUrl}/${id}`)
                    .then(() => {
                        toast("success", "Country deleted");
                        loadCountries();
                    })
                    .catch((err) => console.error("Error deleting Country:", err));
            }
        });
    };

    const resetForm = ()=>{
        setId(0);
       setName("");
    }
   return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Countries</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Country"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={handleSave}>
          {id === 0 ? "Add Country" : "Update Country"}
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
          {country.map((country) => (
            <tr key={country.id}>
              <td>{country.id}</td>
              <td>{country.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(country)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(country.id)}
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
export default Country