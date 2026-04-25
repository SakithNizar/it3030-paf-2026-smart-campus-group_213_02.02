package com.group213.backend.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class IncidentTicketRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^07\\d{8}$", message = "Phone number must start with 07 and have exactly 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Priority is required")
    private String priority;

    private String uploadUrl;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static IncidentTicketRequest fromJson(String json) {
        try {
            return objectMapper.readValue(json, IncidentTicketRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON: " + e.getMessage(), e);
        }
    }
}
