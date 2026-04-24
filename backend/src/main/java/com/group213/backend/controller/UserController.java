package com.group213.backend.controller;

import com.group213.backend.model.Role;
import com.group213.backend.model.User;
import com.group213.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/users/me — any authenticated user
    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userService.getById(userId));
    }

    // GET /api/users — admin only (enforced in SecurityConfig)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // PATCH /api/users/{id}/role — admin only
    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role").toUpperCase());
        return ResponseEntity.ok(userService.updateRole(id, role));
    }
}
