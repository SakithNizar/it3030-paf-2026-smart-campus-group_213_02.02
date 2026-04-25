package com.group213.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_preferences",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category"}))
@Data
@NoArgsConstructor
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String category; // BOOKING, INCIDENT, SYSTEM

    @Column(nullable = false)
    private boolean enabled = true;
}
