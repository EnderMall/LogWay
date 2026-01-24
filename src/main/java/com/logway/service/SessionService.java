package com.logway.service;

import com.logway.entity.AppSession;
import com.logway.entity.PageSession;
import com.logway.entity.ViewSession;
import com.logway.repository.AppSessionRepository;
import com.logway.repository.PageSessionRepository;
import com.logway.repository.ViewSessionRepository;
import com.logway.repository.AppRepository;
import com.logway.repository.SiteRepository;
import com.logway.repository.YouTubeVideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Сервис SessionService отвечает за бизнес-логику управления сессиями активности.
 * Обеспечивает безопасное сохранение данных о работе приложений, веб-страниц и видео
 * в рамках транзакций базы данных.
 */
@Service
@Transactional
public class SessionService {

    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;

    /**
     * Конструктор для внедрения зависимостей репозиториев.
     */
    public SessionService(AppSessionRepository appSessionRepository,
                          PageSessionRepository pageSessionRepository,
                          ViewSessionRepository viewSessionRepository,
                          AppRepository appRepository,
                          SiteRepository siteRepository,
                          YouTubeVideoRepository videoRepository) {
        this.appSessionRepository = appSessionRepository;
        this.pageSessionRepository = pageSessionRepository;
        this.viewSessionRepository = viewSessionRepository;
        this.appRepository = appRepository;
        this.siteRepository = siteRepository;
        this.videoRepository = videoRepository;
    }

    /**
     * Сохраняет сессию использования приложения в базе данных.
     * @param session объект сессии приложения.
     * @return сохраненный объект с присвоенным ID.
     */
    @Transactional
    public AppSession saveAppSession(AppSession session) {
        return appSessionRepository.save(session);
    }

    /**
     * Сохраняет сессию посещения веб-страницы в базе данных.
     * @param session объект сессии страницы.
     * @return сохраненный объект с присвоенным ID.
     */
    @Transactional
    public PageSession savePageSession(PageSession session) {
        return pageSessionRepository.save(session);
    }

    /**
     * Сохраняет сессию просмотра видеоролика в базе данных.
     * @param session объект сессии просмотра.
     * @return сохраненный объект с присвоенным ID.
     */
    @Transactional
    public ViewSession saveViewSession(ViewSession session) {
        return viewSessionRepository.save(session);
    }
}