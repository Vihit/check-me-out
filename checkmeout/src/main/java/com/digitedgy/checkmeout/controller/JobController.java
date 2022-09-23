package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.entity.Job;
import com.digitedgy.checkmeout.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/job/")
public class JobController {

    @Autowired
    JobService jobService;

    @GetMapping("/")
    public ResponseEntity<?> getJobs() {
        Iterable<Job> jobs = jobService.getAll();
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/assigned-to/{user}")
    public ResponseEntity<?> getJobsAssignedTo(@PathVariable(name = "user") Integer user) {
        Iterable<Job> jobs = jobService.getAllAssignedTo(user);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/create/{username}")
    public ResponseEntity<?> getJobsCreatedBy(@PathVariable(name = "username") String username) {
        Iterable<Job> jobs = jobService.getAllInitiatedBy(username);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<?> getJobsInState(@PathVariable(name = "state") String state) {
        Iterable<Job> jobs = (state.equalsIgnoreCase("Incomplete") ? jobService.getAllIncompleteJobs() : jobService.getAllCompleteJobs());
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> saveJob(@RequestBody Job job) {
        Job savedJob = jobService.save(job);
        return new ResponseEntity<>(savedJob, HttpStatus.OK);
    }

    @PostMapping("/all/")
    public ResponseEntity<?> saveJobs(@RequestBody Iterable<Job> jobs) {
        Iterable<Job> savedJobs = jobService.saveAll(jobs);
        return new ResponseEntity<>(savedJobs, HttpStatus.OK);
    }
}
