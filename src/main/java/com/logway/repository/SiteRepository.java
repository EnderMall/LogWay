package com.logway.repository;

import com.logway.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Репозиторий SiteRepository предназначен для управления данными сущности {@link Site}.
 * Предоставляет стандартный набор операций для работы со справочником веб-сайтов
 * в базе данных, используя доменное имя в качестве ключа.
 */
@Repository
public interface SiteRepository extends JpaRepository<Site, String> {
}