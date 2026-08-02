package com.airline.airline_management.repository;

import com.airline.airline_management.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // For flight search API
    List<Flight> findByOriginAndDestinationAndDepartureDate(
            String origin, String destination, LocalDate departureDate
    );

    // To prevent duplicate flight numbers
    Optional<Flight> findByFlightNumber(String flightNumber);
    boolean existsByFlightNumber(String flightNumber);
}