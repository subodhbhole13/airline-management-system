package com.airline.airline_management.dto.response;

import com.airline.airline_management.entity.Booking;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private String bookingReference;

    // User info (just enough, not full object)
    private Long userId;
    private String userName;

    // Flight info (just enough)
    private Long flightId;
    private String flightNumber;
    private String origin;
    private String destination;
    private String departureDate;
    private String departureTime;

    private int seatsBooked;
    private double totalPrice;
    private String status;
    private LocalDateTime bookingTime;

    // 🔄 Entity → DTO
    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .flightId(booking.getFlight().getId())
                .flightNumber(booking.getFlight().getFlightNumber())
                .origin(booking.getFlight().getOrigin())
                .destination(booking.getFlight().getDestination())
                .departureDate(booking.getFlight().getDepartureDate().toString())
                .departureTime(booking.getFlight().getDepartureTime().toString())
                .seatsBooked(booking.getSeatsBooked())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .bookingTime(booking.getBookingTime())
                .build();
    }
}