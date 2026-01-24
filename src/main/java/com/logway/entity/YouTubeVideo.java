package com.logway.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Сущность YouTubeVideo представляет собой справочную запись о конкретном видеоролике с платформы YouTube.
 * Хранит метаданные видео, такие как идентификатор, название, автор и общая длительность.
 * Данный класс отображается на таблицу "youtube_videos" в базе данных.
 */
@Entity
@Table(name = "youtube_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeVideo {

    /**
     * Уникальный идентификатор видео (YouTube Video ID).
     * Служит первичным ключом в базе данных.
     */
    @Id
    @Column(name = "video_id",nullable = false)
    private String videoId;

    /** Название видеоролика. */
    @Column(name = "title", nullable = false)
    private String title;

    /** Автор или название канала, опубликовавшего видео. */
    @Column(name = "author", nullable = false)
    private String author;

    /** Общая продолжительность видеоролика в секундах. */
    @Column(name = "video_duration",nullable = false)
    private Integer videoDuration;

    /**
     * Возвращает уникальный идентификатор видео.
     * @return строка с ID видео.
     */
    public String getVideoId() {
        return videoId;
    }

    /**
     * Устанавливает уникальный идентификатор видео.
     * @param videoId идентификатор из URL YouTube.
     */
    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    /**
     * Возвращает название видео.
     * @return заголовок ролика.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Устанавливает название видео.
     * @param title заголовок ролика.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Возвращает автора (канал) видео.
     * @return имя автора.
     */
    public String getAuthor() {
        return author;
    }

    /**
     * Устанавливает автора (канал) видео.
     * @param author имя автора или название канала.
     */
    public void setAuthor(String author) {
        this.author = author;
    }

    /**
     * Возвращает общую длительность видео.
     * @return длительность в секундах.
     */
    public Integer getVideoDuration() {
        return videoDuration;
    }

    /**
     * Устанавливает общую длительность видео.
     * @param videoDuration время в секундах.
     */
    public void setVideoDuration(Integer videoDuration) {
        this.videoDuration = videoDuration;
    }
}