package com.logway.entity;

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

    @Column(name = "domain", nullable = false, length = 255)
    private String domain = "youtube.com";


    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private YouTubeVideo video;
}