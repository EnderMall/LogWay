package com.logway.repository;

import com.logway.entity.AppSession;
import org.springframework.stereotype.Repository;

@Repository
public interface AppSessionRepository extends BaseRepository<AppSession, Long> {
}