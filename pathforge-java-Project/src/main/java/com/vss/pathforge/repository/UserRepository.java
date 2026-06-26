package com.vss.pathforge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vss.pathforge.model.User;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}