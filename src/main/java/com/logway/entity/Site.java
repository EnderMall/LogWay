package com.logway.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сущность Site представляет собой запись о веб-ресурсе (сайте) в системе.
 * Служит базовым справочником доменов для последующей привязки сессий посещения страниц
 * и просмотров видеоконтента.
 * Данный класс отображается на таблицу "sites" в базе данных.
 */
@Entity
@Table(name = "sites")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    /**
     * Доменное имя сайта (например, "google.com" или "youtube.com").
     * Является первичным ключом (ID) в базе данных и не может быть пустым.
     */
    @Id
    @Column(name = "domain",nullable = false)
    private String domain;

    /**
     * Возвращает доменное имя сайта.
     * @return строка с доменом.
     */
    public String getDomain() {
        return domain;
    }

    /**
     * Устанавливает доменное имя сайта.
     * @param domain адрес веб-ресурса.
     */
    public void setDomain(String domain) {
        this.domain = domain;
    }

}