package com.group213.backend.service;

import com.group213.backend.model.Booking;
import com.group213.backend.model.BookingStatus;
import com.group213.backend.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking testBooking;

    @BeforeEach
    void setUp() {
        // Create a dummy booking to use in our tests
        testBooking = new Booking();
        testBooking.setResourceId(1L);
        testBooking.setBookingDate(LocalDate.of(2026, 4, 18));
        testBooking.setStartTime(LocalTime.of(10, 0));
        testBooking.setEndTime(LocalTime.of(11, 0));
    }

    @Test
    void createBooking_Success_WhenNoConflicts() {
        // Arrange: Tell the mock database to return an empty list (no conflicts)
        when(bookingRepository.findConflictingBookings(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act: Try to create the booking
        Booking savedBooking = bookingService.createBooking(testBooking);

        // Assert: Verify it succeeded and was marked as PENDING
        assertNotNull(savedBooking);
        assertEquals(BookingStatus.PENDING, testBooking.getStatus());
        verify(bookingRepository, times(1)).save(testBooking);
    }

    @Test
    void createBooking_ThrowsException_WhenConflictExists() {
        // Arrange: Tell the mock database to pretend a booking already exists (conflict!)
        Booking existingBooking = new Booking();
        when(bookingRepository.findConflictingBookings(any(), any(), any(), any()))
                .thenReturn(List.of(existingBooking));

        // Act & Assert: Expect a RuntimeException with the exact error message
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bookingService.createBooking(testBooking);
        });

        assertEquals("Conflict: This resource is already booked for the selected time.", exception.getMessage());
        
        // Verify that the repository NEVER tried to save this invalid booking
        verify(bookingRepository, never()).save(any(Booking.class));
    }
}