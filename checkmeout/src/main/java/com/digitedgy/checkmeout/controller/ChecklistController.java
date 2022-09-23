package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.entity.Department;
import com.digitedgy.checkmeout.service.ChecklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Checklist savedChecklist = checklistService.save(checklist);
        return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
    }
}
