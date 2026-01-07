package com.logway.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "youtube_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeVideo {
    @Id
    @Column(name = "video_id",nullable = false)
    private String videoId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "video_duration",nullable = false)
    private Integer videoDuration;
}