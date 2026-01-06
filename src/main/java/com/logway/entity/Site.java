package com.logway.entity;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "sites")
@Data

public class Site {
    @Id
    @Column(name = "domain",nullable = false)
    private String domain;
}