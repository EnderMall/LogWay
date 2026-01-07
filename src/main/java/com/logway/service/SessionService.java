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

@Service
@Transactional
public class SessionService {

    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;

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

    @Transactional
    public AppSession saveAppSession(AppSession session) {
        return appSessionRepository.save(session);
    }

    @Transactional
    public PageSession savePageSession(PageSession session) {
        return pageSessionRepository.save(session);
    }

    @Transactional
    public ViewSession saveViewSession(ViewSession session) {
        return viewSessionRepository.save(session);
    }
}