package com.group213.backend.controller;

import com.group213.backend.model.Booking;
import com.group213.backend.model.BookingStatus;
import com.group213.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Allows your React frontend to connect
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. POST: Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking savedBooking = bookingService.createBooking(booking);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Return a 409 Conflict status if the time is taken
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); 
        }
    }

    // 2. GET: Retrieve user bookings
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // 3. PATCH: Update booking status (Approved/Rejected/Cancelled)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        
        BookingStatus status = BookingStatus.valueOf(updates.get("status").toUpperCase());
        String reason = updates.get("adminReason"); // Can be null
        
        Booking updatedBooking = bookingService.updateStatus(id, status, reason);
        return ResponseEntity.ok(updatedBooking);
    }

    // 4. DELETE: Remove a booking entirely
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}