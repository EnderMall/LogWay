package com.logway.repository;

import com.logway.entity.AppSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppSessionRepository extends JpaRepository<AppSession, Long> {
}