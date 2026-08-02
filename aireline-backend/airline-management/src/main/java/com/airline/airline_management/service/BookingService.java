package com.airline.airline_management.service;


import com.airline.airline_management.dto.request.BookingRequest;
import com.airline.airline_management.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse bookTicket(BookingRequest request);

    BookingResponse cancelBooking(Long bookingId);

    BookingResponse getBookingById(Long bookingId);

    BookingResponse getBookingByReference(String reference);

    List<BookingResponse> getBookingsByUser(Long userId);

    List<BookingResponse> getBookingsByFlight(Long flightId);
}