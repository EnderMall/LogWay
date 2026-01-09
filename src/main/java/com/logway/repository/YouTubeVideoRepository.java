package com.logway.repository;

import com.logway.entity.YouTubeVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YouTubeVideoRepository extends JpaRepository<YouTubeVideo, String> {

}