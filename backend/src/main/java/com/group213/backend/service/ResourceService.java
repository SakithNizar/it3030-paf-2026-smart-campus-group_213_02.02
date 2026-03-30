package com.group213.backend.service;

import com.group213.backend.exception.ResourceNotFoundException;
import com.group213.backend.model.Resource;
import com.group213.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    public List<Resource> getAll() {
        return repo.findAll();
    }

    public Resource create(Resource resource) {
        return repo.save(resource);
    }

    public Resource update(Long id, Resource updated) {
        Resource r = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        r.setName(updated.getName());
        r.setType(updated.getType());
        r.setCapacity(updated.getCapacity());
        r.setLocation(updated.getLocation());
        r.setStatus(updated.getStatus());
        r.setAvailableFrom(updated.getAvailableFrom());
        r.setAvailableTo(updated.getAvailableTo());

        return repo.save(r);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found");
        }
        repo.deleteById(id);
    }

    public List<Resource> getByLocation(String location) {
        return repo.findByLocationContainingIgnoreCase(location);
    }

    public List<Resource> getByCapacity(int capacity) {
        return repo.findByCapacityGreaterThanEqual(capacity);
    }
}