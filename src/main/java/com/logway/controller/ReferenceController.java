package com.logway.controller;

import com.logway.entity.App;
import com.logway.entity.Site;
import com.logway.entity.YouTubeVideo;
import com.logway.repository.AppRepository;
import com.logway.repository.SiteRepository;
import com.logway.repository.YouTubeVideoRepository;
import lombok.RequiredArgsConstructor;
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


    public ReferenceController(AppRepository appRepository,
                               SiteRepository siteRepository,
                               YouTubeVideoRepository videoRepository) {
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
    public ResponseEntity<Void> deleteApp(@PathVariable String id) {
        try {
            appRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.noContent().build();
        }
    }



    @GetMapping("/sites")
    public ResponseEntity<List<Site>> getAllSites() {
        return ResponseEntity.ok(siteRepository.findAll());
    }

    @PostMapping("/sites")
    public ResponseEntity<Site> createSite(@RequestBody Site site) {
        return ResponseEntity.ok(siteRepository.save(site));
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
    public ResponseEntity<Void> deleteSite(@PathVariable String id) {
        siteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/videos")
    public ResponseEntity<List<YouTubeVideo>> getAllVideos() {
        return ResponseEntity.ok(videoRepository.findAll());
    }

    @PostMapping("/videos")
    public ResponseEntity<YouTubeVideo> createVideo(@RequestBody YouTubeVideo video) {
        return ResponseEntity.ok(videoRepository.save(video));
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
    public ResponseEntity<Void> deleteVideo(@PathVariable String id) {
        videoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}