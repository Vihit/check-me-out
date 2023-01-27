package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.Checklist;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ChecklistRepository extends CrudRepository<Checklist,Integer> {

    Iterable<Checklist> findByState(String state);
    Iterable<Checklist> findByCreatedBy(String createdBy);
    Iterable<Checklist> findByReviewBy(String reviewBy);
    Optional<Checklist> findByOriginalId(int id);
}
