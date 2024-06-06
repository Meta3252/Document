import React, { useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import '../App.css';
import '../css/add.css'; // Import your custom CSS file

ReactModal.setAppElement('#root'); // Set the root element for accessibility

function App() {
  const [formData, setFormData] = useState({
    requestType: 'เพิ่มเอกสาร',
    documentCode: '',
    documentName: '',
    rev: '0',
    darNo: '', 
    effectiveDate: '',
    status: 'รออนุมัติ',
    file: null
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
    setIsConfirmed(false);
  };

  const handleConfirmSubmit = () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
  
    // ดึงค่า DarNo ล่าสุด
    axios.get('http://localhost:3001/latestDarno')
      .then(response => {
        const latestDarno = response.data.latestDarno;
        const nextDarno = latestDarno + 1; // ค่า DarNo ถัดไป
        setFormData(prevState => ({ ...prevState, darNo: nextDarno.toString() }));
        data.set('darNo', nextDarno);
  
        // ส่งแบบฟอร์มพร้อมค่า DarNo ใหม่
        axios.post('http://localhost:3001/datadocument', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log(response.data);
            setIsConfirmed(true);
            setIsModalOpen(false);
          })
          .catch(error => {
            console.error('มีข้อผิดพลาดในการส่งแบบฟอร์ม!', error);
          });
      })
      .catch(error => {
        console.error('มีข้อผิดพลาดในการรับ Darno ล่าสุด:', error);
      });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const { documentCode, documentName } = formData;

    axios.get(`http://localhost:3001/checkDuplicate?documentCode=${documentCode}&documentName=${documentName}`)
      .then(response => {
        if (response.data.isDuplicate) {
          alert('รหัสเอกสารหรือชื่อเอกสารซ้ำกัน');
        } else {
          axios.get('http://localhost:3001/maxDarNo')
            .then(response => {
              const maxDarNo = response.data.maxDarNo;
              setFormData(prevState => ({ ...prevState, darNo: maxDarNo.toString() }));
              setIsModalOpen(true);
            })
            .catch(error => {
              console.error('มีข้อผิดพลาดในการรับค่า DarNo ที่มากที่สุด:', error);
            });
        }
      })
      .catch(error => {
        console.error('มีข้อผิดพลาดในการตรวจสอบการซ้ำกัน:', error);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>ประเภทคำร้องขอ:</label>
          <input type="text" name="requestType" value={formData.requestType} onChange={handleChange} readOnly />
        </div>
        <div>
          <label>รหัสเอกสาร:</label>
          <input type="text" name="documentCode" value={formData.documentCode} onChange={handleChange} />
        </div>
        <div>
          <label>ชื่อเอกสาร:</label>
          <input type="text" name="documentName" value={formData.documentName} onChange={handleChange} />
        </div>
        <div>
          <label>Rev:</label>
          <input type="text" name="rev" value={formData.rev} onChange={handleChange} readOnly />
        </div>
        <div>
          <label>DarNo:</label>
          <input type="text" name="darNo" value={formData.darNo} onChange={handleChange} readOnly />
        </div>
        <div>
          <label>วันบังคับใช้:</label>
          <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} />
        </div>
        <div>
          <label>สถานะเอกสาร:</label>
          <input type="text" name="status" value={formData.status} onChange={handleChange} readOnly />
        </div>
        <div>
          <label>อัพโหลดไฟล์:</label>
          <input type="file" name="file" onChange={handleChange} />
        </div>
        <button type="submit">ส่ง</button>
      </form>
      <ReactModal 
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="ยืนยันการส่ง"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>ยืนยันการส่ง</h2>
        <p>คุณแน่ใจหรือไม่ว่าต้องการส่งแบบฟอร์มนี้?</p>
        <div className="modal-buttons">
          <button onClick={handleConfirmSubmit}>ยืนยัน</button>
          <button onClick={handleCloseModal}>ยกเลิก</button>
        </div>
      </ReactModal>
      {isConfirmed && (
        <div className="confirmation-message">
          ข้อมูลได้ถูกส่งเรียบร้อยแล้ว
        </div>
      )}
    </div>
  );
}

export default App;
