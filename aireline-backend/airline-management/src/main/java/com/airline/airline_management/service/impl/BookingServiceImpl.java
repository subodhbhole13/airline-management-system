package com.airline.airline_management.service.impl;

import com.airline.airline_management.dto.request.BookingRequest;
import com.airline.airline_management.dto.response.BookingResponse;
import com.airline.airline_management.entity.Booking;
import com.airline.airline_management.entity.Flight;
import com.airline.airline_management.entity.User;
import com.airline.airline_management.exception.BadRequestException;
import com.airline.airline_management.exception.ResourceNotFoundException;
import com.airline.airline_management.repository.BookingRepository;
import com.airline.airline_management.repository.FlightRepository;
import com.airline.airline_management.repository.UserRepository;
import com.airline.airline_management.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;

    @Override
    @Transactional
    public BookingResponse bookTicket(BookingRequest request) {

        // Validate User exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getUserId()
                ));

        //  Validate Flight exists
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flight not found with id: " + request.getFlightId()
                ));

        //  Check user doesn't already have an active booking for this flight
        boolean alreadyBooked = bookingRepository.existsByUserIdAndFlightIdAndStatus(
                request.getUserId(),
                request.getFlightId(),
                Booking.BookingStatus.CONFIRMED
        );
        if (alreadyBooked) {
            throw new BadRequestException(
                    "You already have an active booking for this flight!"
            );
        }

        //  Check flight is SCHEDULED
        if (flight.getStatus() != Flight.FlightStatus.SCHEDULED) {
            throw new BadRequestException(
                    "Cannot book. Flight status is: " + flight.getStatus()
            );
        }

        //  Check seat availability
        if (flight.getAvailableSeats() < request.getSeatsBooked()) {
            throw new BadRequestException(
                    "Not enough seats. Requested: " + request.getSeatsBooked()
                            + ", Available: " + flight.getAvailableSeats()
            );
        }

        //  Calculate total price
        double totalPrice = flight.getPrice() * request.getSeatsBooked();

        //  Generate unique booking reference e.g. "BK-A1B2C3D4"
         String bookingReference = "BK-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();

        //  Build and save booking
        Booking booking = Booking.builder()
                .user(user)
                .flight(flight)
                .bookingReference(bookingReference)
                .seatsBooked(request.getSeatsBooked())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.CONFIRMED)
                .bookingTime(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        //  Reduce available seats on the flight
        flight.setAvailableSeats(flight.getAvailableSeats() - request.getSeatsBooked());
        flightRepository.save(flight);

        return BookingResponse.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {

        //  Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId
                ));

        //  Check if already canceled
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException(
                    "Booking is already cancelled: " + booking.getBookingReference()
            );
        }

        //  Cancel the booking
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        //  Restore seats back to the flight
        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getSeatsBooked());
        flightRepository.save(flight);

        return BookingResponse.fromEntity(booking);
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId
                ));
        return BookingResponse.fromEntity(booking);
    }

    @Override
    public BookingResponse getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with reference: " + reference
                ));
        return BookingResponse.fromEntity(booking);
    }

    @Override
    public List<BookingResponse> getBookingsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not found with id: " + userId
            );
        }
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByFlight(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            throw new ResourceNotFoundException(
                    "Flight not found with id: " + flightId
            );
        }
        return bookingRepository.findByFlightId(flightId)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
}