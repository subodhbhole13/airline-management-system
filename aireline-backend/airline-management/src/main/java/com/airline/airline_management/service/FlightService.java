package com.airline.airline_management.service;


import com.airline.airline_management.dto.request.FlightRequest;
import com.airline.airline_management.dto.response.FlightResponse;

import java.time.LocalDate;
import java.util.List;

public interface FlightService {

    FlightResponse addFlight(FlightRequest request);

    FlightResponse getFlightById(Long id);

    List<FlightResponse> getAllFlights();

    FlightResponse updateFlight(Long id, FlightRequest request);

    void deleteFlight(Long id);

    List<FlightResponse> searchFlights(String origin, String destination, LocalDate date);
}
