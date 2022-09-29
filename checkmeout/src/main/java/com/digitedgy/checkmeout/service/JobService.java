package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.Job;
import com.digitedgy.checkmeout.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    JobRepository jobRepository;

    public Job save(Job job) {
        return jobRepository.save(job);
    }

    public Iterable<Job> saveAll(Iterable<Job> jobs) {
        return jobRepository.saveAll(jobs);
    }

    public Iterable<Job> getAllInitiatedBy(String username) {
        return jobRepository.findByCreatedBy(username);
    }

    public Iterable<Job> getAllAssignedTo(String user) {
        return jobRepository.findByCreatedBy(user);
    }

    public Iterable<Job> getAll() {
        return jobRepository.findAll();
    }

    public Iterable<Job> getAllIncompleteJobs() {
        return jobRepository.findByCompletedOnIsNull();
    }

    public Iterable<Job> getAllCompleteJobs() {
        return jobRepository.findByCompletedOnIsNotNull();
    }

    public Optional<Job> getJobById(Integer jobId) { return jobRepository.findById(jobId);}

    public Job updateCompletedOn(Integer jobId, Timestamp completedOn) {
        Optional<Job> existingJob = getJobById(jobId);
        if(existingJob.isPresent()) {
            existingJob.get().setCompletedOn(completedOn);
            return jobRepository.save(existingJob.get());
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Job Id does not exist");
    }
}
