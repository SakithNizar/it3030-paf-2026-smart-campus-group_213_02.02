package com.group213.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // --- Team Member's Existing Handler ---
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    // --- NEW: Member 2 Conflict Handler ---
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        
        // If the error is your specific Member 2 Conflict Trap, return a 409 status
        if (ex.getMessage() != null && ex.getMessage().contains("Conflict")) {
            body.put("status", HttpStatus.CONFLICT.value());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        }
        
        // Otherwise, return a generic 400 Bad Request
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // --- Team Member's Existing Handler ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body("Something went wrong");
    }
}