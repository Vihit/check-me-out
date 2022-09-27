package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.Job;
import com.digitedgy.checkmeout.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
