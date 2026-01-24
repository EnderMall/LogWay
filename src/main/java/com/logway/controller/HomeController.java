package com.logway.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Основной веб-контроллер для управления навигацией по главным страницам приложения.
 * Служит для связи между сетевыми запросами пользователя и визуальными шаблонами HTML.
 */
@Controller
public class HomeController {

    /**
     * Обрабатывает запрос на получение главной страницы сайта.
     * Вызывается автоматически при переходе пользователя по корневому адресу.
     * @return имя HTML-файла (без расширения), который будет показан пользователю.
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }
}