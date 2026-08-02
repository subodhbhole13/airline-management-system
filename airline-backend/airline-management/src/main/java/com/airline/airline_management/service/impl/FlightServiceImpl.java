package com.airline.airline_management.service.impl;

import com.airline.airline_management.dto.request.FlightRequest;
import com.airline.airline_management.dto.response.FlightResponse;
import com.airline.airline_management.entity.Flight;
import com.airline.airline_management.exception.BadRequestException;
import com.airline.airline_management.exception.ResourceNotFoundException;
import com.airline.airline_management.repository.FlightRepository;
import com.airline.airline_management.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Override
    public FlightResponse addFlight(FlightRequest request) {

        //  Check duplicate flight number
        if (flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new BadRequestException(
                    "Flight number already exists: " + request.getFlightNumber()
            );
        }

        // Validate origin != destination
        if (request.getOrigin().equalsIgnoreCase(request.getDestination())) {
            throw new BadRequestException(
                    "Origin and destination cannot be the same"
            );
        }

        //  Validate arrival is after departure
        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new BadRequestException(
                    "Arrival time must be after departure time"
            );
        }

        //  Build entity
        // availableSeats = totalSeats on creation
        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber())
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .departureDate(request.getDepartureDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats()) // ← Key business logic
                .price(request.getPrice())
                .status(Flight.FlightStatus.SCHEDULED)
                .build();

        Flight saved = flightRepository.save(flight);
        return FlightResponse.fromEntity(saved);
    }

    @Override
    public FlightResponse getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flight not found with id: " + id
                ));
        return FlightResponse.fromEntity(flight);
    }

    @Override
    public List<FlightResponse> getAllFlights() {
        return flightRepository.findAll()
                .stream()
                .map(FlightResponse::fromEntity)  // method reference
                .collect(Collectors.toList());
    }

    @Override
    public FlightResponse updateFlight(Long id, FlightRequest request) {

        //  Find existing flight
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flight not found with id: " + id
                ));

        // If flight number changed, check no duplicate
        if (!flight.getFlightNumber().equals(request.getFlightNumber()) &&
                flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new BadRequestException(
                    "Flight number already exists: " + request.getFlightNumber()
            );
        }

        //  Recalculate availableSeats if totalSeats changed
        // Example: was 180 seats, 20 booked → availableSeats was 160
        // Now admin changes to 200 seats → availableSeats should be 200 - 20 = 180
        int seatsBooked = flight.getTotalSeats() - flight.getAvailableSeats();
        int newAvailableSeats = request.getTotalSeats() - seatsBooked;

        if (newAvailableSeats < 0) {
            throw new BadRequestException(
                    "New total seats cannot be less than already booked seats: " + seatsBooked
            );
        }

        // Update fields
        flight.setFlightNumber(request.getFlightNumber());
        flight.setOrigin(request.getOrigin());
        flight.setDestination(request.getDestination());
        flight.setDepartureDate(request.getDepartureDate());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setTotalSeats(request.getTotalSeats());
        flight.setAvailableSeats(newAvailableSeats);
        flight.setPrice(request.getPrice());

        Flight updated = flightRepository.save(flight);
        return FlightResponse.fromEntity(updated);
    }

    @Override
    public void deleteFlight(Long id) {
        // Check it exists first
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flight not found with id: " + id
                ));
        flightRepository.delete(flight);
    }

    @Override
    public List<FlightResponse> searchFlights(
            String origin, String destination, LocalDate date) {

        List<Flight> flights = flightRepository
                .findByOriginAndDestinationAndDepartureDate(origin, destination, date);

        if (flights.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No flights found from " + origin + " to " + destination + " on " + date
            );
        }

        return flights.stream()
                .map(FlightResponse::fromEntity)
                .collect(Collectors.toList());
    }
}