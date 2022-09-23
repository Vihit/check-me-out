package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.Department;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface DepartmentRepository extends CrudRepository<Department,Integer> {
    public Optional<Department> findByName(String name);
}
