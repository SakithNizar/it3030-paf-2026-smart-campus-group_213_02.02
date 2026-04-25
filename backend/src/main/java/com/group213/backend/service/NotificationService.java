package com.group213.backend.service;

import com.group213.backend.model.IncidentTicket;
import com.group213.backend.model.Notification;
import com.group213.backend.model.Role;
import com.group213.backend.model.User;
import com.group213.backend.repository.NotificationRepository;
import com.group213.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void create(Long userId, String message, String type) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setMessage(message);
        n.setType(type);
        notificationRepository.save(n);
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

    public void notifyAdminsAboutNewTicket(IncidentTicket ticket) {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        String message = String.format("New incident ticket #%d: %s from %s (%s)", 
            ticket.getId(), ticket.getTitle(), ticket.getUserName(), ticket.getUserEmail());
        
        for (User admin : admins) {
            create(admin.getId(), message, "INCIDENT_NEW");
        }
    }

    public void notifyUserAboutResponse(IncidentTicket ticket) {
        String message = String.format("Your incident ticket #%d (%s) has received a response from admin", 
            ticket.getId(), ticket.getTitle());
        create(ticket.getUser().getId(), message, "INCIDENT_RESPONSE");
    }

    public void notifyUserAboutStatusUpdate(IncidentTicket ticket) {
        String message = String.format("Your incident ticket #%d (%s) status has been updated to: %s", 
            ticket.getId(), ticket.getTitle(), ticket.getStatus());
        create(ticket.getUser().getId(), message, "INCIDENT_STATUS");
    }
}
