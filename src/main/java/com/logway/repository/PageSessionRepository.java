package com.logway.repository;

import com.logway.entity.PageSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface PageSessionRepository extends JpaRepository<PageSession, Long> {
    @Query("SELECT s FROM PageSession s WHERE s.site.domain = :domain")
    List<PageSession> findBySiteDomain(@Param("domain") String domain);

    @Query("SELECT s FROM PageSession s WHERE s.browser.processName = :processName")
    List<PageSession> findByBrowserProcessName(@Param("processName") String processName);
}