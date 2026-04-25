package com.group213.backend.service;

import com.group213.backend.model.Booking;
import com.group213.backend.model.BookingStatus;
import com.group213.backend.model.Role;
import com.group213.backend.repository.BookingRepository;
import com.group213.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

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

        booking.setStatus(BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);

        // Notify all admins (in-app only — email skipped for ADMIN role)
        String adminMsg = "New booking request for Resource #" + saved.getResourceId() + " on " + saved.getBookingDate();
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .forEach(admin -> notificationService.create(admin.getId(), adminMsg, "BOOKING"));

        // Confirm to the user who made the booking (triggers email to them)
        String userMsg = "Your booking request for Resource #" + saved.getResourceId()
                + " on " + saved.getBookingDate() + " has been submitted and is pending approval.";
        notificationService.create(saved.getUserId(), userMsg, "BOOKING");

        return saved;
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
        bookingRepository.findById(id).ifPresent(booking -> {
            String msg = "Booking #" + id + " for Resource #" + booking.getResourceId()
                    + " on " + booking.getBookingDate() + " has been cancelled.";
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN)
                    .forEach(admin -> notificationService.create(admin.getId(), msg, "BOOKING"));
        });
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