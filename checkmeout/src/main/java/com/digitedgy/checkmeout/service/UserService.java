package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.Role;
import com.digitedgy.checkmeout.entity.User;
import com.digitedgy.checkmeout.repository.RoleRepository;
import com.digitedgy.checkmeout.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements ApplicationListener<AuthenticationSuccessEvent> {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        String userName = ((User) event.getAuthentication().
                getPrincipal()).getUsername();
        User user = this.userRepository.findByUsername(userName).get();
        user.setLastLoginDt(new Timestamp(System.currentTimeMillis()));
        user.setUpdatedBy(user.getUsername());
        this.saveUser(user);
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User newUser) {
        Set<Role> roles = new HashSet<>();
        newUser.getRoles().stream().forEach(role->roles.add(roleRepository.findById(role.getId()).get()));
        newUser.setRoles(roles);

        return userRepository.save(newUser);
    }
}
