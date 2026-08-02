package com.airline.airline_management.controller;

import com.airline.airline_management.dto.response.ApiResponse;
import com.airline.airline_management.dto.request.FlightRequest;
import com.airline.airline_management.dto.response.FlightResponse;
import com.airline.airline_management.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    // POST /api/flights
    @PostMapping
    public ResponseEntity<ApiResponse<FlightResponse>> addFlight(
            @Valid @RequestBody FlightRequest request) {

        FlightResponse response = flightService.addFlight(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flight added successfully", response));
    }

    // GET /api/flights
    @GetMapping
    public ResponseEntity<ApiResponse<List<FlightResponse>>> getAllFlights() {

        List<FlightResponse> flights = flightService.getAllFlights();
        return ResponseEntity
                .ok(ApiResponse.success("Flights fetched successfully", flights));
    }

    // GET /api/flights/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlightResponse>> getFlightById(
            @PathVariable Long id) {

        FlightResponse response = flightService.getFlightById(id);
        return ResponseEntity
                .ok(ApiResponse.success("Flight fetched successfully", response));
    }

    // PUT /api/flights/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FlightResponse>> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody FlightRequest request) {

        FlightResponse response = flightService.updateFlight(id, request);
        return ResponseEntity
                .ok(ApiResponse.success("Flight updated successfully", response));
    }

    // DELETE /api/flights/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlight(@PathVariable Long id) {

        flightService.deleteFlight(id);
        return ResponseEntity
                .ok(ApiResponse.success("Flight deleted successfully", null));
    }

    // GET /api/flights/search?origin=Mumbai&destination=Delhi&date=2025-06-15
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlightResponse>>> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        //                ↑ Tells Spring how to parse "2025-06-15" into LocalDate

        List<FlightResponse> flights = flightService.searchFlights(origin, destination, date);
        return ResponseEntity
                .ok(ApiResponse.success("Flights found", flights));
    }
}