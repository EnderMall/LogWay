package com.logway.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Сущность AppSession представляет собой запись об отдельном периоде активности приложения.
 * Хранит информацию о времени запуска, завершения и заголовке окна программы.
 * Данный класс отображается на таблицу "app_sessions" в базе данных.
 */
@Entity
@Table(name = "app_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppSession {

    /**
     * Уникальный идентификатор сессии.
     * Генерируется автоматически базой данных (автоинкремент).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    /** Дата активации (запуска) приложения. */
    @Column(name = "activation_date", nullable = false)
    private LocalDate activationDate;

    /** Время активации (запуска) приложения. */
    @Column(name = "activation_time", nullable = false)
    private LocalTime activationTime;

    /** Дата завершения работы или закрытия окна приложения. */
    @Column(name = "shutdown_date")
    private LocalDate shutdownDate;

    /** Время завершения работы или закрытия окна приложения. */
    @Column(name = "shutdown_time")
    private LocalTime shutdownTime;

    /** Заголовок окна приложения в момент фиксации активности. */
    @Column(name = "window_title", nullable = false, length = 255)
    private String windowTitle;

    /**
     * Ссылка на приложение, к которому относится данная сессия.
     * Реализует связь "Многие сессии к Одному приложению".
     */
    @ManyToOne
    @JoinColumn(name = "process_name", nullable = false)
    private App app;

    /**
     * Получает уникальный идентификатор сессии.
     * @return ID сессии.
     */
    public Long getSessionId() {
        return sessionId;
    }

    /**
     * Устанавливает уникальный идентификатор сессии.
     * @param sessionId новый ID сессии.
     */
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * Получает дату активации приложения.
     * @return дата начала сессии.
     */
    public LocalDate getActivationDate() {
        return activationDate;
    }

    /**
     * Устанавливает дату активации приложения.
     * @param activationDate дата начала сессии.
     */
    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    /**
     * Получает время активации приложения.
     * @return время начала сессии.
     */
    public LocalTime getActivationTime() {
        return activationTime;
    }

    /**
     * Устанавливает время активации приложения.
     * @param activationTime время начала сессии.
     */
    public void setActivationTime(LocalTime activationTime) {
        this.activationTime = activationTime;
    }

    /**
     * Получает дату завершения работы приложения.
     * @return дата окончания сессии.
     */
    public LocalDate getShutdownDate() {
        return shutdownDate;
    }

    /**
     * Устанавливает дату завершения работы приложения.
     * @param shutdownDate дата окончания сессии.
     */
    public void setShutdownDate(LocalDate shutdownDate) {
        this.shutdownDate = shutdownDate;
    }

    /**
     * Получает время завершения работы приложения.
     * @return время окончания сессии.
     */
    public LocalTime getShutdownTime() {
        return shutdownTime;
    }

    /**
     * Устанавливает время завершения работы приложения.
     * @param shutdownTime время окончания сессии.
     */
    public void setShutdownTime(LocalTime shutdownTime) {
        this.shutdownTime = shutdownTime;
    }

    /**
     * Получает заголовок окна приложения.
     * @return строка с заголовком окна.
     */
    public String getWindowTitle() {
        return windowTitle;
    }

    /**
     * Устанавливает заголовок окна приложения.
     * @param windowTitle текст заголовка окна.
     */
    public void setWindowTitle(String windowTitle) {
        this.windowTitle = windowTitle;
    }

    /**
     * Получает объект приложения, связанного с данной сессией.
     * @return экземпляр App.
     */
    public App getApp() {
        return app;
    }

    /**
     * Устанавливает связь сессии с конкретным приложением.
     * @param app объект приложения.
     */
    public void setApp(App app) {
        this.app = app;
    }
}