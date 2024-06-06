import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../DataDocumentList.css'; // Import the CSS file

function DataDocumentList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/datadocument');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const moveDocumentToDestroy = async (documentCode, documentName) => {
    try {
      await axios.post('http://localhost:3001/move_to_document_destroy', { documentCode, documentName });
    } catch (error) {
      console.error('Error moving document to document_destroy:', error);
    }
  };

  const approveDocument = async (darNo, requestType, documentCode, documentName) => {
    try {
      if (requestType === 'ขอยกเลิกเอกสาร') {
        const response = await axios.post('http://localhost:3001/document_approve', { darNo });
        if (response.status === 200) {
          // Move all matching documents to document_destroy
          await moveDocumentToDestroy(documentCode, documentName);
          fetchData(); // Refresh data after moving documents
        }
      } else {
        await axios.post('http://localhost:3001/document_approve', { darNo });
        const updatedData = data.map((item) => {
          if (item.darNo === darNo) {
            return { ...item, status: "อนุมัติแล้ว" };
          }
          return item;
        });
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const rejectDocument = async (darNo) => {
    try {
      await axios.post('http://localhost:3001/documents_rejected', { darNo });
      fetchData();
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  return (
    <div className="DataDocumentList">
      <h1>Data Document List</h1>
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
            <th>Actions</th>
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
              <td>
                <button onClick={() => approveDocument(item.darNo, item.requestType, item.documentCode, item.documentName)} className='bg-green-600 hover:bg-green-400'>อนุมัติ</button>
                <button onClick={() => rejectDocument(item.darNo)} className='mt-2 bg-red-600 hover:bg-red-400'>ไม่อนุมัติ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataDocumentList;
