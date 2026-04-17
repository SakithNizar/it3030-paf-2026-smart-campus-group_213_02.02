package com.group213.backend.repository;

import com.group213.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 1. The Conflict Checker Query
    // This finds any PENDING or APPROVED bookings on the same day, for the same resource, 
    // where the time ranges overlap.
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    // 2. Fetch all bookings for a specific user (User View)
    List<Booking> findByUserId(Long userId);
}