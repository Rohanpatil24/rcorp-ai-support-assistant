-- ====================================================================
-- R Corporation AI Support Assistant - MySQL Database Schema
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `rcorp_support_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rcorp_support_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `contact_inquiries`;
DROP TABLE IF EXISTS `knowledge_base`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `chat_sessions`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. Users Table (Core Auth & RBAC)
-- --------------------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `fullname` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `mobile` VARCHAR(25) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'support_agent', 'admin', 'super_admin') NOT NULL DEFAULT 'customer',
    `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Profiles Table (User Metadata & Preferences)
-- --------------------------------------------------------------------
CREATE TABLE `profiles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
    `avatar` VARCHAR(500) NULL,
    `company_name` VARCHAR(150) NULL,
    `designation` VARCHAR(100) NULL,
    `notification_preferences` JSON NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. ChatSessions Table (User Support Conversations)
-- --------------------------------------------------------------------
CREATE TABLE `chat_sessions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `session_uuid` VARCHAR(64) NOT NULL UNIQUE,
    `user_id` BIGINT UNSIGNED NULL,
    `guest_session_id` VARCHAR(100) NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'New Support Conversation',
    `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_time` TIMESTAMP NULL,
    `status` ENUM('active', 'resolved', 'escalated', 'closed') NOT NULL DEFAULT 'active',
    `satisfaction_score` TINYINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chatsessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_chatsessions_user` (`user_id`),
    INDEX `idx_chatsessions_uuid` (`session_uuid`),
    INDEX `idx_chatsessions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Messages Table (Conversations + Emotion Intelligence)
-- --------------------------------------------------------------------
CREATE TABLE `messages` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `session_id` BIGINT UNSIGNED NOT NULL,
    `sender` ENUM('customer', 'ai_assistant', 'human_agent', 'system') NOT NULL,
    `message` TEXT NOT NULL,
    `sentiment` ENUM('Positive', 'Neutral', 'Negative') NOT NULL DEFAULT 'Neutral',
    `emotion` ENUM('Happy', 'Satisfied', 'Neutral', 'Confused', 'Frustrated', 'Angry', 'Urgent', 'Disappointed') NOT NULL DEFAULT 'Neutral',
    `confidence_score` DECIMAL(5, 2) NOT NULL DEFAULT 85.00,
    `retrieved_doc_sources` JSON NULL,
    `is_escalation_trigger` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_messages_session` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE,
    INDEX `idx_messages_session` (`session_id`),
    INDEX `idx_messages_emotion` (`emotion`),
    INDEX `idx_messages_sentiment` (`sentiment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Tickets Table (Lifecycle & Escalation Management)
-- --------------------------------------------------------------------
CREATE TABLE `tickets` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_number` VARCHAR(32) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('Open', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
    `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
    `created_by` BIGINT UNSIGNED NOT NULL,
    `assigned_to` BIGINT UNSIGNED NULL,
    `source_session_id` BIGINT UNSIGNED NULL,
    `resolution_notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tickets_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tickets_assignee` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tickets_session` FOREIGN KEY (`source_session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE SET NULL,
    INDEX `idx_tickets_number` (`ticket_number`),
    INDEX `idx_tickets_status` (`status`),
    INDEX `idx_tickets_priority` (`priority`),
    INDEX `idx_tickets_creator` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. KnowledgeBase Table (RAG Documents & Embeddings Registry)
-- --------------------------------------------------------------------
CREATE TABLE `knowledge_base` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `document_name` VARCHAR(255) NOT NULL,
    `document_type` ENUM('PDF', 'DOCX', 'FAQ', 'SOP', 'POLICY', 'MANUAL') NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'General',
    `vector_id` VARCHAR(128) NOT NULL,
    `file_path` VARCHAR(500) NULL,
    `file_size_kb` INT UNSIGNED NOT NULL DEFAULT 0,
    `total_chunks` INT UNSIGNED NOT NULL DEFAULT 1,
    `content_summary` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `uploaded_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_kb_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_kb_docname` (`document_name`),
    INDEX `idx_kb_type` (`document_type`),
    INDEX `idx_kb_vector` (`vector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. ContactInquiries Table (Leads & Demo Requests)
-- --------------------------------------------------------------------
CREATE TABLE `contact_inquiries` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `company` VARCHAR(150) NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `is_demo_request` BOOLEAN NOT NULL DEFAULT FALSE,
    `status` ENUM('New', 'Contacted', 'Qualified', 'Closed') NOT NULL DEFAULT 'New',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_contact_email` (`email`),
    INDEX `idx_contact_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Triggers for Ticket Number Auto-Generation
-- --------------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER `trg_before_insert_ticket`
BEFORE INSERT ON `tickets`
FOR EACH ROW
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        SET NEW.ticket_number = CONCAT('RCORP-', LPAD(FLOOR(RAND() * 900000 + 100000), 6, '0'));
    END IF;
END$$
DELIMITER ;
