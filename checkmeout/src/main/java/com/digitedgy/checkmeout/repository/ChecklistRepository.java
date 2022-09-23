package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.Checklist;
import org.springframework.data.repository.CrudRepository;

public interface ChecklistRepository extends CrudRepository<Checklist,Integer> {

    Iterable<Checklist> findByState(String state);
    Iterable<Checklist> findByCreatedBy(String createdBy);
    Iterable<Checklist> findByReviewBy(String reviewBy);
}
