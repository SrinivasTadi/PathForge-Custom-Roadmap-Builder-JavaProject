package com.vss.pathforge.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.vss.pathforge.model.Note;
import com.vss.pathforge.model.User;

import com.vss.pathforge.repository.NoteRepository;
import com.vss.pathforge.repository.UserRepository;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // USED TO SAVE NOTE

    @PostMapping("/save/{userId}")
    public Note saveNote(

            @PathVariable Long userId,

            @RequestBody Note note
    ) {

        User user =
            userRepository.findById(userId)
                .orElse(null);

        note.setUser(user);

        return noteRepository.save(note);
    }

    // USED TO LOAD NOTES

    @GetMapping("/load/{userId}")
    public List<Note> loadNotes(
            @PathVariable Long userId
    ) {

        return noteRepository.findByUserId(userId);
    }

    // USED TO DELETE NOTE

    @DeleteMapping("/delete/{id}")
    public String deleteNote(
            @PathVariable Long id
    ) {

        noteRepository.deleteById(id);

        return "Note Deleted";
    }
}