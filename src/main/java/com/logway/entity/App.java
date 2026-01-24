package com.logway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


/**
 * Сущность App представляет собой описание десктопного приложения в системе.
 * Используется как справочник для идентификации запущенных процессов и их понятных названий.
 * Данный класс отображается на таблицу "apps" в базе данных.
 */
@Entity
@Table(name = "apps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class App {

    /**
     * Имя исполняемого процесса приложения (например, "chrome.exe").
     * Является первичным ключом (ID) в базе данных.
     */
    @Id
    @Column(name = "process_name",nullable = false)
    private String processName;

    /**
     * Отображаемое название приложения (например, "Google Chrome").
     * Позволяет заменить техническое имя процесса на человекочитаемое.
     */
    @Column(name = "base_name")
    private String baseName;

    /**
     * Возвращает идентификатор процесса.
     * @return строка с именем процесса.
     */
    public String getProcessName() {
        return processName;
    }

    /**
     * Устанавливает идентификатор процесса.
     * @param processName имя исполняемого файла.
     */
    public void setProcessName(String processName) {
        this.processName = processName;
    }

    /**
     * Возвращает базовое название приложения.
     * @return понятное название приложения.
     */
    public String getBaseName() {
        return baseName;
    }

    /**
     * Устанавливает базовое название приложения.
     * @param baseName пользовательское название.
     */
    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }
}