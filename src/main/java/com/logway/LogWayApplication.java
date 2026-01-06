package com.logway;

import com.logway.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@SpringBootApplication
public class LogWayApplication {

    public static void main(String[] args) {
        try {
            File file = new File("UserData.txt");
            if (!file.exists()) {
                String dbUser = null;
                String dbPassword = null;
                String dbPort =null;
                Scanner scanner = new Scanner(System.in);

                System.out.println("=== Настройка LogWay ===");
                System.out.print("Введите логин пользователя БД: ");
                dbUser = scanner.nextLine();

                System.out.print("Введите пароль пользователя БД: ");
                dbPassword = scanner.nextLine();

                System.out.print("Введите порт для БД: ");
                dbPort = scanner.nextLine();
                scanner.close();

                Files.writeString(Paths.get("UserData.txt"),"username="+dbUser+"\npassword="
                        +dbPassword+"\nport="+dbPort);

            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        createDatabase();

        SpringApplication.run(LogWayApplication.class, args);
    }
    public static void createDatabase(){
        try {
            List<String> ost = new ArrayList<>();
            List<String> lines = Files.readAllLines(Paths.get("UserData.txt"));
            for (String line:lines){
                String arg = line.split("=")[1].trim();
                ost.add(arg);
            }

            Connection conn = DriverManager.getConnection(
                    "jdbc:postgresql://localhost:"+ost.get(2)+"/postgres",
                    ost.get(0),
                    ost.get(1)
            );
            String yaml = Files.readString(Paths.get("src/main/resources/application.yml"));
            yaml = yaml.replaceAll(
                    "(localhost:)\\d+(/logway_db)",
                    "$1" +  ost.get(2) + "$2"
            );
            yaml = yaml.replaceAll(
                    "(username:\\s*).*",
                    "$1" +  ost.get(0)
            );
            yaml = yaml.replaceAll(
                    "(password:\\s*).*",
                    "$1" +  ost.get(1)
            );
            Files.writeString(Paths.get("src/main/resources/application.yml"), yaml);

            System.setProperty("spring.datasource.url",
                    "jdbc:postgresql://localhost:" + ost.get(2) + "/logway_db");
            System.setProperty("spring.datasource.username", ost.get(0));
            System.setProperty("spring.datasource.password", ost.get(1));
            System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                    "SELECT 1 FROM pg_database WHERE datname = 'logway_db'"
            );

            if (!rs.next()) {
                stmt.executeUpdate("CREATE DATABASE logway_db");
            }
            createTables(conn);
            rs.close();
            conn.close();

        } catch (Exception e) {
            System.err.println(e.getMessage());
        }

    }
    private static void createTables(Connection conn) {
        try {
            Statement stmt = conn.createStatement();
            String[] createTableQueries = {
                    // apps table
                    "CREATE TABLE IF NOT EXISTS apps (" +
                            "    process_name VARCHAR(255) NOT NULL, " +
                            "    base_name TEXT, " +
                            "    PRIMARY KEY(process_name)" +
                            ")",

                    // sites table
                    "CREATE TABLE IF NOT EXISTS sites (" +
                            "    domain VARCHAR(255) NOT NULL, " +
                            "    PRIMARY KEY(domain)" +
                            ")",

                    // youtube_videos table
                    "CREATE TABLE IF NOT EXISTS youtube_videos (" +
                            "    video_id VARCHAR(255) NOT NULL, " +
                            "    title TEXT NOT NULL, " +
                            "    author TEXT NOT NULL, " +
                            "    video_duration INTEGER NOT NULL, " +
                            "    PRIMARY KEY(video_id)" +
                            ")",

                    // page_sessions table
                    "CREATE TABLE IF NOT EXISTS page_sessions (" +
                            "    session_id SERIAL NOT NULL, " +
                            "    activation_date DATE NOT NULL, " +
                            "    activation_time TIME NOT NULL, " +
                            "    shutdown_date DATE, " +
                            "    shutdown_time TIME, " +
                            "    domain VARCHAR(255) NOT NULL, " +
                            "    page_title TEXT NOT NULL, " +
                            "    browser_name VARCHAR(255) NOT NULL, " +
                            "    PRIMARY KEY(session_id), " +
                            "    FOREIGN KEY (domain) REFERENCES sites(domain) " +
                            "        ON UPDATE CASCADE ON DELETE RESTRICT, " +
                            "    FOREIGN KEY (browser_name) REFERENCES apps(process_name) " +
                            "        ON UPDATE CASCADE ON DELETE RESTRICT" +
                            ")",

                    // app_sessions table
                    "CREATE TABLE IF NOT EXISTS app_sessions (" +
                            "    session_id SERIAL NOT NULL, " +
                            "    activation_date DATE NOT NULL, " +
                            "    activation_time TIME NOT NULL, " +
                            "    shutdown_date DATE, " +
                            "    shutdown_time TIME, " +
                            "    process_name VARCHAR(255) NOT NULL, " +
                            "    window_title VARCHAR(255) NOT NULL, " +
                            "    PRIMARY KEY(session_id), " +
                            "    FOREIGN KEY (process_name) REFERENCES apps(process_name) " +
                            "        ON UPDATE CASCADE ON DELETE RESTRICT" +
                            ")",

                    // views_sessions table
                    "CREATE TABLE IF NOT EXISTS views_sessions (" +
                            "    view_id SERIAL NOT NULL, " +
                            "    activation_date DATE NOT NULL, " +
                            "    activation_time TIME NOT NULL, " +
                            "    shutdown_date DATE, " +
                            "    shutdown_time TIME, " +
                            "    video_id VARCHAR(255) NOT NULL, " +
                            "    viewing_time INTEGER, " +
                            "    domain VARCHAR(255) NOT NULL DEFAULT 'youtube.com', " +
                            "    PRIMARY KEY(view_id), " +
                            "    FOREIGN KEY (video_id) REFERENCES youtube_videos(video_id) " +
                            "        ON UPDATE CASCADE ON DELETE RESTRICT, " +
                            "    FOREIGN KEY (domain) REFERENCES sites(domain) " +
                            "        ON UPDATE CASCADE ON DELETE RESTRICT" +
                            ")"
            };

            for (String query : createTableQueries) {
                stmt.executeUpdate(query);
            }
            stmt.close();

        } catch (Exception e) {
            System.err.println("Ошибка при создании таблиц: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
