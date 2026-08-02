package com.airline.airline_management.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = " Email is required ")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}