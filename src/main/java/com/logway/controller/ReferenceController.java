package com.logway.controller;

import com.logway.entity.*;
import com.logway.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST-контроллер ReferenceController предоставляет API для управления справочными данными системы.
 * Осуществляет операции CRUD (создание, чтение, обновление, удаление) для сущностей
 * App (Приложения), Site (Сайты) и YouTubeVideo (Видео).
 * Включает механизмы проверки целостности данных, запрещая удаление записей,
 * связанных с активными пользовательскими сессиями.
 */
@RestController
@RequestMapping("/api")
public class ReferenceController{
    /** Репозитории для взаимодействия с таблицами базы данных. */
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;
    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;

    /**
     * Конструктор контроллера с автоматическим внедрением зависимостей через параметры.
     */
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

    /**
     * Возвращает список всех зарегистрированных приложений.
     * @return ResponseEntity со списком объектов App.
     */
    @GetMapping("/apps")
    public ResponseEntity<List<App>> getAllApps() {
        return ResponseEntity.ok(appRepository.findAll());
    }

    /**
     * Ищет приложение по его уникальному идентификатору (processName).
     * @param id имя процесса приложения.
     * @return ResponseEntity с найденным приложением или статусом 404 (Not Found).
     */
    @GetMapping("/apps/{id}")
    public ResponseEntity<App> getApp(@PathVariable String id) {
        Optional<App> app = appRepository.findById(id);
        return app.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Создает новую запись о приложении. Если приложение уже существует, возвращает его.
     * @param app объект приложения из тела запроса.
     * @return ResponseEntity с сохраненным объектом.
     */
    @PostMapping("/apps")
    public ResponseEntity<App> createApp(@RequestBody App app) {
        Optional<App> existing = appRepository.findById(app.getProcessName());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        App saved = appRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    /**
     * Обновляет данные существующего приложения.
     * @param id имя процесса.
     * @param updatedApp обновленные данные.
     * @return ResponseEntity с обновленным объектом.
     */
    @PutMapping("/apps/{id}")
    public ResponseEntity<App> updateApp(
            @PathVariable String id,
            @RequestBody App updatedApp) {
        updatedApp.setProcessName(id);
        App saved = appRepository.save(updatedApp);
        return ResponseEntity.ok(saved);
    }

    /**
     * Удаляет приложение, если на него нет ссылок в сессиях работы или браузеров.
     * @param id имя процесса для удаления.
     * @return 204 (No Content) при успехе или 409 (Conflict) при наличии связей.
     */
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

    /**
     * Возвращает список всех зарегистрированных веб-сайтов.
     * @return ResponseEntity со списком объектов Site.
     */
    @GetMapping("/sites")
    public ResponseEntity<List<Site>> getAllSites() {
        return ResponseEntity.ok(siteRepository.findAll());
    }

    /**
     * Регистрирует новый сайт в системе.
     * Если сайт с таким доменом уже существует, возвращает имеющуюся запись.
     * @param site объект сайта (домен и категория).
     * @return ResponseEntity с сохраненным объектом.
     */
    @PostMapping("/sites")
    public ResponseEntity<Site> createSite(@RequestBody Site site) {
        Optional<Site> existing = siteRepository.findById(site.getDomain());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        Site saved = siteRepository.save(site);
        return ResponseEntity.ok(saved);
    }

    /**
     * Обновляет данные о сайте (например, меняет его категорию).
     * @param id домен сайта, используемый как уникальный ключ.
     * @param updatedSite новые данные сайта.
     * @return ResponseEntity с обновленной сущностью.
     */
    @PutMapping("/sites/{id}")
    public ResponseEntity<Site> updateSite(
            @PathVariable String id,
            @RequestBody Site updatedSite) {
        updatedSite.setDomain(id);
        Site saved = siteRepository.save(updatedSite);
        return ResponseEntity.ok(saved);
    }

    /**
     * Удаляет сайт из справочника.
     * Проверяет отсутствие связанных сессий посещения страниц или просмотров видео.
     * @param id домен удаляемого сайта.
     * @return 204 (Успех) или 409 (Конфликт, если есть зависимости в других таблицах).
     */
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

    /**
     * Получает список всех видеороликов, хранящихся в базе.
     * @return ResponseEntity со списком YouTube-видео.
     */
    @GetMapping("/videos")
    public ResponseEntity<List<YouTubeVideo>> getAllVideos() {
        return ResponseEntity.ok(videoRepository.findAll());
    }

    /**
     * Сохраняет новое видео в справочник.
     * Если видео с таким ID уже есть, возвращает существующее.
     * @param video объект видео из YouTube.
     * @return ResponseEntity с результатом сохранения.
     */
    @PostMapping("/videos")
    public ResponseEntity<YouTubeVideo> createVideo(@RequestBody YouTubeVideo video) {
        Optional<YouTubeVideo> existing = videoRepository.findById(video.getVideoId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        YouTubeVideo saved = videoRepository.save(video);
        return ResponseEntity.ok(videoRepository.save(saved));
    }

    /**
     * Изменяет информацию о видеоролике.
     * @param id уникальный идентификатор видео (videoId).
     * @param updatedVideo новые данные (название, канал).
     * @return ResponseEntity с обновленным видео.
     */
    @PutMapping("/videos/{id}")
    public ResponseEntity<YouTubeVideo> updateVideo(
            @PathVariable String id,
            @RequestBody YouTubeVideo updatedVideo) {
        updatedVideo.setVideoId(id);
        YouTubeVideo saved = videoRepository.save(updatedVideo);
        return ResponseEntity.ok(saved);
    }

    /**
     * Удаляет видео из справочника.
     * Операция блокируется, если существуют записи о просмотре данного видео пользователями.
     * @param id идентификатор видео для удаления.
     * @return статус операции.
     */
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
