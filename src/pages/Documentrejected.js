import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../css/DocumentRejectedList.css'; // Import the CSS file

function DocumentRejectedList() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/document_rejected', {
        params: { query }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <div className="DocumentRejectedList">
      <h1>Rejected Document List</h1>
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
          {data.map((item, index) => (
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

export default DocumentRejectedList;
