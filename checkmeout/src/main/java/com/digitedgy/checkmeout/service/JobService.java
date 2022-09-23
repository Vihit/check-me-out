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

    public Iterable<Job> getAllAssignedTo(Integer userId) {
        return jobRepository.findByUserId(userId);
    }

    public Iterable<Job> getAll() {
        return jobRepository.findAll();
    }

    public Iterable<Job> getAllIncompleteJobs() {
        return jobRepository.findByJobStatus("Incomplete");
    }

    public Iterable<Job> getAllCompleteJobs() {
        return jobRepository.findByJobStatus("Complete");
    }
}
