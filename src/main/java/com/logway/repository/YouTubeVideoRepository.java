package com.logway.repository;

import com.logway.entity.YouTubeVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Репозиторий YouTubeVideoRepository предназначен для управления данными сущности {@link YouTubeVideo}.
 * Обеспечивает сохранение и поиск информации о видеороликах в справочнике системы,
 * используя уникальный идентификатор видео (videoId) в качестве ключа.
 */
@Repository
public interface YouTubeVideoRepository extends JpaRepository<YouTubeVideo, String> {

}