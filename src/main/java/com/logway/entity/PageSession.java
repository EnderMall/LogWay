package com.logway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "page_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "activation_date", nullable = false)
    private LocalDate activationDate;

    @Column(name = "activation_time", nullable = false)
    private LocalTime activationTime;

    @Column(name = "shutdown_date")
    private LocalDate shutdownDate;

    @Column(name = "shutdown_time")
    private LocalTime shutdownTime;

    @Column(name = "page_title", nullable = false, columnDefinition = "TEXT")
    private String pageTitle;


    @ManyToOne
    @JoinColumn(name = "domain", nullable = false)
    private Site site;


    @ManyToOne
    @JoinColumn(name = "browser_name", nullable = false)
    private App browser;

    public App getBrowser() {
        return browser;
    }

    public void setBrowser(App browser) {
        this.browser = browser;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public String getPageTitle() {
        return pageTitle;
    }

    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle;
    }

    public LocalTime getShutdownTime() {
        return shutdownTime;
    }

    public void setShutdownTime(LocalTime shutdownTime) {
        this.shutdownTime = shutdownTime;
    }

    public LocalDate getShutdownDate() {
        return shutdownDate;
    }

    public void setShutdownDate(LocalDate shutdownDate) {
        this.shutdownDate = shutdownDate;
    }

    public LocalTime getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(LocalTime activationTime) {
        this.activationTime = activationTime;
    }

    public LocalDate getActivationDate() {
        return activationDate;
    }

    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
}