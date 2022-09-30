package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.entity.Job;
import org.springframework.data.repository.CrudRepository;

public interface JobRepository extends CrudRepository<Job,Integer> {
    Iterable<Job> findByCreatedBy(String createdBy);
    Iterable<Job> findByCompletedOnIsNull();
    Iterable<Job> findByCompletedOnIsNotNull();
}
