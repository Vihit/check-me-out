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
        Optional<Checklist> existingChecklist = null;
        if(!checklist.getState().equalsIgnoreCase("Archive")) {
            if(checklist.getOriginalId() != 0 && !checklistService.getById(checklist.getOriginalId()).get().getState().equalsIgnoreCase("Overwritten")) {
                originalChecklist = checklistService.getById(checklist.getOriginalId());
                previouslyUpdatedChecklist = checklistService.getById(checklist.getId());
            } else if(!checklist.getState().equalsIgnoreCase("Published")) {
                if(!(checklistService.getById(checklist.getId()).get().getState().equalsIgnoreCase("Draft") && (checklist.getState().equalsIgnoreCase("Draft") || checklist.getState().equalsIgnoreCase("In Review")))) {
                    originalChecklist = checklistService.getById(checklist.getId());
                    checklist.setId(null);
                    checklist.setVersion(originalChecklist.get().getVersion()+1);
                    checklist.setOriginalId(originalChecklist.get().getId());
                } else {
                    Checklist savedChecklist = checklistService.save(checklist);
                    return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
                }
            } else {
                existingChecklist = checklistService.getById(checklist.getId());
            }
            if(originalChecklist!=null && originalChecklist.isPresent()) {
                if(previouslyUpdatedChecklist!=null && previouslyUpdatedChecklist.isPresent()) {
    //                checklist.setCreatedBy(null);
    //                checklist.setCreateDt(null);
    //                checklist.setReviewBy(previouslyUpdatedChecklist.get().getReviewBy());
                }

                if(checklist.getState().equalsIgnoreCase("published") && checklist.getOriginalId() != 0) {
                    originalChecklist.get().setReasonForChange(checklist.getReasonForChange());
                    originalChecklist.get().setState("Overwritten");
                    Checklist updatedChecklist = checklistService.save(originalChecklist.get());
                }
                Checklist savedChecklist = checklistService.save(checklist);
                return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
            } else if (checklist.getState().equalsIgnoreCase("published") && checklist.getOriginalId() == 0) {
                checklist.setCreateDt(existingChecklist.get().getCreateDt());
                checklist.setCreatedBy(existingChecklist.get().getCreatedBy());
    //            checklist.setReasonForChange(existingChecklist.get);
                Checklist savedChecklist = checklistService.save(checklist);
                return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Checklist does not exist!");
            }
        } else {
            Checklist savedChecklist = checklistService.save(checklist);
            return new ResponseEntity<>(savedChecklist, HttpStatus.OK);
        }
    }
}
