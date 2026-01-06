package com.logway.service;

import com.logway.entity.*;
import com.logway.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class SessionService {

    private final AppSessionRepository appSessionRepository;
    private final PageSessionRepository pageSessionRepository;
    private final ViewSessionRepository viewSessionRepository;
    private final AppRepository appRepository;
    private final SiteRepository siteRepository;
    private final YouTubeVideoRepository videoRepository;

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