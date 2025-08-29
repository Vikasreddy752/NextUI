import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function ImageUpload() {
  const [customers, setCustomers] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const baseUrl = "http://localhost:7070/api/Customer"; // adjust if needed
  const imageUrl = "http://localhost"; // to display images later

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await axios.get(`${baseUrl}`);
    setCustomers(res.data);
  };

  const resetForm = () => {
    setId(0);
    setName("");
    setEmail("");
    setMobile("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    if (image) formData.append("image", image);

    if (id && id > 0) {
      await axios.put(`${baseUrl}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Updated!", "Customer updated successfully.", "success");
    } else {
      await axios.post(`${baseUrl}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Added!", "Customer added successfully.", "success");
    }

    resetForm();
    loadCustomers();
  };

  const handleEdit = (cus) => {
    setId(cus.id);
    setName(cus.name);
    setEmail(cus.email);
    setMobile(cus.mobile);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await axios.delete(`${baseUrl}/${id}`);
      Swal.fire("Deleted!", "Customer has been deleted.", "success");
      loadCustomers();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Customers</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="text-center mb-3">
          <button type="submit" className="btn btn-primary">
            {id > 0 ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>

      <h3>Customer List</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cus) => (
            <tr key={cus.id}>
              <td>{cus.id}</td>
              <td>{cus.name}</td>
              <td>{cus.email}</td>
              <td>{cus.mobile}</td>
              <td>
                {cus.image && (
                  <img
                    src={`${imageUrl}/uploads/${cus.image}`}
                    alt={cus.name}
                    width="50"
                  />
                )}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(cus)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cus.id)}
                  className="btn btn-danger btn-sm"
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

export default ImageUpload;
