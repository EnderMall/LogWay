package com.logway.repository;

import com.logway.entity.AppSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий AppSessionRepository предназначен для управления данными сессий приложений.
 * Обеспечивает стандартные операции CRUD и специализированные запросы для поиска
 * сессий, связанных с конкретными процессами.
 */
@Repository
public interface AppSessionRepository extends JpaRepository<AppSession, Long> {

    /**
     * Выполняет поиск всех сессий активности для указанного приложения.
     * Использует объектно-ориентированный запрос (JPQL) для связи сессии с полем processName сущности App.
     * @param processName уникальное имя процесса (например, "chrome.exe").
     * @return список найденных сессий типа {@link AppSession}.
     */
    @Query("SELECT s FROM AppSession s WHERE s.app.processName = :processName")
    List<AppSession> findByAppProcessName(@Param("processName") String processName);
}