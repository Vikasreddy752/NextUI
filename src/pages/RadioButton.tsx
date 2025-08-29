import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function RadioButton() {
  const [students, setStudents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
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

  const baseUrl = "http://localhost:7070/api/Students";

  // Load Data
  useEffect(() => {
    loadStudents();
    loadCountries();
    loadStates();
    loadDistricts();
  }, []);

  const loadStudents = async () => {
    const res = await axios.get(`${baseUrl}`);
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

  const resetForm = () => {
    setId(0);
    setName("");
    setEmail("");
    setMobile("");
    setCountryId("");
    setStateId("");
    setDistrictId("");
    setGenderId(0);
  };

  // Add / Update
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

    if (id > 0) {
      await axios.put(`${baseUrl}/${id}`, payload);
      Swal.fire("Updated!", "Student record has been updated.", "success");
    } else {
      await axios.post(`${baseUrl}`, payload);
      Swal.fire("Added!", "New student has been added.", "success");
    }

    resetForm();
    loadStudents();
  };

  // Edit
  const handleEdit = (std) => {
    setId(std.id);
    setName(std.name);
    setEmail(std.email);
    setMobile(std.mobile);
    setCountryId(std.countryId);
    setStateId(std.stateId);
    setDistrictId(std.districtId);
    setGenderId(std.genderId || 0);
  };

  // Delete
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
        loadStudents();
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Student</h2>

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              value={mobile}
              placeholder="Enter Mobile"
              onChange={(e) => setMobile(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col">
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="form-control"
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
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="form-control"
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
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="form-control"
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

        {/* Row 3 */}
        <div className="row mb-3 text-center">
          <div className="col">
            {genders.map((g) => (
              <label key={g.id} className="me-3">
                <input
                  type="radio"
                  name="gender"
                  value={g.id}
                  checked={genderId === g.id}
                  onChange={(e) => setGenderId(Number(e.target.value))}
                  className="me-1"
                />
                {g.name}
              </label>
            ))}
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {id > 0 ? "Update Student" : "Add Student"}
            </button>
          </div>
          <div className="col"></div>
        </div>
      </form>

      {/* Student Table */}
      <h3 className="mt-4">Student List</h3>
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
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(std)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(std.id)}
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



export default RadioButton;
