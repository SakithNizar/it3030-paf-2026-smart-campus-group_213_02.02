package com.group213.backend.controller;

import com.group213.backend.dto.IncidentTicketRequest;
import com.group213.backend.dto.IncidentTicketResponse;
import com.group213.backend.model.IncidentTicket;
import com.group213.backend.model.User;
import com.group213.backend.service.IncidentTicketService;
import com.group213.backend.service.FileUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incident-tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class IncidentTicketController {

    private final IncidentTicketService incidentTicketService;
    private final FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<IncidentTicketResponse> createTicket(
            @Valid @RequestBody IncidentTicketRequest request,
            @AuthenticationPrincipal User user) {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setMessage(request.getMessage());
        ticket.setPhoneNumber(request.getPhoneNumber());
        ticket.setPriority(IncidentTicket.IncidentPriority.valueOf(request.getPriority()));
        ticket.setUploadUrl(request.getUploadUrl());

        IncidentTicket savedTicket = incidentTicketService.createIncidentTicket(ticket, user);
        return ResponseEntity.ok(IncidentTicketResponse.fromEntity(savedTicket));
    }

    @PostMapping("/with-file")
    public ResponseEntity<IncidentTicketResponse> createTicketWithFile(
            @RequestPart("ticket") String ticketJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal User user) {
        
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        IncidentTicketRequest request = IncidentTicketRequest.fromJson(ticketJson);
        
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setMessage(request.getMessage());
        ticket.setPhoneNumber(request.getPhoneNumber());
        ticket.setPriority(IncidentTicket.IncidentPriority.valueOf(request.getPriority()));
        ticket.setUploadUrl(request.getUploadUrl());

        if (file != null && !file.isEmpty()) {
            String filePath = fileUploadService.uploadFile(file, "incident-attachments");
            ticket.setAttachmentPath(filePath);
        }

        try {
            IncidentTicket savedTicket = incidentTicketService.createIncidentTicket(ticket, user);
            return ResponseEntity.ok(IncidentTicketResponse.fromEntity(savedTicket));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<Page<IncidentTicketResponse>> getMyTickets(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IncidentTicket> tickets = incidentTicketService.getUserTickets(user, pageable);
        Page<IncidentTicketResponse> response = tickets.map(IncidentTicketResponse::fromEntity);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<IncidentTicketResponse>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IncidentTicket> tickets = incidentTicketService.getAllTickets(pageable);
        Page<IncidentTicketResponse> response = tickets.map(IncidentTicketResponse::fromEntity);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicketResponse> getTicket(@PathVariable Long id) {
        IncidentTicket ticket = incidentTicketService.getTicketById(id);
        return ResponseEntity.ok(IncidentTicketResponse.fromEntity(ticket));
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<IncidentTicketResponse> respondToTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        String response = request.get("response");
        IncidentTicket updatedTicket = incidentTicketService.respondToTicket(id, response, admin);
        return ResponseEntity.ok(IncidentTicketResponse.fromEntity(updatedTicket));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User admin) {
        IncidentTicket.IncidentStatus status = IncidentTicket.IncidentStatus.valueOf(request.get("status"));
        IncidentTicket updatedTicket = incidentTicketService.updateTicketStatus(id, status, admin);
        return ResponseEntity.ok(IncidentTicketResponse.fromEntity(updatedTicket));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTicketStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("openTickets", incidentTicketService.getTicketCountByStatus(IncidentTicket.IncidentStatus.OPEN));
        stats.put("inProgressTickets", incidentTicketService.getTicketCountByStatus(IncidentTicket.IncidentStatus.IN_PROGRESS));
        stats.put("resolvedTickets", incidentTicketService.getTicketCountByStatus(IncidentTicket.IncidentStatus.RESOLVED));
        stats.put("highPriorityTickets", incidentTicketService.getTicketCountByPriority(IncidentTicket.IncidentPriority.HIGH));
        stats.put("mediumPriorityTickets", incidentTicketService.getTicketCountByPriority(IncidentTicket.IncidentPriority.MEDIUM));
        stats.put("lowPriorityTickets", incidentTicketService.getTicketCountByPriority(IncidentTicket.IncidentPriority.LOW));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<IncidentTicketResponse>> getTicketsByStatus(@PathVariable String status) {
        IncidentTicket.IncidentStatus ticketStatus = IncidentTicket.IncidentStatus.valueOf(status.toUpperCase());
        List<IncidentTicket> tickets = incidentTicketService.getTicketsByStatus(ticketStatus);
        List<IncidentTicketResponse> response = tickets.stream()
                .map(IncidentTicketResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-priority/{priority}")
    public ResponseEntity<List<IncidentTicketResponse>> getTicketsByPriority(@PathVariable String priority) {
        IncidentTicket.IncidentPriority ticketPriority = IncidentTicket.IncidentPriority.valueOf(priority.toUpperCase());
        List<IncidentTicket> tickets = incidentTicketService.getTicketsByPriority(ticketPriority);
        List<IncidentTicketResponse> response = tickets.stream()
                .map(IncidentTicketResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
