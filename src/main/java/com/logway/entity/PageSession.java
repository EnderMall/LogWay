package com.logway.entity;

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

}