package com.logway.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Сущность PageSession представляет собой запись о посещении конкретной веб-страницы.
 * Хранит информацию о времени начала и окончания просмотра страницы, её заголовке,
 * а также связывает сессию с конкретным сайтом и браузером.
 * Данный класс отображается на таблицу "page_sessions" в базе данных.
 */
@Entity
@Table(name = "page_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageSession {

    /**
     * Уникальный идентификатор сессии страницы.
     * Генерируется автоматически базой данных.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    /** Дата открытия (активации) страницы. */
    @Column(name = "activation_date", nullable = false)
    private LocalDate activationDate;

    /** Время открытия (активации) страницы. */
    @Column(name = "activation_time", nullable = false)
    private LocalTime activationTime;

    /** Дата закрытия страницы или перехода на другую. */
    @Column(name = "shutdown_date")
    private LocalDate shutdownDate;

    /** Время закрытия страницы или перехода на другую. */
    @Column(name = "shutdown_time")
    private LocalTime shutdownTime;

    /**
     * Заголовок веб-страницы.
     * Используется тип TEXT для хранения длинных названий заголовков.
     */
    @Column(name = "page_title", nullable = false, columnDefinition = "TEXT")
    private String pageTitle;

    /**
     * Сайт, к которому относится данная страница.
     * Связь "Многие сессии страниц к Одному сайту".
     */
    @ManyToOne
    @JoinColumn(name = "domain", nullable = false)
    private Site site;

    /**
     * Браузер (приложение), через который открыта страница.
     * Связь "Многие сессии страниц к Одному приложению-браузеру".
     */
    @ManyToOne
    @JoinColumn(name = "browser_name", nullable = false)
    private App browser;

    /**
     * Возвращает объект приложения-браузера, в котором открыта страница.
     * @return объект App, представляющий браузер.
     */
    public App getBrowser() {
        return browser;
    }

    /**
     * Устанавливает приложение-браузер для данной сессии.
     * @param browser экземпляр приложения (например, chrome.exe).
     */
    public void setBrowser(App browser) {
        this.browser = browser;
    }

    /**
     * Возвращает объект сайта, к которому принадлежит страница.
     * @return экземпляр Site.
     */
    public Site getSite() {
        return site;
    }

    /**
     * Устанавливает сайт (домен) для текущей сессии.
     * @param site объект сайта из справочника.
     */
    public void setSite(Site site) {
        this.site = site;
    }

    /**
     * Возвращает полный заголовок просматриваемой веб-страницы.
     * @return текстовый заголовок страницы.
     */
    public String getPageTitle() {
        return pageTitle;
    }

    /**
     * Устанавливает заголовок просматриваемой веб-страницы.
     * @param pageTitle текст заголовка (title) из браузера.
     */
    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle;
    }

    /**
     * Возвращает время закрытия страницы или окончания активности.
     * @return время завершения сессии.
     */
    public LocalTime getShutdownTime() {
        return shutdownTime;
    }

    /**
     * Устанавливает время завершения активности на странице.
     * @param shutdownTime время закрытия.
     */
    public void setShutdownTime(LocalTime shutdownTime) {
        this.shutdownTime = shutdownTime;
    }

    /**
     * Возвращает дату завершения активности на странице.
     * @return дата закрытия сессии.
     */
    public LocalDate getShutdownDate() {
        return shutdownDate;
    }

    /**
     * Устанавливает дату завершения активности на странице.
     * @param shutdownDate дата закрытия.
     */
    public void setShutdownDate(LocalDate shutdownDate) {
        this.shutdownDate = shutdownDate;
    }

    /**
     * Возвращает время открытия (активации) веб-страницы.
     * @return время начала сессии.
     */
    public LocalTime getActivationTime() {
        return activationTime;
    }

    /**
     * Устанавливает время открытия веб-страницы.
     * @param activationTime время начала сессии.
     */
    public void setActivationTime(LocalTime activationTime) {
        this.activationTime = activationTime;
    }

    /**
     * Возвращает дату открытия (активации) веб-страницы.
     * @return дата начала сессии.
     */
    public LocalDate getActivationDate() {
        return activationDate;
    }

    /**
     * Устанавливает дату открытия веб-страницы.
     * @param activationDate дата начала сессии.
     */
    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    /**
     * Возвращает уникальный системный идентификатор сессии.
     * @return ID сессии.
     */
    public Long getSessionId() {
        return sessionId;
    }

    /**
     * Устанавливает системный идентификатор сессии.
     * @param sessionId новый ID сессии.
     */
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
}