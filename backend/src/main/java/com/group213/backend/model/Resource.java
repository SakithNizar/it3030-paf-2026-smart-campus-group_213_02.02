package com.group213.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Enumerated(EnumType.STRING)
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    private String location;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    private String availableFrom;
    private String availableTo;
}
