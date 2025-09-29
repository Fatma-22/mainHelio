-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 23, 2025 at 08:54 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u994232507_onlyhelio`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `actor_id` int(11) NOT NULL,
  `actor_type` enum('user','staff') NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `actor_id`, `actor_type`, `action`, `entity_type`, `entity_id`, `created_at`) VALUES
(1, 1, 'user', 'view', 'property', 1, '2025-08-26 10:54:58'),
(2, 2, 'user', 'like', 'property', 2, '2025-08-26 10:54:58'),
(3, 1, 'staff', 'create', 'property', 3, '2025-08-26 10:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name_ar`, `name_en`) VALUES
(1, 'تكييف مركزي', 'Central AC'),
(2, 'مدفأة', 'Fireplace'),
(3, 'حوض سباحة', 'Swimming Pool'),
(4, 'جاكوزي', 'Jacuzzi'),
(5, 'شرفة', 'Balcony'),
(6, 'حديقة', 'Garden'),
(7, 'موقف سيارات', 'Parking'),
(8, 'أمن 24/7', '24/7 Security'),
(9, 'صالة ألعاب رياضية', 'Gym'),
(10, 'ملعب تنس', 'Tennis Court');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `content_ar` text NOT NULL,
  `content_en` text NOT NULL,
  `cover_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title_ar`, `title_en`, `content_ar`, `content_en`, `cover_url`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'نصائح لشراء أول عقار لك', 'Tips for Buying Your First Property', 'نصائح مهمة يجب معرفتها قبل شراء أول عقار لك...', 'Important tips to know before buying your first property...', '/images/blog/post1.jpg', '2025-08-26 10:54:58', '2025-08-26 10:54:58', '2025-08-26 10:54:58'),
