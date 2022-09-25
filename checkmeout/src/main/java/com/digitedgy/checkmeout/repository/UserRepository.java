package com.digitedgy.checkmeout.repository;

import com.digitedgy.checkmeout.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User,Integer> {

    @Query("select u from User u join fetch u.roles where u.username = ?1")
    Optional<User> findByUsername(String username);
    @Query("select u from User u join fetch u.roles where role in (?1)")
    Iterable<User> findAllWithRoles(String[] roles);
}
