package com.logway.controller;

import com.logway.entity.*;
import com.logway.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ReferenceController{
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;
    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;


    public ReferenceController(AppRepository appRepository,
                             SiteRepository siteRepository,
                             YouTubeVideoRepository videoRepository,
                               AppSessionRepository appSessionRepository,
                               PageSessionRepository pageSessionRepository,
                               ViewSessionRepository viewSessionRepository) {
        this.appSessionRepository = appSessionRepository;
        this.pageSessionRepository = pageSessionRepository;
        this.viewSessionRepository = viewSessionRepository;
        this.appRepository = appRepository;
        this.siteRepository = siteRepository;
        this.videoRepository = videoRepository;
    }


    @GetMapping("/apps")
    public ResponseEntity<List<App>> getAllApps() {
        return ResponseEntity.ok(appRepository.findAll());
    }

    @GetMapping("/apps/{id}")
    public ResponseEntity<App> getApp(@PathVariable String id) {
        Optional<App> app = appRepository.findById(id);
        return app.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/apps")
    public ResponseEntity<App> createApp(@RequestBody App app) {
        Optional<App> existing = appRepository.findById(app.getProcessName());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        App saved = appRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/apps/{id}")
    public ResponseEntity<App> updateApp(
            @PathVariable String id,
            @RequestBody App updatedApp) {
        updatedApp.setProcessName(id);
        App saved = appRepository.save(updatedApp);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/apps/{id}")
    @Transactional
    public ResponseEntity<?> deleteApp(@PathVariable String id) {
        try {
            List<AppSession> appSessions = appSessionRepository.findByAppProcessName(id);
            if (!appSessions.isEmpty()) {
                return ResponseEntity.status(409)
                        .body("Нельзя удалить приложение. Существуют связанные сессии: " + appSessions.size());
            }

            List<PageSession> pageSessions = pageSessionRepository.findByBrowserProcessName(id);
            if (!pageSessions.isEmpty()) {
                return ResponseEntity.status(409)
                        .body("Нельзя удалить приложение. Используется как браузер: " + pageSessions.size());
            }

            appRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    }




    @GetMapping("/sites")
    public ResponseEntity<List<Site>> getAllSites() {
        return ResponseEntity.ok(siteRepository.findAll());
    }

    @PostMapping("/sites")
    public ResponseEntity<Site> createSite(@RequestBody Site site) {
        Optional<Site> existing = siteRepository.findById(site.getDomain());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        Site saved = siteRepository.save(site);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/sites/{id}")
    public ResponseEntity<Site> updateSite(
            @PathVariable String id,
            @RequestBody Site updatedSite) {
        updatedSite.setDomain(id);
        Site saved = siteRepository.save(updatedSite);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/sites/{id}")
    @Transactional
    public ResponseEntity<?> deleteSite(@PathVariable String id) {
        try {
            List<PageSession> pageSessions = pageSessionRepository.findBySiteDomain(id);
            if (!pageSessions.isEmpty()) {
                return ResponseEntity.status(409)
                        .body("Нельзя удалить сайт. Существуют сессии страниц: " + pageSessions.size());
            }
            List<ViewSession> viewSessions = viewSessionRepository.findBySiteDomain(id);
            if (!viewSessions.isEmpty()) {
                return ResponseEntity.status(409)
                        .body("Нельзя удалить сайт. Существуют сессии просмотра: " + viewSessions.size());
            }

            siteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/videos")
    public ResponseEntity<List<YouTubeVideo>> getAllVideos() {
        return ResponseEntity.ok(videoRepository.findAll());
    }

    @PostMapping("/videos")
    public ResponseEntity<YouTubeVideo> createVideo(@RequestBody YouTubeVideo video) {
        Optional<YouTubeVideo> existing = videoRepository.findById(video.getVideoId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        YouTubeVideo saved = videoRepository.save(video);
        return ResponseEntity.ok(videoRepository.save(saved));
    }


    @PutMapping("/videos/{id}")
    public ResponseEntity<YouTubeVideo> updateVideo(
            @PathVariable String id,
            @RequestBody YouTubeVideo updatedVideo) {
        updatedVideo.setVideoId(id);
        YouTubeVideo saved = videoRepository.save(updatedVideo);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/videos/{id}")
    @Transactional
    public ResponseEntity<?> deleteVideo(@PathVariable String id) {
        try {
            List<ViewSession> viewSessions = viewSessionRepository.findByVideoId(id);
            if (!viewSessions.isEmpty()) {
                return ResponseEntity.status(409)
                        .body("Нельзя удалить видео. Существуют сессии просмотра: " + viewSessions.size());
            }

            videoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
