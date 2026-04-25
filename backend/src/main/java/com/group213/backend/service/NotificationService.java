package com.group213.backend.service;

import com.group213.backend.model.Notification;
import com.group213.backend.model.NotificationPreference;
import com.group213.backend.model.Role;
import com.group213.backend.repository.NotificationPreferenceRepository;
import com.group213.backend.repository.NotificationRepository;
import com.group213.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final List<String> CATEGORIES = Arrays.asList("BOOKING", "INCIDENT", "SYSTEM", "EMAIL_NOTIFICATIONS");

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void create(Long userId, String message, String type) {
        boolean enabled = preferenceRepository.findByUserIdAndCategory(userId, type)
                .map(NotificationPreference::isEnabled)
                .orElse(true);
        if (!enabled) return;

        Notification n = new Notification();
        n.setUserId(userId);
        n.setMessage(message);
        n.setType(type);
        notificationRepository.save(n);

        // Only email non-admin users, and only if they have email notifications enabled
        userRepository.findById(userId).ifPresent(user -> {
            if (user.getRole() == Role.ADMIN) return;
            boolean emailEnabled = preferenceRepository.findByUserIdAndCategory(userId, "EMAIL_NOTIFICATIONS")
                    .map(NotificationPreference::isEnabled)
                    .orElse(true);
            if (!emailEnabled) return;
            String subject = emailSubject(type, message);
            String html = emailService.buildHtml(subject, message);
            emailService.send(user.getEmail(), subject, html);
        });
    }

    private String emailSubject(String type, String message) {
        if (type.equals("BOOKING")) {
            if (message.toLowerCase().contains("approved")) return "Booking Approved — Smart Campus";
            if (message.toLowerCase().contains("rejected")) return "Booking Update — Smart Campus";
            if (message.toLowerCase().contains("cancelled")) return "Booking Cancelled — Smart Campus";
            if (message.toLowerCase().contains("new booking")) return "New Booking Request — Smart Campus";
        }
        if (type.equals("INCIDENT")) return "Incident Update — Smart Campus";
        return "Notification — Smart Campus";
    }

    public Map<String, Boolean> getPreferences(Long userId) {
        List<NotificationPreference> saved = preferenceRepository.findByUserId(userId);
        Map<String, Boolean> prefs = saved.stream()
                .collect(Collectors.toMap(NotificationPreference::getCategory, NotificationPreference::isEnabled));
        CATEGORIES.forEach(cat -> prefs.putIfAbsent(cat, true));
        return prefs;
    }

    public Map<String, Boolean> savePreferences(Long userId, Map<String, Boolean> updates) {
        updates.forEach((category, enabled) -> {
            if (!CATEGORIES.contains(category)) return;
            NotificationPreference pref = preferenceRepository
                    .findByUserIdAndCategory(userId, category)
                    .orElseGet(() -> {
                        NotificationPreference p = new NotificationPreference();
                        p.setUserId(userId);
                        p.setCategory(category);
                        return p;
                    });
            pref.setEnabled(enabled);
            preferenceRepository.save(pref);
        });
        return getPreferences(userId);
    }

    public List<Notification> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void clearAll(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }
}
