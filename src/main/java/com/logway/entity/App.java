package com.logway.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "apps")
@Data
public class App {

    @Id
    @Column(name = "process_name",nullable = false)
    private String processName;

    @Column(name = "base_name")
    private String baseName;
}
