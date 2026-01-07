package com.logway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "apps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class App {

    @Id
    @Column(name = "process_name",nullable = false)
    private String processName;

    @Column(name = "base_name")
    private String baseName;

    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AppSession> appSessions = new ArrayList<>();

    @OneToMany(mappedBy = "browser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PageSession> pageSessionsAsBrowser = new ArrayList<>();


}