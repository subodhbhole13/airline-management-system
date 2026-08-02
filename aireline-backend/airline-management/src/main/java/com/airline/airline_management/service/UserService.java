package com.airline.airline_management.service;
import com.airline.airline_management.dto.request.UserLoginRequest;
import com.airline.airline_management.dto.request.UserRegistrationRequest;
import com.airline.airline_management.dto.response.UserResponse;

public interface UserService {
    UserResponse register(UserRegistrationRequest request);
    UserResponse login(UserLoginRequest request);
    UserResponse getUserById(Long id);
}