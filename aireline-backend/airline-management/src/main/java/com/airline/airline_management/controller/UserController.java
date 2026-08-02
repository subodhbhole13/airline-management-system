package com.airline.airline_management.controller;
import com.airline.airline_management.dto.request.UserLoginRequest;
import com.airline.airline_management.dto.request.UserRegistrationRequest;
import com.airline.airline_management.dto.response.ApiResponse;
import com.airline.airline_management.dto.response.UserResponse;
import com.airline.airline_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody UserLoginRequest request) {
        UserResponse response = userService.login(request);
        return ResponseEntity
                .ok(ApiResponse.success("Login successful", response));
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity
                .ok(ApiResponse.success("User fetched successfully", response));
    }
}