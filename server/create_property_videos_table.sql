-- Create property_videos table for YouTube video integration
-- This table stores YouTube video links associated with properties

CREATE TABLE `property_videos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` bigint(20) unsigned NOT NULL,
  `video_url` varchar(255) NOT NULL COMMENT 'YouTube URL',  
  `thumbnail_url` varchar(255) DEFAULT NULL, 

  PRIMARY KEY (`id`),
  KEY `property_videos_property_id_foreign` (`property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better performance
ALTER TABLE `property_videos`
  ADD CONSTRAINT `property_videos_property_id_foreign`
  FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE; 

-- -- Sample data for property_videos table
-- INSERT INTO `property_videos` (`property_id`, `video_url`, `thumbnail_url`)
-- VALUES
--   (104, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'),
--   (104, 'https://www.youtube.com/watch?v=9bZkp7q19f0', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg');



