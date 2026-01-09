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



    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }

    public String getBaseName() {
        return baseName;
    }

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }
}