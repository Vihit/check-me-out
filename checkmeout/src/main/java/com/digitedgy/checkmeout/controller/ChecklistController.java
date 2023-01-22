package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.entity.Department;
import com.digitedgy.checkmeout.service.ChecklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/checklist/")
public class ChecklistController {

    @Autowired
    ChecklistService checklistService;

    @GetMapping("/")
    public ResponseEntity<?> getChecklists() {
        Iterable<Checklist> checklists = checklistService.getAll();
        return new ResponseEntity<>(checklists, HttpStatus.OK);
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<?> getChecklistsInState(@PathVariable(name = "state") String state) {
        Iterable<Checklist> checklists = checklistService.getAllInState(state);
        return new ResponseEntity<>(checklists, HttpStatus.OK);
    }

    @GetMapping("/create/{username}")
    public ResponseEntity<?> getChecklistsCreatedBy(@PathVariable(name = "username") String username) {
        Iterable<Checklist> checklists = checklistService.getAllCreatedBy(username);
        return new ResponseEntity<>(checklists, HttpStatus.OK);
    }

    @GetMapping("/review/{username}")
    public ResponseEntity<?> getChecklistsReviewBy(@PathVariable(name = "username") String username) {
        Iterable<Checklist> checklists = checklistService.getAllReviewBy(username);
        return new ResponseEntity<>(checklists, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> saveChecklist(@RequestBody Checklist checklist) {
        checklist.setVersion(1);
        Checklist savedChecklist = checklistService.save(checklist);
        return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
    }

    @PutMapping("/")
    public ResponseEntity<?> updateChecklist(@RequestBody Checklist checklist) {
        Optional<Checklist> originalChecklist = null;
        Optional<Checklist> previouslyUpdatedChecklist = null;
        if(checklist.getOriginalId() != 0) {
            originalChecklist = checklistService.getById(checklist.getOriginalId());
            previouslyUpdatedChecklist = checklistService.getById(checklist.getId());
        } else {
            originalChecklist = checklistService.getById(checklist.getId());
            checklist.setId(null);
            checklist.setVersion(originalChecklist.get().getVersion()+1);
            checklist.setOriginalId(originalChecklist.get().getId());
        }
        if(originalChecklist.isPresent()) {
            if(previouslyUpdatedChecklist!=null && previouslyUpdatedChecklist.isPresent()) {
                checklist.setCreatedBy(previouslyUpdatedChecklist.get().getCreatedBy());
                checklist.setCreateDt(previouslyUpdatedChecklist.get().getCreateDt());
                checklist.setReviewBy(previouslyUpdatedChecklist.get().getReviewBy());
            }

            if(checklist.getState().equalsIgnoreCase("published")) {
                originalChecklist.get().setReasonForChange(checklist.getReasonForChange());
                originalChecklist.get().setState("Overwritten");
                Checklist updatedChecklist = checklistService.save(originalChecklist.get());
            }
            Checklist savedChecklist = checklistService.save(checklist);
            return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Checklist does not exist!");
        }
    }
}
