import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Document_Approved.css';

function DocumentApproved() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchApprovedData();
  }, []);

  const fetchApprovedData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/documents_approved');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching approved documents:', error);
    }
  };

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const formattedDate = dateObj.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    return formattedDate;
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.documentCode.toLowerCase().includes(query.toLowerCase()) ||
    item.documentName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="DocumentApproved">
      <h1>Approved Document List</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by document code or name"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>DarNo</th>
            <th>Request Type</th>
            <th>Document Code</th>
            <th>Document Name</th>
            <th>Rev</th>
            <th>Effective Date</th>
            <th>Status</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.darNo}</td>
              <td>{item.requestType}</td>
              <td>{item.documentCode}</td>
              <td>{item.documentName}</td>
              <td>{item.rev}</td>
              <td>{formatDate(item.effectiveDate)}</td>
              <td>{item.status}</td>
              <td>
                {item.filePath ? (
                  <a href={`http://localhost:3001/${item.filePath}`} target="_blank" rel="noopener noreferrer">Download</a>
                ) : (
                  'No file'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentApproved;