(2, 'أحدث trends في الديكور الداخلي', 'Latest Trends in Interior Decor', 'أحدث صيحات الديكور الداخلي لعام 2023...', 'Latest interior decor trends for 2023...', '/images/blog/post2.jpg', '2025-08-26 10:54:58', '2025-08-26 10:54:58', '2025-08-26 10:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `prefered_contact_times` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `type` enum('buyer','seller','finishing','decor') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `prefered_contact_times`, `email`, `type`, `notes`, `created_at`, `updated_at`, `created_by`) VALUES
(3, 'نادر بشار', '01044332264', NULL, 'nader@example.com', 'buyer', 'اريد شراء فيلا فى القاهرة الجديدة', '2025-08-28 06:09:34', '2025-08-31 07:36:23', 1),
(4, 'محمد', '01044332211', NULL, 'mohamed@example.com', 'buyer', 'اريد شراء فيلا فى القاهرة الجديدة', '2025-08-28 06:10:54', '2025-08-29 07:19:53', 1),
(11, 'فاطمة', '12345678', 'morning', 'fatma@example.com', 'seller', NULL, '2025-08-31 11:17:42', '2025-08-31 11:17:42', NULL),
(12, 'فاطمة جمال', '34343434', NULL, NULL, 'buyer', NULL, '2025-08-31 15:31:41', '2025-08-31 15:31:41', NULL),
(13, 'فاطمة جمال', '01011991431', NULL, NULL, 'buyer', NULL, '2025-09-01 06:28:40', '2025-09-01 06:28:40', NULL),
(14, 'fatma gamal', '6326236763', NULL, NULL, 'buyer', NULL, '2025-09-01 06:59:40', '2025-09-01 06:59:40', NULL),
(15, 'ىىى', '1234567890', NULL, NULL, 'buyer', NULL, '2025-09-01 07:06:56', '2025-09-01 07:06:56', NULL),
(16, 'fatma gamal', '734676ق47', NULL, NULL, 'buyer', NULL, '2025-09-01 07:10:04', '2025-09-01 07:10:04', NULL),
(17, 'سجى', '032558585', 'morning', 'fatma@example.com', 'seller', NULL, '2025-09-01 19:35:51', '2025-09-01 19:35:51', NULL),
(18, 'محمد', '9999999', 'afternoon', 'fatma@example.com', 'seller', NULL, '2025-09-01 19:39:40', '2025-09-01 19:39:40', NULL),
(19, 'Test', '5678', NULL, NULL, 'buyer', NULL, '2025-09-03 08:41:24', '2025-09-03 08:41:24', NULL),
(20, 'test2', '7654', NULL, NULL, 'buyer', NULL, '2025-09-03 08:41:50', '2025-09-03 08:41:50', NULL),
(21, 'test3', '87t3', NULL, NULL, 'buyer', NULL, '2025-09-03 08:42:06', '2025-09-03 08:42:06', NULL),
(22, 'تامر الشافعي', '01063335517', 'afternoon', NULL, 'seller', NULL, '2025-09-08 15:34:02', '2025-09-08 15:34:02', NULL),
(23, 'test 4', '011111111', NULL, NULL, 'buyer', NULL, '2025-09-10 09:47:07', '2025-09-10 09:47:07', NULL),
(24, 'test 4', '01111', NULL, NULL, 'buyer', NULL, '2025-09-10 09:47:52', '2025-09-10 09:47:52', NULL),
(25, 'Maha saber mansour', '+201014587122', NULL, NULL, 'buyer', NULL, '2025-09-13 21:12:41', '2025-09-20 14:38:41', NULL),
(26, 'm', '01', NULL, NULL, 'buyer', NULL, '2025-09-13 21:16:14', '2025-09-13 21:16:14', NULL),
(27, 'Test 4', '01111111111', NULL, NULL, 'buyer', NULL, '2025-09-14 06:59:16', '2025-09-14 06:59:16', NULL),
(28, '..', '2222', NULL, NULL, 'buyer', NULL, '2025-09-14 07:03:47', '2025-09-14 07:03:47', NULL),
(29, 'Test4.', '0000', NULL, NULL, 'buyer', NULL, '2025-09-14 07:04:16', '2025-09-14 07:04:16', NULL),
(30, 'Test 4', '000', NULL, NULL, 'buyer', NULL, '2025-09-14 07:04:56', '2025-09-14 07:04:56', NULL),
(31, '...', '00', NULL, NULL, 'buyer', NULL, '2025-09-14 07:06:30', '2025-09-14 07:06:30', NULL),
(32, 'Test 4', '0', NULL, NULL, 'buyer', NULL, '2025-09-14 07:06:49', '2025-09-14 07:06:49', NULL),
(33, 'فاطمة', '010119914131', 'morning', 'FATMA@GMAIL.COM', 'seller', NULL, '2025-09-14 09:07:47', '2025-09-14 09:07:47', NULL),
(34, 'سجى', '01022655447', 'morning', 'FATMA@GMAIL.COM', 'seller', NULL, '2025-09-14 12:05:48', '2025-09-14 12:05:48', NULL),
(35, 'test 4', '91 80056 65780', NULL, NULL, 'buyer', NULL, '2025-09-14 19:37:54', '2025-09-14 19:37:54', NULL),
(36, 'test 5', '1284701288', NULL, NULL, 'buyer', NULL, '2025-09-14 19:38:09', '2025-09-14 19:38:09', NULL),
(37, 'shimaa elsayed fouad', 'hjfjgffjyfjyjfjf', NULL, NULL, 'buyer', NULL, '2025-09-14 19:39:49', '2025-09-14 19:39:49', NULL),
(38, 'esraa elsayed', '01284362', NULL, NULL, 'buyer', NULL, '2025-09-14 19:43:42', '2025-09-14 19:43:42', NULL),
(39, 'alaa', '012hhghg', NULL, NULL, 'buyer', NULL, '2025-09-14 19:44:28', '2025-09-14 19:44:28', NULL),
(40, 'sh', '012847012', NULL, NULL, 'buyer', NULL, '2025-09-14 19:46:53', '2025-09-14 19:46:53', NULL),
(41, 'e', '01284701288', NULL, NULL, 'buyer', NULL, '2025-09-14 19:47:20', '2025-09-14 19:47:20', NULL),
(42, 'elsayed ali', '01064161382', NULL, NULL, 'buyer', NULL, '2025-09-14 19:56:26', '2025-09-14 19:56:26', NULL),
(43, 'we', '+201284701288', NULL, NULL, 'buyer', NULL, '2025-09-14 19:57:16', '2025-09-14 19:57:16', NULL),
(44, 'aya', '01284701255', NULL, NULL, 'buyer', NULL, '2025-09-14 19:59:44', '2025-09-14 19:59:44', NULL),
(45, 'ee', '128 470 1288', NULL, NULL, 'buyer', NULL, '2025-09-14 20:01:04', '2025-09-14 20:01:04', NULL),
(46, 'r', '01555909568', NULL, NULL, 'buyer', NULL, '2025-09-14 20:01:33', '2025-09-14 20:01:33', NULL),
(47, 'salma', '+20 12 84701288', NULL, NULL, 'buyer', NULL, '2025-09-14 20:06:23', '2025-09-14 20:06:23', NULL),
(48, 'Maha saber mansour', 'HHNM', NULL, NULL, 'buyer', NULL, '2025-09-14 20:20:02', '2025-09-14 20:20:02', NULL),
(49, 'ي', '22شسش', NULL, NULL, 'buyer', NULL, '2025-09-14 20:54:05', '2025-09-14 20:54:05', NULL),
(50, 'm', '01014587122', NULL, NULL, 'buyer', NULL, '2025-09-14 21:22:32', '2025-09-14 21:22:32', NULL),
(51, 'Maha saber mansour', 'mm', NULL, NULL, 'buyer', NULL, '2025-09-14 21:25:14', '2025-09-14 21:25:14', NULL),
(52, 'ليلى محمود ابراهيم', '01203536465', NULL, NULL, 'buyer', NULL, '2025-09-14 22:12:48', '2025-09-14 22:12:48', NULL),
(53, 'Tester sh', '01020676650', NULL, NULL, 'buyer', NULL, '2025-09-14 22:18:24', '2025-09-14 22:18:24', NULL),
(54, 'fatma gamal', '2', NULL, NULL, 'buyer', NULL, '2025-09-15 07:17:30', '2025-09-20 14:01:40', NULL),
(55, 'محمود', '+20101458712', NULL, NULL, 'buyer', NULL, '2025-09-15 10:09:47', '2025-09-15 10:09:47', NULL),
(56, 'فؤاد', '0000563831', NULL, NULL, 'buyer', NULL, '2025-09-15 11:36:37', '2025-09-15 11:36:37', NULL),
(57, 'Bug', '5555555555555', NULL, NULL, 'buyer', NULL, '2025-09-15 11:38:13', '2025-09-15 11:38:13', NULL),
(58, 'مها صابر', '01014587123', NULL, NULL, 'buyer', NULL, '2025-09-15 11:57:37', '2025-09-15 11:57:37', NULL),
(59, 'مه', '01014587124', NULL, NULL, 'buyer', NULL, '2025-09-15 12:00:19', '2025-09-15 12:00:19', NULL),
(60, 'مه', '01014587125', NULL, NULL, 'buyer', NULL, '2025-09-15 12:01:26', '2025-09-15 12:01:26', NULL),
(61, 'مها صابر', '01014587126', NULL, NULL, 'buyer', NULL, '2025-09-15 12:03:18', '2025-09-15 12:03:18', NULL),
(62, 'مها صابر22', '01014587127', NULL, NULL, 'buyer', NULL, '2025-09-15 12:10:10', '2025-09-15 12:10:10', NULL),
(63, 'ساميه جلال', '+201014587129', NULL, NULL, 'buyer', NULL, '2025-09-15 12:21:04', '2025-09-15 12:21:04', NULL),
(64, 'ساميه جلال', '+201014587133', NULL, NULL, 'buyer', NULL, '2025-09-15 12:26:00', '2025-09-15 12:26:00', NULL),
(65, 'شيماء السيد فؤاد', '01289166248', NULL, NULL, 'buyer', NULL, '2025-09-15 12:31:51', '2025-09-15 12:31:51', NULL),
(66, 'محمد صابر', '01014587144', NULL, NULL, 'buyer', NULL, '2025-09-15 12:34:39', '2025-09-15 12:34:39', NULL),
(67, 'فاطمه الزهراء', '01014587155', NULL, NULL, 'buyer', NULL, '2025-09-15 12:40:55', '2025-09-15 12:40:55', NULL),
(68, 'غدير محمود', '01203836465', NULL, NULL, 'buyer', NULL, '2025-09-15 12:41:18', '2025-09-15 12:41:18', NULL),
(69, 'مع', '01289166245', NULL, NULL, 'buyer', NULL, '2025-09-15 12:42:59', '2025-09-15 12:42:59', NULL),
(70, 'ساميه جلال', '+201014587166', NULL, NULL, 'buyer', NULL, '2025-09-15 14:21:21', '2025-09-15 14:21:21', NULL),
(71, 'محمود صابر', '+201014587199', NULL, NULL, 'buyer', NULL, '2025-09-15 14:30:21', '2025-09-15 14:30:21', NULL),
(72, 'محمد الشاطر', '+201014587111', NULL, NULL, 'buyer', NULL, '2025-09-15 14:37:38', '2025-09-15 14:37:38', NULL),
(73, 'محمد', '0102345676', 'morning', 'FATMA@GMAIL.COM', 'seller', NULL, '2025-09-15 19:06:31', '2025-09-15 19:06:31', NULL),
(74, 'سجى', '01234567789', 'morning', 'FATMA@GMAIL.COM', 'seller', NULL, '2025-09-15 19:35:16', '2025-09-15 19:35:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_interactions`
--

CREATE TABLE `customer_interactions` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `channel` enum('phone','email','whatsapp','in_person') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `decor_requests`
--

CREATE TABLE `decor_requests` (
  `id` int(11) NOT NULL,
  `details` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `medium_url` varchar(255) DEFAULT NULL,
  `altText` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `original_filename` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `reference_item_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('جديد','تم التواصل','قيد التنفيذ','مكتمل','ملغي') NOT NULL DEFAULT 'جديد',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('منحوتات جدارية','لوحات كانفس','تحف ديكورية') NOT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `handled_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `decor_requests`
--

INSERT INTO `decor_requests` (`id`, `details`, `image`, `thumbnail_url`, `medium_url`, `altText`, `caption`, `file_size`, `dimensions`, `original_filename`, `mime_type`, `seo_keywords`, `deleted_at`, `reference_item_id`, `notes`, `status`, `assigned_to`, `created_at`, `updated_at`, `type`, `requested_by`, `handled_by`) VALUES
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '١٦‏/٩‏/٢٠٢٥ ٢:٥٦:٢٥ م:\njbmnbj\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٢:٥٨:٠٧ م:\n,mnbvcvbnm,.\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٢:٥٨:٤٢ م:\n,mnbvnbmj,kl.;lk,mnb\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٠١:٤٢ م:\njjjjj\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٢٠ م:\ndfdfdf\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٢٥ م:\ndfdfd\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٢٩ م:\ndfdfd\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٣٤ م:\ndfdf\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٣٧:٣٨ م:\nszdfzsfsf\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٦:٠٨ م:\nFDGFG\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٨:٤٧ م:\nDFDFDS\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٨:٥٩ م:\nDFSDS\n\n---\n\n١٩‏/٩‏/٢٠٢٥ ٩:٢٧:٥١ ص:\nلاتالتلاتلغ\n\n---\n\n٢٠‏/٩‏/٢٠٢٥ ٥:٠٤:٢٢ م:\nرؤرلاىةوز', 'ملغي', NULL, '2025-08-26 10:54:58', '2025-09-20 14:04:22', 'منحوتات جدارية', NULL, 1),
(3, 'ففغ | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '١٦‏/٩‏/٢٠٢٥ ٣:٠٠:٢١ م:\nhkgjghjghjgh', 'قيد التنفيذ', NULL, '2025-08-31 15:54:38', '2025-09-16 12:00:20', 'منحوتات جدارية', 12, 1),
(4, 'وصف الطلب', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '١٦‏/٩‏/٢٠٢٥ ٣:٠٠:٠٣ م:\n.jvcxcvbnhmj,kl./;.k,jmnbv', 'قيد التنفيذ', NULL, '2025-08-31 15:56:14', '2025-09-16 12:00:01', 'لوحات كانفس', 12, 1),
(5, 'الاسلوب', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-08-31 15:56:53', '2025-08-31 15:56:53', 'تحف ديكورية', 12, NULL),
(6, 'وصف | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-08-31 16:00:34', '2025-08-31 16:00:34', 'منحوتات جدارية', 12, NULL),
(7, 'وصف | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-08-31 16:02:11', '2025-08-31 16:02:11', 'منحوتات جدارية', 12, NULL),
(8, 'وصف | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-08-31 16:09:43', '2025-08-31 16:09:43', 'منحوتات جدارية', 12, NULL),
(11, 'يبلبل | الأبعاد: 4 متر فى 4 متر', 'decor-requests/sgI7vt6IUSgFiyH6q2rn8bgSccBZRo5FR1FHwxjt.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '١‏/٩‏/٢٠٢٥ ١:١١:٤٢ م:\ngf', 'قيد التنفيذ', NULL, '2025-09-01 06:28:41', '2025-09-01 07:11:43', 'منحوتات جدارية', 13, 1),
(12, 'm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-13 21:12:41', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(13, 'm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-13 21:16:14', '2025-09-22 11:18:46', 'منحوتات جدارية', 26, NULL),
(14, '.....', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-14 07:02:40', '2025-09-22 11:18:46', 'منحوتات جدارية', 27, NULL),
(15, '....', 'decor-requests/QyiBMCtwlBFYXAaSnHkXLayCnQ01qUoQu3UOzxJJ.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 07:03:26', '2025-09-14 07:03:26', 'منحوتات جدارية', 27, NULL),
(16, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:45', 44, NULL, 'جديد', NULL, '2025-09-14 07:03:47', '2025-09-22 11:18:45', 'منحوتات جدارية', 28, NULL),
(17, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:42', 45, NULL, 'جديد', NULL, '2025-09-14 07:03:59', '2025-09-22 11:18:42', 'منحوتات جدارية', 27, NULL),
(18, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:33', 46, NULL, 'جديد', NULL, '2025-09-14 07:04:16', '2025-09-22 11:18:33', 'منحوتات جدارية', 29, NULL),
(19, '.....', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', 47, NULL, 'جديد', NULL, '2025-09-14 07:04:28', '2025-09-22 11:18:34', 'منحوتات جدارية', 29, NULL),
(20, '....', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', 48, NULL, 'جديد', NULL, '2025-09-14 07:04:56', '2025-09-22 11:18:34', 'منحوتات جدارية', 30, NULL),
(21, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', 48, NULL, 'جديد', NULL, '2025-09-14 07:05:10', '2025-09-22 11:18:34', 'منحوتات جدارية', 30, NULL),
(22, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:35', 49, NULL, 'جديد', NULL, '2025-09-14 07:05:30', '2025-09-22 11:18:35', 'منحوتات جدارية', 30, NULL),
(23, '... | الأبعاد: 4\\6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:36', 50, NULL, 'جديد', NULL, '2025-09-14 07:05:49', '2025-09-22 11:18:36', 'منحوتات جدارية', 30, NULL),
(24, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:28', 37, NULL, 'جديد', NULL, '2025-09-14 07:06:30', '2025-09-22 14:08:28', 'لوحات كانفس', 31, NULL),
(25, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:05', 24, NULL, 'جديد', NULL, '2025-09-14 07:06:49', '2025-09-22 14:08:05', 'لوحات كانفس', 32, NULL),
(26, '...', 'decor-requests/c75Gd4JJy36agJLKIyz48od7pFxwtQdYdeOwEFv3.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 07:07:21', '2025-09-14 07:07:21', 'تحف ديكورية', 31, NULL),
(27, 'nnn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-14 20:48:49', '2025-09-22 11:18:46', 'منحوتات جدارية', 26, NULL),
(28, 'jjj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-14 20:49:12', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(29, 'mmm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:39', 16, NULL, 'جديد', NULL, '2025-09-14 20:49:29', '2025-09-22 14:07:39', 'لوحات كانفس', 25, NULL),
(30, 'jjj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 20:49:42', '2025-09-14 20:49:42', 'تحف ديكورية', 25, NULL),
(31, 'jjj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 20:49:53', '2025-09-14 20:49:53', 'تحف ديكورية', 25, NULL),
(32, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 22:12:48', '2025-09-14 22:12:48', 'تحف ديكورية', 52, NULL),
(34, '...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'قيد التنفيذ', NULL, '2025-09-14 22:16:58', '2025-09-14 22:18:51', 'تحف ديكورية', 27, 1),
(35, '....', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-14 22:18:24', '2025-09-14 22:18:24', 'منحوتات جدارية', 53, NULL),
(36, 'kjhgfdsdfghjk', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 07:24:48', '2025-09-22 11:18:46', 'منحوتات جدارية', 12, NULL),
(37, 'cvnbvcvbnm, | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 07:29:19', '2025-09-22 11:18:46', 'منحوتات جدارية', 13, NULL),
(38, 'xdfghjhgfds', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 07:30:35', '2025-09-22 11:18:46', 'منحوتات جدارية', 13, NULL),
(39, '.jgxzkjhgfd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:39', 16, NULL, 'جديد', NULL, '2025-09-15 07:30:57', '2025-09-22 14:07:39', 'لوحات كانفس', 13, NULL),
(40, '.lkjhgfdxz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 07:31:14', '2025-09-15 07:31:14', 'تحف ديكورية', 13, NULL),
(41, 'تصميم عصري ومودرن', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 09:25:47', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(42, 'تصميم مودرن', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 09:27:45', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(43, 'تصميم عصري', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 09:28:26', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(44, 'تصميم بسيط وراقي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:06:04', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(45, 'تصمسم عصرسي وانيق', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:07:30', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(46, 'تصميم بسيطه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:09:47', '2025-09-22 11:18:46', 'منحوتات جدارية', 55, NULL),
(47, 'تصميم بسيط', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:11:33', '2025-09-22 11:18:46', 'منحوتات جدارية', 55, NULL),
(48, 'تصميم انيق', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:13:04', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(49, 'تصاميم انيقه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:15:47', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(50, 'ارسءسشلاىءرءىسشءتستؤصضعهبعصضهبلعبلصضلصضنا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:16:49', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(51, 'تصميم انيق وبسيط', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 10:18:16', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(52, 'KHJJGHKFTGFGHGK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 10:44:37', '2025-09-15 10:44:37', 'منحوتات جدارية', 25, NULL),
(53, 'تصاميم فخمه وراقيه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:24:28', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(54, 'تصميم راقي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:29:05', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(55, 'تصميم معمارى', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:36:37', '2025-09-22 11:18:46', 'منحوتات جدارية', 56, NULL),
(56, 'Uhhjgjgjjv', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:38:13', '2025-09-22 11:18:46', 'منحوتات جدارية', 57, NULL),
(57, 'تصميم راقي وانيق', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:39:51', '2025-09-22 11:18:46', 'منحوتات جدارية', 25, NULL),
(58, 'تصميم بسيط وراقي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 11:48:19', '2025-09-22 11:18:46', 'منحوتات جدارية', 50, NULL),
(59, 'تصميم انيق وراقي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 11:52:24', '2025-09-15 11:52:24', 'منحوتات جدارية', 50, NULL),
(60, 'Bug 15 desgin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:39', 16, NULL, 'جديد', NULL, '2025-09-15 11:53:59', '2025-09-22 14:07:39', 'لوحات كانفس', 27, NULL),
(61, 'نىبىرتبرتلاركنتىرمسينربرىبتىرن', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 11:54:56', '2025-09-15 11:54:56', 'منحوتات جدارية', 50, NULL),
(62, 'نتارتبراتريارتواتلاؤشراتررزيرتيبلابتلاتبرزبتنتبيبتتبيت', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 11:57:37', '2025-09-15 11:57:37', 'منحوتات جدارية', 58, NULL),
(63, 'تربرىنيبرىنتبيرصثهعراصثعهنترنعراتن', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 12:00:19', '2025-09-22 11:18:46', 'منحوتات جدارية', 59, NULL),
(64, 'رتلابلاترصضلاتنلاضصعهثصتىى', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 12:01:26', '2025-09-22 11:18:46', 'منحوتات جدارية', 60, NULL),
(65, 'تصميم رايق', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:33', 46, NULL, 'جديد', NULL, '2025-09-15 12:03:18', '2025-09-22 11:18:33', 'منحوتات جدارية', 61, NULL),
(66, 'تصميم مميز', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:33', 46, NULL, 'جديد', NULL, '2025-09-15 12:10:10', '2025-09-22 11:18:33', 'منحوتات جدارية', 62, NULL),
(67, 'تصميم مميز', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 12:21:04', '2025-09-22 11:18:46', 'منحوتات جدارية', 63, NULL),
(68, 'متااالبليقيقسفتيفقلتيقبليثثثثفقفلبتبللؤتؤلبؤلبلاتاات', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 12:26:00', '2025-09-22 11:18:46', 'منحوتات جدارية', 64, NULL),
(69, 'تصميم تكنولوجيا', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:39', 16, NULL, 'جديد', NULL, '2025-09-15 12:31:51', '2025-09-22 14:07:39', 'لوحات كانفس', 65, NULL),
(70, 'ىانتللغبغفبففغبفغ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', 48, NULL, 'جديد', NULL, '2025-09-15 12:33:00', '2025-09-22 11:18:34', 'منحوتات جدارية', 65, NULL),
(71, 'تابغبفليتغبغل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 12:34:39', '2025-09-15 12:34:39', 'منحوتات جدارية', 66, NULL),
(72, 'تصميم عملي', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:16', 61, NULL, 'جديد', NULL, '2025-09-15 12:36:50', '2025-09-22 11:18:16', 'منحوتات جدارية', 65, NULL),
(73, 'تصميم خاص بعميل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 12:40:55', '2025-09-15 12:40:55', 'منحوتات جدارية', 67, NULL),
(74, 'تصميم معمل تحاليل', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 12:41:18', '2025-09-15 12:41:18', 'منحوتات جدارية', 68, NULL),
(75, 'ااااااااهه', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 12:42:59', '2025-09-15 12:42:59', 'منحوتات جدارية', 69, NULL),
(76, 'تصميم عصري وانيق', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 14:21:21', '2025-09-22 11:18:46', 'منحوتات جدارية', 70, NULL),
(77, 'تصميم عصري وحديث', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 14:30:21', '2025-09-22 11:18:46', 'منحوتات جدارية', 71, NULL),
(78, 'تصميم عصري', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 14:37:38', '2025-09-22 11:18:46', 'منحوتات جدارية', 72, NULL),
(79, 'dfhgfdsasdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-15 20:27:59', '2025-09-22 11:18:46', 'منحوتات جدارية', 13, NULL),
(80, 'sdfghgvcfxd', 'decor-requests/H9yR348jceBmorEveSyQrhvgOfnRhWRvGXQEpVfI.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-15 20:28:28', '2025-09-15 20:28:28', 'منحوتات جدارية', 14, NULL),
(81, 'وصفتالبيتالبي | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-16 13:20:39', '2025-09-22 11:18:46', 'منحوتات جدارية', 13, NULL),
(82, 'AWEWERWERWEWE | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:45', 44, NULL, 'جديد', NULL, '2025-09-16 13:27:27', '2025-09-22 11:18:45', 'منحوتات جدارية', 13, NULL),
(83, 'retest website | الأبعاد: 3*4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-19 09:45:57', '2025-09-22 11:18:46', 'منحوتات جدارية', 36, NULL),
(84, 'wwwwwwwwww | الأبعاد: 3*4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-19 09:47:46', '2025-09-22 11:18:46', 'منحوتات جدارية', 46, NULL),
(85, 'لؤلؤلتؤتؤت | الأبعاد: 3*4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-19 13:06:28', '2025-09-22 11:18:46', 'منحوتات جدارية', 35, NULL),
(86, 'HFHGDGFCDGFD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-19 13:06:30', '2025-09-22 11:18:46', 'منحوتات جدارية', 50, NULL),
(89, 'شسيبلاتنمت | الأبعاد: 3*4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', 43, NULL, 'جديد', NULL, '2025-09-19 13:19:45', '2025-09-22 11:18:46', 'منحوتات جدارية', 41, NULL),
(90, 'dfghjkljhgfdsaASDFGHJK | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-21 12:39:33', '2025-09-21 12:39:33', 'منحوتات جدارية', 13, NULL),
(91, ',kjhgfdsfghjkl;lkjhgf | الأبعاد: 4 متر فى 4 متر', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-22 07:16:18', '2025-09-22 07:16:18', 'منحوتات جدارية', 13, NULL),
(92, 'jhgfghjklkjhgfdfghjklkjhgfdfghjkl | الأبعاد: lkjhgfdsdfghjm,./.,mnbvcxzxcvbnm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'جديد', NULL, '2025-09-22 08:27:26', '2025-09-22 08:27:26', 'منحوتات جدارية', 13, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finishing_requests`
--

CREATE TABLE `finishing_requests` (
  `id` int(11) NOT NULL,
  `package` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('جديد','تم التواصل','قيد التنفيذ','مكتمل','ملغي') NOT NULL DEFAULT 'جديد',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('استشارة وتصور','تصميم ثلاثي الأبعاد','تنفيذ وإشراف') NOT NULL,
  `handled_by` int(11) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `finishing_requests`
--

INSERT INTO `finishing_requests` (`id`, `package`, `notes`, `status`, `assigned_to`, `created_at`, `updated_at`, `type`, `handled_by`, `details`, `requested_by`) VALUES
(2, 'باكيج ستاندرد', '١٦‏/٩‏/٢٠٢٥ ٣:١٢:١٠ م:\nhghhghg\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٣٧:٢٣ م:\nzfzsfzsf\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٤٢:٥٠ م:\nيبليل\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٤٣:٥٦ م:\nبلبيل\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٤٤:٥٠ م:\nييءب\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٤٦:٠٩ م:\nؤءر\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٤٦:٢٣ م:\nليبلبل\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٥٣:١٠ م:\nبلبلبل\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٥٣:٢٢ م:\nبلبلبي\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٢:٥٨ م:\nXVXDF\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٣:١٤ م:\nXXCVDFXDF\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٨:٢٠ م:\nSFSDFDFD\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٨:٣٢ م:\nDFSDFDSF', 'جديد', NULL, '2025-08-26 10:54:58', '2025-09-16 13:08:31', 'تنفيذ وإشراف', NULL, NULL, NULL),
(3, NULL, 'vbccbc\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٣:٢٧ م:\nvbvbvbv', 'تم التواصل', NULL, '2025-09-01 07:02:30', '2025-09-16 12:13:25', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', NULL),
(4, NULL, 'cvxxcvghj', 'تم التواصل', NULL, '2025-09-01 07:04:41', '2025-09-16 11:10:52', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', NULL),
(5, NULL, 'ةىلارؤءؤر\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٣:٥٦ م:\njjhjh', 'تم التواصل', NULL, '2025-09-01 07:06:56', '2025-09-16 12:13:54', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', NULL),
(6, NULL, 'jxzzxfghj\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٥:٥٤ م:\nmnbvcvbjklmnbv', 'تم التواصل', NULL, '2025-09-01 07:10:04', '2025-09-16 12:15:52', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 16),
(7, NULL, '١٦‏/٩‏/٢٠٢٥ ٣:١٦:٢١ م:\nvcbvnm,.,mnbvc\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٦:٣٠ م:\nmbjnnb\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٦:٣٤ م:\nmbhbnm\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٦:٣٩ م:\nmnhmnbm', 'قيد التنفيذ', NULL, '2025-09-03 08:41:24', '2025-09-16 12:16:38', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 19),
(8, NULL, 'uygf', 'جديد', NULL, '2025-09-03 08:41:50', '2025-09-03 08:41:50', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 20),
(9, NULL, 'iuyht', 'جديد', NULL, '2025-09-03 08:42:06', '2025-09-03 08:42:06', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 21),
(10, NULL, 'مساحة', 'جديد', NULL, '2025-09-10 09:47:07', '2025-09-10 09:47:07', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 23),
(11, NULL, NULL, 'جديد', NULL, '2025-09-10 09:47:26', '2025-09-10 09:47:26', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 23),
(12, NULL, NULL, 'جديد', NULL, '2025-09-10 09:47:52', '2025-09-10 09:47:52', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 24),
(13, NULL, NULL, 'جديد', NULL, '2025-09-14 06:59:16', '2025-09-14 06:59:16', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 27),
(14, NULL, NULL, 'جديد', NULL, '2025-09-14 06:59:46', '2025-09-14 06:59:46', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 27),
(15, NULL, NULL, 'جديد', NULL, '2025-09-14 06:59:55', '2025-09-14 06:59:55', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 27),
(16, NULL, NULL, 'جديد', NULL, '2025-09-14 07:00:06', '2025-09-14 07:00:06', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 27),
(17, NULL, NULL, 'جديد', NULL, '2025-09-14 19:37:54', '2025-09-14 19:37:54', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 35),
(18, NULL, NULL, 'جديد', NULL, '2025-09-14 19:37:59', '2025-09-14 19:37:59', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(19, NULL, NULL, 'جديد', NULL, '2025-09-14 19:38:09', '2025-09-14 19:38:09', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 36),
(20, NULL, NULL, 'جديد', NULL, '2025-09-14 19:39:45', '2025-09-14 19:39:45', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(21, NULL, NULL, 'جديد', NULL, '2025-09-14 19:39:49', '2025-09-14 19:39:49', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 37),
(22, NULL, NULL, 'جديد', NULL, '2025-09-14 19:41:16', '2025-09-14 19:41:16', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 36),
(23, NULL, NULL, 'جديد', NULL, '2025-09-14 19:41:35', '2025-09-14 19:41:35', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(24, NULL, NULL, 'جديد', NULL, '2025-09-14 19:41:36', '2025-09-14 19:41:36', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 32),
(25, NULL, NULL, 'جديد', NULL, '2025-09-14 19:42:32', '2025-09-14 19:42:32', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 31),
(26, NULL, NULL, 'جديد', NULL, '2025-09-14 19:43:42', '2025-09-14 19:43:42', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 38),
(27, NULL, NULL, 'جديد', NULL, '2025-09-14 19:43:52', '2025-09-14 19:43:52', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 25),
(28, NULL, NULL, 'جديد', NULL, '2025-09-14 19:44:28', '2025-09-14 19:44:28', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 39),
(29, NULL, NULL, 'جديد', NULL, '2025-09-14 19:44:46', '2025-09-14 19:44:46', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 25),
(30, NULL, NULL, 'جديد', NULL, '2025-09-14 19:45:59', '2025-09-14 19:45:59', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(31, NULL, NULL, 'جديد', NULL, '2025-09-14 19:46:53', '2025-09-14 19:46:53', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 40),
(32, NULL, NULL, 'جديد', NULL, '2025-09-14 19:47:20', '2025-09-14 19:47:20', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 41),
(33, NULL, NULL, 'جديد', NULL, '2025-09-14 19:53:56', '2025-09-14 19:53:56', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 35),
(34, NULL, NULL, 'جديد', NULL, '2025-09-14 19:54:51', '2025-09-14 19:54:51', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 36),
(35, NULL, NULL, 'جديد', NULL, '2025-09-14 19:56:26', '2025-09-14 19:56:26', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 42),
(36, NULL, NULL, 'جديد', NULL, '2025-09-14 19:57:16', '2025-09-14 19:57:16', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 43),
(37, NULL, NULL, 'جديد', NULL, '2025-09-14 19:58:45', '2025-09-14 19:58:45', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 43),
(38, NULL, NULL, 'جديد', NULL, '2025-09-14 19:59:44', '2025-09-14 19:59:44', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 44),
(39, NULL, NULL, 'جديد', NULL, '2025-09-14 20:00:13', '2025-09-14 20:00:13', 'تنفيذ وإشراف', NULL, 'التنفيذ والإشراف الكامل', 41),
(40, NULL, NULL, 'جديد', NULL, '2025-09-14 20:01:01', '2025-09-14 20:01:01', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(41, NULL, NULL, 'جديد', NULL, '2025-09-14 20:01:04', '2025-09-14 20:01:04', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 45),
(42, NULL, NULL, 'جديد', NULL, '2025-09-14 20:01:33', '2025-09-14 20:01:33', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 46),
(43, NULL, NULL, 'جديد', NULL, '2025-09-14 20:03:34', '2025-09-14 20:03:34', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(44, NULL, NULL, 'جديد', NULL, '2025-09-14 20:04:10', '2025-09-14 20:04:10', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 36),
(45, NULL, NULL, 'جديد', NULL, '2025-09-14 20:04:33', '2025-09-14 20:04:33', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 46),
(46, NULL, NULL, 'جديد', NULL, '2025-09-14 20:05:39', '2025-09-14 20:05:39', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 35),
(47, NULL, NULL, 'جديد', NULL, '2025-09-14 20:06:23', '2025-09-14 20:06:23', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 47),
(48, NULL, NULL, 'جديد', NULL, '2025-09-14 20:08:06', '2025-09-14 20:08:06', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 41),
(49, NULL, NULL, 'جديد', NULL, '2025-09-14 20:09:29', '2025-09-14 20:09:29', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 25),
(50, NULL, NULL, 'جديد', NULL, '2025-09-14 20:10:21', '2025-09-14 20:10:21', 'تصميم ثلاثي الأبعاد', NULL, 'التصميم ثلاثي الأبعاد', 25),
(51, NULL, NULL, 'جديد', NULL, '2025-09-14 20:20:02', '2025-09-14 20:20:02', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 48),
(52, NULL, NULL, 'جديد', NULL, '2025-09-14 20:54:05', '2025-09-14 20:54:05', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 49),
(53, NULL, NULL, 'جديد', NULL, '2025-09-14 21:22:32', '2025-09-14 21:22:32', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 50),
(54, NULL, NULL, 'جديد', NULL, '2025-09-14 21:25:14', '2025-09-14 21:25:14', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 51),
(55, NULL, NULL, 'جديد', NULL, '2025-09-15 07:17:30', '2025-09-15 07:17:30', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 54),
(56, NULL, NULL, 'جديد', NULL, '2025-09-15 07:24:27', '2025-09-15 07:24:27', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 13),
(57, NULL, '4ق5فيبلات', 'جديد', NULL, '2025-09-15 11:43:44', '2025-09-15 11:43:44', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 13),
(58, NULL, 'sdfgh', 'جديد', NULL, '2025-09-15 11:48:36', '2025-09-15 11:48:36', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 13),
(59, NULL, 'fdfgfdfg', 'جديد', NULL, '2025-09-15 20:31:23', '2025-09-15 20:31:23', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', 13),
(60, NULL, NULL, 'جديد', NULL, '2025-09-19 09:39:28', '2025-09-19 09:39:28', 'استشارة وتصور', NULL, 'الاستشارة ووضع التصور', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('جديد','تم التواصل','قيد المتابعة','مغلق') NOT NULL DEFAULT 'جديد',
  `type` enum('تواصل عام','طلب ديكور','إضافة عقار') NOT NULL DEFAULT 'تواصل عام',
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `handled_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contact_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `message`, `status`, `type`, `read`, `notes`, `handled_by`, `created_at`, `updated_at`, `contact_time`) VALUES
(2, 'أمير مصطفى', 'amir@example.com', '01004445556', 'هل تقدمون خدمات التصميم الداخلي؟', 'جديد', 'تواصل عام', 0, '٢٨‏/٨‏/٢٠٢٥ ٦:٥٩:٣١ م:\nملاحظة\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:٠١:٢٢ م:\nملاحظة\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:٠١:٣٧ م:\nملاحظى\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:٠٢:٠٦ م:\nبيب\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:٠٥:٢٦ م:\nملاحظات\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:١١:١١ م:\nبلارلا\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:١١:٣٨ م:\nل\n\n---\n\n٢٨‏/٨‏/٢٠٢٥ ٧:٢٢:١٩ م:\nfff\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١٠:٣٩:٤٦ ص:\n,bvcxcvb\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١٠:٥٣:٢٠ ص:\nىلارؤ\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١٢:٣٣:٢٧ م:\nتم\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١٢:٣٣:٤١ م:\nالببلاتن\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١٢:٣٤:٠٣ م:\nملاحظة جديدة\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ١:٠٣:٤٧ م:\nمرحبا\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٢:٤٥:٥٧ م:\nوةىلارؤءؤرلاىتن\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٢:٤٩:٢٤ م:\nءبيب\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:٣٧:٥٧ م:\nsdfsd\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٤:٠٨:٠٤ م:\nSDSADSA', 1, '2025-08-26 10:54:58', '2025-09-16 13:08:02', NULL),
(3, 'fatma', NULL, '34343434', 'الالل\n\nوقت الاتصال المفضل: afternoon', 'مغلق', 'تواصل عام', 0, '٣١‏/٨‏/٢٠٢٥ ٥:٥٨:١٩ م:\nاهلا\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٠١ م:\ndfdf\n\n---\n\n١٦‏/٩‏/٢٠٢٥ ٣:١٨:٠٥ م:\ndfdf\n\n---\n\n٢٣‏/٩‏/٢٠٢٥ ١٠:٣٣:٢٧ ص:\nJRTHJRH', 1, '2025-08-30 15:23:06', '2025-09-23 07:33:26', NULL),
(4, 'hadeer', NULL, '34343434', 'df\n\nوقت الاتصال المفضل: morning', 'قيد المتابعة', 'تواصل عام', 0, '١٦‏/٩‏/٢٠٢٥ ٣:٣٨:٠٩ م:\nsdsd', 1, '2025-08-30 16:40:36', '2025-09-16 12:38:07', NULL),
(5, 'test', NULL, '34343434', 'dfdf\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, 1, '2025-08-30 16:41:07', '2025-08-31 04:01:31', NULL),
(6, 'fatma', NULL, '34343434', 'اهلا \n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-08-31 11:45:32', '2025-08-31 11:45:32', NULL),
(7, 'fatma', NULL, '34343434', 'hello\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-08-31 11:52:24', '2025-08-31 11:52:24', NULL),
(8, 'fatma', NULL, '34343434', 'ddsds\n\nوقت الاتصال المفضل: evening', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-08-31 11:53:43', '2025-08-31 11:53:43', NULL),
(9, 'hadeer', NULL, '34343434', 'dff\n\nوقت الاتصال المفضل: morning', 'تم التواصل', 'تواصل عام', 0, '٣١‏/٨‏/٢٠٢٥ ٦:١٥:٢٢ م:\nاهلا', 1, '2025-08-31 11:56:45', '2025-08-31 12:15:23', 'morning'),
(10, 'maha saber', NULL, '01014587122', 'dddddd\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, 1, '2025-09-13 21:10:12', '2025-09-15 21:41:25', 'morning'),
(11, 'maha saber', NULL, '01014587122', 'm\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-13 21:10:31', '2025-09-13 21:10:31', 'morning'),
(12, 'maha saber', NULL, '01014587122', 'm\n\nوقت الاتصال المفضل: غير محدد', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-13 21:10:47', '2025-09-13 21:10:47', NULL),
(13, 'maha saber', NULL, '01014587122', 'ة\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-13 22:44:29', '2025-09-13 22:44:29', 'morning'),
(14, 'ة', NULL, '0101458712', 'ة\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-13 22:44:45', '2025-09-13 22:44:45', 'afternoon'),
(15, 'Test 4', NULL, '01111111111', 'شقة \n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 06:54:37', '2025-09-14 06:54:37', 'morning'),
(16, 'Test 4', NULL, '000', '....\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 07:00:34', '2025-09-14 07:00:34', 'afternoon'),
(17, 'Test 4', NULL, '00', '...\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 07:00:59', '2025-09-14 07:00:59', 'afternoon'),
(18, 'Test 4', NULL, '0000', '...\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 07:08:02', '2025-09-14 07:08:02', 'morning'),
(19, 'Test 4', NULL, '00', '....\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 07:08:36', '2025-09-14 07:08:36', 'morning'),
(20, 'maha saber', NULL, '01014587122', 'm\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 11:44:56', '2025-09-14 11:44:56', 'morning'),
(21, 'maha saber', NULL, '01014587122', 'شقه تلات غرف وحمام وصاله ومطبخ\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 11:46:04', '2025-09-14 11:46:04', 'morning'),
(22, 'maha saber', NULL, '01014587122', 'شقه 120 متر مكونه من تلات غرف وحمام وصاله ومطبخ\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 11:49:29', '2025-09-14 11:49:29', 'morning'),
(23, 'users', NULL, '01555909568', 'helio\n\nوقت الاتصال المفضل: غير محدد', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:10:20', '2025-09-14 20:10:20', NULL),
(24, 'شيماء السيد فؤاد', NULL, '1284701288', 'shimaa elsayed\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:11:40', '2025-09-14 20:11:40', 'afternoon'),
(25, 'shimaa elsayed fouad', NULL, '01284701288', 'شيماء السيد\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:13:10', '2025-09-14 20:13:10', 'morning'),
(26, 'ندا مدحت', NULL, '01064161382', 'اهلا\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:18:07', '2025-09-14 20:18:07', 'afternoon'),
(27, 'users', NULL, '+20 12 84701288', 'هاى\n\nوقت الاتصال المفضل: evening', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:18:30', '2025-09-14 20:18:30', 'evening'),
(28, 'maha saber', NULL, '01014587122', ',,\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:21:33', '2025-09-14 20:21:33', 'afternoon'),
(29, 'Sumoha', NULL, '1284701288', 'مهم\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-14 20:38:19', '2025-09-14 20:38:19', 'morning'),
(30, 'fatma.gamal.shams@gmail.com', NULL, '34343434', 'GHJ\n\nوقت الاتصال المفضل: غير محدد', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 06:59:24', '2025-09-15 06:59:24', NULL),
(31, 'fatma', NULL, '34343434', 'تالبلاتلار\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 07:11:50', '2025-09-15 07:11:50', 'morning'),
(32, 'fatma', NULL, '34343434', 'البلتالبيسيبل\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 07:14:38', '2025-09-15 07:14:38', 'morning'),
(33, 'fatma', NULL, '34343434', 'ةلارؤرلاات\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 07:14:56', '2025-09-15 07:14:56', 'morning'),
(34, 'fatma', NULL, '01011991431', 'ىلارؤنتالبيسيبلا\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 07:17:06', '2025-09-15 07:17:06', 'morning'),
(35, 'test', NULL, '0123456879', 'ddfgdsfgdsfgd\n\nوقت الاتصال المفضل: afternoon', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-15 20:48:07', '2025-09-15 20:48:07', 'afternoon'),
(36, 'fatma', NULL, '01011991431', 'ءؤريءبسيبسيب\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-16 13:34:21', '2025-09-16 13:34:21', 'morning'),
(37, 'fatma.gamal.shams@gmail.com', NULL, '01011991431', 'نتالبيسشيبي\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-16 13:58:06', '2025-09-16 13:58:06', 'morning'),
(38, 'retest', NULL, '01203836465', 'retest website\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-19 08:49:20', '2025-09-19 08:49:20', 'morning'),
(39, 'OPEN', NULL, '+20 10 14587122', 'استفسار وحيد\n\nوقت الاتصال المفضل: morning', 'جديد', 'تواصل عام', 0, NULL, NULL, '2025-09-19 12:41:42', '2025-09-19 12:41:42', 'morning');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"1434d1a0-4422-49c3-94ee-ce2726542e2c\",\"displayName\":\"App\\\\Notifications\\\\VerifyEmail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:9;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:29:\\\"App\\\\Notifications\\\\VerifyEmail\\\":1:{s:2:\\\"id\\\";s:36:\\\"836c6a04-0759-42b3-873e-436433a7dea7\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"},\"createdAt\":1756201612,\"delay\":null}', 0, NULL, 1756201612, 1756201612);

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_08_25_190426_create_sessions_table', 2),
(4, '2025_08_25_190703_create_personal_access_tokens_table', 3),
(5, '2025_08_26_095457_add_email_verified_at_to_users_table', 4),
(6, '2025_08_26_192945_add_role_and_last_login_to_users_table', 5),
(7, '2025_08_27_192259_create_permissions_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_type` enum('user','staff') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('email','sms','in_app') NOT NULL,
  `status` enum('read','unread') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `recipient_id`, `recipient_type`, `title`, `message`, `type`, `status`, `created_at`) VALUES
(1, 1, 'user', 'عرض جديد', 'هناك عقار جديد قد يهمك', 'in_app', 'unread', '2025-08-26 10:54:58'),
(2, 2, 'user', 'تذكير', 'لديك موعد معاينة غداً', 'email', 'read', '2025-08-26 10:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', 'bf984998cf218c0bd05baae7d1f1ce0fbca22343baa197ad8d840f4d67bf60bb', '[\"*\"]', NULL, NULL, '2025-08-26 02:33:12', '2025-08-26 02:33:12'),
(3, 'App\\Models\\User', 2, 'auth_token', 'c07968a86b489428a98e5da243285d4111058906cb2179c2b3bb0a0bdc159b90', '[\"*\"]', '2025-08-26 03:06:12', NULL, '2025-08-26 02:58:19', '2025-08-26 03:06:12'),
(4, 'App\\Models\\User', 3, 'auth_token', '85fa5c96bee68f1dc91e34e6fe668fe5b4d3d8c3800801fbbe96227b04ae38b4', '[\"*\"]', NULL, NULL, '2025-08-26 05:46:53', '2025-08-26 05:46:53'),
(5, 'App\\Models\\User', 3, 'auth_token', '1198159920ab230d5e0d7128eb685f320cb21df8ac2d09343392727e066ac533', '[\"*\"]', '2025-08-26 05:55:16', NULL, '2025-08-26 05:51:14', '2025-08-26 05:55:16'),
(6, 'App\\Models\\User', 4, 'auth_token', 'f5b4614ed192eef3436f6a25e2cca911ea23ad6f2db69edc4df43660523d0e63', '[\"*\"]', NULL, NULL, '2025-08-26 05:59:31', '2025-08-26 05:59:31'),
(7, 'App\\Models\\User', 5, 'auth_token', 'a5e46382dced120c6dcb4c9836c201495a11a3c82cdc4df20f9eabb2582ea4fa', '[\"*\"]', NULL, NULL, '2025-08-26 06:10:04', '2025-08-26 06:10:04'),
(8, 'App\\Models\\User', 6, 'auth_token', '854c40d40dd38464534b77f2ceaa976ca6bf4d0a7a0de41a4247d95818daea1e', '[\"*\"]', NULL, NULL, '2025-08-26 06:11:39', '2025-08-26 06:11:39'),
(9, 'App\\Models\\User', 7, 'auth_token', '98598e4f293e69a7047fdc3ee1891fe4e5ee76d455d0e480638f543f17bc966a', '[\"*\"]', NULL, NULL, '2025-08-26 06:25:00', '2025-08-26 06:25:00'),
(10, 'App\\Models\\User', 8, 'auth_token', 'f3de0d923bb7b687730a4252d3822509eaba79ef77a0c0f9ad627b2b413bf2ca', '[\"*\"]', NULL, NULL, '2025-08-26 06:27:41', '2025-08-26 06:27:41'),
(11, 'App\\Models\\User', 9, 'auth_token', 'cc5b1c5d10a03bca989cc21a9fffcfb5d28e5478c8d96347772c7e6657066390', '[\"*\"]', NULL, NULL, '2025-08-26 06:37:35', '2025-08-26 06:37:35'),
(12, 'App\\Models\\User', 10, 'auth_token', '36ddd1cb2de9079f2c6f848944d2db1d268276022132b5e92f448f378fed162d', '[\"*\"]', NULL, NULL, '2025-08-26 06:53:50', '2025-08-26 06:53:50'),
(13, 'App\\Models\\User', 11, 'auth_token', '4e5befa54750abb1252dcc9da7569ebb22639bd3f72be9e151f023deaefdf020', '[\"*\"]', NULL, NULL, '2025-08-26 06:59:39', '2025-08-26 06:59:39'),
(15, 'App\\Models\\Staff', 1, 'auth_token', 'e44bb218b206e0890a438aa8494aa6a69735a4fbc6f58c11c6bd6743bba3b219', '[\"*\"]', NULL, NULL, '2025-08-26 10:32:35', '2025-08-26 10:32:35'),
(16, 'App\\Models\\Staff', 1, 'auth_token', '5e0896d1a7c570dfdf94d0c8f7cd1f0646a130a1f7a5ea875d07b3907c089127', '[\"*\"]', NULL, NULL, '2025-08-26 10:32:46', '2025-08-26 10:32:46'),
(17, 'App\\Models\\Staff', 1, 'auth_token', '9e184854557bc55de7d4128509bfe135065aee1dadb3a9fce8d1a4691e1eacc1', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:02', '2025-08-26 10:33:02'),
(18, 'App\\Models\\Staff', 1, 'auth_token', '5230889aa863e226d08e9a5741cdae38fd005e18b6b3a941ff8e50b02f335d28', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:02', '2025-08-26 10:33:02'),
(19, 'App\\Models\\Staff', 1, 'auth_token', '87ab4ff68ea9b091c3e8b9f0c1f1a2013c7855f444ffe53bc92680ff50c4f769', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:03', '2025-08-26 10:33:03'),
(20, 'App\\Models\\Staff', 1, 'auth_token', 'ad1f664f7340bdf53cd4422149d8390b4adc0efe3d7e8348f2599920ef43930d', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:04', '2025-08-26 10:33:04'),
(21, 'App\\Models\\Staff', 1, 'auth_token', 'e04cd1d8a3daf49d812c62621b1a1f8353379cf39d3a5c47f8075853d01ba54e', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:05', '2025-08-26 10:33:05'),
(22, 'App\\Models\\Staff', 1, 'auth_token', '913cefad463247e1d564637b8bf50ee87bb2784188f2daa94d94d4981561a831', '[\"*\"]', NULL, NULL, '2025-08-26 10:33:35', '2025-08-26 10:33:35'),
(23, 'App\\Models\\Staff', 1, 'auth_token', 'a6a6c4d93dd54477c57d66e3f7dccc4d8aad7cf4f2f6ed07b51d913729cfac48', '[\"*\"]', NULL, NULL, '2025-08-26 10:47:36', '2025-08-26 10:47:36'),
(24, 'App\\Models\\Staff', 1, 'auth_token', '996bbe16a4fb87a8232677c03d8ef02fa695b708d5e56493be6497ca2dbc30a0', '[\"*\"]', NULL, NULL, '2025-08-26 10:48:51', '2025-08-26 10:48:51'),
(25, 'App\\Models\\User', 5, 'auth_token', '460413c56327d45677b3a154ed1a1011a96d68b834d41c2ce0cd7425cd565d20', '[\"*\"]', '2025-08-26 11:35:10', NULL, '2025-08-26 11:33:06', '2025-08-26 11:35:10'),
(26, 'App\\Models\\User', 5, 'auth_token', 'f54a50b90a307f56ce4a90f205b604f189a58f94f238031886f0e1d42b4c61e7', '[\"*\"]', '2025-08-26 11:35:24', NULL, '2025-08-26 11:35:22', '2025-08-26 11:35:24'),
(27, 'App\\Models\\User', 5, 'auth_token', '6bbc5b983ef1f0274ecb0864d95bda530549a9ad6603958859eccbfd6368e940', '[\"*\"]', NULL, NULL, '2025-08-26 11:42:45', '2025-08-26 11:42:45'),
(28, 'App\\Models\\User', 5, 'auth_token', 'b23282ef5a1d2b38e9b02fac4c9b03ad3342944768d33f641e4617afbbe58028', '[\"*\"]', NULL, NULL, '2025-08-26 11:42:57', '2025-08-26 11:42:57'),
(29, 'App\\Models\\User', 5, 'auth_token', '432b56a843c849d9e0f2ecaff01dacf902d859414be8f6b2bd538169da8708f1', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:00', '2025-08-26 11:43:00'),
(30, 'App\\Models\\User', 5, 'auth_token', '9fea6f9c1766e4b8652813bfe2f20d401d42044f96d6423af4a1e9a3a2179d83', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:02', '2025-08-26 11:43:02'),
(31, 'App\\Models\\User', 5, 'auth_token', 'fb966f77216fc1aaa07253efc2f8a1392cf69556d17029b4ec992c26bf578910', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:02', '2025-08-26 11:43:02'),
(32, 'App\\Models\\User', 5, 'auth_token', 'a34aaf3977a81b894ec7cdc6a33c344f5f8e2d7d03838c690d8e1a402f9433ee', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:02', '2025-08-26 11:43:02'),
(33, 'App\\Models\\User', 5, 'auth_token', '31c04081ba393a3dc7c7ea0661f8089d0322537065b4ce1ae21ed746e820d6de', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:06', '2025-08-26 11:43:06'),
(34, 'App\\Models\\User', 5, 'auth_token', 'ce6236bb8fe541afc0a79dae8c072ac65856cc1fee548ea0b64aff698ea49c5e', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:06', '2025-08-26 11:43:06'),
(35, 'App\\Models\\User', 5, 'auth_token', '6bf7e695e31288be7cc1a8c89c0d12ebaba31e3a3d9f0b5ff78c04027542fb3c', '[\"*\"]', NULL, NULL, '2025-08-26 11:43:07', '2025-08-26 11:43:07'),
(36, 'App\\Models\\User', 5, 'auth_token', '77a435f02e6dd61023ead80ef9385a05e72e1947339ec0f0758e6a38a69251cc', '[\"*\"]', '2025-08-26 11:43:29', NULL, '2025-08-26 11:43:26', '2025-08-26 11:43:29'),
(37, 'App\\Models\\User', 5, 'auth_token', 'd942755131d79de50b05f500871d04fb1721ed6fd13b33da5be7ad35201de9c8', '[\"*\"]', '2025-08-26 12:08:08', NULL, '2025-08-26 12:08:06', '2025-08-26 12:08:08'),
(38, 'App\\Models\\User', 5, 'auth_token', '552f2fcabe83f2ce5d19b66bd04832da10f1778edc8ee198a419f478b7bbe54a', '[\"*\"]', '2025-08-26 12:37:50', NULL, '2025-08-26 12:25:49', '2025-08-26 12:37:50'),
(39, 'App\\Models\\User', 5, 'auth_token', 'f8c85cf4d1ce26d1cfa6b5ced97484510649960d2b3b0c1b0c6824a180d4235c', '[\"*\"]', '2025-08-26 12:53:59', NULL, '2025-08-26 12:38:06', '2025-08-26 12:53:59'),
(40, 'App\\Models\\User', 5, 'auth_token', '7c2fdb688db32e7872ac61b189e6105e3ffa283ddeb30bd1f8c505f2b87f21f4', '[\"*\"]', '2025-08-26 13:07:58', NULL, '2025-08-26 12:54:12', '2025-08-26 13:07:58'),
(41, 'App\\Models\\User', 5, 'auth_token', '9bb67ad49434395c39a06721d186a4523acf79a2cee29c375b53db11437198f0', '[\"*\"]', '2025-08-26 13:33:57', NULL, '2025-08-26 13:08:08', '2025-08-26 13:33:57'),
(42, 'App\\Models\\User', 5, 'auth_token', 'a6e757fbcfb85f381e9901663f06db40b40ecc07bdbe21b5fab5ade9237ca8bb', '[\"*\"]', '2025-08-26 13:38:11', NULL, '2025-08-26 13:34:07', '2025-08-26 13:38:11'),
(43, 'App\\Models\\User', 5, 'auth_token', 'da9d12f2f076ec29fca243240ba44c48620b876b95a5ac9892b17ff9f7774f7e', '[\"*\"]', '2025-08-26 13:39:51', NULL, '2025-08-26 13:38:30', '2025-08-26 13:39:51'),
(44, 'App\\Models\\User', 5, 'auth_token', '00b5a1b9efc367a576cb5428c2edac5df960f050fa505a2cfe270c20a6200559', '[\"*\"]', '2025-08-26 14:01:42', NULL, '2025-08-26 13:40:09', '2025-08-26 14:01:42'),
(45, 'App\\Models\\User', 5, 'auth_token', '79f218c51b091b2a9785ff8d06d372e5b574597d00ade950c5c8e98e1f65f8cf', '[\"*\"]', '2025-08-26 14:09:37', NULL, '2025-08-26 14:02:03', '2025-08-26 14:09:37'),
(46, 'App\\Models\\User', 5, 'auth_token', 'b14b9183c51bf23a1de3bef7ce6211f7d6b4ea68af8fc6428a340bc6e64750f4', '[\"*\"]', '2025-08-26 14:13:07', NULL, '2025-08-26 14:09:52', '2025-08-26 14:13:07'),
(47, 'App\\Models\\User', 5, 'auth_token', '675bd1f2d28542ed91d50f5f75fdb40e61381a994c0660cc5392fe82cf4ba17a', '[\"*\"]', '2025-08-26 14:13:55', NULL, '2025-08-26 14:13:19', '2025-08-26 14:13:55'),
(48, 'App\\Models\\User', 5, 'auth_token', 'f13f91009b14d999e9e15d07493501d8f14e1599d9648516c877a2616e3d44ba', '[\"*\"]', '2025-08-26 14:14:08', NULL, '2025-08-26 14:14:06', '2025-08-26 14:14:08'),
(50, 'App\\Models\\User', 5, 'auth_token', 'fed638a17c5fa6aeb1b7a5db283caccdd579e8251841fda8b1f1ec75d981908a', '[\"*\"]', '2025-08-26 15:15:02', NULL, '2025-08-26 14:15:10', '2025-08-26 15:15:02'),
(51, 'App\\Models\\User', 5, 'auth_token', '52568e1ed9e7bba93ae56e43a8ae2bd9f94e2ef79c29522d3dca7580f307bdba', '[\"*\"]', '2025-08-26 16:11:43', NULL, '2025-08-26 15:33:12', '2025-08-26 16:11:43'),
(52, 'App\\Models\\User', 5, 'auth_token', '942ed7701f9d8800c7b0c6b6d95193ad62e4ba17234920ef5d35aad68b8558cb', '[\"*\"]', '2025-08-26 16:12:20', NULL, '2025-08-26 16:12:07', '2025-08-26 16:12:20'),
(53, 'App\\Models\\User', 5, 'auth_token', '1aa4b50a787262503ff3c330e37413c4665956febc84c0145cad7fa11b182a96', '[\"*\"]', '2025-08-26 16:12:39', NULL, '2025-08-26 16:12:13', '2025-08-26 16:12:39'),
(54, 'App\\Models\\User', 5, 'auth_token', '696fe2e7bc79b902ef264d32fa008e8f3a4df324364a44628e6e4d51226bee69', '[\"*\"]', '2025-08-26 16:12:43', NULL, '2025-08-26 16:12:14', '2025-08-26 16:12:43'),
(55, 'App\\Models\\User', 5, 'auth_token', 'aa105ec1c95f9108020bb4413b2a3ebfabc664e4a139b196f89c0ea702a5366b', '[\"*\"]', '2025-08-26 16:12:48', NULL, '2025-08-26 16:12:15', '2025-08-26 16:12:48'),
(56, 'App\\Models\\User', 5, 'auth_token', '7d4cca0dc1b5c1b4dc6135d166849c526c1495189132f0dc6d3eb90013c18821', '[\"*\"]', '2025-08-26 16:15:30', NULL, '2025-08-26 16:12:15', '2025-08-26 16:15:30'),
(57, 'App\\Models\\User', 5, 'auth_token', '8bb58580cb70f6a4a371e4df6c6ee4765020262920341f19364c487ffb4dc391', '[\"*\"]', '2025-08-26 16:18:58', NULL, '2025-08-26 16:15:52', '2025-08-26 16:18:58'),
(58, 'App\\Models\\User', 5, 'auth_token', '46b1be94259e870bee2837bd4fab48acf8784497ec31372f4582eb4a9299a6f6', '[\"*\"]', '2025-08-26 16:19:26', NULL, '2025-08-26 16:19:18', '2025-08-26 16:19:26'),
(59, 'App\\Models\\User', 5, 'auth_token', '00d642ce6bbdfd01372edeaafc83514abbd7eb15c4f03e2ac1ae72c3838541c7', '[\"*\"]', '2025-08-26 16:38:55', NULL, '2025-08-26 16:38:43', '2025-08-26 16:38:55'),
(60, 'App\\Models\\User', 5, 'auth_token', '7e83af8b72cfe57809909220b90f5fd07f63973436b781068525bf3c6bcc804b', '[\"*\"]', NULL, NULL, '2025-08-26 16:39:08', '2025-08-26 16:39:08'),
(61, 'App\\Models\\User', 5, 'auth_token', '1c3219b824b0bcdf46cafe0489a626ef49ea7f4a38c8982d6e289f3e4d122945', '[\"*\"]', '2025-08-26 16:42:50', NULL, '2025-08-26 16:39:09', '2025-08-26 16:42:50'),
(62, 'App\\Models\\User', 5, 'auth_token', 'ca5988e3240baf0f989d2706b1659b657a3978cd36823d870fb54d2441876680', '[\"*\"]', NULL, NULL, '2025-08-26 16:43:11', '2025-08-26 16:43:11'),
(63, 'App\\Models\\Staff', 1, 'auth_token', '9ab485e3790a1bbce1b95ec3d55c739dd0d7b0c684fdbf3688f8d142402e63e9', '[\"*\"]', NULL, NULL, '2025-08-26 17:12:44', '2025-08-26 17:12:44'),
(64, 'App\\Models\\Staff', 1, 'auth_token', '801a359885a89fd1e1ff586ddd0d13ed89a50d92bf504ea47a00b64dd0d3f232', '[\"*\"]', NULL, NULL, '2025-08-26 17:13:03', '2025-08-26 17:13:03'),
(65, 'App\\Models\\Staff', 1, 'auth_token', '8ad730290e93e5b192333f4a67346945b84d683861b8092ceab799bd06a5800e', '[\"*\"]', NULL, NULL, '2025-08-26 17:13:19', '2025-08-26 17:13:19'),
(66, 'App\\Models\\Staff', 1, 'auth_token', '6c2f0b025ff9a8e5a3762c2fe1e1b9d230603dd1da9780605ec92142f353120e', '[\"*\"]', NULL, NULL, '2025-08-26 17:24:31', '2025-08-26 17:24:31'),
(67, 'App\\Models\\Staff', 1, 'auth_token', '4c68777930e2f0dbfac9f304498d0e6d39637e70d3fa75d0e09c9109bd28cc9f', '[\"*\"]', NULL, NULL, '2025-08-26 17:29:18', '2025-08-26 17:29:18'),
(68, 'App\\Models\\Staff', 1, 'auth_token', '4dbec3db5bcb10f3b692f7ad3ef8ef370b4cb3331636c7115a608ec9db55cbcc', '[\"*\"]', NULL, NULL, '2025-08-26 17:35:26', '2025-08-26 17:35:26'),
(69, 'App\\Models\\Staff', 1, 'auth_token', '6b19367aacf97b7bea6813ed17e679d6015e625c860e2be2ab497ed91d5e2404', '[\"*\"]', NULL, NULL, '2025-08-26 17:38:03', '2025-08-26 17:38:03'),
(70, 'App\\Models\\Staff', 1, 'auth_token', '578b14f63c053ce77f20c95cd57b3b15fffe0b36a3c940121007665819cce52b', '[\"*\"]', NULL, NULL, '2025-08-26 17:40:05', '2025-08-26 17:40:05'),
(71, 'App\\Models\\Staff', 1, 'auth_token', '6ed32e48b30a961575df06da0fd2019e7e62fd86641e6a8b313a8bc2fda63f63', '[\"*\"]', NULL, NULL, '2025-08-26 17:45:11', '2025-08-26 17:45:11'),
(72, 'App\\Models\\Staff', 1, 'auth_token', 'e44e140310d61283915377c121f0a2891467679442f39079df406c2a2286f6dd', '[\"*\"]', NULL, NULL, '2025-08-26 17:51:12', '2025-08-26 17:51:12'),
(73, 'App\\Models\\Staff', 1, 'auth_token', '7db71ecb5f9c08dd91bd96c44255d9a8bd1b40ff54c751a5b8d41e9422ef704b', '[\"*\"]', NULL, NULL, '2025-08-26 17:57:35', '2025-08-26 17:57:35'),
(74, 'App\\Models\\Staff', 1, 'auth_token', '6cce60d11119f733640a646cb69fc9d3db86fed3de4dc670c3f1e59723883364', '[\"*\"]', NULL, NULL, '2025-08-26 18:03:14', '2025-08-26 18:03:14'),
(75, 'App\\Models\\Staff', 1, 'auth_token', '007e8bdfbe3c5629e06e7524b23111e524ca399616352f847bb80ca9e06205d6', '[\"*\"]', NULL, NULL, '2025-08-26 18:06:27', '2025-08-26 18:06:27'),
(76, 'App\\Models\\Staff', 1, 'auth_token', '8141abd0fa624623c55fead8febb0dc8c07a7ce447874013b86b1c82854a7484', '[\"*\"]', NULL, NULL, '2025-08-26 18:10:18', '2025-08-26 18:10:18'),
(77, 'App\\Models\\Staff', 1, 'auth_token', 'bcb8be5112e5cabbf4e6f987a433a7b15e2ada74a5cd7a96575f7b0e11e79cc3', '[\"*\"]', NULL, NULL, '2025-08-26 18:28:32', '2025-08-26 18:28:32'),
(78, 'App\\Models\\Staff', 1, 'auth_token', 'd44620c8ecec221ababc3e7a62df490ee206f45198b7ec14051210794f45c56f', '[\"*\"]', NULL, NULL, '2025-08-26 18:29:13', '2025-08-26 18:29:13'),
(79, 'App\\Models\\Staff', 1, 'auth_token', 'c705ad055ffbab270ba016e5b32637e14845fecf7b7780a6614eb6b54ccceee3', '[\"*\"]', NULL, NULL, '2025-08-26 18:31:02', '2025-08-26 18:31:02'),
(80, 'App\\Models\\Staff', 1, 'auth_token', 'd5d03530df0dce36bc27963b5f2f7c34a0f6bbd893ef29aea01d1bbe95364237', '[\"*\"]', NULL, NULL, '2025-08-26 18:31:35', '2025-08-26 18:31:35'),
(81, 'App\\Models\\Staff', 1, 'auth_token', '0923d493fefb5ea314fb62a2315ee49c3c486da9f415d7e431b0e1c5eaadbbbe', '[\"*\"]', NULL, NULL, '2025-08-26 18:33:54', '2025-08-26 18:33:54'),
(82, 'App\\Models\\Staff', 1, 'auth_token', '218c203afee252d8f2609840f1455c588e1e9f3f9e924b06380cd9dd4e139fe0', '[\"*\"]', NULL, NULL, '2025-08-26 18:44:20', '2025-08-26 18:44:20'),
(83, 'App\\Models\\Staff', 1, 'auth_token', '528ebd2623674916776b2a5ef8a51d27b3bc74c7fe7423f977dcfcbd31209253', '[\"*\"]', NULL, NULL, '2025-08-26 19:19:40', '2025-08-26 19:19:40'),
(84, 'App\\Models\\Staff', 1, 'auth_token', 'ce6ebfac6741141735b3440e8fd321fb6a9201238acfec8f87ed4ab7167d1f77', '[\"*\"]', NULL, NULL, '2025-08-26 19:20:19', '2025-08-26 19:20:19'),
(85, 'App\\Models\\Staff', 1, 'auth_token', '383821f1b48519110bf8eeee2a832731403e475523669ea85b4bbb859881da78', '[\"*\"]', NULL, NULL, '2025-08-26 19:21:45', '2025-08-26 19:21:45'),
(86, 'App\\Models\\Staff', 1, 'auth_token', '09531e9c545e72fefcaf3cfebfa31781e8ff9241b18b3b6e3da484ca0f6b2178', '[\"*\"]', NULL, NULL, '2025-08-26 19:23:36', '2025-08-26 19:23:36'),
(87, 'App\\Models\\Staff', 1, 'auth_token', '23c4847685c9dab03ccc9683f9d728bca590a6f4fe00403d5315523fbe60a89d', '[\"*\"]', NULL, NULL, '2025-08-26 19:24:20', '2025-08-26 19:24:20'),
(88, 'App\\Models\\Staff', 1, 'auth_token', '041dcd663732fc0e73b6107a345e7ab417cd040d13a935a637816f31e111d1c7', '[\"*\"]', NULL, NULL, '2025-08-26 19:34:19', '2025-08-26 19:34:19'),
(89, 'App\\Models\\Staff', 1, 'auth_token', 'f690f5fb4693e24a090f0380d4c1615f765ce5b1906b438701902fe76ad56244', '[\"*\"]', NULL, NULL, '2025-08-26 19:36:02', '2025-08-26 19:36:02'),
(90, 'App\\Models\\Staff', 1, 'auth_token', 'b5d35679172a7c7020ed3fb5953bee1f9f1b67f1b31966c1bacbfd4b9e3c13d3', '[\"*\"]', NULL, NULL, '2025-08-26 19:40:37', '2025-08-26 19:40:37'),
(91, 'App\\Models\\Staff', 1, 'auth_token', 'ba01ff0a196a66dced88313a4676a716f8aee4f934697607f0401a3616d51d46', '[\"*\"]', NULL, NULL, '2025-08-26 19:47:45', '2025-08-26 19:47:45'),
(92, 'App\\Models\\Staff', 1, 'auth_token', '34953c1a7ddd36b718a71234df76827992ddc4b07c487328d45f38775744be57', '[\"*\"]', NULL, NULL, '2025-08-26 19:51:17', '2025-08-26 19:51:17'),
(93, 'App\\Models\\Staff', 1, 'auth_token', 'cac2cc772287b9348c87da1ec9fe5c0db56d6c5897226bf2c1a2f3db8ac499c6', '[\"*\"]', NULL, NULL, '2025-08-26 20:01:47', '2025-08-26 20:01:47'),
(94, 'App\\Models\\Staff', 1, 'auth_token', '35e9c1634e66dd55e8131309dd33644b21bd6219a04c2d16993bb3afd6483c97', '[\"*\"]', NULL, NULL, '2025-08-26 20:03:47', '2025-08-26 20:03:47'),
(95, 'App\\Models\\Staff', 1, 'auth_token', '898cb29dd8084375e26c09629c7170b5f1769684ee692a53dca73d2b05c1c9cb', '[\"*\"]', '2025-08-26 20:19:47', NULL, '2025-08-26 20:17:45', '2025-08-26 20:19:47'),
(96, 'App\\Models\\Staff', 1, 'auth_token', 'b92c202dd6230b9cebc9586a468b0938dd1c4895ec14ed870e63afca9c383312', '[\"*\"]', '2025-08-26 20:20:15', NULL, '2025-08-26 20:20:13', '2025-08-26 20:20:15'),
(98, 'App\\Models\\Staff', 1, 'auth_token', '685ab25e49da8c8ae5d685e0c923eca4ae2d04a76b6686f3268a010fcb781204', '[\"*\"]', NULL, NULL, '2025-08-27 11:32:50', '2025-08-27 11:32:50'),
(99, 'App\\Models\\Staff', 1, 'auth_token', '582daedef907c5621c77c135785a8b080fe11887118e32aeb54fdea0d2c31161', '[\"*\"]', NULL, NULL, '2025-08-27 11:34:36', '2025-08-27 11:34:36'),
(100, 'App\\Models\\Staff', 1, 'auth_token', '1414fd96477f23de59edc0bae95d8423f74c16de3388668efef9440fdab1c084', '[\"*\"]', NULL, NULL, '2025-08-27 11:35:52', '2025-08-27 11:35:52'),
(101, 'App\\Models\\Staff', 1, 'auth_token', 'bfad33f1243c6d8da268181ec2fd47c5c2d9ea5ec3a19e6902c02453509573b8', '[\"*\"]', NULL, NULL, '2025-08-27 11:36:36', '2025-08-27 11:36:36'),
(102, 'App\\Models\\Staff', 1, 'auth_token', 'aecd1940fad947a1350503e6daec06ac5a1e46d9c61a258e1a176e5e9524e914', '[\"*\"]', '2025-08-27 15:52:05', NULL, '2025-08-27 11:39:43', '2025-08-27 15:52:05'),
(103, 'App\\Models\\Staff', 1, 'auth_token', 'f091b6530da1095169f8a00b3f3d211e321708a4a12f866a0105bff045ce0181', '[\"*\"]', '2025-08-27 12:48:34', NULL, '2025-08-27 12:36:56', '2025-08-27 12:48:34'),
(104, 'App\\Models\\Staff', 1, 'auth_token', '76c2364246cab40069856e7035f3d54441d5a52821bd9e7f5e40c1f34508abab', '[\"*\"]', '2025-08-27 15:55:02', NULL, '2025-08-27 15:52:20', '2025-08-27 15:55:02'),
(105, 'App\\Models\\Staff', 1, 'auth_token', 'f24e271888ad0701328bd640f587b9c970f4f6a1cce1fcc020d7a3c7fc2a408c', '[\"*\"]', '2025-08-27 16:16:26', NULL, '2025-08-27 16:14:40', '2025-08-27 16:16:26'),
(106, 'App\\Models\\Staff', 1, 'auth_token', '77a88f25bf39e98b9e1e4fffb0342d4d2b890581c33c90b33e29e1adc46491e0', '[\"*\"]', '2025-08-27 16:18:57', NULL, '2025-08-27 16:18:56', '2025-08-27 16:18:57'),
(107, 'App\\Models\\Staff', 1, 'auth_token', 'ac4311743bf32acf2ea4ae28bd6ba3bf6b61d3a4cc556d0f7b7c7f799f1cd718', '[\"*\"]', '2025-08-27 22:51:50', NULL, '2025-08-27 16:55:54', '2025-08-27 22:51:50'),
(111, 'App\\Models\\Staff', 1, 'auth_token', 'f44dad9044203a3effd873185b95dfddf43e7fd1fcc65a6965ea4d80cae18bdc', '[\"*\"]', '2025-08-27 23:03:01', NULL, '2025-08-27 22:57:24', '2025-08-27 23:03:01'),
(112, 'App\\Models\\Staff', 1, 'auth_token', 'c642d3d77af29652ae2342a4dfbc311cebb54932b5b82892f8d96e18e6105ca9', '[\"*\"]', '2025-08-27 23:11:18', NULL, '2025-08-27 23:03:13', '2025-08-27 23:11:18'),
(113, 'App\\Models\\Staff', 1, 'auth_token', 'b07e603a64d7def5ecfd767753cdcca6174b68ad088796f15dd2423e723d445b', '[\"*\"]', '2025-08-27 23:19:34', NULL, '2025-08-27 23:11:28', '2025-08-27 23:19:34'),
(114, 'App\\Models\\Staff', 1, 'auth_token', 'c46d273f6bf3900a346115ac0ea1cbf4393ac101563013e54d3d47980bfece5e', '[\"*\"]', '2025-08-27 23:20:35', NULL, '2025-08-27 23:19:44', '2025-08-27 23:20:35'),
(115, 'App\\Models\\Staff', 1, 'auth_token', '784f60ec70f416a78e57bcbd2cb5ca3cc9e734f32c226c166896d4ead2ad1532', '[\"*\"]', '2025-08-27 23:22:10', NULL, '2025-08-27 23:20:48', '2025-08-27 23:22:10'),
(116, 'App\\Models\\Staff', 1, 'auth_token', '2deb9480e8e58fcf81dce65215910a70a4f87b185539caf4f55ee148b90d859a', '[\"*\"]', '2025-08-28 16:19:15', NULL, '2025-08-27 23:22:22', '2025-08-28 16:19:15'),
(122, 'App\\Models\\Staff', 1, 'auth_token', '1fbb36d29af84cd937a0a4f8ed08b552c000c34bca4311220bf5a31b8a136cb6', '[\"*\"]', '2025-09-01 08:22:43', NULL, '2025-09-01 08:22:05', '2025-09-01 08:22:43'),
(123, 'App\\Models\\Staff', 1, 'auth_token', '6ca1451465e84b6ac5f47831cd51260a0bb45dcc9cf31aeffab1967664130d78', '[\"*\"]', '2025-09-23 07:59:58', NULL, '2025-09-01 17:34:42', '2025-09-23 07:59:58'),
(124, 'App\\Models\\Staff', 1, 'auth_token', '5e4e0b9646868eda481c73e09edba9752fb47fd924b44cd9eacd8f120ec6a83b', '[\"*\"]', '2025-09-20 12:50:07', NULL, '2025-09-01 21:47:58', '2025-09-20 12:50:07'),
(125, 'App\\Models\\Staff', 1, 'auth_token', '312589b593dab3acc7541788f0a3426692a38e7703053439f319ea392d9dce4d', '[\"*\"]', '2025-09-05 13:42:02', NULL, '2025-09-05 13:42:01', '2025-09-05 13:42:02'),
(126, 'App\\Models\\Staff', 1, 'auth_token', '9f58ab0d27d58547774d9e766f73ba3ca30395502fb80be0ec4d402a2b4c3bd6', '[\"*\"]', '2025-09-07 08:16:06', NULL, '2025-09-07 06:30:07', '2025-09-07 08:16:06'),
(128, 'App\\Models\\Staff', 1, 'auth_token', 'fa266d1369be95563ea4e9045dc4bdd6e53d058a1931773bd9f3937334d3b3a4', '[\"*\"]', '2025-09-19 13:08:07', NULL, '2025-09-10 07:32:36', '2025-09-19 13:08:07'),
(129, 'App\\Models\\Staff', 1, 'auth_token', 'f95c3a917f7e4d271eab8c78f7f6c1c0359fc6f449771e0adf6711ec5161107d', '[\"*\"]', '2025-09-13 20:15:25', NULL, '2025-09-13 20:13:57', '2025-09-13 20:15:25'),
(130, 'App\\Models\\Staff', 1, 'auth_token', '0acd526d029ad103fad7c8356381272ec6e006817c319c72ef9989f731b6c6c0', '[\"*\"]', '2025-09-13 20:42:11', NULL, '2025-09-13 20:40:33', '2025-09-13 20:42:11'),
(131, 'App\\Models\\Staff', 1, 'auth_token', 'f78a5f4b4bc80df4371f143756886b2e7d4e69639910fae211ce0adb43829fd0', '[\"*\"]', '2025-09-19 13:08:20', NULL, '2025-09-13 21:05:52', '2025-09-19 13:08:20'),
(132, 'App\\Models\\Staff', 1, 'auth_token', '2d067d6c533f85717fa2085f8d0712cf4e7feeb7f8547f6f4c21cf041b811681', '[\"*\"]', '2025-09-18 18:33:43', NULL, '2025-09-14 22:20:07', '2025-09-18 18:33:43'),
(133, 'App\\Models\\Staff', 1, 'auth_token', '4d6a6c2e4eaa6165e7509b57c94d39662e15447af678458ea387c06bd6f3483d', '[\"*\"]', '2025-09-15 13:12:10', NULL, '2025-09-15 11:47:13', '2025-09-15 13:12:10'),
(134, 'App\\Models\\Staff', 1, 'auth_token', 'c1d8c99db969871ca35e2fc0038c0045ddeb716725b2f52dc1c6ec52d525b1e8', '[\"*\"]', '2025-09-21 19:57:28', NULL, '2025-09-21 19:50:53', '2025-09-21 19:57:28');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL,
  `features_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `price`, `duration`, `features_json`, `created_at`, `updated_at`) VALUES
(1, 'باقة أساسية', 99.00, 30, '[\"3 عقارات\", \"10 صور لكل عقار\", \"دعم فني\"]', '2025-08-26 10:57:57', '2025-08-26 10:57:57'),
(2, 'باقة متقدمة', 199.00, 30, '[\"10 عقارات\", \"20 صورة لكل عقار\", \"دعم فني سريع\", \"إعلانات مميزة\"]', '2025-08-26 10:57:57', '2025-08-26 10:57:57'),
(3, 'باقة بريميوم', 299.00, 30, '[\"عقارات غير محدودة\", \"50 صورة لكل عقار\", \"دعم فني على مدار الساعة\", \"إعلانات مميزة\", \"تقييمات مضمونة\"]', '2025-08-26 10:57:57', '2025-08-26 10:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_items`
--

CREATE TABLE `portfolio_items` (
  `id` int(11) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `type` enum('لوحات كانفس','تحف ديكورية','منحوتات جدارية','تشطيبات') DEFAULT NULL,
  `description_ar` text NOT NULL,
  `description_en` text DEFAULT NULL,
  `cover_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `medium_url` varchar(255) DEFAULT NULL,
  `altText` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `original_filename` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `images_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `portfolio_items`
--

INSERT INTO `portfolio_items` (`id`, `title_ar`, `title_en`, `type`, `description_ar`, `description_en`, `cover_url`, `thumbnail_url`, `medium_url`, `altText`, `caption`, `file_size`, `dimensions`, `original_filename`, `mime_type`, `seo_keywords`, `deleted_at`, `images_json`, `created_at`, `updated_at`) VALUES
(16, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download1.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:39', NULL, '2025-09-08 13:54:13', '2025-09-22 14:07:39'),
(17, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download2.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:43', NULL, '2025-09-08 13:54:43', '2025-09-22 14:07:43'),
(18, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download3.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:48', NULL, '2025-09-08 13:54:56', '2025-09-22 14:07:48'),
(19, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download4.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:52', NULL, '2025-09-08 13:55:05', '2025-09-22 14:07:52'),
(20, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download5.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:55', NULL, '2025-09-08 13:55:14', '2025-09-22 14:07:55'),
(21, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download6.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:07:58', NULL, '2025-09-08 13:55:22', '2025-09-22 14:07:58'),
(22, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download7.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:01', NULL, '2025-09-08 13:55:29', '2025-09-22 14:08:01'),
(23, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download8.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:03', NULL, '2025-09-08 13:55:36', '2025-09-22 14:08:03'),
(24, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/download9.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:05', NULL, '2025-09-08 13:55:42', '2025-09-22 14:08:05'),
(25, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:06', NULL, '2025-09-08 13:55:52', '2025-09-22 14:08:06'),
(26, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator1.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:08', NULL, '2025-09-08 13:56:01', '2025-09-22 14:08:08'),
(27, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator2.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:10', NULL, '2025-09-08 13:56:07', '2025-09-22 14:08:10'),
(28, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator3.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:11', NULL, '2025-09-08 13:56:13', '2025-09-22 14:08:11'),
(29, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator4.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:13', NULL, '2025-09-08 13:56:21', '2025-09-22 14:08:13'),
(30, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator5.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:14', NULL, '2025-09-08 13:56:28', '2025-09-22 14:08:14'),
(31, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator6.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:24', NULL, '2025-09-08 13:56:34', '2025-09-22 14:08:24'),
(32, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator7.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:30', NULL, '2025-09-08 13:56:41', '2025-09-22 14:08:30'),
(33, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator10.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:31', NULL, '2025-09-08 13:56:49', '2025-09-22 14:08:31'),
(34, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator11.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:32', NULL, '2025-09-08 14:00:18', '2025-09-22 14:08:32'),
(35, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator12.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:33', NULL, '2025-09-08 14:00:24', '2025-09-22 14:08:33'),
(36, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator13.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:26', NULL, '2025-09-08 14:00:29', '2025-09-22 14:08:26'),
(37, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator14.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:28', NULL, '2025-09-08 14:00:36', '2025-09-22 14:08:28'),
(38, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator15.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:27', NULL, '2025-09-08 14:00:44', '2025-09-22 14:08:27'),
(39, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator16.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:23', NULL, '2025-09-08 14:00:51', '2025-09-22 14:08:23'),
(40, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator17.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:21', NULL, '2025-09-08 14:00:56', '2025-09-22 14:08:21'),
(41, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator18.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:20', NULL, '2025-09-08 14:01:01', '2025-09-22 14:08:20'),
(42, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/generator19.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:19', NULL, '2025-09-08 14:01:11', '2025-09-22 14:08:19'),
(43, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/001.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:46', NULL, '2025-09-08 14:09:04', '2025-09-22 11:18:46'),
(44, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/002.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:45', NULL, '2025-09-08 14:09:17', '2025-09-22 11:18:45'),
(45, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/003.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:42', NULL, '2025-09-08 14:09:22', '2025-09-22 11:18:42'),
(46, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/004.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:33', NULL, '2025-09-08 14:09:28', '2025-09-22 11:18:33'),
(47, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/005.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', NULL, '2025-09-08 14:09:33', '2025-09-22 11:18:34'),
(48, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/006.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:34', NULL, '2025-09-08 14:09:39', '2025-09-22 11:18:34'),
(49, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/007.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:35', NULL, '2025-09-08 14:09:43', '2025-09-22 11:18:35'),
(50, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/008.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:36', NULL, '2025-09-08 14:09:48', '2025-09-22 11:18:36'),
(51, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/009.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:36', NULL, '2025-09-08 14:09:54', '2025-09-22 11:18:36'),
(52, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/010.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:52', NULL, '2025-09-08 14:10:03', '2025-09-22 11:18:52'),
(53, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/011.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:19:04', NULL, '2025-09-08 14:10:10', '2025-09-22 11:19:04'),
(54, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/012.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:55', NULL, '2025-09-08 14:10:16', '2025-09-22 11:18:55'),
(55, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/013.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:19:03', NULL, '2025-09-08 14:11:29', '2025-09-22 11:19:03'),
(56, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/014.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:56', NULL, '2025-09-08 14:11:34', '2025-09-22 11:18:56'),
(57, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/015.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:19:01', NULL, '2025-09-08 14:11:39', '2025-09-22 11:19:01'),
(58, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/016.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:57', NULL, '2025-09-08 14:11:44', '2025-09-22 11:18:57'),
(59, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/017.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:18:58', NULL, '2025-09-08 14:11:50', '2025-09-22 11:18:58'),
(60, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/018.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 11:19:00', NULL, '2025-09-08 14:11:56', '2025-09-22 11:19:00'),
(61, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/download_3_1-68d13070717dc.jpeg', 'portfolio/thumbnail/download_3_1-68d13070717dc.jpeg', 'portfolio/medium/download_3_1-68d13070717dc.jpeg', 'Download31 portfolio item', NULL, 127948, '{\"width\":1300,\"height\":974}', 'download_3_1.jpeg', 'image/jpeg', 'download31,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', '2025-09-22 11:18:16', NULL, '2025-09-08 14:12:02', '2025-09-22 11:18:16'),
(72, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/E9JfJFAgO0hKGcrTC1wH1bdDHjrVHZjZtTDX5TG3.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:37', NULL, '2025-09-17 13:46:16', '2025-09-22 14:08:37'),
(73, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/Vg9JULHN90bR2ghLlZg1fJKe4caU8DWPrkxYZR2O.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:37', NULL, '2025-09-17 13:46:36', '2025-09-22 14:08:37'),
(74, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/6jxAC2dbillpSdLmbrxPHPs8F62ig801eHU3XKvX.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:44', NULL, '2025-09-17 13:46:51', '2025-09-22 14:08:44'),
(75, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/YWelsSECuU6zQ7IkwJmc83jdniwVuTwRQeX1bwSD.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:46', NULL, '2025-09-17 13:50:07', '2025-09-22 14:08:46'),
(76, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/0EamzKQpZbx6s9cwUhmdOgphqVrgszJswquzhP1k.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:49', NULL, '2025-09-17 13:50:42', '2025-09-22 14:08:49'),
(77, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/FNnRIiFuOERMIH2hBROjhP6HOJ88gYWW1PjCLVoh.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:48', NULL, '2025-09-17 13:52:57', '2025-09-22 14:08:48'),
(78, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/mISANUIwcGsQj3rLYhOkCgyQRh9R6XxrJsW7fvtI.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:54', NULL, '2025-09-17 13:53:25', '2025-09-22 14:08:54'),
(79, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/u4fYlX01fHKU22gsaUtVJGbSdzhcaKJ2OXM9gGrq.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:51', NULL, '2025-09-17 14:20:29', '2025-09-22 14:08:51'),
(80, 'تحفة ديكورية', NULL, 'تحف ديكورية', 'تحف ديكورية', NULL, 'portfolio/5pVngbQ04fxBVtPsFSZWwC11zZLFVciuW4L8311j.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 14:08:52', NULL, '2025-09-17 14:20:46', '2025-09-22 14:08:52'),
(86, 'fdgfgfgfgfgfgfg', NULL, 'منحوتات جدارية', 'fffggdfgdfgdfgdfgdfgfgdfgdfg', NULL, 'portfolio/original/download_3_1_-_copy-68d11f8aa4e35.jpeg', 'portfolio/thumbnail/download_3_1_-_copy-68d11f8aa4e35.jpeg', 'portfolio/medium/download_3_1_-_copy-68d11f8aa4e35.jpeg', 'Download31copy portfolio item', NULL, 127948, '{\"width\":1300,\"height\":974}', 'download_3_1_-_copy.jpeg', 'image/jpeg', 'download31copy,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', '2025-09-22 11:17:37', NULL, '2025-09-22 10:06:02', '2025-09-22 11:17:37'),
(87, 'منحوتات', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/001-68d132dae4cb6.jpg', 'portfolio/thumbnail/001-68d132dae4cb6.jpg', 'portfolio/medium/001-68d132dae4cb6.jpg', '001 portfolio item', NULL, 481222, '{\"width\":1200,\"height\":1757}', '001.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:42:29', NULL, '2025-09-22 11:28:27', '2025-09-22 11:42:29'),
(88, 'منحوتات', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/002-68d1331f62102.jpg', 'portfolio/thumbnail/002-68d1331f62102.jpg', 'portfolio/medium/002-68d1331f62102.jpg', '002 portfolio item', NULL, 273858, '{\"width\":1200,\"height\":1956}', '002.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:30:13', NULL, '2025-09-22 11:29:35', '2025-09-22 11:30:13'),
(89, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/002-68d134933a181.jpg', 'portfolio/thumbnail/002-68d134933a181.jpg', 'portfolio/medium/002-68d134933a181.jpg', '002 portfolio item', NULL, 273858, '{\"width\":1200,\"height\":1956}', '002.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:42:32', NULL, '2025-09-22 11:35:47', '2025-09-22 11:42:32'),
(90, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/003-68d134c4a2737.jpg', 'portfolio/thumbnail/003-68d134c4a2737.jpg', 'portfolio/medium/003-68d134c4a2737.jpg', '003 portfolio item', NULL, 227859, '{\"width\":1200,\"height\":1329}', '003.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:42:30', NULL, '2025-09-22 11:36:36', '2025-09-22 11:42:30'),
(91, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/005-68d134efe8a3b.jpg', 'portfolio/thumbnail/005-68d134efe8a3b.jpg', 'portfolio/medium/005-68d134efe8a3b.jpg', '005 portfolio item', NULL, 320126, '{\"width\":1200,\"height\":1747}', '005.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:42:34', NULL, '2025-09-22 11:37:20', '2025-09-22 11:42:34'),
(92, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/006-68d13549ee304.jpg', 'portfolio/thumbnail/006-68d13549ee304.jpg', 'portfolio/medium/006-68d13549ee304.jpg', '006 portfolio item', NULL, 1365096, '{\"width\":1200,\"height\":1871}', '006.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 11:42:27', NULL, '2025-09-22 11:38:50', '2025-09-22 11:42:27'),
(93, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/001-68d14822e9073.jpg', 'portfolio/thumbnail/001-68d14822e9073.jpg', 'portfolio/medium/001-68d14822e9073.jpg', '001 portfolio item', NULL, 481222, '{\"width\":1200,\"height\":1757}', '001.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 13:04:43', NULL, '2025-09-22 12:59:15', '2025-09-22 13:04:43'),
(94, 'test test', NULL, 'منحوتات جدارية', 'tessssssssssssssssssssssssst', NULL, 'portfolio/original/001-68d149ac00adb.jpg', 'portfolio/thumbnail/001-68d149ac00adb.jpg', 'portfolio/medium/001-68d149ac00adb.jpg', '001 portfolio item', NULL, 481222, '{\"width\":1200,\"height\":1757}', '001.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', '2025-09-22 13:42:12', NULL, '2025-09-22 13:05:48', '2025-09-22 13:42:12'),
(95, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'tesssssssssssssssssssssssssst', NULL, 'portfolio/original/001-68d152938f14d.jpg', 'portfolio/thumbnail/001-68d152938f14d.jpg', 'portfolio/medium/001-68d152938f14d.jpg', 'test', 'test', 481222, '{\"width\":1200,\"height\":1757}', '001.jpg', 'image/jpeg', 'test,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', '2025-09-22 13:44:18', NULL, '2025-09-22 13:43:47', '2025-09-22 13:44:18'),
(96, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/001-68d152ef4aa8b.jpg', 'portfolio/thumbnail/001-68d152ef4aa8b.jpg', 'portfolio/medium/001-68d152ef4aa8b.jpg', 'منحوتة جدارية', 'منحوتة جدارية على شكل شجرة', 481222, '{\"width\":1200,\"height\":1757}', '001.jpg', 'image/jpeg', 'منحوتة,جدارية,على,شكل,شجرة,portfolio,art,decoration,canvas,sculpture', NULL, NULL, '2025-09-22 13:45:19', '2025-09-22 14:08:52'),
(97, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية رائعة', NULL, 'portfolio/original/002-68d1532a27880.jpg', 'portfolio/thumbnail/002-68d1532a27880.jpg', 'portfolio/medium/002-68d1532a27880.jpg', '002 portfolio item', NULL, 273858, '{\"width\":1200,\"height\":1956}', '002.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 13:46:18', '2025-09-22 13:46:18'),
(98, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/003-68d15340ba0e8.jpg', 'portfolio/thumbnail/003-68d15340ba0e8.jpg', 'portfolio/medium/003-68d15340ba0e8.jpg', '003 portfolio item', NULL, 227859, '{\"width\":1200,\"height\":1329}', '003.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 13:46:41', '2025-09-22 14:08:51'),
(99, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/004-68d1535c80213.jpg', 'portfolio/thumbnail/004-68d1535c80213.jpg', 'portfolio/medium/004-68d1535c80213.jpg', '004 portfolio item', NULL, 255227, '{\"width\":1200,\"height\":1788}', '004.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 13:47:08', '2025-09-22 13:47:08'),
(100, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/005-68d1538ab91b3.jpg', 'portfolio/thumbnail/005-68d1538ab91b3.jpg', 'portfolio/medium/005-68d1538ab91b3.jpg', '005 portfolio item', NULL, 320126, '{\"width\":1200,\"height\":1747}', '005.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 13:47:55', '2025-09-22 14:07:58'),
(101, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/006-68d153a66eb10.jpg', 'portfolio/thumbnail/006-68d153a66eb10.jpg', 'portfolio/medium/006-68d153a66eb10.jpg', '006 portfolio item', NULL, 1365096, '{\"width\":1200,\"height\":1871}', '006.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 13:48:22', '2025-09-22 13:48:22'),
(102, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/007-68d1567da1dd4.jpg', 'portfolio/thumbnail/007-68d1567da1dd4.jpg', 'portfolio/medium/007-68d1567da1dd4.jpg', '007 portfolio item', NULL, 73298, '{\"width\":1200,\"height\":1112}', '007.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:00:29', '2025-09-22 14:08:30'),
(103, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/008-68d15699ce790.jpg', 'portfolio/thumbnail/008-68d15699ce790.jpg', 'portfolio/medium/008-68d15699ce790.jpg', '008 portfolio item', NULL, 135639, '{\"width\":1200,\"height\":1200}', '008.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:00:58', '2025-09-22 14:00:58'),
(104, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/009-68d156c118567.jpg', 'portfolio/thumbnail/009-68d156c118567.jpg', 'portfolio/medium/009-68d156c118567.jpg', '009 portfolio item', NULL, 148858, '{\"width\":1200,\"height\":1616}', '009.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:01:37', '2025-09-22 14:08:46'),
(105, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/010-68d156cf8215a.jpg', 'portfolio/thumbnail/010-68d156cf8215a.jpg', 'portfolio/medium/010-68d156cf8215a.jpg', '010 portfolio item', NULL, 165462, '{\"width\":1200,\"height\":2133}', '010.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:01:52', '2025-09-22 14:01:52'),
(106, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/011-68d156ec6a216.jpg', 'portfolio/thumbnail/011-68d156ec6a216.jpg', 'portfolio/medium/011-68d156ec6a216.jpg', '011 portfolio item', NULL, 164880, '{\"width\":1200,\"height\":1800}', '011.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:02:20', '2025-09-22 14:12:54'),
(107, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/012-68d1571c4821a.jpg', 'portfolio/thumbnail/012-68d1571c4821a.jpg', 'portfolio/medium/012-68d1571c4821a.jpg', '012 portfolio item', NULL, 81950, '{\"width\":1200,\"height\":800}', '012.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:03:08', '2025-09-22 14:03:08'),
(108, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/013-68d15729e4e50.jpg', 'portfolio/thumbnail/013-68d15729e4e50.jpg', 'portfolio/medium/013-68d15729e4e50.jpg', '013 portfolio item', NULL, 115378, '{\"width\":1200,\"height\":1177}', '013.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:03:22', '2025-09-22 14:03:22'),
(109, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/014-68d157369b702.jpg', 'portfolio/thumbnail/014-68d157369b702.jpg', 'portfolio/medium/014-68d157369b702.jpg', '014 portfolio item', NULL, 136463, '{\"width\":1200,\"height\":1200}', '014.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:03:34', '2025-09-22 14:08:27'),
(110, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/015-68d15745b74f4.jpg', 'portfolio/thumbnail/015-68d15745b74f4.jpg', 'portfolio/medium/015-68d15745b74f4.jpg', '015 portfolio item', NULL, 188492, '{\"width\":1200,\"height\":1800}', '015.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:03:50', '2025-09-22 14:07:52'),
(111, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/016-68d15755671ee.jpg', 'portfolio/thumbnail/016-68d15755671ee.jpg', 'portfolio/medium/016-68d15755671ee.jpg', '016 portfolio item', NULL, 137345, '{\"width\":1200,\"height\":1150}', '016.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:04:05', '2025-09-22 14:08:21'),
(112, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/017-68d157684ce02.jpg', 'portfolio/thumbnail/017-68d157684ce02.jpg', 'portfolio/medium/017-68d157684ce02.jpg', '017 portfolio item', NULL, 176627, '{\"width\":1200,\"height\":1681}', '017.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:04:24', '2025-09-22 14:08:31'),
(113, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/018-68d1577d456c2.jpg', 'portfolio/thumbnail/018-68d1577d456c2.jpg', 'portfolio/medium/018-68d1577d456c2.jpg', '018 portfolio item', NULL, 110455, '{\"width\":1200,\"height\":1161}', '018.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:04:45', '2025-09-22 14:08:49'),
(114, 'منحوتات جدارية', NULL, 'منحوتات جدارية', 'منحوتات جدارية', NULL, 'portfolio/original/019-68d157a847de4.jpg', 'portfolio/thumbnail/019-68d157a847de4.jpg', 'portfolio/medium/019-68d157a847de4.jpg', '019 portfolio item', NULL, 100132, '{\"width\":1200,\"height\":1467}', '019.jpg', 'image/jpeg', 'portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury,modern', NULL, NULL, '2025-09-22 14:05:28', '2025-09-22 14:05:28'),
(115, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator10-68d15932612a9.jpg', 'portfolio/thumbnail/generator10-68d15932612a9.jpg', 'portfolio/medium/generator10-68d15932612a9.jpg', 'Generator10 portfolio item', NULL, 422342, '{\"width\":1200,\"height\":889}', 'generator10.jpg', 'image/jpeg', 'generator10,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:12:02', '2025-09-22 14:12:02'),
(116, 'لوحات كانفس', NULL, 'منحوتات جدارية', 'لوحات كانفس', NULL, 'portfolio/original/generator11-68d159563aadc.jpg', 'portfolio/thumbnail/generator11-68d159563aadc.jpg', 'portfolio/medium/generator11-68d159563aadc.jpg', 'Generator11 portfolio item', NULL, 586623, '{\"width\":1200,\"height\":1829}', 'generator11.jpg', 'image/jpeg', 'generator11,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', '2025-09-22 14:12:54', NULL, '2025-09-22 14:12:38', '2025-09-22 14:12:54'),
(117, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator11-68d1597a05f50.jpg', 'portfolio/thumbnail/generator11-68d1597a05f50.jpg', 'portfolio/medium/generator11-68d1597a05f50.jpg', 'Generator11 portfolio item', NULL, 586623, '{\"width\":1200,\"height\":1829}', 'generator11.jpg', 'image/jpeg', 'generator11,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:13:14', '2025-09-22 14:13:14'),
(118, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator12-68d1598a72d2c.jpg', 'portfolio/thumbnail/generator12-68d1598a72d2c.jpg', 'portfolio/medium/generator12-68d1598a72d2c.jpg', 'Generator12 portfolio item', NULL, 299637, '{\"width\":1200,\"height\":934}', 'generator12.jpg', 'image/jpeg', 'generator12,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:13:30', '2025-09-22 14:13:30'),
(119, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator13-68d1599f3af4a.jpg', 'portfolio/thumbnail/generator13-68d1599f3af4a.jpg', 'portfolio/medium/generator13-68d1599f3af4a.jpg', 'Generator13 portfolio item', NULL, 220193, '{\"width\":1200,\"height\":1381}', 'generator13.jpg', 'image/jpeg', 'generator13,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:13:51', '2025-09-22 14:13:51'),
(120, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator14-68d159b238a30.jpg', 'portfolio/thumbnail/generator14-68d159b238a30.jpg', 'portfolio/medium/generator14-68d159b238a30.jpg', 'Generator14 portfolio item', NULL, 315671, '{\"width\":1200,\"height\":2804}', 'generator14.jpg', 'image/jpeg', 'generator14,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:14:10', '2025-09-22 14:14:10'),
(121, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator15-68d159c44e146.jpg', 'portfolio/thumbnail/generator15-68d159c44e146.jpg', 'portfolio/medium/generator15-68d159c44e146.jpg', 'Generator15 portfolio item', NULL, 261709, '{\"width\":1200,\"height\":923}', 'generator15.jpg', 'image/jpeg', 'generator15,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:14:28', '2025-09-22 14:14:28'),
(122, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator16-68d159d4cdaae.jpg', 'portfolio/thumbnail/generator16-68d159d4cdaae.jpg', 'portfolio/medium/generator16-68d159d4cdaae.jpg', 'Generator16 portfolio item', NULL, 155022, '{\"width\":1200,\"height\":938}', 'generator16.jpg', 'image/jpeg', 'generator16,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:14:45', '2025-09-22 14:14:45'),
(123, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator17-68d159f197ae1.jpg', 'portfolio/thumbnail/generator17-68d159f197ae1.jpg', 'portfolio/medium/generator17-68d159f197ae1.jpg', 'Generator17 portfolio item', NULL, 179149, '{\"width\":1200,\"height\":1392}', 'generator17.jpg', 'image/jpeg', 'generator17,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:15:14', '2025-09-22 14:15:14'),
(124, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator18-68d15a03d7be8.jpg', 'portfolio/thumbnail/generator18-68d15a03d7be8.jpg', 'portfolio/medium/generator18-68d15a03d7be8.jpg', 'Generator18 portfolio item', NULL, 228061, '{\"width\":1200,\"height\":944}', 'generator18.jpg', 'image/jpeg', 'generator18,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:15:32', '2025-09-22 14:15:32'),
(125, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator19-68d15a13df5c3.jpg', 'portfolio/thumbnail/generator19-68d15a13df5c3.jpg', 'portfolio/medium/generator19-68d15a13df5c3.jpg', 'Generator19 portfolio item', NULL, 242804, '{\"width\":1200,\"height\":1539}', 'generator19.jpg', 'image/jpeg', 'generator19,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:15:48', '2025-09-22 14:15:48'),
(126, 'لوحات كانفس', NULL, 'منحوتات جدارية', 'لوحات كانفس', NULL, 'portfolio/original/generator-68d15a4957ad5.jpg', 'portfolio/thumbnail/generator-68d15a4957ad5.jpg', 'portfolio/medium/generator-68d15a4957ad5.jpg', 'Generator portfolio item', NULL, 405595, '{\"width\":1200,\"height\":2042}', 'generator.jpg', 'image/jpeg', 'generator,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:16:41', '2025-09-22 14:16:41'),
(127, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator1-68d15a601e176.jpg', 'portfolio/thumbnail/generator1-68d15a601e176.jpg', 'portfolio/medium/generator1-68d15a601e176.jpg', 'Generator1 portfolio item', NULL, 282012, '{\"width\":1200,\"height\":854}', 'generator1.jpg', 'image/jpeg', 'generator1,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:17:04', '2025-09-22 14:17:04'),
(128, 'لوحات كانفس', NULL, 'منحوتات جدارية', 'لوحات كانفس', NULL, 'portfolio/original/generator3-68d15a7bb4183.jpg', 'portfolio/thumbnail/generator3-68d15a7bb4183.jpg', 'portfolio/medium/generator3-68d15a7bb4183.jpg', 'Generator3 portfolio item', NULL, 287691, '{\"width\":1200,\"height\":1768}', 'generator3.jpg', 'image/jpeg', 'generator3,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:17:32', '2025-09-22 14:17:32'),
(129, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator4-68d15ab8590ff.jpg', 'portfolio/thumbnail/generator4-68d15ab8590ff.jpg', 'portfolio/medium/generator4-68d15ab8590ff.jpg', 'Generator4 portfolio item', NULL, 312652, '{\"width\":1200,\"height\":900}', 'generator4.jpg', 'image/jpeg', 'generator4,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:18:32', '2025-09-22 14:18:32'),
(130, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator5-68d15adabddbe.jpg', 'portfolio/thumbnail/generator5-68d15adabddbe.jpg', 'portfolio/medium/generator5-68d15adabddbe.jpg', 'Generator5 portfolio item', NULL, 124330, '{\"width\":1200,\"height\":1829}', 'generator5.jpg', 'image/jpeg', 'generator5,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:19:07', '2025-09-22 14:19:07'),
(131, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator6-68d15aef60ed1.jpg', 'portfolio/thumbnail/generator6-68d15aef60ed1.jpg', 'portfolio/medium/generator6-68d15aef60ed1.jpg', 'Generator6 portfolio item', NULL, 536170, '{\"width\":1200,\"height\":1399}', 'generator6.jpg', 'image/jpeg', 'generator6,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:19:27', '2025-09-22 14:19:27'),
(132, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/generator7-68d15b0768dc7.jpg', 'portfolio/thumbnail/generator7-68d15b0768dc7.jpg', 'portfolio/medium/generator7-68d15b0768dc7.jpg', 'Generator7 portfolio item', NULL, 193266, '{\"width\":1200,\"height\":867}', 'generator7.jpg', 'image/jpeg', 'generator7,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:19:51', '2025-09-22 14:19:51'),
(133, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download3-68d15ba367d55.png', 'portfolio/thumbnail/download3-68d15ba367d55.png', 'portfolio/medium/download3-68d15ba367d55.png', 'Download3 portfolio item', NULL, 1737884, '{\"width\":1300,\"height\":975}', 'download3.png', 'image/png', 'download3,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:22:29', '2025-09-22 14:22:29'),
(134, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download4-68d15bb399ec1.png', 'portfolio/thumbnail/download4-68d15bb399ec1.png', 'portfolio/medium/download4-68d15bb399ec1.png', 'Download4 portfolio item', NULL, 1211987, '{\"width\":1300,\"height\":962}', 'download4.png', 'image/png', 'download4,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:22:45', '2025-09-22 14:22:45'),
(135, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download5-68d15bc967eca.png', 'portfolio/thumbnail/download5-68d15bc967eca.png', 'portfolio/medium/download5-68d15bc967eca.png', 'Download5 portfolio item', NULL, 1836705, '{\"width\":1300,\"height\":975}', 'download5.png', 'image/png', 'download5,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:23:07', '2025-09-22 14:23:07'),
(136, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download6-68d15bdd0cf26.png', 'portfolio/thumbnail/download6-68d15bdd0cf26.png', 'portfolio/medium/download6-68d15bdd0cf26.png', 'Download6 portfolio item', NULL, 1764188, '{\"width\":1300,\"height\":940}', 'download6.png', 'image/png', 'download6,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:23:26', '2025-09-22 14:23:26'),
(137, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download7-68d15bf0553b7.png', 'portfolio/thumbnail/download7-68d15bf0553b7.png', 'portfolio/medium/download7-68d15bf0553b7.png', 'Download7 portfolio item', NULL, 1357334, '{\"width\":1300,\"height\":962}', 'download7.png', 'image/png', 'download7,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:23:45', '2025-09-22 14:23:45'),
(138, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download8-68d15c0290e19.png', 'portfolio/thumbnail/download8-68d15c0290e19.png', 'portfolio/medium/download8-68d15c0290e19.png', 'Download8 portfolio item', NULL, 1720915, '{\"width\":1300,\"height\":975}', 'download8.png', 'image/png', 'download8,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:24:04', '2025-09-22 14:24:04'),
(139, 'لوحات كانفس', NULL, 'لوحات كانفس', 'لوحات كانفس', NULL, 'portfolio/original/download9-68d15c17b51af.png', 'portfolio/thumbnail/download9-68d15c17b51af.png', 'portfolio/medium/download9-68d15c17b51af.png', 'Download9 portfolio item', NULL, 1651760, '{\"width\":1300,\"height\":975}', 'download9.png', 'image/png', 'download9,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:24:25', '2025-09-22 14:24:25'),
(140, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture6-68d15c4d1ac81.png', 'portfolio/thumbnail/picture6-68d15c4d1ac81.png', 'portfolio/medium/picture6-68d15c4d1ac81.png', 'Picture6 portfolio item', NULL, 615642, '{\"width\":1200,\"height\":1601}', 'picture6.png', 'image/png', 'picture6,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:25:18', '2025-09-22 14:25:18'),
(141, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture7-68d15c5fd1eb2.png', 'portfolio/thumbnail/picture7-68d15c5fd1eb2.png', 'portfolio/medium/picture7-68d15c5fd1eb2.png', 'Picture7 portfolio item', NULL, 805376, '{\"width\":1200,\"height\":1601}', 'picture7.png', 'image/png', 'picture7,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:25:37', '2025-09-22 14:25:37'),
(142, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture8-68d15c6f846ba.png', 'portfolio/thumbnail/picture8-68d15c6f846ba.png', 'portfolio/medium/picture8-68d15c6f846ba.png', 'Picture8 portfolio item', NULL, 478969, '{\"width\":1200,\"height\":1501}', 'picture8.png', 'image/png', 'picture8,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:25:52', '2025-09-22 14:25:52'),
(143, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture9-68d15c832aa69.png', 'portfolio/thumbnail/picture9-68d15c832aa69.png', 'portfolio/medium/picture9-68d15c832aa69.png', 'Picture9 portfolio item', NULL, 880067, '{\"width\":1200,\"height\":1601}', 'picture9.png', 'image/png', 'picture9,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:26:12', '2025-09-22 14:26:12'),
(144, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture1-68d15c9a35776.jpg', 'portfolio/thumbnail/picture1-68d15c9a35776.jpg', 'portfolio/medium/picture1-68d15c9a35776.jpg', 'Picture1 portfolio item', NULL, 149786, '{\"width\":1200,\"height\":1601}', 'picture1.jpg', 'image/jpeg', 'picture1,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:26:34', '2025-09-22 14:26:34'),
(145, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture2-68d15ca8aa3b3.png', 'portfolio/thumbnail/picture2-68d15ca8aa3b3.png', 'portfolio/medium/picture2-68d15ca8aa3b3.png', 'Picture2 portfolio item', NULL, 437248, '{\"width\":1200,\"height\":1601}', 'picture2.png', 'image/png', 'picture2,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:26:49', '2025-09-22 14:26:49'),
(146, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture4-68d15cba4b66b.png', 'portfolio/thumbnail/picture4-68d15cba4b66b.png', 'portfolio/medium/picture4-68d15cba4b66b.png', 'Picture4 portfolio item', NULL, 637565, '{\"width\":1200,\"height\":1601}', 'picture4.png', 'image/png', 'picture4,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:27:07', '2025-09-22 14:27:07'),
(147, 'ديكور رائع', NULL, 'تحف ديكورية', 'ديكور رائع', NULL, 'portfolio/original/picture5-68d15ccf48380.jpg', 'portfolio/thumbnail/picture5-68d15ccf48380.jpg', 'portfolio/medium/picture5-68d15ccf48380.jpg', 'Picture5 portfolio item', NULL, 236372, '{\"width\":1200,\"height\":1599}', 'picture5.jpg', 'image/jpeg', 'picture5,portfolio,art,decoration,canvas,sculpture,wall art,interior design,home decor,luxury', NULL, NULL, '2025-09-22 14:27:27', '2025-09-22 14:27:27');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `desc_ar` text NOT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `listing_plan` varchar(100) DEFAULT NULL,
  `desc_en` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `area` decimal(10,2) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `type` enum('شقة','فيلا','ارض','تجاري') NOT NULL,
  `status` enum('للبيع','للإيجار','مباع','مؤجر') NOT NULL DEFAULT 'للبيع',
  `finish` varchar(50) DEFAULT NULL,
  `is_listed` tinyint(1) NOT NULL DEFAULT 1,
  `listing_end_date` date DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `google_maps_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `requested_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title_ar`, `title_en`, `desc_ar`, `keywords`, `listing_plan`, `desc_en`, `price`, `area`, `bedrooms`, `bathrooms`, `type`, `status`, `finish`, `is_listed`, `listing_end_date`, `lat`, `lng`, `google_maps_url`, `address`, `is_published`, `created_by`, `updated_by`, `requested_by`, `requested_at`, `created_at`, `updated_at`) VALUES
(46, 'ارض تصميم', NULL, 'وصف', 'تصميم', 'paid', NULL, 1000000.00, 100.00, NULL, NULL, 'ارض', 'للبيع', NULL, 1, '2025-10-03', 30.14091653, 31.67971361, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'التجمع الخامس', 1, 1, NULL, 11, '2025-09-03 17:07:01', '2025-09-03 17:07:01', '2025-09-07 16:27:12'),
(47, 'عنوان', NULL, 'وصف', NULL, NULL, NULL, 100000.00, NULL, NULL, NULL, 'تجاري', 'للبيع', NULL, 1, '2025-10-03', NULL, NULL, 'https://maps.app.goo.gl/7UxXNQN1LfoepX2H7', 'العنوان', 1, 1, NULL, NULL, NULL, '2025-09-03 17:31:37', '2025-09-03 17:31:37'),
(48, 'فيلا تشطيب', NULL, 'وصف', 'تشطيب', 'paid', NULL, 1000000000.00, 98.00, 3, 2, 'فيلا', 'للبيع', 'على الطوب', 1, '2025-10-07', 30.14091653, 31.67971361, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'التجمع الخامس', 1, 1, NULL, 18, '2025-09-07 16:05:03', '2025-09-07 16:05:03', '2025-09-23 06:25:28'),
(49, 'بينتينبتينسمبلةيس', NULL, 'يبيسشبلرلالبيسب', NULL, NULL, NULL, 23456.00, 100.00, 2, 3, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-08', NULL, NULL, NULL, 'بيلبيسبلبيق', 1, 1, NULL, NULL, NULL, '2025-09-07 21:29:35', '2025-09-07 21:35:50'),
(50, 'شقة اختبار\nشقه متتشطبة وجاهزة للسكن', NULL, 'اكتشف قمة الفخامة والراحة في هذه الشقة الراقية بمساحة 150 متر مربع، المصممة بعناية فائقة لتكون جاهزة للسكن الفوري. ادخل عالماً من التفاصيل المتقنة؛ حيث تقدم هذه الشقة المتتشطبة بالكامل انتقالاً سلساً نحو نمط الحياة الذي طالما حلمت به. تتميز بتصميم داخلي فسيح وتشطيبات عالية الجودة، مما يجعلها ملاذاً مثالياً للباحثين عن الرفاهية بلا حدود. منزلك الجاهز ينتظرك، واعداً بتجربة معيشية لا مثيل لها منذ لحظة دخولك.', 'اختبار\nشقه متتشطبة وجاهزة للسكن', 'commission', NULL, 1500000.00, 150.00, 3, 2, 'شقة', 'للبيع', NULL, 1, '2025-10-08', NULL, NULL, NULL, 'الحي السادس بجانب الجهاز', 1, 1, NULL, 22, '2025-09-08 15:34:02', '2025-09-08 15:34:02', '2025-09-13 21:53:39'),
(51, 'فيلا CF', NULL, 'DD', 'CF', 'paid', NULL, 234567890.00, 100.00, 3, 1, 'فيلا', 'للإيجار', NULL, 1, '2025-10-14', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'aswan', 1, 1, NULL, 13, '2025-09-14 09:05:31', '2025-09-14 09:05:31', '2025-09-14 20:23:08'),
(52, 'شقة KJHGFDFGHJK', NULL, 'FGHJKJHGV', 'KJHGFDFGHJK', 'paid', NULL, 1000000.00, 100.00, 3, 1, 'شقة', 'للبيع', 'على الطوب', 1, '2025-10-14', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'التجمع الخامس', 1, 1, NULL, 33, '2025-09-14 09:07:47', '2025-09-14 09:07:47', '2025-09-14 09:08:44'),
(53, 'شقة تصميم', NULL, 'وصف', 'تصميم', 'paid', NULL, 10000000.00, 100.00, 3, 1, 'شقة', 'للإيجار', 'نص تشطيب', 1, '2025-10-14', 0.00000000, 0.00000000, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'التجمع الخامس', 1, 1, NULL, 13, '2025-09-14 10:58:25', '2025-09-14 10:58:25', '2025-09-19 15:57:31'),
(54, 'فيلا تصميم', NULL, 'وصف', 'تصميم', 'paid', NULL, 1000000.00, 100.00, 3, 1, 'فيلا', 'للبيع', 'نص تشطيب', 1, '2025-10-14', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'التجمع الخامس', 1, 1, NULL, 13, '2025-09-14 11:10:06', '2025-09-14 11:10:06', '2025-09-14 20:24:10'),
(57, 'هوليوبليس', NULL, 'ننن', NULL, NULL, NULL, 25000.00, 220.00, 2, 2, 'شقة', 'للإيجار', 'تشطيب كامل', 1, '2025-10-14', 22.00000000, 23.00000000, NULL, 'هوليوبلس', 1, 1, NULL, NULL, NULL, '2025-09-14 17:58:06', '2025-09-23 06:25:30'),
(58, 'هوليوبليس', NULL, '...', NULL, NULL, NULL, 2200.00, 220.00, 2, 2, 'شقة', 'للإيجار', 'على الطوب', 1, '2025-10-14', 22.00000000, 22.00000000, NULL, 'هيلوبليس', 1, 1, NULL, NULL, NULL, '2025-09-14 19:21:02', '2025-09-20 14:36:27'),
(59, 'مصر الجديدة', NULL, '...', NULL, NULL, NULL, 10000.00, 22.00, 2, 2, 'شقة', 'للإيجار', 'تشطيب كامل', 1, '2025-10-14', 20.00000000, 40.00000000, NULL, 'مصر الجديدة', 1, 1, NULL, NULL, NULL, '2025-09-14 19:31:26', '2025-09-14 20:25:25'),
(61, 'شقة تصميم شاشه', NULL, 'تركيا', 'تصميم شاشه', 'paid', NULL, 4444000.00, 220.00, 4, 2, 'شقة', 'للبيع', 'على الطوب', 1, '2025-10-15', 20.00000000, 20.00000000, 'https://whitehomedecor.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-09-at-10.42.25-AM-1.jpeg', 'El ibrahymia', 1, 1, NULL, 41, '2025-09-15 13:17:19', '2025-09-15 13:17:19', '2025-09-15 13:20:16'),
(62, 'شقة تصميم عصري', NULL, 'شقة تشطيب كامل', 'تصميم عصري', 'paid', NULL, 4000000.00, 100.00, 3, 3, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-15', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'القاهرة-الجيزة', 1, 1, NULL, 73, '2025-09-15 19:06:31', '2025-09-19 13:14:08', '2025-09-19 13:14:08'),
(63, 'شقة تصميم', NULL, 'وصف', 'تصميم', 'paid', NULL, 4000000.00, 100.00, 3, 3, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-15', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'القاهرة-الجيزة', 1, 1, NULL, 74, '2025-09-15 19:35:16', '2025-09-19 15:19:12', '2025-09-20 14:14:43'),
(64, 'شقة تصميم', NULL, 'وصف', 'تصميم', 'paid', NULL, 4000000.00, 100.00, 3, 3, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-15', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'القاهرة-الجيزة', 1, 1, NULL, 74, '2025-09-15 19:35:54', '2025-09-20 13:47:33', '2025-09-20 13:47:33'),
(65, 'شقة سيبلاالبيسش', NULL, 'يبللاىلاربيس', 'سيبلاالبيسش', 'commission', NULL, 4000000.00, 100.00, 3, 3, 'شقة', 'للإيجار', NULL, 1, '2025-10-15', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'aswan', 1, 1, NULL, 13, '2025-09-15 19:50:11', '2025-09-20 13:46:34', '2025-09-20 13:46:34'),
(66, 'تجاري sdfghjkl;\'', NULL, '/.,mnbvcxcvbnm,', 'sdfghjkl;\'', 'paid', NULL, 10000000.00, 100.00, NULL, NULL, 'تجاري', 'للإيجار', NULL, 1, '2025-10-15', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'الجوزيرة - نجع العمراب - بجوار نادي ابوالريش قبلي', 1, 1, NULL, 13, '2025-09-15 19:52:02', '2025-09-20 13:50:26', '2025-09-20 13:50:26'),
(70, 'شقة ريءريءبسيبسيبسب', NULL, 'يسبسيبسيبسيبسيب', 'ريءريءبسيبسيبسب', 'paid', NULL, 10000000.00, 100.00, 3, 3, 'شقة', 'للبيع', 'على الطوب', 1, '2025-10-16', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'الجوزيرة - نجع العمراب - بجوار نادي ابوالريش قبلي', 1, 1, NULL, 13, '2025-09-16 13:38:02', '2025-09-20 13:50:17', '2025-09-20 17:38:13'),
(71, 'فيلا FGHM,JLKHGFDSASDFGHJ', NULL, 'GHJKHGFDSAsdfghyuh', 'FGHM,JLKHGFDSASDFGHJ', 'paid', NULL, 10000000.00, 100.00, 3, 3, 'فيلا', 'للبيع', 'تشطيب كامل', 1, '2025-10-16', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'الجوزيرة - نجع العمراب - بجوار نادي ابوالريش قبلي', 1, 1, NULL, 13, '2025-09-16 13:40:06', '2025-09-19 15:32:24', '2025-09-19 15:32:24'),
(73, 'ارض dgfsfdfsdfdf', NULL, 'dfdfdfsdf', 'dgfsfdfsdfdf', 'paid', NULL, 4000000.00, 100.00, NULL, NULL, 'ارض', 'للبيع', NULL, 1, '2025-10-16', NULL, NULL, 'https://maps.app.goo.gl/FgDT1A86Lmgk4agM7', 'الجوزيرة - نجع العمراب - بجوار نادي ابوالريش قبلي', 1, 1, NULL, 13, '2025-09-16 14:07:37', '2025-09-20 13:50:34', '2025-09-23 06:25:23'),
(74, 'شقة تشطيب سوبر لوكس', NULL, 'اكتشف الفخامة التي لا مثيل لها في هذه الشقة الفاخرة التي تبلغ مساحتها 300 متر مربع. تتميز بتشطيبات سوبر لوكس رائعة في كل زاوية، فقد تم تصميم كل تفصيل في هذا المسكن بعناية فائقة ليوفر أسلوب حياة يتميز بالرقي والراحة. من المواد عالية الجودة إلى التصميم الأنيق، تعد هذه الشقة الواسعة تحفة فنية حقيقية، جاهزة لتكون منزل أحلامك. اختبر الرفاهية في أبهى صورها.', 'تشطيب سوبر لوكس', 'commission', NULL, 4000000.00, 300.00, 3, 3, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-17', 12.00000000, NULL, 'https://maps.app.goo.gl/snqqYaNSt3Do3Zuw7', 'القاهره -الجيزه', 1, 1, NULL, 50, '2025-09-17 08:25:24', '2025-09-20 14:36:39', '2025-09-20 14:36:39'),
(75, 'شقة creative', NULL, 'اكتشف ملاذًا حضريًا لا مثيل له، مصممًا خصيصًا للباحثين عن التميز. هذه الشقة الفاخرة التي تبلغ مساحتها 100 متر مربع هي تحفة فنية من التصميم الإبداعي، حيث تم تنسيق كل التفاصيل بعناية فائقة لإلهامك والارتقاء بتجربة معيشتك. انغمس في عالم من الراحة الراقية، الجماليات المبتكرة، والتشطيبات الفاخرة. هذا ليس مجرد منزل؛ بل هو لوحة فنية لأسلوب حياتك الفريد، يقدم مزيجًا متناغمًا من الفخامة والحياة الملهمة. اختبر قمة الأناقة العصرية واجعل هذا السكن المميز ملكًا لك.', 'creative', 'paid', NULL, 20000000.00, 100.00, 4, 2, 'شقة', 'للإيجار', 'نص تشطيب', 1, '2025-10-19', 0.00000000, 0.00000000, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'El ibrahymia', 1, 1, NULL, 68, '2025-09-19 08:39:06', '2025-09-19 08:47:20', '2025-09-23 06:25:21'),
(76, 'شقة تصميم عصري وانيق', NULL, 'شقه بها تلات غرف وتلات حمامات', 'تصميم عصري وانيق', 'paid', NULL, 150000.00, 300.00, 3, 3, 'شقة', 'للإيجار', 'نص تشطيب', 1, '2025-10-19', 0.00000000, 0.00000000, 'https://maps.app.goo.gl/yzvkmZrgLJrsUgLN9', 'Cairo, Egypt', 1, 1, NULL, 25, '2025-09-19 10:17:04', '2025-09-19 10:18:50', '2025-09-19 12:06:41'),
(77, 'retest', NULL, '....', NULL, NULL, NULL, 2200000.00, 200.00, 2, 2, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-10-19', 2.00000000, 2.00000000, 'https://meet.google.com/ozz-vnrg-bfz', 'misr', 1, 1, NULL, NULL, NULL, '2025-09-19 12:18:06', '2025-09-20 14:26:55'),
(78, 'شقة تصميم راقى', NULL, 'تصميم راقى', 'تصميم راقى', 'paid', NULL, 40000000.00, 100.00, 4, 2, 'شقة', 'للإيجار', NULL, 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'ibrahimia', 1, 1, NULL, 41, '2025-09-19 12:49:27', '2025-09-20 18:22:55', '2025-09-20 18:22:55'),
(79, 'شقة اطلاله عصريه وجميله', NULL, 'لليقسثقستيفلبغابغعاتلعغبفغ', 'اطلاله عصريه وجميله', 'paid', NULL, 150000.00, 300.00, 3, 3, 'شقة', 'للبيع', 'نص تشطيب', 1, '2025-10-19', 22.00000000, 21.00000000, 'https://maps.app.goo.gl/yzvkmZrgLJrsUgLN9', 'Cairo, Egypt', 1, 1, NULL, 25, '2025-09-19 12:49:40', '2025-09-20 13:50:47', '2025-09-21 05:09:44'),
(80, 'ارض ارض زراعية', NULL, 'ارض راعية', 'ارض زراعية', 'paid', NULL, 40000000.00, 100.00, 0, 0, 'ارض', 'للبيع', NULL, 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'El ibrahymia', 1, 1, NULL, 53, '2025-09-19 12:53:20', '2025-09-21 04:32:47', '2025-09-21 04:32:47'),
(81, 'ارض وراعية', NULL, 'ارض زراعية', 'وراعية', 'paid', NULL, 1000000.00, 100.00, NULL, NULL, 'ارض', 'للإيجار', NULL, 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'ibrahimia', 0, NULL, NULL, 41, '2025-09-19 12:54:31', '2025-09-19 12:54:31', '2025-09-19 12:54:31'),
(82, 'فيلا تصميم تحفه وتشطيب روعه', NULL, 'ؤرلثة ىةؤءى وؤت هبختهلانلبن', 'تصميم تحفه وتشطيب روعه', 'paid', NULL, 150000.00, 300.00, 7, 3, 'فيلا', 'للبيع', 'تشطيب كامل', 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/yzvkmZrgLJrsUgLN9', 'Cairo, Egypt', 0, NULL, NULL, 25, '2025-09-19 12:56:26', '2025-09-19 12:56:26', '2025-09-19 12:56:26'),
(83, 'شقة يسيسيس', NULL, 'يسيسيسي', 'يسيسيس', 'paid', NULL, 2220000.00, 100.00, 2, 2, 'شقة', 'للبيع', 'على الطوب', 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'ibrahimia', 1, 1, NULL, 41, '2025-09-19 12:58:58', '2025-09-20 13:51:27', '2025-09-23 06:25:26'),
(84, 'شقة اببي', NULL, 'ببابيابال', 'اببي', 'commission', NULL, 4000000.00, 100.00, 2, 2, 'شقة', 'للإيجار', 'على الطوب', 1, '2025-10-19', NULL, NULL, 'https://maps.app.goo.gl/GErqw3uBsMhmmBA69', 'ibrahimia', 1, 1, NULL, 41, '2025-09-19 12:59:55', '2025-09-20 14:29:46', '2025-09-20 14:29:46'),
(90, 'عقار جديد', NULL, 'وصف وصف وصف', NULL, NULL, NULL, 100000.00, 100.00, 3, 1, 'شقة', 'للبيع', 'تشطيب كامل', 1, '2025-09-26', 20.00000000, 30.00000000, 'https://hpanel.hostinger.com/websites/onlyhelio.com', 'العنوان', 1, 1, NULL, NULL, NULL, '2025-09-23 06:26:58', '2025-09-23 07:03:04');

-- --------------------------------------------------------

--
-- Table structure for table `property_amenities`
--

CREATE TABLE `property_amenities` (
  `property_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `medium_url` varchar(255) DEFAULT NULL,
  `sort` int(11) DEFAULT 0,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `altText` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `original_filename` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `isfeatured` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `url`, `thumbnail_url`, `medium_url`, `sort`, `updated_at`, `created_at`, `altText`, `caption`, `file_size`, `dimensions`, `original_filename`, `mime_type`, `seo_keywords`, `isfeatured`, `deleted_at`) VALUES
(51, 46, 'properties/v4c2jown6uvhTMrOmDsJLCXSkNSWgeB7LOCFk7aU.jpg', NULL, NULL, 0, '2025-09-03 17:07:01', '2025-09-03 17:07:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(52, 46, 'properties/H6fYQ7zmVcZTIKtXh8ZaDvDuqcFfNalXbamJvYJO.jpg', NULL, NULL, 0, '2025-09-03 17:07:01', '2025-09-03 17:07:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(53, 46, 'properties/1y5Ohya6jxK2SNZ1GA6NlzNuiW4mvfEsSjEU1OmU.jpg', NULL, NULL, 0, '2025-09-03 17:07:01', '2025-09-03 17:07:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(54, 48, 'properties/AlJ8QfoyZjQhtXs3JmyMi5qioGfwFApsicGK8cwL.jpg', NULL, NULL, 0, '2025-09-07 16:05:04', '2025-09-07 16:05:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(55, 49, 'properties/iDSNS0zrAkk0m8Mh4LWQCQVThMr7c4ZvbnwGv5Q7.jpg', NULL, NULL, 0, '2025-09-07 21:29:35', '2025-09-07 21:29:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(56, 50, 'properties/4oGvSFRcy8Wn74DJ6Gai6wDlnI9owiGtvQCsI9uo.jpg', NULL, NULL, 0, '2025-09-08 15:34:03', '2025-09-08 15:34:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(57, 50, 'properties/3FG42pNJHhIlTDHGVo91VRlpRzgQ7V4VDLRgQ3qC.jpg', NULL, NULL, 0, '2025-09-08 15:34:03', '2025-09-08 15:34:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(58, 50, 'properties/WP3gAz5dCT78CwZvH2sXX4eqpcVGZmTGepELGnvU.jpg', NULL, NULL, 0, '2025-09-08 15:34:03', '2025-09-08 15:34:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(59, 50, 'properties/egZs2EbX3uQZgaS2ohnqLFKLKQx02EWMPcy4xNjV.jpg', NULL, NULL, 0, '2025-09-08 15:34:03', '2025-09-08 15:34:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(60, 50, 'properties/wMPfX8C2RIAMdMroouk8QZjhukpz4prozbsCL8IA.jpg', NULL, NULL, 0, '2025-09-08 15:34:03', '2025-09-08 15:34:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(61, 52, 'properties/1rMPQN0LYtbL0iAkLqBBpWSCFMN1YDkcvKdri49c.png', NULL, NULL, 0, '2025-09-14 09:07:49', '2025-09-14 09:07:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(62, 53, 'properties/pqxyZJhcP6c9uZRSshQXKHHSZdLkdXn6D9eJVQN8.jpg', NULL, NULL, 0, '2025-09-14 10:58:25', '2025-09-14 10:58:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(63, 53, 'properties/9FqHT1ZsQK1UOyWDIPNDUWbHuPXnYwMQ7PwCrjKK.jpg', NULL, NULL, 0, '2025-09-14 10:58:25', '2025-09-14 10:58:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(64, 53, 'properties/ZmE8y0rBk5sZxqSuzZU5NmL5fRGtUwip773TeUtW.jpg', NULL, NULL, 0, '2025-09-14 10:58:25', '2025-09-14 10:58:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(65, 54, 'properties/eQaxaqKaLJW1lNXp9MeqWksgYVz8ksMe6W7Gjlob.jpg', NULL, NULL, 0, '2025-09-14 11:10:07', '2025-09-14 11:10:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(66, 54, 'properties/u7QzEC9euLKb8OlvoE25oxec7ZW7a5LV4440Thf3.jpg', NULL, NULL, 0, '2025-09-14 11:10:07', '2025-09-14 11:10:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(67, 54, 'properties/eMMhwhCLUaAViqAq6aBASNNda54YBf6JWBh43Ctg.jpg', NULL, NULL, 0, '2025-09-14 11:10:07', '2025-09-14 11:10:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(75, 57, 'properties/MElyUTwqw3yWWWw3KLKkFoKMbrqFDHbFAuKFATM5.jpg', NULL, NULL, 0, '2025-09-14 17:58:57', '2025-09-14 17:58:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(76, 57, 'properties/5Lalj5orBuQVZdk0rEnTxLZdrgCReCwCiPH92AQ9.jpg', NULL, NULL, 0, '2025-09-14 18:02:45', '2025-09-14 18:02:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(77, 57, 'properties/EvYtNjnihdbNg9YJdyZg03sm49ztSIJJAAY4SPWe.jpg', NULL, NULL, 0, '2025-09-14 18:13:31', '2025-09-14 18:13:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(78, 58, 'properties/aGOd43bomsoKnftQp67QNyyn73ujJAe3LDfuF3M7.png', NULL, NULL, 0, '2025-09-14 19:22:06', '2025-09-14 19:22:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(82, 61, 'properties/dpld1THV0aa66h1ho7EdS8BBoWyopd8lmPp5psEw.png', NULL, NULL, 0, '2025-09-15 13:17:20', '2025-09-15 13:17:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(83, 61, 'properties/oCMp7HSQ3acEixzo3552m39mpqj25Hhfu6KZjxiD.png', NULL, NULL, 0, '2025-09-15 13:17:20', '2025-09-15 13:17:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(84, 61, 'properties/60T5RXmCEQeBdrMerdtEVtKswMsPnjpxJhJpV918.png', NULL, NULL, 0, '2025-09-15 13:17:20', '2025-09-15 13:17:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(85, 61, 'properties/qMQSRnb8y0oyL5bY0UJuWBXRGEmMDC1aUDRWXOWs.png', NULL, NULL, 0, '2025-09-15 13:17:20', '2025-09-15 13:17:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(86, 61, 'properties/wK3wwF8fgsthpSfOb6hRDkLLL3fkSYSoIWCoK6YS.png', NULL, NULL, 0, '2025-09-15 13:20:16', '2025-09-15 13:20:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(87, 62, 'properties/IWip8UCk12Fgpjc7mSpPrA27Fh3euWAJiqfQwWXf.jpg', NULL, NULL, 0, '2025-09-15 19:06:32', '2025-09-15 19:06:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(88, 62, 'properties/3PUM4alReeOAWmq3Nop3L2L5iQ2G7jK69a9wxRk2.jpg', NULL, NULL, 0, '2025-09-15 19:06:32', '2025-09-15 19:06:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(89, 62, 'properties/2iRS3hU14aEr1tcCn3jWJ1DOWp7kVaJwhppFiIFB.jpg', NULL, NULL, 0, '2025-09-15 19:06:32', '2025-09-15 19:06:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(90, 63, 'properties/R671KtxdvSicbYOEusZfu1JXEnI5AA9yeRDE4DOj.jpg', NULL, NULL, 0, '2025-09-15 19:35:17', '2025-09-15 19:35:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(91, 63, 'properties/O4RFIW5I3WLLkIcXJsdA3yYMnI7GlUtKTZRLY1uy.jpg', NULL, NULL, 0, '2025-09-15 19:35:17', '2025-09-15 19:35:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(92, 63, 'properties/saGJ1S2CKeTIWOigJHYLDejfRgYEjQ54dBdNabbc.jpg', NULL, NULL, 0, '2025-09-15 19:35:17', '2025-09-15 19:35:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(93, 64, 'properties/46jzFa5QKbePnC7bA5i97RlOExBoL38u69dt2AHW.jpg', NULL, NULL, 0, '2025-09-15 19:35:54', '2025-09-15 19:35:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(94, 64, 'properties/ZTC97afPOAGwvypDDdYNkHw4gaPXS5KweJ4LH1dN.jpg', NULL, NULL, 0, '2025-09-15 19:35:54', '2025-09-15 19:35:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(95, 64, 'properties/BuV2MBrvlQm8XWgAfZNOjIhudx51b1jRehsN7Com.jpg', NULL, NULL, 0, '2025-09-15 19:35:54', '2025-09-15 19:35:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(96, 65, 'properties/hbNEqP9x93VClGuZ5OeKO8aByvGVnlOrSaJYutli.jpg', NULL, NULL, 0, '2025-09-15 19:50:12', '2025-09-15 19:50:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(97, 65, 'properties/3pQ2FjF2IlgaLkD7vVCWrQwT4epLSd4lQU9OQeij.jpg', NULL, NULL, 0, '2025-09-15 19:50:12', '2025-09-15 19:50:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(98, 65, 'properties/HYRrzRWWcxGelroeqImVeakM72GJTULc1ZUZeCIn.jpg', NULL, NULL, 0, '2025-09-15 19:50:12', '2025-09-15 19:50:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(99, 66, 'properties/8CBYTOaYH2HVwRh3mRH5fltwmUKdzuZWGFOiygfr.jpg', NULL, NULL, 0, '2025-09-15 19:52:03', '2025-09-15 19:52:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(100, 66, 'properties/65RfNoNmjBdMLuW1JbqFXh2IohFKhdBMWq4nCMaO.jpg', NULL, NULL, 0, '2025-09-15 19:52:03', '2025-09-15 19:52:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(101, 66, 'properties/3Zf9XHekSLc0nh0AKPVsdXm3mO0FOq9Bc7K2s6zL.jpg', NULL, NULL, 0, '2025-09-15 19:52:03', '2025-09-15 19:52:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(108, 70, 'properties/nrLYrK48Gug8qXuZvYiv1JVxPE8YGcWSY8pwNKUF.jpg', NULL, NULL, 0, '2025-09-16 13:38:03', '2025-09-16 13:38:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(109, 70, 'properties/EPBexdHO1WfdockTnu2qvYSRwnQUf0msBdp6jBsE.jpg', NULL, NULL, 0, '2025-09-16 13:38:03', '2025-09-16 13:38:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(110, 70, 'properties/ZeuLfXVuZTzY2GEWXeFVSFd9bonea6LEn4claWhM.jpg', NULL, NULL, 0, '2025-09-16 13:38:03', '2025-09-16 13:38:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(111, 71, 'properties/AwqxGlHGwhSG6CntTqvwQKjjtoPnmyXyMpDtYkiV.jpg', NULL, NULL, 0, '2025-09-16 13:40:07', '2025-09-16 13:40:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(112, 71, 'properties/FfggFRCjeQGTCQTzXepcwCfhPnzvK2P91fXHEpWp.jpg', NULL, NULL, 0, '2025-09-16 13:40:07', '2025-09-16 13:40:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(113, 71, 'properties/hiCZnOh8J0KOqAgNSwCCUUvoPjScM6cYOQkt0pVt.jpg', NULL, NULL, 0, '2025-09-16 13:40:07', '2025-09-16 13:40:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(117, 73, 'properties/QJGzgxTHSWnS2FC45k3Shjv6IGhO00ksnqhGZ6ng.jpg', NULL, NULL, 0, '2025-09-16 14:07:38', '2025-09-16 14:07:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(118, 73, 'properties/laYCPuJ9OVvjA6ebB3wYuO0up2BC49UexYesydEw.jpg', NULL, NULL, 0, '2025-09-16 14:07:38', '2025-09-16 14:07:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(119, 73, 'properties/AeRzurJX6AoWf2Dg4HrnlGakb1deIpdejkRsqrxY.jpg', NULL, NULL, 0, '2025-09-16 14:07:38', '2025-09-16 14:07:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(120, 74, 'properties/ps5jjGDgkY9AQ0gx3gkYrPTnZKmG1ApCTyryjE2y.jpg', NULL, NULL, 0, '2025-09-17 08:25:26', '2025-09-17 08:25:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(121, 74, 'properties/EPCeQkIqb3NO71dBcqHrqq55y25aLqLWOV5NUPf0.jpg', NULL, NULL, 0, '2025-09-17 08:25:26', '2025-09-17 08:25:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(122, 74, 'properties/kCTPZwGaVqBP5s9yeIYh5kEiS9gUDc8IBHGABJQc.jpg', NULL, NULL, 0, '2025-09-17 08:25:26', '2025-09-17 08:25:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(123, 75, 'properties/Y2cqaAIgabkerqnNC8bJ0phFUNAY2KcIy0CrIIWe.png', NULL, NULL, 0, '2025-09-19 08:39:07', '2025-09-19 08:39:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(124, 75, 'properties/Hq6ONOdKySQyXBn6HpNKaYsplLwsc7BhmWv1dfjD.png', NULL, NULL, 0, '2025-09-19 08:39:07', '2025-09-19 08:39:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(125, 75, 'properties/jTsqAKupVgRJddQS80jMVcyS22G7puXux8t3YMUS.png', NULL, NULL, 0, '2025-09-19 08:39:07', '2025-09-19 08:39:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(126, 75, 'properties/GkzaTH1m38O5NGdbnrzoSUOVYgwbeurZQD9mdmJG.png', NULL, NULL, 0, '2025-09-19 08:39:07', '2025-09-19 08:39:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(127, 76, 'properties/eLG1XJMHU4dWMFHmQclJM20SjB3lWNxoDnCZDbe3.jpg', NULL, NULL, 0, '2025-09-19 10:17:07', '2025-09-19 10:17:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(128, 76, 'properties/Nkxum1UWgYpt19t0MR52zbS70HeeWiV4gkvERop2.jpg', NULL, NULL, 0, '2025-09-19 10:17:07', '2025-09-19 10:17:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(129, 76, 'properties/p9Awx9Uxz1mWTQquHBtaQdtKF2QAWrlXc20fyljZ.jpg', NULL, NULL, 0, '2025-09-19 10:17:07', '2025-09-19 10:17:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(130, 76, 'properties/ZhsB9YCNvfFootsLPZoC4hMyQDVdeU4R83ujry95.jpg', NULL, NULL, 0, '2025-09-19 11:13:41', '2025-09-19 11:13:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(131, 76, 'properties/TEw8Qus1cy7Hl56gVxlbM8mQAn1jPXJE77DgYAQL.jpg', NULL, NULL, 0, '2025-09-19 11:42:40', '2025-09-19 11:42:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(132, 78, 'properties/Snyhf2W4FkiRsrfcFP0owuGn6KZY9qGFyrs6WT4V.png', NULL, NULL, 0, '2025-09-19 12:49:31', '2025-09-19 12:49:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(133, 78, 'properties/peQsmjw4WneQhzqasRBUDRmqIfvDY1YGl81V7efC.png', NULL, NULL, 0, '2025-09-19 12:49:31', '2025-09-19 12:49:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(134, 78, 'properties/uaLCALd00SMxGl6Dsfhnwdlf0IEhtmyRmH7r5pbD.png', NULL, NULL, 0, '2025-09-19 12:49:31', '2025-09-19 12:49:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(135, 78, 'properties/szY5kfr5XvredKCVLXwxGHSN64KCq0P9uGpi68nZ.png', NULL, NULL, 0, '2025-09-19 12:49:31', '2025-09-19 12:49:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(136, 79, 'properties/xDyeHy3b8chvd5TtxGrDbaZ2aPoJla3wc8pJYm33.jpg', NULL, NULL, 0, '2025-09-19 12:49:44', '2025-09-19 12:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(137, 79, 'properties/J0qw5B1BhxDt1HY2zfatWOKQcPj1bjHugkksHzkU.png', NULL, NULL, 0, '2025-09-19 12:49:44', '2025-09-19 12:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(138, 79, 'properties/7wiH17xiuABPTDyF3rypMfxiB24o4opJ9ZAUZdEe.png', NULL, NULL, 0, '2025-09-19 12:49:44', '2025-09-19 12:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(139, 79, 'properties/I9tzMmjQeDfTLsJzwlkwc1elEzrEuxJ1Ex6nZBbq.jpg', NULL, NULL, 0, '2025-09-19 12:49:44', '2025-09-19 12:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(140, 80, 'properties/YLP5pA20BOKm8K5Ygr8lccafzpkFGWRqw29ycmNa.png', NULL, NULL, 0, '2025-09-19 12:53:23', '2025-09-19 12:53:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(141, 80, 'properties/dLORLwTun1hLsTmaNlWt3hCwPDhFEn04WkTOAk5s.png', NULL, NULL, 0, '2025-09-19 12:53:23', '2025-09-19 12:53:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(142, 80, 'properties/I8833jbm5TxXAdkOrrR9rie068kEho9sWhZPIVC8.png', NULL, NULL, 0, '2025-09-19 12:53:23', '2025-09-19 12:53:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(143, 81, 'properties/SgPc578HlLo3Scf50wV5Alw3cOj8oR9mehC0jCUu.png', NULL, NULL, 0, '2025-09-19 12:54:32', '2025-09-19 12:54:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(144, 81, 'properties/xRm2nj9aVtrKjyPcvJQazRkarI2CSXBpAhtJAk4w.png', NULL, NULL, 0, '2025-09-19 12:54:32', '2025-09-19 12:54:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(145, 81, 'properties/vHDRuCdh2k7PE8BO9PH86irTOvrTzSI3beEHkmS0.png', NULL, NULL, 0, '2025-09-19 12:54:32', '2025-09-19 12:54:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(146, 82, 'properties/0z6vACEPUppEXuCQh4wzgN502KMqqwdJokJYRdnN.png', NULL, NULL, 0, '2025-09-19 12:56:29', '2025-09-19 12:56:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(147, 82, 'properties/9O5OXaHGsNwXBWpdyKDmX1DPbD95Ez1QgR03RsNy.png', NULL, NULL, 0, '2025-09-19 12:56:29', '2025-09-19 12:56:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(148, 82, 'properties/VijBYY5WtivsPCvwNHyZ5bswTfeG9ASLsnotGWDY.jpg', NULL, NULL, 0, '2025-09-19 12:56:29', '2025-09-19 12:56:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(149, 83, 'properties/QZOZTk83X5AstKBbqNBKALg2GpkVQzAcPgSdZ87i.png', NULL, NULL, 0, '2025-09-19 12:58:59', '2025-09-19 12:58:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(150, 83, 'properties/qiNaBOekJCaf38CktX0pw9LX2wmeS3oJV8y8hNQe.png', NULL, NULL, 0, '2025-09-19 12:58:59', '2025-09-19 12:58:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(151, 83, 'properties/bru9Shdt757zSofISn38QdZWHA8h2iZjd4GpCleB.png', NULL, NULL, 0, '2025-09-19 12:58:59', '2025-09-19 12:58:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(152, 84, 'properties/xf5pkhpkH1mEBjS1VSvvlbRKAx5IA7ngLzPWmYFk.png', NULL, NULL, 0, '2025-09-19 12:59:57', '2025-09-19 12:59:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(153, 84, 'properties/ynJFE7mLKY1vzmExssRL96CaNk6lqiHGr4GjYnor.png', NULL, NULL, 0, '2025-09-19 12:59:57', '2025-09-19 12:59:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(154, 84, 'properties/6idCE22lfuWDRzda3g0m6jcAb2774lKO5DkiFwU7.png', NULL, NULL, 0, '2025-09-19 12:59:57', '2025-09-19 12:59:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(170, 90, 'properties/original/download3-68d23db2950dd.png', 'properties/thumbnail/download3-68d23db2950dd.png', 'properties/medium/download3-68d23db2950dd.png', 0, '2025-09-23 06:36:28', '2025-09-23 06:27:01', NULL, NULL, 1737884, '{\"width\":1300,\"height\":975}', 'download3.png', 'image/png', 'download3,property,real estate,home,house,apartment,villa,land,commercial,residential', 0, '2025-09-23 06:36:28'),
(171, 90, 'properties/original/download4-68d23db53e062.png', 'properties/thumbnail/download4-68d23db53e062.png', 'properties/medium/download4-68d23db53e062.png', 1, '2025-09-23 06:36:28', '2025-09-23 06:27:03', NULL, NULL, 1211987, '{\"width\":1300,\"height\":962}', 'download4.png', 'image/png', 'download4,property,real estate,home,house,apartment,villa,land,commercial,residential', 0, '2025-09-23 06:36:28'),
(172, 90, 'properties/original/download5-68d23db75ced1.png', 'properties/thumbnail/download5-68d23db75ced1.png', 'properties/medium/download5-68d23db75ced1.png', 2, '2025-09-23 06:36:28', '2025-09-23 06:27:06', NULL, NULL, 1836705, '{\"width\":1300,\"height\":975}', 'download5.png', 'image/png', 'download5,property,real estate,home,house,apartment,villa,land,commercial,residential', 1, '2025-09-23 06:36:28'),
(173, 90, 'properties/original/download6-68d2404034d58.png', 'properties/thumbnail/download6-68d2404034d58.png', 'properties/medium/download6-68d2404034d58.png', 0, '2025-09-23 06:38:57', '2025-09-23 06:37:54', NULL, NULL, 1764188, '{\"width\":1300,\"height\":940}', 'download6.png', 'image/png', 'download6,property,real estate,home,house,apartment,villa,land,commercial,residential', 0, '2025-09-23 06:38:57'),
(174, 90, 'properties/original/download7-68d24081916ec.png', 'properties/thumbnail/download7-68d24081916ec.png', 'properties/medium/download7-68d24081916ec.png', 0, '2025-09-23 06:39:40', '2025-09-23 06:38:59', NULL, NULL, 1357334, '{\"width\":1300,\"height\":962}', 'download7.png', 'image/png', 'download7,property,real estate,home,house,apartment,villa,land,commercial,residential', 0, '2025-09-23 06:39:40'),
(175, 90, 'properties/original/download8-68d240839f544.png', 'properties/thumbnail/download8-68d240839f544.png', 'properties/medium/download8-68d240839f544.png', 1, '2025-09-23 06:39:40', '2025-09-23 06:39:02', NULL, NULL, 1720915, '{\"width\":1300,\"height\":975}', 'download8.png', 'image/png', 'download8,property,real estate,home,house,apartment,villa,land,commercial,residential', 0, '2025-09-23 06:39:40'),
(176, 90, 'properties/original/download2-68d240aceca88.png', 'properties/thumbnail/download2-68d240aceca88.png', 'properties/medium/download2-68d240aceca88.png', 0, '2025-09-23 07:03:04', '2025-09-23 06:39:42', NULL, '', 885931, '{\"width\":1300,\"height\":835}', 'download2.png', 'image/png', 'download2,property,real estate,home,house,apartment,villa,land,commercial,residential', 1, NULL),
(177, 90, 'properties/original/011-68d24628232b5.jpg', 'properties/thumbnail/011-68d24628232b5.jpg', 'properties/medium/011-68d24628232b5.jpg', 1, '2025-09-23 07:03:04', '2025-09-23 07:03:04', NULL, NULL, 164880, '{\"width\":1200,\"height\":1800}', '011.jpg', 'image/jpeg', 'property,real estate,home,house,apartment,villa,land,commercial,residential,luxury', 0, NULL),
(178, 90, 'properties/original/012-68d24628b6b0d.jpg', 'properties/thumbnail/012-68d24628b6b0d.jpg', 'properties/medium/012-68d24628b6b0d.jpg', 2, '2025-09-23 07:03:05', '2025-09-23 07:03:05', NULL, NULL, 81950, '{\"width\":1200,\"height\":800}', '012.jpg', 'image/jpeg', 'property,real estate,home,house,apartment,villa,land,commercial,residential,luxury', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `entity_type` enum('finishing','decor','property') NOT NULL,
  `entity_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `entity_type`, `entity_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 'property', 1, 5, 'عقار رائع وموقع مميز', '2025-08-26 10:54:58'),
(2, 2, 'finishing', 1, 4, 'جودة تشطيب عالية', '2025-08-26 10:54:58'),
(3, 3, 'decor', 2, 5, 'تصميم ديكور مبدع', '2025-08-26 10:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'مدير عام', 'مدير النظام مع جميع الصلاحيات', '2025-08-26 10:54:58'),
(2, 'مندوب مبيعات', 'محرر يمكنه إدارة المحتوى والعقارات', '2025-08-26 10:54:58'),
(3, 'محرر محتوى', 'وسيط عقاري يمكنه إدارة العقارات', '2025-08-26 10:54:58'),
(4, 'مسؤل مبيعات العقارات', 'مسؤل مبيعات العقارات', '2025-08-26 10:54:58'),
(5, 'مسؤل مبيعات التشطيبات', 'مسؤل مبيعات التشطيبات', '2025-08-28 03:27:24'),
(6, 'مسؤل مبيعات الديكورات والتحف', 'مسؤل مبيعات الديكورات والتحف', '2025-08-28 03:27:24'),
(7, 'منسق', 'منسق', '2025-08-28 03:27:24');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `permission_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('IZZTMfjXos4X4udVLyb9hFeLUGApXhn0gPiIet4i', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOFd4d2F5WW9yb1NoTE1odXl6S2hjRlMzbGlscDhlcGJvSVp5aWNxRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1756154179),
('LIN5VcLJx7IVr2FK0UdoDlzIdlW4UDhkVhD2TVa1', NULL, '127.0.0.1', 'PostmanRuntime/7.45.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidmthcHYwS0tDZ2EzdVRFQ3kzbFNkRjIxbU82MEczdnl1eEVNS2hsOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756154153),
('N93c0o1vt0vKWRAzABRoBtGt8oTMJxGhPURwcHu3', NULL, '196.133.157.96', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTnpyUmFMUGlUTEFuUUxiRDlCU1FONERmVFI2S3dodWlIUlVKNkJsYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm9ubHloZWxpby5jb20vdGVzdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1756745343),
('ohD8G6yQ4Rn0m1lhGk6OJuv9IIg5GLT51k5o1jVW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0JyaVliNWthb1NyRjNqc0NQaE1MVTN6czVYM2hueGl6ekpLeGVSUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1756148682),
('vYg7ejvVhD1hfs0YYjvYm2WKzdrfar6Zd3GxLdhB', NULL, '127.0.0.1', 'PostmanRuntime/7.45.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieVpydjM1dUlweEl1SUpiOGdyblBrR2VLUTNPbEE2c3BZQzRJOWZaeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1756155953);

-- --------------------------------------------------------

--
-- Table structure for table `site_content`
--

CREATE TABLE `site_content` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `heroTitle` varchar(255) DEFAULT NULL,
  `heroSubtitle` text DEFAULT NULL,
  `aboutTitle` varchar(255) DEFAULT NULL,
  `aboutSubtitle` text DEFAULT NULL,
  `aboutPoints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aboutPoints`)),
  `servicesTitle` varchar(255) DEFAULT NULL,
  `services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`services`)),
  `testimonialsTitle` varchar(255) DEFAULT NULL,
  `testimonials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`testimonials`)),
  `contactTitle` varchar(255) DEFAULT NULL,
  `contactSubtitle` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(255) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `contactAddress` varchar(255) DEFAULT NULL,
  `workingHours` varchar(255) DEFAULT NULL,
  `socialLinks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialLinks`)),
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_content`
--

INSERT INTO `site_content` (`id`, `heroTitle`, `heroSubtitle`, `aboutTitle`, `aboutSubtitle`, `aboutPoints`, `servicesTitle`, `services`, `testimonialsTitle`, `testimonials`, `contactTitle`, `contactSubtitle`, `contactPhone`, `contactEmail`, `contactAddress`, `workingHours`, `socialLinks`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 'أهلا بك في منصتنا العقارية', 'أفضل الحلول لبيع وشراء وتأجير العقارات في مصر.', 'عن شركتنا', 'نحن نقدم خدمات متكاملة تشمل العقارات، التصميم الداخلي، التشطيبات والديكور.', '[{\"id\":1,\"description\":\"\\u0623\\u0639\\u0644\\u0649 \\u0645\\u0639\\u0627\\u064a\\u064a\\u0631 \\u0627\\u0644\\u062c\\u0648\\u062f\\u0629 \\u0641\\u064a \\u0627\\u0644\\u062a\\u0634\\u0637\\u064a\\u0628\\u0627\\u062a \\u0648\\u0627\\u0644\\u0628\\u0646\\u0627\\u0621\"},{\"id\":2,\"description\":\"\\u0639\\u0631\\u0648\\u0636 \\u0648\\u0623\\u0633\\u0639\\u0627\\u0631 \\u062a\\u0646\\u0627\\u0641\\u0633\\u064a\\u0629 \\u062a\\u0646\\u0627\\u0633\\u0628 \\u062c\\u0645\\u064a\\u0639 \\u0627\\u0644\\u0645\\u064a\\u0632\\u0627\\u0646\\u064a\\u0627\\u062a\"},{\"id\":3,\"description\":\"\\u0641\\u0631\\u064a\\u0642 \\u0645\\u062a\\u062e\\u0635\\u0635 \\u0648\\u0645\\u062d\\u062a\\u0631\\u0641\"},{\"id\":1757315005288,\"description\":\"\\u0645\\u062a\\u062e\\u0635\\u0635\\u0648\\u0646 \\u0641\\u0649 \\u0645\\u062f\\u064a\\u0646\\u0629 \\u0647\\u064a\\u0644\\u064a\\u0648\\u0628\\u0648\\u0644\\u064a\\u0633 \\u0627\\u0644\\u062c\\u062f\\u064a\\u062f\\u0629\"}]', 'خدماتنا', '[{\"id\":1,\"title\":\"\\u0627\\u0644\\u062e\\u062f\\u0645\\u0627\\u062a \\u0627\\u0644\\u0639\\u0642\\u0627\\u0631\\u064a\\u0629 \\u0627\\u0644\\u0645\\u062a\\u0643\\u0627\\u0645\\u0644\\u0629\",\"description\":\"\\u0646\\u0648\\u0641\\u0631 \\u062e\\u062f\\u0645\\u0627\\u062a \\u0628\\u064a\\u0639 \\u0648\\u0634\\u0631\\u0627\\u0621 \\u0648\\u062a\\u0623\\u062c\\u064a\\u0631 \\u0627\\u0644\\u0639\\u0642\\u0627\\u0631\\u0627\\u062a \\u0627\\u0644\\u0633\\u0643\\u0646\\u064a\\u0629 \\u0648\\u0627\\u0644\\u062a\\u062c\\u0627\\u0631\\u064a\\u0629. \\u0646\\u0633\\u0627\\u0639\\u062f\\u0643 \\u0641\\u064a \\u0639\\u0631\\u0636 \\u0639\\u0642\\u0627\\u0631\\u0643 \\u0639\\u0644\\u0649 \\u0645\\u0646\\u0635\\u062a\\u0646\\u0627 \\u0644\\u0644\\u0648\\u0635\\u0648\\u0644 \\u0625\\u0644\\u0649 \\u0623\\u0643\\u0628\\u0631 \\u0639\\u062f\\u062f \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 \\u0627\\u0644\\u0645\\u062d\\u062a\\u0645\\u0644\\u064a\\u0646.\",\"iconUrl\":\"https:\\/\\/img.icons8.com\\/color\\/96\\/city-buildings.png\",\"link\":null},{\"id\":2,\"title\":\"\\u0627\\u0644\\u062a\\u0634\\u0637\\u064a\\u0628 \\u0648\\u0627\\u0644\\u062a\\u0635\\u0645\\u064a\\u0645 \\u0627\\u0644\\u062f\\u0627\\u062e\\u0644\\u064a\",\"description\":\"\\u0646\\u0642\\u062f\\u0645 \\u062d\\u0644\\u0648\\u0644\\u0627\\u064b \\u0645\\u062a\\u0643\\u0627\\u0645\\u0644\\u0629 \\u0644\\u0644\\u062a\\u0634\\u0637\\u064a\\u0628\\u0627\\u062a \\u0648\\u0627\\u0644\\u062a\\u0635\\u0645\\u064a\\u0645 \\u0627\\u0644\\u062f\\u0627\\u062e\\u0644\\u064a\\u060c \\u0628\\u062f\\u0621\\u064b\\u0627 \\u0645\\u0646 \\u0648\\u0636\\u0639 \\u0627\\u0644\\u062a\\u0635\\u0627\\u0645\\u064a\\u0645 \\u0648\\u0627\\u0644\\u0645\\u0642\\u0627\\u064a\\u0633\\u0627\\u062a \\u0627\\u0644\\u062f\\u0642\\u064a\\u0642\\u0629\\u060c \\u0648\\u0635\\u0648\\u0644\\u0627\\u064b \\u0625\\u0644\\u0649 \\u0627\\u0644\\u062a\\u0646\\u0641\\u064a\\u0630 \\u0648\\u0627\\u0644\\u0625\\u0634\\u0631\\u0627\\u0641 \\u0628\\u0623\\u0639\\u0644\\u0649 \\u0645\\u0639\\u0627\\u064a\\u064a\\u0631 \\u0627\\u0644\\u062c\\u0648\\u062f\\u0629.\",\"iconUrl\":\"https:\\/\\/img.icons8.com\\/color\\/96\\/interior-design.png\",\"link\":null},{\"id\":3,\"title\":\"\\u0627\\u0644\\u062f\\u064a\\u0643\\u0648\\u0631\\u0627\\u062a \\u0648\\u0627\\u0644\\u062a\\u062d\\u0641 \\u0627\\u0644\\u0641\\u0646\\u064a\\u0629\",\"description\":\"\\u0646\\u0635\\u0645\\u0645 \\u0648\\u0646\\u0646\\u0641\\u0630 \\u062f\\u064a\\u0643\\u0648\\u0631\\u0627\\u062a \\u062c\\u062f\\u0627\\u0631\\u064a\\u0629 \\u0641\\u0631\\u064a\\u062f\\u0629 \\u0648\\u0645\\u0646\\u062d\\u0648\\u062a\\u0627\\u062a \\u0641\\u0646\\u064a\\u0629 \\u0631\\u0627\\u0626\\u0639\\u0629. \\u0646\\u0648\\u0641\\u0631 \\u062a\\u0634\\u0643\\u064a\\u0644\\u0629 \\u0648\\u0627\\u0633\\u0639\\u0629 \\u0645\\u0646 \\u0627\\u0644\\u0644\\u0648\\u062d\\u0627\\u062a \\u0648\\u0627\\u0644\\u062a\\u062d\\u0641 \\u0627\\u0644\\u062a\\u064a \\u062a\\u0636\\u064a\\u0641 \\u0644\\u0645\\u0633\\u0629 \\u062c\\u0645\\u0627\\u0644\\u064a\\u0629 \\u0627\\u0633\\u062a\\u062b\\u0646\\u0627\\u0626\\u064a\\u0629 \\u0644\\u0645\\u0646\\u0632\\u0644\\u0643 \\u0623\\u0648 \\u0645\\u0643\\u062a\\u0628\\u0643.\",\"iconUrl\":\"https:\\/\\/img.icons8.com\\/?size=100&id=Im5fIIdq55tq&format=png&color=000000\",\"link\":null}]', 'آراء العملاء', '[{\"id\":1757314927349,\"name\":\"\\u0623\\u062d\\u0645\\u062f \\u0639\\u0644\\u064a\",\"designation\":\"\\u0645\\u0627\\u0644\\u0643 \\u0639\\u0642\\u0627\\u0631\",\"quote\":\"\\u062e\\u062f\\u0645\\u0629 \\u0645\\u0645\\u062a\\u0627\\u0632\\u0629 \\u0648\\u0633\\u0631\\u064a\\u0639\\u0629!\",\"imageUrl\":\"https:\\/\\/randomuser.me\\/api\\/portraits\\/men\\/1.jpg\"},{\"id\":1757314927349,\"name\":\"\\u0633\\u0627\\u0631\\u0629 \\u0645\\u062d\\u0645\\u062f\",\"designation\":\"\\u0645\\u0635\\u0645\\u0645\\u0629 \\u062f\\u0627\\u062e\\u0644\\u064a\\u0629\",\"quote\":\"\\u0627\\u0644\\u062a\\u0635\\u0645\\u064a\\u0645 \\u0648\\u0627\\u0644\\u062a\\u0646\\u0641\\u064a\\u0630 \\u0643\\u0627\\u0646 \\u0631\\u0627\\u0626\\u0639!\",\"imageUrl\":\"https:\\/\\/randomuser.me\\/api\\/portraits\\/women\\/2.jpg\"}]', 'تواصل معنا', 'نحن هنا لمساعدتك في أي وقت', '01200728006', 'onlyhelio@tech-bokra.com', 'هليوبوليس الجديده، القاهرة', 'من الأحد الى الخميس 9 صباحا الى 6 مساء', '{\"facebook\":\"https://facebook.com/example\",\"twitter\":\"https://twitter.com/example\",\"instagram\":\"https://instagram.com/example\",\"linkedin\":\"https://linkedin.com/example\",\"youtube\":\"https://youtube.com/example\"}', 1, NULL, '2025-09-15 16:49:58');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `role_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `user_id`, `name`, `email`, `last_login_at`, `password`, `status`, `created_at`, `updated_at`, `role_id`) VALUES
(1, NULL, 'علي أحمد', 'ali@helio.com', '2025-09-21 19:50:53', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', '2025-08-26 10:54:58', '2025-09-21 19:50:53', 1),
(3, NULL, 'خالد عبدالرحمن', 'khaled@helio.com', '2025-09-01 10:13:20', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'on_leave', '2025-08-26 10:54:58', '2025-09-20 14:03:15', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_id`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(3, 1, 2, '2025-08-26', '2025-09-25', 'active', '2025-08-26 10:57:57'),
(4, 3, 1, '2025-08-26', '2025-09-25', 'active', '2025-08-26 10:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `quote_ar` text NOT NULL,
  `quote_en` text NOT NULL,
  `designation_ar` varchar(255) DEFAULT NULL,
  `designation_en` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name_ar`, `name_en`, `quote_ar`, `quote_en`, `designation_ar`, `designation_en`, `image_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'أحمد محمد', 'Ahmed Mohamed', 'خدمة ممتاز وفريق محترف', 'Excellent service and professional team', 'عميل', 'Client', '/images/testimonials/ahmed.jpg', 1, 0, '2025-08-26 14:29:40', '2025-08-26 14:29:40'),
(2, 'فاطمة علي', 'Fatima Ali', 'نتائج تفوق التوقعات', 'Results that exceed expectations', 'عميلة', 'Client', '/images/testimonials/fatima.jpg', 1, 0, '2025-08-26 14:29:40', '2025-08-26 14:29:40');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('credit_card','bank_transfer','cash','other') NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `reference_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `amount`, `method`, `status`, `reference_id`, `created_at`) VALUES
(1, 1, 199.00, 'credit_card', 'completed', 'txn_123456', '2025-08-26 10:57:57'),
(2, 3, 99.00, 'bank_transfer', 'pending', 'txn_789012', '2025-08-26 10:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `type` enum('image','pdf','video','document','other') NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `uploader_id` int(11) NOT NULL,
  `uploader_type` enum('user','staff') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `url`, `type`, `entity_type`, `entity_id`, `uploader_id`, `uploader_type`, `created_at`) VALUES
(1, '/uploads/contract1.pdf', 'pdf', 'property', 1, 1, 'staff', '2025-08-26 10:57:57'),
(2, '/uploads/design1.jpg', 'image', 'portfolio', 2, 2, 'staff', '2025-08-26 10:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'مستخدم',
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `phone`, `status`, `created_at`, `updated_at`, `last_login_at`) VALUES
(1, 'أحمد محمد', 'ahmed@example.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مستخدم', NULL, NULL, NULL, '01234567890', 'active', '2025-08-26 10:54:58', '2025-08-26 14:08:13', NULL),
(2, 'فاطمة علي', 'fatima@example.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مستخدم', NULL, NULL, NULL, '01234567891', 'active', '2025-08-26 10:54:58', '2025-08-26 14:08:13', NULL),
(3, 'محمد إبراهيم', 'mohamed@example.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مستخدم', NULL, NULL, NULL, '01234567892', 'active', '2025-08-26 10:54:58', '2025-08-26 14:08:13', NULL),
(4, 'سارة عبدالله', 'sara@example.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مستخدم', NULL, NULL, NULL, '01234567893', 'inactive', '2025-08-26 10:54:58', '2025-08-26 14:08:13', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_actor` (`actor_id`,`actor_type`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`);

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `fk_customers_created_by` (`created_by`);

--
-- Indexes for table `customer_interactions`
--
ALTER TABLE `customer_interactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `decor_requests`
--
ALTER TABLE `decor_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reference_item_id` (`reference_item_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `handled_by` (`handled_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`property_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `finishing_requests`
--
ALTER TABLE `finishing_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `handled_by` (`handled_by`),
  ADD KEY `requested_by` (`requested_by`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `handled_by` (`handled_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_portfolio_items_type` (`type`),
  ADD KEY `idx_portfolio_items_deleted_at` (`deleted_at`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `properties_ibfk_1` (`created_by`),
  ADD KEY `fk_requested_by` (`requested_by`);
ALTER TABLE `properties` ADD FULLTEXT KEY `ft_search` (`title_ar`,`title_en`,`desc_ar`,`desc_en`);

--
-- Indexes for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD PRIMARY KEY (`property_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_property_images_property_id` (`property_id`),
  ADD KEY `idx_property_images_isfeatured` (`isfeatured`),
  ADD KEY `idx_property_images_sort` (`sort`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_permission_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_content`
--
ALTER TABLE `site_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `fk_staff_role` (`role_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `customer_interactions`
--
ALTER TABLE `customer_interactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `decor_requests`
--
ALTER TABLE `decor_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finishing_requests`
--
ALTER TABLE `finishing_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `role_permission`
--
ALTER TABLE `role_permission`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_content`
--
ALTER TABLE `site_content`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customers_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_interactions`
--
ALTER TABLE `customer_interactions`
  ADD CONSTRAINT `customer_interactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `customer_interactions_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `decor_requests`
--
ALTER TABLE `decor_requests`
  ADD CONSTRAINT `decor_requests_ibfk_1` FOREIGN KEY (`reference_item_id`) REFERENCES `portfolio_items` (`id`),
  ADD CONSTRAINT `decor_requests_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `decor_requests_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `decor_requests_ibfk_4` FOREIGN KEY (`handled_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finishing_requests`
--
ALTER TABLE `finishing_requests`
  ADD CONSTRAINT `finishing_requests_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `finishing_requests_ibfk_2` FOREIGN KEY (`handled_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `finishing_requests_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`handled_by`) REFERENCES `staff` (`id`);

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `fk_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD CONSTRAINT `property_amenities_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
