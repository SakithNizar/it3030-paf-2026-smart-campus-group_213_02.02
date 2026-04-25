package com.group213.backend.service;

import com.group213.backend.dto.LoginRequest;
import com.group213.backend.dto.RegisterRequest;
import com.group213.backend.model.Role;
import com.group213.backend.model.User;
import com.group213.backend.repository.UserRepository;
import com.group213.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use.");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.USER);

        User saved = userRepository.save(user);
        return jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name(), saved.getName());
    }

    public String login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (user.getPassword() == null) {
            throw new RuntimeException("This account uses Google sign-in. Please use the Google login button.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getName());
    }
}
