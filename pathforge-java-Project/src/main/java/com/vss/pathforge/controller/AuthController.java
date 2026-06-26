package com.vss.pathforge.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.vss.pathforge.model.User;
import com.vss.pathforge.repository.UserRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // SIGNUP API

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if(existingUser.isPresent()) {
            return "Email already exists!";
        }

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // LOGIN API

    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {

        Optional<User> user =
                userRepository.findByEmail(loginUser.getEmail());

        if(user.isPresent()) {

            if(user.get().getPassword()
                    .equals(loginUser.getPassword())) {

                return "Login Successful";
            }
        }

        return "Invalid Email or Password";
    }

    // GET USER BY EMAIL

    @GetMapping("/getUser/{email}")
    public User getUser(
            @PathVariable String email
    ) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }

    // SAVE ROADMAP TITLE IT IS THE NEW FEATURE I ADDED BECAUSE FOR MORE CLARITY

@PostMapping("/saveRoadmapTitle/{userId}")

public String saveRoadmapTitle(

        @PathVariable Long userId,

        @RequestBody String title){

    User user =
            userRepository
            .findById(userId)
            .orElseThrow();

    user.setRoadmapTitle(title);

    userRepository.save(user);

    return "Roadmap Title Saved";
}


// GET ROADMAP TITLE

@GetMapping("/getRoadmapTitle/{userId}")

public String getRoadmapTitle(

        @PathVariable Long userId){

    User user =
            userRepository
            .findById(userId)
            .orElseThrow();

    return user.getRoadmapTitle();
}
}