import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DocumentDestroy.css';

function DocumentDestroy() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDestroyedData();
  }, []);

  const fetchDestroyedData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/document_destroy');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching destroyed documents:', error);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      item.documentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="DocumentDestroy">
      <h1>Destroyed Document List</h1>
      <input
        type="text"
        placeholder="Search by document code or name"
        value={searchTerm}
        onChange={handleSearch}
      />
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

export default DocumentDestroy;
