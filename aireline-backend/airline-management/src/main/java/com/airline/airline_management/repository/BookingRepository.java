package com.airline.airline_management.repository;


import com.airline.airline_management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings of a specific user
    List<Booking> findByUserId(Long userId);

    // Get all bookings for a specific flight
    List<Booking> findByFlightId(Long flightId);

    // Find booking by its reference code
    Optional<Booking> findByBookingReference(String bookingReference);

    boolean existsByUserIdAndFlightIdAndStatus(
            Long userId, Long flightId, Booking.BookingStatus status
    );
}