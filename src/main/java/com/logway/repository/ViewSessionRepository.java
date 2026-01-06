package com.logway.repository;

import com.logway.entity.ViewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewSessionRepository extends JpaRepository<ViewSession, Long> {
}