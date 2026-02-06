import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getStudents, deleteStudent } from "../api";
import { useNavigate } from "react-router-dom";

export default function StudentsCRUD() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      setError("Could not fetch students");
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
    } catch {
      setError("Could not delete student");
    }
  };

  return (
    <>
      <Header />
      <div className="hh22">
        <h2>Students List</h2>
        {error && <small className="error">{error}</small>}
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>University</th><th>City</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.full_name}</td>
                <td>{s.email}</td>
                <td>{s.university}</td>
                <td>{s.city}</td>
                <td>
                  <button onClick={() => navigate(`/edit-student/${s.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
