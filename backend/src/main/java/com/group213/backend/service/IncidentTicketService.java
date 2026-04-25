package com.group213.backend.service;

import com.group213.backend.model.IncidentTicket;
import com.group213.backend.model.User;
import com.group213.backend.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;
    
    private static final Pattern PHONE_PATTERN = Pattern.compile("^07\\d{8}$");

    public IncidentTicket createIncidentTicket(IncidentTicket ticket, User user) {
        if (!isValidPhoneNumber(ticket.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number must start with 07 and have exactly 10 digits");
        }
        
        ticket.setUser(user);
        ticket.setUserName(user.getName() != null ? user.getName() : "Unknown User");
        ticket.setUserEmail(user.getEmail());
        
        IncidentTicket savedTicket = incidentTicketRepository.save(ticket);
        
        try {
            notificationService.notifyAdminsAboutNewTicket(savedTicket);
            savedTicket.setIsNotified(true);
            incidentTicketRepository.save(savedTicket);
        } catch (Exception e) {
            log.error("Failed to send notification for ticket {}", savedTicket.getId(), e);
        }
        
        return savedTicket;
    }

    public Page<IncidentTicket> getUserTickets(User user, Pageable pageable) {
        return incidentTicketRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Page<IncidentTicket> getAllTickets(Pageable pageable) {
        return incidentTicketRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<IncidentTicket> getTicketsByStatus(IncidentTicket.IncidentStatus status) {
        return incidentTicketRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<IncidentTicket> getTicketsByPriority(IncidentTicket.IncidentPriority priority) {
        return incidentTicketRepository.findByPriorityOrderByCreatedAtDesc(priority);
    }

    public IncidentTicket respondToTicket(Long ticketId, String response, User admin) {
        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setAdminResponse(response);
        ticket.setRespondedBy(admin);
        ticket.setStatus(IncidentTicket.IncidentStatus.IN_PROGRESS);
        
        IncidentTicket updatedTicket = incidentTicketRepository.save(ticket);
        
        try {
            notificationService.notifyUserAboutResponse(updatedTicket);
        } catch (Exception e) {
            log.error("Failed to notify user about ticket response {}", ticketId, e);
        }
        
        return updatedTicket;
    }

    public IncidentTicket updateTicketStatus(Long ticketId, IncidentTicket.IncidentStatus status, User admin) {
        IncidentTicket ticket = incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        ticket.setRespondedBy(admin);
        
        if (status == IncidentTicket.IncidentStatus.RESOLVED || status == IncidentTicket.IncidentStatus.CLOSED) {
            try {
                notificationService.notifyUserAboutStatusUpdate(ticket);
            } catch (Exception e) {
                log.error("Failed to notify user about status update {}", ticketId, e);
            }
        }
        
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket getTicketById(Long ticketId) {
        return incidentTicketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<IncidentTicket> getUnnotifiedTickets() {
        return incidentTicketRepository.findUnnotifiedTickets();
    }

    public long getTicketCountByStatus(IncidentTicket.IncidentStatus status) {
        return incidentTicketRepository.countByStatus(status);
    }

    public long getTicketCountByPriority(IncidentTicket.IncidentPriority priority) {
        return incidentTicketRepository.countByPriority(priority);
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && PHONE_PATTERN.matcher(phoneNumber).matches();
    }
}
