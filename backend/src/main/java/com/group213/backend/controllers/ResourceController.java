package com.group213.backend.controllers;

import com.group213.backend.model.Resource;
import com.group213.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Resource> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Resource create(@Valid @RequestBody Resource resource) {
        return service.create(resource);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @RequestBody Resource resource) {
        return service.update(id, resource);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/filter")
    public List<Resource> filter(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {

        if (location != null) {
            return service.getByLocation(location);
        }
        if (capacity != null) {
            return service.getByCapacity(capacity);
        }
        return service.getAll();
    }
}