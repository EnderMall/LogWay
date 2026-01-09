package com.logway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "app_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppSession {

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

    @Column(name = "window_title", nullable = false, length = 255)
    private String windowTitle;


    @ManyToOne
    @JoinColumn(name = "process_name", nullable = false)
    private App app;

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDate getActivationDate() {
        return activationDate;
    }

    public void setActivationDate(LocalDate activationDate) {
        this.activationDate = activationDate;
    }

    public LocalTime getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(LocalTime activationTime) {
        this.activationTime = activationTime;
    }

    public LocalDate getShutdownDate() {
        return shutdownDate;
    }

    public void setShutdownDate(LocalDate shutdownDate) {
        this.shutdownDate = shutdownDate;
    }

    public LocalTime getShutdownTime() {
        return shutdownTime;
    }

    public void setShutdownTime(LocalTime shutdownTime) {
        this.shutdownTime = shutdownTime;
    }

    public String getWindowTitle() {
        return windowTitle;
    }

    public void setWindowTitle(String windowTitle) {
        this.windowTitle = windowTitle;
    }

    public App getApp() {
        return app;
    }

    public void setApp(App app) {
        this.app = app;
    }
}