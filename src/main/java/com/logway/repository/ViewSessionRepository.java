package com.logway.repository;

import com.logway.entity.ViewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий ViewSessionRepository обеспечивает доступ к данным сессий просмотра видео.
 * Позволяет выполнять выборку историй просмотров, фильтруя их по конкретным доменам сайтов
 * или уникальным идентификаторам видеороликов YouTube.
 */
@Repository
public interface ViewSessionRepository extends JpaRepository<ViewSession, Long> {
    /**
     * Находит все сессии просмотра видео, зафиксированные на конкретном сайте.
     * Используется для анализа активности пользователя на определенных ресурсах (например, youtube.com).
     * @param domain доменное имя сайта.
     * @return список сессий просмотра, связанных с указанным доменом.
     */
    @Query("SELECT s FROM ViewSession s WHERE s.site.domain = :domain")
    List<ViewSession> findBySiteDomain(@Param("domain") String domain);

    /**
     * Находит все сессии просмотра для конкретного видеоролика.
     * Позволяет определить, сколько раз и когда просматривалось конкретное видео.
     * @param videoId уникальный идентификатор видео YouTube.
     * @return список сессий просмотра для данного видео.
     */
    @Query("SELECT s FROM ViewSession s WHERE s.video.videoId = :videoId")
    List<ViewSession> findByVideoId(@Param("videoId") String videoId);
}