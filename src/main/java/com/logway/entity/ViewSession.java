package com.logway.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Сущность ViewSession представляет собой запись о конкретном сеансе просмотра видеоконтента.
 * Хранит временные метки начала и окончания просмотра, общую продолжительность сессии,
 * а также устанавливает связи с веб-сайтом и конкретным видеороликом.
 * Данный класс отображается на таблицу "views_sessions" в базе данных.
 */
@Entity
@Table(name = "views_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewSession {

    /**
     * Уникальный системный идентификатор сессии просмотра.
     * Генерируется автоматически на стороне базы данных.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "view_id")
    private Long viewId;

    /** Дата начала просмотра видео. */
    @Column(name = "activation_date", nullable = false)
    private LocalDate activationDate;

    /** Время начала просмотра видео. */
    @Column(name = "activation_time", nullable = false)
    private LocalTime activationTime;

    /** Дата завершения просмотра видео. */
    @Column(name = "shutdown_date")
    private LocalDate shutdownDate;

    /** Время завершения просмотра видео. */
    @Column(name = "shutdown_time")
    private LocalTime shutdownTime;

    /**
     * Чистое время просмотра видеоконтента в секундах.
     * Позволяет анализировать фактическую вовлеченность пользователя.
     */
    @Column(name = "viewing_time")
    private Integer viewingTime;

    /**
     * Сайт, на котором производился просмотр (например, youtube.com).
     * Связь "Многие сессии просмотра к Одному сайту".
     */
    @ManyToOne
    @JoinColumn(name = "domain", nullable = false)
    private Site site;

    /**
     * Видеоролик, который просматривался в рамках данной сессии.
     * Связь "Многие сессии просмотра к Одному YouTube видео".
     */
    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private YouTubeVideo video;

    /**
     * Возвращает уникальный идентификатор записи просмотра.
     * @return идентификатор сессии просмотра.
     */
    public Long getViewId() {
        return viewId;
    }

    /**
     * Устанавливает идентификатор записи просмотра.
     * @param viewId новый идентификатор сессии.
     */
    public void setViewId(Long viewId) {
        this.viewId = viewId;
    }

    /**
     * Возвращает дату начала сессии просмотра.
     * @return дата активации сессии.
     */
    public LocalDate getActivationDate() {
        return activationDate;
    }

    /**
     * Устанавливает дату начала сессии просмотра.
     * @param activationDate дата запуска видео.
     */
    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    /**
     * Возвращает время начала сессии просмотра.
     * @return время активации сессии.
     */
    public LocalTime getActivationTime() {
        return activationTime;
    }

    /**
     * Устанавливает время начала сессии просмотра.
     * @param activationTime время запуска видео.
     */
    public void setActivationTime(LocalTime activationTime) {
        this.activationTime = activationTime;
    }

    /**
     * Возвращает дату окончания сессии просмотра.
     * @return дата закрытия видео.
     */
    public LocalDate getShutdownDate() {
        return shutdownDate;
    }

    /**
     * Устанавливает дату окончания сессии просмотра.
     * @param shutdownDate дата остановки видео.
     */
    public void setShutdownDate(LocalDate shutdownDate) {
        this.shutdownDate = shutdownDate;
    }

    /**
     * Возвращает время окончания сессии просмотра.
     * @return время остановки видео.
     */
    public LocalTime getShutdownTime() {
        return shutdownTime;
    }

    /**
     * Устанавливает время окончания сессии просмотра.
     * @param shutdownTime время остановки видео.
     */
    public void setShutdownTime(LocalTime shutdownTime) {
        this.shutdownTime = shutdownTime;
    }

    /**
     * Возвращает суммарное время нахождения пользователя в просмотре.
     * @return время просмотра в секундах.
     */
    public Integer getViewingTime() {
        return viewingTime;
    }

    /**
     * Устанавливает суммарное время просмотра.
     * @param viewingTime фактическое время просмотра.
     */
    public void setViewingTime(Integer viewingTime) {
        this.viewingTime = viewingTime;
    }

    /**
     * Возвращает объект сайта, связанного с этой сессией.
     * @return экземпляр Site.
     */
    public Site getSite() {
        return site;
    }

    /**
     * Устанавливает сайт, через который просматривается видео.
     * @param site объект сайта из базы данных.
     */
    public void setSite(Site site) {
        this.site = site;
    }

    /**
     * Возвращает объект просматриваемого YouTube видео.
     * @return экземпляр YouTubeVideo.
     */
    public YouTubeVideo getVideo() {
        return video;
    }

    /**
     * Связывает текущую сессию с конкретным видеороликом.
     * @param video объект видео для привязки.
     */
    public void setVideo(YouTubeVideo video) {
        this.video = video;
    }
}