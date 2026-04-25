package com.group213.backend.service;

import com.group213.backend.model.Booking;
import com.group213.backend.model.BookingStatus;
import com.group213.backend.repository.BookingRepository;
import com.group213.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    // 1. POST Logic: Check for conflicts before saving
    public Booking createBooking(Booking booking) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflict: This resource is already booked for the selected time.");
        }

        booking.setStatus(BookingStatus.PENDING); // Always start as PENDING
        return bookingRepository.save(booking);
    }

    // 2a. GET Logic: Fetch all bookings (admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 2b. GET Logic: Fetch bookings for a specific user
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // 3. PUT/PATCH Logic: Admin updating workflow status
    public Booking updateStatus(Long id, BookingStatus newStatus, String adminReason) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        existingBooking.setStatus(newStatus);

        if (newStatus == BookingStatus.REJECTED && adminReason != null) {
            existingBooking.setAdminReason(adminReason);
        }

        Booking saved = bookingRepository.save(existingBooking);

        String message = "Your booking has been " + newStatus.name().toLowerCase() + ".";
        if (newStatus == BookingStatus.REJECTED && adminReason != null) {
            message += " Reason: " + adminReason;
        }
        notificationService.create(saved.getUserId(), message, "BOOKING");

        return saved;
    }

    // 4. DELETE Logic: Cancel/remove a booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // 5. PATCH Logic: QR Code Check-in
    public Booking checkInBooking(Long id) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Security Trap: You can't check in if the booking isn't approved!
        if (existingBooking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Conflict: Only approved bookings can be checked in.");
        }

        existingBooking.setStatus(BookingStatus.CHECKED_IN);
        
        // Optional: Send a notification that they successfully checked in
        notificationService.create(existingBooking.getUserId(), "You have successfully checked in to your resource.", "CHECK_IN");

        return bookingRepository.save(existingBooking);
    }
}