package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.AuditTrail;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AuditTrailRepository extends CrudRepository<AuditTrail, Integer> {
    Iterable<AuditTrail> findAllByTypeAndPkValueIn(String type, String[] pkValues);
}
