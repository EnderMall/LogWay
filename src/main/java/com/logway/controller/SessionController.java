package com.logway.controller;

import com.logway.entity.*;
import com.logway.repository.*;
import com.logway.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;
    private final SessionService sessionService;
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;


    public SessionController(AppSessionRepository appSessionRepository,
                             PageSessionRepository pageSessionRepository,
                             ViewSessionRepository viewSessionRepository,
                             SessionService sessionService,AppRepository appRepository,
                             SiteRepository siteRepository,
                             YouTubeVideoRepository videoRepository) {
        this.appSessionRepository = appSessionRepository;
        this.pageSessionRepository = pageSessionRepository;
        this.viewSessionRepository = viewSessionRepository;
        this.sessionService = sessionService;
        this.appRepository = appRepository;
        this.siteRepository = siteRepository;
        this.videoRepository = videoRepository;
    }

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
        String processName = session.getApp().getProcessName();
        Optional<App> existingApp = appRepository.findById(processName);

        if (existingApp.isEmpty()) {
            App newApp = new App();
            newApp.setProcessName( session.getApp().getProcessName());
            newApp.setBaseName(session.getApp().getBaseName() != null ?
                    session.getApp().getBaseName() : processName);

            App savedApp = appRepository.save(newApp);
            session.setApp(savedApp);
        } else {
            session.setApp(existingApp.get());
        }
        AppSession saved = sessionService.saveAppSession(session);
        return ResponseEntity.ok(saved);
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
        String domain = session.getSite().getDomain();
        Optional<Site> existingSite = siteRepository.findById(domain);

        if (existingSite.isEmpty()) {
            Site newSite = new Site();
            newSite.setDomain(domain);

            Site savedSite = siteRepository.save(newSite);
            session.setSite(savedSite);
        } else {
            session.setSite(existingSite.get());
        }

        String processName = session.getBrowser().getProcessName();
        Optional<App> existingApp = appRepository.findById(processName);

        if (existingApp.isEmpty()) {
            App newApp = new App();
            newApp.setProcessName(processName);
            newApp.setBaseName(processName);


            App savedApp = appRepository.save(newApp);
            session.setBrowser(savedApp);
        } else {
            session.setBrowser(existingApp.get());
        }

        PageSession saved = sessionService.savePageSession(session);
        return ResponseEntity.ok(saved);
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
        String domain = session.getSite().getDomain();
        Optional<Site> existingSite = siteRepository.findById(domain);

        if (existingSite.isEmpty()) {
            Site newSite = new Site();
            newSite.setDomain(domain);
            Site savedSite = siteRepository.save(newSite);
            session.setSite(savedSite);
        } else {
            session.setSite(existingSite.get());
        }

        String videoId = session.getVideo().getVideoId();
        Optional<YouTubeVideo> existingVideo = videoRepository.findById(videoId);

        if (existingVideo.isEmpty()) {
            YouTubeVideo newVideo = new YouTubeVideo();
            newVideo.setVideoId(session.getVideo().getVideoId());
            newVideo.setTitle("Unknown");
            newVideo.setAuthor("Unknown");
            newVideo.setVideoDuration(session.getViewingTime());

            YouTubeVideo savedVideo = videoRepository.save(newVideo);
            session.setVideo(savedVideo);
        } else {
            session.setVideo(existingVideo.get());
        }
        ViewSession saved = sessionService.saveViewSession(session);
        return ResponseEntity.ok(saved);
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