import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

import "react-datepicker/dist/react-datepicker.css";

function Documentsearch() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedFile, setEditedFile] = useState(null);
  const [editedDate, setEditedDate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/documents_approved');
      const jsonData = await response.json();
      setData(jsonData);
      setSearchResults(getHighestRevDocuments(jsonData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (Array.isArray(data)) {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
      } else {
        const filteredData = data.filter(item =>
          item.documentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(getHighestRevDocuments(filteredData));
      }
    }
  }, [data, searchTerm]);

  const getHighestRevDocuments = (documents) => {
    const documentMap = new Map();
    documents.forEach(doc => {
      const key = `${doc.documentCode}-${doc.documentName}`;
      if (!documentMap.has(key) || documentMap.get(key).rev < doc.rev) {
        documentMap.set(key, doc);
      }
    });
    return Array.from(documentMap.values());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedDate(new Date(searchResults[index].effectiveDate));
  };

  const sendDataToServer = async (newDarNo) => {
    try {
      const formData = new FormData();
      const currentRev = parseInt(searchResults[editingIndex].rev);
      formData.append('requestType', 'แก้ไขเอกสาร');
      formData.append('documentCode', searchResults[editingIndex].documentCode);
      formData.append('documentName', searchResults[editingIndex].documentName);
      formData.append('rev', currentRev + 1);
      formData.append('darNo', newDarNo);
      const editedDateTime = new Date(editedDate);
      editedDateTime.setHours(12);
      formData.append('effectiveDate', editedDateTime.toISOString().split('T')[0]);
      formData.append('status', 'รออนุมัติ');
      formData.append('file', editedFile);

      const response = await fetch('http://localhost:3001/datadocument', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
        setEditingIndex(null);
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleSave = async () => {
    if (editedDate && editedFile && editedFile.type === 'application/pdf') {
      try {
        const response = await fetch('http://localhost:3001/maxDarNo');
        const jsonData = await response.json();
        const newDarNo = jsonData.maxDarNo + 1;
        sendDataToServer(newDarNo);
      } catch (error) {
        console.error('Error fetching max darNo:', error);
      }
    } else {
      alert('Please select a valid PDF file and date');
    }
  };

  const moveDocumentToDataDocument = async (document, newDarNo) => {
    document.darNo = newDarNo;
    document.requestType = 'ขอยกเลิกเอกสาร';
    document.status = 'รออนุมัติ';
  
    try {
      const response = await fetch('http://localhost:3001/datadocument', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
      } else {
        console.error('Failed to move document');
      }
    } catch (error) {
      console.error('Error moving document:', error);
    }
  };
  
  const handleCancel = (index) => {
    confirmAlert({
      title: 'ยืนยันการยกเลิกเอกสาร',
      message: 'คุณต้องการยกเลิกเอกสารฉบับนี้ใช่ไหม',
      buttons: [
        {
          label: 'ใช่',
          onClick: async () => {
            try {
              const document = searchResults[index];
              const response = await fetch('http://localhost:3001/maxDarNo');
              const jsonData = await response.json();
              const newDarNo = jsonData.maxDarNo + 1;
              await moveDocumentToDataDocument(document, newDarNo);
            } catch (error) {
              console.error('Error canceling document:', error);
            }
          }
        },
        {
          label: 'ไม่ใช่',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="Documentsearch">
      <h1>Approved Document List</h1>
      <div>
        <input
          type="text"
          placeholder="Search document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Dar No</th>
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
          {searchResults.map((item, index) => (
            <tr key={index}>
              <td>{item.darNo}</td>
              <td>{item.requestType}</td>
              <td>{item.documentCode}</td>
              <td>{item.documentName}</td>
              <td>{item.rev}</td>
              <td>
                {index === editingIndex ? (
                  <DatePicker
                    selected={editedDate || (searchResults[index] && new Date(searchResults[index].effectiveDate))}
                    onChange={(date) => setEditedDate(date)}
                    dateFormat="dd/MM/yyyy"
                  />
                ) : (
                  formatDate(item.effectiveDate)
                )}
              </td>
              <td>{item.status}</td>
              <td>
                {item.filePath ? (
                  <a href={`http://localhost:3001/${item.filePath}`} target="_blank" rel="noopener noreferrer">Download</a>
                ) : (
                  'No file'
                )}
              </td>
              <td>
                {index === editingIndex ? (
                  <>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setEditedFile(e.target.files[0])}
                    />
                    <button onClick={handleSave}>Save</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(index)} className='bg-yellow-500 hover:bg-yellow-200'>แก้ไข</button>
                    <button onClick={() => handleCancel(index)} className='mt-2 bg-red-600 hover:bg-red-400'>ยกเลิกเอกสาร</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Documentsearch;
