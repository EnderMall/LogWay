package com.logway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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
}