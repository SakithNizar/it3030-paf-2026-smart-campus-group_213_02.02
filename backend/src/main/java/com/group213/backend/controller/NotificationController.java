package com.group213.backend.controller;

import com.group213.backend.model.Notification;
import com.group213.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // GET /api/notifications/me
    @GetMapping("/me")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }

    // GET /api/notifications/me/unread-count
    @GetMapping("/me/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    // PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // PATCH /api/notifications/me/read-all
    @PatchMapping("/me/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/notifications/me
    @Transactional
    @DeleteMapping("/me")
    public ResponseEntity<Void> clearAll(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        notificationService.clearAll(userId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/notifications/preferences
    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> getPreferences(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getPreferences(userId));
    }

    // PUT /api/notifications/preferences
    @PutMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> savePreferences(
            Authentication auth,
            @RequestBody Map<String, Boolean> updates) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.savePreferences(userId, updates));
    }
}
