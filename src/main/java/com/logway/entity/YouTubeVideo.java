package com.logway.entity;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "youtube_videos")
@Data

public class YouTubeVideo {
    @Id
    @Column(name = "video_id",nullable = false)
    private String video_id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "video_duration",nullable = false)
    private Integer video_duration;
}