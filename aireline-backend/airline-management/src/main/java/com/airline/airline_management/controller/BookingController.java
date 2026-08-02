package com.airline.airline_management.controller;

import com.airline.airline_management.dto.response.ApiResponse;
import com.airline.airline_management.dto.request.BookingRequest;
import com.airline.airline_management.dto.response.BookingResponse;
import com.airline.airline_management.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> bookTicket(
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.bookTicket(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket booked successfully", response));
    }

    // PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id) {

        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity
                .ok(ApiResponse.success("Booking cancelled successfully", response));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id) {

        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity
                .ok(ApiResponse.success("Booking fetched successfully", response));
    }

    // GET /api/bookings/reference/{ref}
    @GetMapping("/reference/{ref}")
    public ResponseEntity<ApiResponse<BookingResponse>> getByReference(
            @PathVariable String ref) {

        BookingResponse response = bookingService.getBookingByReference(ref);
        return ResponseEntity
                .ok(ApiResponse.success("Booking fetched successfully", response));
    }

    // GET /api/bookings/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByUser(
            @PathVariable Long userId) {

        List<BookingResponse> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity
                .ok(ApiResponse.success("User bookings fetched successfully", bookings));
    }

    // GET /api/bookings/flight/{flightId}
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByFlight(
            @PathVariable Long flightId) {

        List<BookingResponse> bookings = bookingService.getBookingsByFlight(flightId);
        return ResponseEntity
                .ok(ApiResponse.success("Flight bookings fetched successfully", bookings));
    }
}