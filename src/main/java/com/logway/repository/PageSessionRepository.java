package com.logway.repository;

import com.logway.entity.PageSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Репозиторий PageSessionRepository предоставляет доступ к данным сессий посещения веб-страниц.
 * Помимо стандартных операций, содержит специализированные методы для поиска сессий
 * по конкретным сайтам и используемым браузерам.
 */
@Repository
public interface PageSessionRepository extends JpaRepository<PageSession, Long> {

    /**
     * Выполняет поиск всех сессий посещения для указанного домена.
     * Используется для проверки наличия активности по конкретному сайту.
     * @param domain доменное имя сайта (например, "google.com").
     * @return список сессий страниц, связанных с данным доменом.
     */
    @Query("SELECT s FROM PageSession s WHERE s.site.domain = :domain")
    List<PageSession> findBySiteDomain(@Param("domain") String domain);

    /**
     * Находит все сессии страниц, открытые через конкретный браузер.
     * @param processName системное имя процесса браузера (например, "chrome.exe").
     * @return список сессий, запущенных в данном браузере.
     */
    @Query("SELECT s FROM PageSession s WHERE s.browser.processName = :processName")
    List<PageSession> findByBrowserProcessName(@Param("processName") String processName);
}