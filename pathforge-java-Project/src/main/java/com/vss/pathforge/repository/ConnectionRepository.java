package com.vss.pathforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vss.pathforge.model.Connection;

public interface ConnectionRepository
        extends JpaRepository<Connection, Long> {

    List<Connection> findByUserId(Long userId);
}