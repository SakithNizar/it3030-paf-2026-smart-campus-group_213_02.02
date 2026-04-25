import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncidentTicketForm.css';

const IncidentTicketForm = ({ user, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    phoneNumber: '',
    priority: 'MEDIUM',
    uploadUrl: ''
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        // Name and email will be auto-filled from authenticated user
      }));
    }
  }, [user]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must start with 07 and have exactly 10 digits';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: 'File size must be less than 5MB'
        }));
        return;
      }
      setFile(selectedFile);
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      const ticketData = {
        title: formData.title,
        message: formData.message,
        phoneNumber: formData.phoneNumber,
        priority: formData.priority,
        uploadUrl: formData.uploadUrl
      };
      
      formDataToSend.append('ticket', JSON.stringify(ticketData));
      
      if (file) {
        formDataToSend.append('file', file);
      }
      
      const response = await axios.post(
        'http://localhost:8080/api/incident-tickets/with-file',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSubmitSuccess(true);
      setFormData({
        title: '',
        message: '',
        phoneNumber: '',
        priority: 'MEDIUM',
        uploadUrl: ''
      });
      setFile(null);
      
      if (onTicketCreated) {
        onTicketCreated(response.data);
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to create incident ticket'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="incident-ticket-form">
      <div className="form-header">
        <h2>Create Incident Ticket</h2>
        <p>Report an issue or request assistance</p>
      </div>

      {user && (
        <div className="user-info">
          <div className="info-row">
            <label>Name:</label>
            <span>{user.name || 'Unknown User'}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="alert alert-success">
          Incident ticket created successfully!
        </div>
      )}

      {errors.submit && (
        <div className="alert alert-error">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="title">Incident Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? 'error' : ''}
            placeholder="Brief description of the incident"
            maxLength="200"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Detailed Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={errors.message ? 'error' : ''}
            placeholder="Provide detailed information about the incident"
            rows="5"
            maxLength="2000"
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
          <small>{formData.message.length}/2000 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={errors.phoneNumber ? 'error' : ''}
            placeholder="07xxxxxxxx (10 digits, starts with 07)"
            maxLength="10"
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Incident Priority *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className={errors.priority ? 'error' : ''}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {errors.priority && <span className="error-message">{errors.priority}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="uploadUrl">Upload URL (Optional)</label>
          <input
            type="url"
            id="uploadUrl"
            name="uploadUrl"
            value={formData.uploadUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/relevant-link"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Attach File (Optional)</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className={errors.file ? 'error' : ''}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
          {errors.file && <span className="error-message">{errors.file}</span>}
          <small>Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 5MB)</small>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Ticket...' : 'Create Incident Ticket'}
        </button>
      </form>
    </div>
  );
};

export default IncidentTicketForm;
