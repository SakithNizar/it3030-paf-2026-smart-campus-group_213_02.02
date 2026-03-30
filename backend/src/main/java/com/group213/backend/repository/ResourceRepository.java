package com.group213.backend.repository;

import com.group213.backend.model.Resource;
import com.group213.backend.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);
}