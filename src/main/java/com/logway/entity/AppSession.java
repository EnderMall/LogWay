package com.logway.entity;

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

}