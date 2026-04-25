package com.group213.backend.repository;

import com.group213.backend.model.IncidentTicket;
import com.group213.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {
    
    Page<IncidentTicket> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<IncidentTicket> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<IncidentTicket> findByStatusOrderByCreatedAtDesc(IncidentTicket.IncidentStatus status);
    
    List<IncidentTicket> findByPriorityOrderByCreatedAtDesc(IncidentTicket.IncidentPriority priority);
    
    @Query("SELECT t FROM IncidentTicket t WHERE t.status = :status OR t.priority = :priority ORDER BY t.createdAt DESC")
    List<IncidentTicket> findByStatusOrPriorityOrderByCreatedAtDesc(
        @Param("status") IncidentTicket.IncidentStatus status,
        @Param("priority") IncidentTicket.IncidentPriority priority
    );
    
    @Query("SELECT COUNT(t) FROM IncidentTicket t WHERE t.status = :status")
    long countByStatus(@Param("status") IncidentTicket.IncidentStatus status);
    
    @Query("SELECT COUNT(t) FROM IncidentTicket t WHERE t.priority = :priority")
    long countByPriority(@Param("priority") IncidentTicket.IncidentPriority priority);
    
    @Query("SELECT t FROM IncidentTicket t WHERE t.isNotified = false ORDER BY t.createdAt ASC")
    List<IncidentTicket> findUnnotifiedTickets();
}
