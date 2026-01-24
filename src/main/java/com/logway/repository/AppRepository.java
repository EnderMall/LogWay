package com.logway.repository;

import com.logway.entity.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Репозиторий AppRepository предоставляет механизмы доступа к данным сущности {@link App}.
 * Наследует стандартные методы CRUD (создание, чтение, обновление, удаление)
 * из интерфейса JpaRepository.
 */
@Repository
public interface AppRepository extends JpaRepository<App, String> {
}