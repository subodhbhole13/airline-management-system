package com.airline.airline_management.service.impl;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.airline.airline_management.dto.request.UserLoginRequest;
import com.airline.airline_management.dto.request.UserRegistrationRequest;
import com.airline.airline_management.dto.response.UserResponse;
import com.airline.airline_management.entity.User;
import com.airline.airline_management.exception.BadRequestException;
import com.airline.airline_management.exception.ResourceNotFoundException;
import com.airline.airline_management.repository.UserRepository;
import com.airline.airline_management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse register(UserRegistrationRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Email already registered: " + request.getEmail()
            );
        }

        //  Hash password using BCrypt (no Spring Security needed)
        String hashedPassword = BCrypt.withDefaults()
                .hashToString(12, request.getPassword().toCharArray());

        //  Build user with hashed password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(hashedPassword) // ✅ Stored as hash
                .role(User.Role.CUSTOMER)
                .build();

        //  Save to DB
        User savedUser = userRepository.save(user);

        //  Return response
        return UserResponse.fromEntity(savedUser);
    }

    @Override
    public UserResponse login(UserLoginRequest request) {

        //  Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with email: " + request.getEmail()
                ));

        // Verify password using BCrypt (no Spring Security needed)
        BCrypt.Result result = BCrypt.verifyer()
                .verify(request.getPassword().toCharArray(), user.getPassword());

        if (!result.verified) {
            throw new BadRequestException("Invalid password");
        }

        //  Return response
        return UserResponse.fromEntity(user);
    }

    @Override
    public UserResponse getUserById(Long id) {

        // Find user or throw
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + id
                ));

        //  Return response
        return UserResponse.fromEntity(user);
    }
}