package com.vss.pathforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vss.pathforge.model.Node;

public interface NodeRepository
        extends JpaRepository<Node, Long> {

    List<Node> findByUserId(Long userId);
}