import React, { useState, useEffect } from 'react';

export default function BookingManager() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Hardcoded for testing. In a real app, you'd get this from your OAuth login!
    const testUserId = 1; 

    const [formData, setFormData] = useState({
        resourceId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });

    // Fetch user bookings on load
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/user/${testUserId}`);
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

        const payload = {
            ...formData,
            userId: testUserId
        };

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 409) {
                setError("Conflict: This resource is already booked for the selected time.");
                return;
            }

            if (response.ok) {
                setSuccess("Booking requested successfully!");
                fetchBookings(); // Refresh the list
                setFormData({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' }); // Reset form
            } else {
                setError("An error occurred while booking.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Smart Campus - Booking Manager</h2>

            {/* Notifications */}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

            {/* Booking Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                <input type="number" name="resourceId" placeholder="Resource ID (e.g., 1)" value={formData.resourceId} onChange={handleInputChange} required />
                <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} required />
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
                <input type="text" name="purpose" placeholder="Purpose of booking" value={formData.purpose} onChange={handleInputChange} required />
                <input type="number" name="expectedAttendees" placeholder="Expected Attendees" value={formData.expectedAttendees} onChange={handleInputChange} required />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Request Booking
                </button>
            </form>

            {/* Bookings List */}
            <h3>Your Recent Bookings</h3>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {bookings.map((b) => (
                        <li key={b.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                            <strong>Resource {b.resourceId}</strong> on {b.bookingDate} ({b.startTime} - {b.endTime}) <br/>
                            Status: <span style={{ fontWeight: 'bold', color: b.status === 'PENDING' ? 'orange' : 'black' }}>{b.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}