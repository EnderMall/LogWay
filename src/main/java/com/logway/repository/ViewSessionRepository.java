package com.logway.repository;

import com.logway.entity.ViewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewSessionRepository extends JpaRepository<ViewSession, Long> {
    @Query("SELECT s FROM ViewSession s WHERE s.site.domain = :domain")
    List<ViewSession> findBySiteDomain(@Param("domain") String domain);

    @Query("SELECT s FROM ViewSession s WHERE s.video.videoId = :videoId")
    List<ViewSession> findByVideoId(@Param("videoId") String videoId);
}