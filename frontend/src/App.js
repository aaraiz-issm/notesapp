import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState({ instructorName: "", universityName: "", courseCode: "" });
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", courseName: "", courseCode: "", instructorName: "", universityName: "" });

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    const res = await axios.get("http://localhost:3000/api/pdfs");
    setPdfs(res.data);
  };

  const handleSearch = async () => {
    const query = new URLSearchParams(search).toString();
    const res = await axios.get(`http://localhost:3000/api/pdfs/search?${query}`);
    setPdfs(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append("pdf", file);
    await axios.post("http://localhost:3000/api/pdfs", data, { headers: { "Content-Type": "multipart/form-data" } });
    fetchPdfs();
  };

  return (
    <div className="container">
      <h1 className="title">PDF Manager</h1>
      
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="form">
        <input type="text" placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required />
        <input type="text" placeholder="Course Name" onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} className="input" required />
        <input type="text" placeholder="Course Code" onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} className="input" required />
        <input type="text" placeholder="Instructor Name" onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })} className="input" required />
        <input type="text" placeholder="University Name" onChange={(e) => setFormData({ ...formData, universityName: e.target.value })} className="input" required />
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="input" required />
        <button type="submit" className="button">Upload PDF</button>
      </form>

      {/* Search Form */}
      <div className="form">
        <input type="text" placeholder="Search by Instructor" onChange={(e) => setSearch({ ...search, instructorName: e.target.value })} className="input" />
        <input type="text" placeholder="Search by University" onChange={(e) => setSearch({ ...search, universityName: e.target.value })} className="input" />
        <input type="text" placeholder="Search by Course Code" onChange={(e) => setSearch({ ...search, courseCode: e.target.value })} className="input" />
        <button onClick={handleSearch} className="button">Search</button>
      </div>

      {/* PDF List */}
      <div>
        {pdfs.map((pdf) => (
          <div key={pdf._id} className="pdf-item">
            <span>{pdf.title} - {pdf.courseCode} - {pdf.instructorName}</span>
            <a href={`http://localhost:3000/api/pdfs/${pdf._id}/file`} target="_blank" className="view-link">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
