package com.logway.repository;

import com.logway.entity.AppSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppSessionRepository extends JpaRepository<AppSession, Long> {
    @Query("SELECT s FROM AppSession s WHERE s.app.processName = :processName")
    List<AppSession> findByAppProcessName(@Param("processName") String processName);
}