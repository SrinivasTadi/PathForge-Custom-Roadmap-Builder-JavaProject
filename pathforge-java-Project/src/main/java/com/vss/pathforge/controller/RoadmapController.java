package com.vss.pathforge.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.vss.pathforge.model.Connection;
import com.vss.pathforge.model.Node;
import com.vss.pathforge.model.User;

import com.vss.pathforge.repository.ConnectionRepository;
import com.vss.pathforge.repository.NodeRepository;
import com.vss.pathforge.repository.UserRepository;

@RestController
@RequestMapping("/roadmap")
public class RoadmapController {

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    // SAVING ROADMAP

    @PostMapping("/save/{userId}")
    public String saveRoadmap(
            @PathVariable Long userId,
            @RequestBody List<Node> nodes
    ) {

        User user =
            userRepository.findById(userId)
                .orElse(null);

        if(user == null){
            return "User not found";
        }

        // DELETING OLD NODES

        List<Node> existingNodes =
            nodeRepository.findByUserId(userId);

        nodeRepository.deleteAll(existingNodes);

        // SAVING NEW NODES

        for(Node node : nodes){

            node.setUser(user);

            nodeRepository.save(node);
        }

        return "Roadmap Saved Successfully";
    }

    // LOADING ROADMAP

    @GetMapping("/load/{userId}")
    public List<Node> loadRoadmap(
            @PathVariable Long userId
    ) {

        return nodeRepository.findByUserId(userId);
    }

    // SAVING CONNECTIONS

    @PostMapping("/saveConnections/{userId}")
    public String saveConnections(
            @PathVariable Long userId,
            @RequestBody List<Connection> connections
    ) {

        User user =
            userRepository.findById(userId)
                .orElse(null);

        if(user == null){
            return "User not found";
        }

        // DELETE OLD CONNECTIONS

        List<Connection> oldConnections =
            connectionRepository.findByUserId(userId);

        connectionRepository.deleteAll(oldConnections);

        // SAVE NEW CONNECTIONS

        for(Connection connection : connections){

            connection.setUser(user);

            connectionRepository.save(connection);
        }

        return "Connections Saved";
    }

    // LOAD CONNECTIONS

    @GetMapping("/loadConnections/{userId}")
    public List<Connection> loadConnections(
            @PathVariable Long userId
    ) {

        return connectionRepository.findByUserId(userId);
    }
}