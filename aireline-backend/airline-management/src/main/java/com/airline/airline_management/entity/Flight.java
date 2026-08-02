package com.airline.airline_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "flights")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String flightNumber;

    @NotBlank
    @Column(nullable = false)
    private String origin;

    @NotBlank
    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate departureDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Min(1)
    @Column(nullable = false)
    private int totalSeats;


    @Column(nullable = false)
    private int availableSeats;

    @Column(nullable = false)
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightStatus status =FlightStatus.SCHEDULED;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
    public enum FlightStatus{
        SCHEDULED ,DELAYED,CANCELLED, COMPLETED
    }


}
