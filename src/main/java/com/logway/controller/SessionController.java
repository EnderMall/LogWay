package com.logway.controller;

import com.logway.entity.AppSession;
import com.logway.entity.PageSession;
import com.logway.entity.ViewSession;
import com.logway.repository.AppSessionRepository;
import com.logway.repository.PageSessionRepository;
import com.logway.repository.ViewSessionRepository;
import com.logway.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;
    private final SessionService sessionService;

    @GetMapping("/app")
    public ResponseEntity<List<AppSession>> getAllAppSessions() {
        return ResponseEntity.ok(appSessionRepository.findAll());
    }

    @GetMapping("/app/{id}")
    public ResponseEntity<AppSession> getAppSession(@PathVariable Long id) {
        Optional<AppSession> session = appSessionRepository.findById(id);
        return session.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/app")
    public ResponseEntity<AppSession> createAppSession(@RequestBody AppSession session) {
        return ResponseEntity.ok(sessionService.saveAppSession(session));
    }

    @PutMapping("/app/{id}")
    public ResponseEntity<AppSession> updateAppSession(
            @PathVariable Long id,
            @RequestBody AppSession updatedSession) {

        if (!appSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Просто сохраняем, не устанавливаем ID
        return ResponseEntity.ok(sessionService.saveAppSession(updatedSession));
    }

    @DeleteMapping("/app/{id}")
    public ResponseEntity<Void> deleteAppSession(@PathVariable Long id) {
        if (!appSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        appSessionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/page")
    public ResponseEntity<List<PageSession>> getAllPageSessions() {
        return ResponseEntity.ok(pageSessionRepository.findAll());
    }

    @GetMapping("/page/{id}")
    public ResponseEntity<PageSession> getPageSession(@PathVariable Long id) {
        Optional<PageSession> session = pageSessionRepository.findById(id);
        return session.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/page")
    public ResponseEntity<PageSession> createPageSession(@RequestBody PageSession session) {
        return ResponseEntity.ok(sessionService.savePageSession(session));
    }

    @PutMapping("/page/{id}")
    public ResponseEntity<PageSession> updatePageSession(
            @PathVariable Long id,
            @RequestBody PageSession updatedSession) {

        if (!pageSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(sessionService.savePageSession(updatedSession));
    }

    @DeleteMapping("/page/{id}")
    public ResponseEntity<Void> deletePageSession(@PathVariable Long id) {
        if (!pageSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        pageSessionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/view")
    public ResponseEntity<List<ViewSession>> getAllViewSessions() {
        return ResponseEntity.ok(viewSessionRepository.findAll());
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<ViewSession> getViewSession(@PathVariable Long id) {
        Optional<ViewSession> session = viewSessionRepository.findById(id);
        return session.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/view")
    public ResponseEntity<ViewSession> createViewSession(@RequestBody ViewSession session) {
        return ResponseEntity.ok(sessionService.saveViewSession(session));
    }

    @PutMapping("/view/{id}")
    public ResponseEntity<ViewSession> updateViewSession(
            @PathVariable Long id,
            @RequestBody ViewSession updatedSession) {

        if (!viewSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(sessionService.saveViewSession(updatedSession));
    }

    @DeleteMapping("/view/{id}")
    public ResponseEntity<Void> deleteViewSession(@PathVariable Long id) {
        if (!viewSessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        viewSessionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}