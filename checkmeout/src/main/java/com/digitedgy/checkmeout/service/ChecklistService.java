package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.entity.User;
import com.digitedgy.checkmeout.repository.ChecklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChecklistService {

    @Autowired
    ChecklistRepository checklistRepository;

    public Optional<Checklist> getById(Integer id) {
        return checklistRepository.findById(id);
    }
    public Checklist save(Checklist checklist) {
        return checklistRepository.save(checklist);
    }

    public Iterable<Checklist> getAll() {
        return checklistRepository.findAll();
    }

    public Iterable<Checklist> getAllInState(String state) {
        return checklistRepository.findByState(state);
    }

    public Iterable<Checklist> getAllCreatedBy(String username) {
        return checklistRepository.findByCreatedBy(username);
    }

    public Iterable<Checklist> getAllReviewBy(String username) {
        return checklistRepository.findByReviewBy(username);
    }
}
