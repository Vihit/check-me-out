package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.Role;
import com.digitedgy.checkmeout.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    public Optional<Role> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }

    public Iterable<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> findByRole(String role) { return roleRepository.findByRole(role); }

    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public boolean hasAccess(Set<Role> userRoles, Set<Role> authorizedRoles) {
        for (Role userRole : userRoles) {
            if(authorizedRoles.contains(userRole)) {
                return true;
            }
        }
        return false;
    }
}
