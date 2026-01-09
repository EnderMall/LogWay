package com.logway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "views_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "view_id")
    private Long viewId;

    @Column(name = "activation_date", nullable = false)
    private LocalDate activationDate;

    @Column(name = "activation_time", nullable = false)
    private LocalTime activationTime;

    @Column(name = "shutdown_date")
    private LocalDate shutdownDate;

    @Column(name = "shutdown_time")
    private LocalTime shutdownTime;

    @Column(name = "viewing_time")
    private Integer viewingTime;


    @ManyToOne
    @JoinColumn(name = "domain", nullable = false)
    private Site site;


    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private YouTubeVideo video;

    public Long getViewId() {
        return viewId;
    }

    public void setViewId(Long viewId) {
        this.viewId = viewId;
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

    public Integer getViewingTime() {
        return viewingTime;
    }

    public void setViewingTime(Integer viewingTime) {
        this.viewingTime = viewingTime;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public YouTubeVideo getVideo() {
        return video;
    }

    public void setVideo(YouTubeVideo video) {
        this.video = video;
    }
}