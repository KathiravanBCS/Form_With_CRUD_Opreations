import React, { useState } from 'react';

const StudentForm = () => {
  // State for storing student records and form data
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    studentEmail: '',
    studentPhone: '',
    gender: '',
    address: {
      fullAddress: '',  
      town: '',
      pincode: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate student ID format 
  const validateStudentId = (id) => {
    const regex = /^[A-Za-z]{3}\d{3}$/;
    return regex.test(id);
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate phone number 
  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  // Validate pincode 
  const validatePincode = (pincode) => {
    const regex = /^\d{6}$/;
    return regex.test(pincode);
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!validateStudentId(formData.studentId)) {
      newErrors.studentId = 'Student Id Format abc123';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required';
    } else if (!validateEmail(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email';
    }
    
    if (!formData.studentPhone.trim()) {
      newErrors.studentPhone = 'Phone number is required';
    } else if (!validatePhone(formData.studentPhone)) {
      newErrors.studentPhone = 'Phone number must be 10 digits';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.address.fullAddress.trim()) {
      newErrors['address.fullAddress'] = 'Address is required';
    }
    
    if (!formData.address.town.trim()) {
      newErrors['address.town'] = 'City is required';
    }
    
    if (!formData.address.pincode.trim()) {
      newErrors['address.pincode'] = 'Pincode is required';
    } else if (!validatePincode(formData.address.pincode)) {
      newErrors['address.pincode'] = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check for duplicate student ID
    if (!editMode && students.some(student => student.studentId === formData.studentId)) {
      setErrors({
        ...errors,
        studentId: 'Student ID already exists!'
      });
      return;
    }

    if (editMode) {
      // Update existing student
      setStudents(students.map(student => 
        student.studentId === currentStudentId ? formData : student
      ));
      setEditMode(false);
      setCurrentStudentId(null);
    } else {
      // Add new student
      setStudents([...students, formData]);
    }
    
    // Reset form
    setFormData({
      studentId: '',
      firstName: '',
      lastName: '',
      studentEmail: '',
      studentPhone: '',
      gender: '',
      address: {
        fullAddress: '',
        town: '',
        pincode: ''
      }
    });
    setErrors({});
  };

  // Edit student handler
  const handleEdit = (student) => {
    setFormData(student);
    setEditMode(true);
    setCurrentStudentId(student.studentId);
    setErrors({});
  };

  // Delete student handler
  const handleDelete = (studentId) => {
    setStudents(students.filter(student => student.studentId !== studentId));
  };

  // Save data to text file
  const saveToTextFile = () => {
    if (students.length === 0) {
      alert('No student records to save!');
      return;
    }

    const jsonData = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_data.txt';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="container mt-3 mt-md-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Student Details Form</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Student ID Field */}
              <div className="col-md-6">
                <label htmlFor="studentId" className="form-label">
                  Student ID *
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g., abc123"
                />
                {errors.studentId && (
                  <div className="invalid-feedback">
                    {errors.studentId}
                  </div>
                )}
              </div>

              {/* First Name Field */}
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <div className="invalid-feedback">
                    {errors.firstName}
                  </div>
                )}
              </div>

              {/* Last Name Field */}
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name (optional)"
                />
              </div>

              {/* Student Email Field */}
              <div className="col-md-6">
                <label htmlFor="studentEmail" className="form-label">
                  Student Email *
                </label>
                <input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  className={`form-control ${errors.studentEmail ? 'is-invalid' : ''}`}
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email "
                />
                {errors.studentEmail && (
                  <div className="invalid-feedback">
                    {errors.studentEmail}
                  </div>
                )}
              </div>

              {/* Student Phone Field */}
              <div className="col-md-6">
                <label htmlFor="studentPhone" className="form-label">
                  Student Phone *
                </label>
                <input
                  id="studentPhone"
                  name="studentPhone"
                  type="text"
                  className={`form-control ${errors.studentPhone ? 'is-invalid' : ''}`}
                  value={formData.studentPhone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.studentPhone && (
                  <div className="invalid-feedback">
                    {errors.studentPhone}
                  </div>
                )}
              </div>

              {/* Gender Field */}
              <div className="col-md-6">
                <label htmlFor="gender" className="form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">
                    {errors.gender}
                  </div>
                )}
              </div>

              {/* Full Address Field */}
              <div className="col-12">
                <label htmlFor="fullAddress" className="form-label">
                  Address (House No, Street, Area) *
                </label>
                <textarea
                  id="fullAddress"
                  name="address.fullAddress"
                  className={`form-control ${errors['address.fullAddress'] ? 'is-invalid' : ''}`}
                  value={formData.address.fullAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 123/A, Main Street, Downtown Area"
                  rows="2"
                />
                {errors['address.fullAddress'] && (
                  <div className="invalid-feedback">
                    {errors['address.fullAddress']}
                  </div>
                )}
              </div>

              {/* City Field */}
              <div className="col-md-6">
                <label htmlFor="town" className="form-label">
                  City *
                </label>
                <input
                  id="town"
                  name="address.town"
                  type="text"
                  className={`form-control ${errors['address.town'] ? 'is-invalid' : ''}`}
                  value={formData.address.town}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                />
                {errors['address.town'] && (
                  <div className="invalid-feedback">
                    {errors['address.town']}
                  </div>
                )}
              </div>

              {/* Pincode Field */}
              <div className="col-md-6">
                <label htmlFor="pincode" className="form-label">
                  Pincode *
                </label>
                <input
                  id="pincode"
                  name="address.pincode"
                  type="text"
                  className={`form-control ${errors['address.pincode'] ? 'is-invalid' : ''}`}
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit pincode"
                />
                {errors['address.pincode'] && (
                  <div className="invalid-feedback">
                    {errors['address.pincode']}
                  </div>
                )}
              </div>
            </div>

            {/* Form Buttons */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <button type="submit" className="btn btn-primary me-md-2">
                {editMode ? 'Update Student' : 'Add Student'}
              </button>
              {students.length > 0 && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={saveToTextFile}
                >
                  Save Student Details
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Student Records Section */}
      <div className="card shadow mt-4">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Student Records</h2>
          
          {students.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3">
                <i className="bi bi-people-fill fs-1 text-muted"></i>
              </div>
              <h5 className="text-muted">No student records available</h5>
              <p className="text-muted">Add students using the form above</p>
            </div>
          ) : (
            <>
              {/* Desktop View  */}
              <div className="d-none d-md-block">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.studentId}>
                          <td>{student.studentId}</td>
                          <td>{student.firstName} {student.lastName}</td>
                          <td>{student.studentEmail}</td>
                          <td>{student.studentPhone}</td>
                          <td>{student.gender}</td>
                          <td>
                            {student.address.fullAddress}, {student.address.town}, {student.address.pincode}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleEdit(student)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(student.studentId)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile View  */}
              <div className="d-md-none">
                {students.map((student) => (
                  <div key={student.studentId} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">
                        {student.firstName} {student.lastName}
                        <span className="text-muted small ms-2">({student.studentId})</span>
                      </h5>
                      
                      <div className="mb-2">
                        <strong>Email:</strong> {student.studentEmail}
                      </div>
                      
                      <div className="mb-2">
                        <strong>Phone:</strong> {student.studentPhone}
                      </div>
                      
                      <div className="mb-2">
                        <strong>Gender:</strong> {student.gender}
                      </div>
                      
                      <div className="mb-3">
                        <strong>Address:</strong> {student.address.fullAddress}, {student.address.town}, {student.address.pincode}
                      </div>
                      
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(student.studentId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForm;