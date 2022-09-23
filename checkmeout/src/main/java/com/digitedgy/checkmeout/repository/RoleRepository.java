package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role,Integer> {
    Optional<Role> findByRole(String role);
}
