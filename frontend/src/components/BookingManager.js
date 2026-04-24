import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BookingManager() {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        resourceId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/user/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // --- NEW: Time-Travel Validation ---
        const selectedDate = new Date(formData.bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset today's time to midnight for accurate date comparison

        if (selectedDate < today) {
            setError("You cannot book a resource in the past.");
            setIsLoading(false);
            return;
        }

        if (formData.endTime <= formData.startTime) {
            setError("End time must be strictly after the start time.");
            setIsLoading(false);
            return;
        }
        // ------------------------------------

        const payload = {
            ...formData,
            userId: user.userId
        };

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 409) {
                setError("Conflict: This resource is already booked for the selected time.");
                return;
            }

            if (response.ok) {
                setSuccess("Booking requested successfully!");
                fetchBookings(); 
                setFormData({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
            } else {
                setError("An error occurred while booking.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Shared input style for consistency
    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '15px',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#f8f9fa'
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: "'Inter', '-apple-system', sans-serif", color: '#333' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>Booking Manager</h2>
                <p style={{ color: '#6c757d', margin: 0, fontSize: '16px' }}>Reserve campus resources and manage your schedule</p>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '40px' }}>
                
                {/* Notifications */}
                {error && <div style={{ backgroundColor: '#fff1f0', color: '#d93025', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #d93025' }}>{error}</div>}
                {success && <div style={{ backgroundColor: '#e6f4ea', color: '#1e8e3e', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #1e8e3e' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Grid Layout for Date & Resource */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>Resource ID</label>
                            <input type="number" name="resourceId" placeholder="e.g., 1" value={formData.resourceId} onChange={handleInputChange} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>Date</label>
                            <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} required style={inputStyle} />
                        </div>
                    </div>

                    {/* Grid Layout for Times */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>Start Time</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>End Time</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>Purpose</label>
                        <input type="text" name="purpose" placeholder="e.g., Group Project Meeting" value={formData.purpose} onChange={handleInputChange} required style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>Expected Attendees</label>
                        <input type="number" name="expectedAttendees" placeholder="How many people?" value={formData.expectedAttendees} onChange={handleInputChange} required style={inputStyle} />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            marginTop: '10px',
                            padding: '14px', 
                            backgroundColor: isLoading ? '#a0cfff' : '#0061f2', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(0, 97, 242, 0.2)'
                        }}
                    >
                        {isLoading ? 'Processing...' : 'Request Booking'}
                    </button>
                </form>
            </div>

            {/* Bookings List */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 20px 0', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Your Recent Bookings</h3>
                
                {bookings.length === 0 ? (
                    <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>No bookings found. Create one above!</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {bookings.map((b) => (
                            <li key={b.id} style={{ border: '1px solid #f0f0f0', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>Resource {b.resourceId}</div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>{b.bookingDate} • {b.startTime} - {b.endTime}</div>
                                </div>
                                
                                {/* Status Badge */}
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    backgroundColor: b.status === 'PENDING' ? '#fff3cd' : '#e6f4ea',
                                    color: b.status === 'PENDING' ? '#856404' : '#1e8e3e'
                                }}>
                                    {b.status}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}