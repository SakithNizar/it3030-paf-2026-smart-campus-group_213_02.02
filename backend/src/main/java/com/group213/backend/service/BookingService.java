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

    // 2. GET Logic: Fetch bookings for a specific user
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
}