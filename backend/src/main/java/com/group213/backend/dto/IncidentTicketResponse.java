package com.group213.backend.dto;

import com.group213.backend.model.IncidentTicket;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentTicketResponse {
    private Long id;
    private String userName;
    private String userEmail;
    private String phoneNumber;
    private String priority;
    private String title;
    private String message;
    private String uploadUrl;
    private String attachmentPath;
    private String status;
    private String adminResponse;
    private String respondedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static IncidentTicketResponse fromEntity(IncidentTicket ticket) {
        IncidentTicketResponse response = new IncidentTicketResponse();
        response.setId(ticket.getId());
        response.setUserName(ticket.getUserName());
        response.setUserEmail(ticket.getUserEmail());
        response.setPhoneNumber(ticket.getPhoneNumber());
        response.setPriority(ticket.getPriority().toString());
        response.setTitle(ticket.getTitle());
        response.setMessage(ticket.getMessage());
        response.setUploadUrl(ticket.getUploadUrl());
        response.setAttachmentPath(ticket.getAttachmentPath());
        response.setStatus(ticket.getStatus().toString());
        response.setAdminResponse(ticket.getAdminResponse());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        
        if (ticket.getRespondedBy() != null) {
            response.setRespondedBy(ticket.getRespondedBy().getName());
        }
        
        return response;
    }
}
