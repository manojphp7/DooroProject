-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 03:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dooro_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6', 'i:2;', 1779779989),
('laravel-cache-livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6:timer', 'i:1779779989;', 1779779989);

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
-- Table structure for table `claims`
--

CREATE TABLE `claims` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `policy_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `claim_number` varchar(255) NOT NULL,
  `reason` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `incident_date` date DEFAULT NULL,
  `claim_amount` decimal(10,2) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','approved','rejected','processing') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `claims`
--

INSERT INTO `claims` (`id`, `policy_id`, `user_id`, `claim_number`, `reason`, `description`, `incident_date`, `claim_amount`, `admin_notes`, `resolved_at`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 'CLM-RUAXGFFN', 'Fire Damage', 'Test it', '2018-05-26', 0.00, NULL, NULL, 'processing', '2026-05-24 09:19:34', '2026-05-25 05:30:53'),
(3, 2, 1, 'CLM-C10QB6GN', 'Shutter Damage', 'Due to some technical issues , shutter stuck at upper layer', '2025-05-26', 0.00, NULL, NULL, 'pending', '2026-05-25 06:50:46', '2026-05-25 06:50:46'),
(4, 2, 1, 'CLM-7TILOPCA', 'Shutter Damage', 'khjkj', '2025-05-26', 0.00, NULL, NULL, 'pending', '2026-05-25 07:05:36', '2026-05-25 07:05:36'),
(5, 4, 1, 'CLM-H5KHTHDO', 'Shutter Damage', 'Technically issue , so shutter upper layer has been stucked...so kindly fix it asap', '2026-05-26', 0.00, NULL, NULL, 'pending', '2026-05-26 01:34:00', '2026-05-26 01:34:00');

-- --------------------------------------------------------

--
-- Table structure for table `claim_images`
--

CREATE TABLE `claim_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `claim_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `claim_images`
--

INSERT INTO `claim_images` (`id`, `claim_id`, `image_path`, `created_at`, `updated_at`) VALUES
(4, 4, 'claims/9Ep6B39Kqi1HlLSMrZoEFBF64UFJ95OaCaCotmdI.jpg', '2026-05-25 07:05:36', '2026-05-25 07:05:36'),
(5, 4, 'claims/iov0xH2NYakDKqkgZ9mR5FXapOYJEtd1tT5sPGez.jpg', '2026-05-25 07:05:36', '2026-05-25 07:05:36'),
(6, 4, 'claims/6ZOlNTE7tWAUTX44j0wpkDfwMkHsfowQVwNxi6Un.jpg', '2026-05-25 07:05:36', '2026-05-25 07:05:36'),
(7, 5, 'claims/nZ6Dh45TIN2fu0HuKukvYJWNHGHbQm0dqTsHRX2B.jpg', '2026-05-26 01:34:00', '2026-05-26 01:34:00'),
(8, 5, 'claims/sFl9HVYWaKHns4DaSPyeHLOQ5uuXL7bXtgyWlqYY.jpg', '2026-05-26 01:34:00', '2026-05-26 01:34:00'),
(9, 5, 'claims/Xbz980sM1mu3U0V1MIhXrbAlVue4J8CYZ69zChzF.jpg', '2026-05-26 01:34:00', '2026-05-26 01:34:00');

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
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_11_065146_create_personal_access_tokens_table', 1),
(5, '2026_05_11_065905_add_google_id_to_users_table', 1),
(6, '2026_05_11_070519_update_auth_fields_in_users_table', 1),
(7, '2026_05_19_044431_create_shop_details_table', 1),
(8, '2026_05_19_111746_add_payment_and_images_to_shop_details_table', 1),
(9, '2026_05_22_110054_add_payment_intent_id_to_shop_details_table', 1),
(10, '2026_05_23_105343_create_policies_table', 1),
(11, '2026_05_23_110551_add_payment_intent_to_policies_table', 1),
(12, '2026_05_23_121434_make_policy_dates_nullable', 1),
(13, '2026_05_24_071440_create_claims_table', 2),
(14, '2026_05_24_071556_create_claim_images_table', 2),
(15, '2026_05_24_142243_make_policy_dates_nullable', 3),
(16, '2026_05_24_144537_add_more_fields_to_claims_table', 4),
(17, '2026_05_24_145240_add_extra_fields_to_claims_table', 5),
(18, '2026_05_25_080112_remove_approved_amount_from_claims_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'App\\Models\\User', 1, 'mobile-token', '4289f541858e51df97f4514b404fb43a5864679698e25b8cf6befb3a6cd33179', '[\"*\"]', NULL, NULL, '2026-05-24 08:24:19', '2026-05-24 08:24:19'),
(2, 'App\\Models\\User', 2, 'mobile-token', '8711c6f3ee6e8c526a1385170dc2426a39123cdded390252ee639bac175df704', '[\"*\"]', NULL, NULL, '2026-05-24 08:33:24', '2026-05-24 08:33:24'),
(3, 'App\\Models\\User', 1, 'mobile', 'fc41cc642823ea763ce6309f2d574608d41bbca517211baa8f38c6523c59c85a', '[\"*\"]', '2026-05-24 09:26:35', NULL, '2026-05-24 08:46:45', '2026-05-24 09:26:35'),
(4, 'App\\Models\\User', 1, 'mobile-token', 'ac0e602f8f46c3243048b1693c85aa436b97b438e992172dd1dfdcffc1b44ec0', '[\"*\"]', '2026-05-25 06:31:11', NULL, '2026-05-25 05:27:27', '2026-05-25 06:31:11'),
(5, 'App\\Models\\User', 1, 'mobile-token', 'd86b4b56835b853b0afcb1cd9d89a204ecf25b9cc125b93f033aa118be47d8a5', '[\"*\"]', '2026-05-25 08:53:48', NULL, '2026-05-25 06:46:23', '2026-05-25 08:53:48'),
(6, 'App\\Models\\User', 1, 'mobile-token', '4f60db0fd8dcd39215695f6e91aeabedf654e9e2063763dede317d086623b928', '[\"*\"]', '2026-05-26 01:34:24', NULL, '2026-05-26 01:22:34', '2026-05-26 01:34:24');

-- --------------------------------------------------------

--
-- Table structure for table `policies`
--

CREATE TABLE `policies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `shop_detail_id` bigint(20) UNSIGNED NOT NULL,
  `policy_number` varchar(255) NOT NULL,
  `plan_id` varchar(255) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `premium_amount` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('pending','active','expired','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_intent_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `policies`
--

INSERT INTO `policies` (`id`, `shop_detail_id`, `policy_number`, `plan_id`, `plan_name`, `premium_amount`, `start_date`, `end_date`, `status`, `payment_status`, `payment_intent_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'PLC-QERKWNCWHZ', 'basic', 'Basic Cover', 100.00, '2026-05-24', '2027-05-24', 'active', 'paid', 'pi_3Tacw8GEW1F0nHMl1eNkhmM7', '2026-05-24 08:53:20', '2026-05-26 02:15:16'),
(2, 2, 'PLC-YUBE32V12K', 'full', 'Full Cover', 250.00, '2026-05-25', '2027-05-25', 'active', 'paid', 'pi_3TaxTBGEW1F0nHMl1Faxbwr1', '2026-05-25 06:48:46', '2026-05-25 06:49:48'),
(3, 3, 'PLC-EK4BKF5ZMR', 'basic', 'Basic Cover', 100.00, '2026-05-25', '2027-05-25', 'active', 'paid', 'pi_3TayKxGEW1F0nHMl0HA2P4pu', '2026-05-25 07:44:25', '2026-05-25 07:45:16'),
(4, 4, 'PLC-XP0ERZWUWL', 'full', 'Full Cover', 250.00, '2026-05-26', '2027-05-26', 'active', 'paid', 'pi_3TbEuPGEW1F0nHMl0ajXssNa', '2026-05-26 01:25:47', '2026-05-26 01:27:47');

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
('F08nu1kdieBxV3VqCqdd4fjuJjiHOZsa6RzHPPL1', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTo3OntzOjY6Il90b2tlbiI7czo0MDoiRGRQNnJ5ZTFuR3hWb2hYMWxqM0RzQmJwREpHWHJUc25zOUt6MDh3USI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbiI7czo1OiJyb3V0ZSI7czozMDoiZmlsYW1lbnQuYWRtaW4ucGFnZXMuZGFzaGJvYXJkIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2NDoiOWI4OTIzOTA5YzRmYTljMjEyMGViZTlmNjMwNDAzMjM4YmYwZTNjMTMzYzY0M2RjOTljNTAzZDU3ZjFiM2NhNSI7czo2OiJ0YWJsZXMiO2E6Mzp7czo0MDoiZTY0NDgzM2Y0ZTRlMDg3MTIzMTVkYTcxYjMzZmFjZDJfY29sdW1ucyI7YTo1OntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NDoibmFtZSI7czo1OiJsYWJlbCI7czo0OiJOYW1lIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo1OiJlbWFpbCI7czo1OiJsYWJlbCI7czoxMzoiRW1haWwgYWRkcmVzcyI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTc6ImVtYWlsX3ZlcmlmaWVkX2F0IjtzOjU6ImxhYmVsIjtzOjE3OiJFbWFpbCB2ZXJpZmllZCBhdCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6ImNyZWF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IkNyZWF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO31pOjQ7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6InVwZGF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IlVwZGF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO319czo0MDoiMjU0MWRlZWE2ZWZiYTIxNDgyMTUzMjI4NTIzZDg5Y2NfY29sdW1ucyI7YTo3OntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTM6InBvbGljeV9udW1iZXIiO3M6NToibGFiZWwiO3M6MTM6IlBvbGljeSBudW1iZXIiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToxO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjE0OiJzaG9wLnNob3BfbmFtZSI7czo1OiJsYWJlbCI7czo0OiJTaG9wIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxNDoic2hvcC51c2VyLm5hbWUiO3M6NToibGFiZWwiO3M6NToiT3duZXIiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjE0OiJwcmVtaXVtX2Ftb3VudCI7czo1OiJsYWJlbCI7czoxNDoiUHJlbWl1bSBhbW91bnQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjY6InN0YXR1cyI7czo1OiJsYWJlbCI7czo2OiJTdGF0dXMiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo1O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJzdGFydF9kYXRlIjtzOjU6ImxhYmVsIjtzOjEwOiJTdGFydCBkYXRlIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czo4OiJlbmRfZGF0ZSI7czo1OiJsYWJlbCI7czo4OiJFbmQgZGF0ZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO319czo0MDoiMjY0MzgxOWE4NzY3MzkyYjM4MzBkYTE1ZGFhNGI1MmZfY29sdW1ucyI7YTo3OntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTI6ImNsYWltX251bWJlciI7czo1OiJsYWJlbCI7czoxMjoiQ2xhaW0gbnVtYmVyIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoyMDoicG9saWN5LnBvbGljeV9udW1iZXIiO3M6NToibGFiZWwiO3M6NjoiUG9saWN5IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoyMToicG9saWN5LnNob3Auc2hvcF9uYW1lIjtzOjU6ImxhYmVsIjtzOjQ6IlNob3AiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjIxOiJwb2xpY3kuc2hvcC51c2VyLm5hbWUiO3M6NToibGFiZWwiO3M6NToiT3duZXIiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEyOiJjbGFpbV9hbW91bnQiO3M6NToibGFiZWwiO3M6MTI6IkNsYWltIGFtb3VudCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjU7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6Njoic3RhdHVzIjtzOjU6ImxhYmVsIjtzOjY6IlN0YXR1cyI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjY7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6ImNyZWF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IkNyZWF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9fX1zOjg6ImZpbGFtZW50IjthOjA6e319', 1779781531),
('Z38ES0CQPoLVUT69zA1A2s2FSwAenEtWLOyrendU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiek5sOHJINkgyS2VkZmVQSzF5NTlRaHZSamJSblI0bGx0aUR6bFdHVyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMzoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FkbWluL3VzZXJzIjt9czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9sb2dpbiI7czo1OiJyb3V0ZSI7czoyNToiZmlsYW1lbnQuYWRtaW4uYXV0aC5sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779791598);

-- --------------------------------------------------------

--
-- Table structure for table `shop_details`
--

CREATE TABLE `shop_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `shop_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `shop_type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `front_image` varchar(255) DEFAULT NULL,
  `closeup_image` varchar(255) DEFAULT NULL,
  `serial_image` varchar(255) DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT NULL,
  `payment_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_intent_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shop_details`
--

INSERT INTO `shop_details` (`id`, `user_id`, `shop_name`, `address`, `mobile`, `shop_type`, `created_at`, `updated_at`, `front_image`, `closeup_image`, `serial_image`, `plan_name`, `payment_amount`, `payment_status`, `payment_intent_id`) VALUES
(1, 1, 'Test 1', 'Test 1 address', '+441234567890', 'Photography', '2026-05-24 08:48:08', '2026-05-24 08:48:08', 'shop-photos/gQSZI3DgO4AGFVHKcbA0RjoanwTmVOmKFRPg3AQn.jpg', 'shop-photos/2mn8a2qYUWuLMZKmrt0uXrcHM3yZGyJJoKK03etp.jpg', 'shop-photos/F5cD8cPzh0b5XyMTRAkggvbF77MP866SqnjqXFPA.jpg', NULL, 0.00, 'pending', NULL),
(2, 1, 'shop no. 2', 'shop no. 2 address', '+441236547890', 'Camera Repair', '2026-05-25 06:48:01', '2026-05-25 06:48:01', 'shop-photos/AnRHxdtgiNyQExzgq97l33MyQ1Ce48hfT42GyZZq.jpg', 'shop-photos/uAMfWHZZPHf2JUsm92Zui06HuDNDYJFe5wetiMMy.jpg', 'shop-photos/9F94KWcyjd1eHXbX6RZV2sWlkQFezi6bNDzqELfj.jpg', NULL, 0.00, 'pending', NULL),
(3, 1, 'shop3', 'shop3', '+442589631470', 'Electronics', '2026-05-25 07:44:21', '2026-05-25 07:44:21', 'shop-photos/6XYJSvxn9PyiGYdaJhtXiFoA5RWHiFC7C7UqNkR8.jpg', 'shop-photos/eL1HofP76MlNPgtsOrkY4MmZW30HEgpq1us67j8z.jpg', 'shop-photos/2RWB5lXfwtCN2m5pPq5ua4FU0icTJVq6sXHRu6zd.jpg', NULL, 0.00, 'pending', NULL),
(4, 1, 'Test 4', 'Test 4 address', '+443698521470', 'Restaurant', '2026-05-26 01:25:24', '2026-05-26 01:25:24', 'shop-photos/HYNNpMIvMN5BoAdKJ5rD9gCyrvOWl4AdvyJntFFC.jpg', 'shop-photos/OAc6p5zOq6PLbt1K5Z6yyaFBSjR2BLrBePa2I7WV.jpg', 'shop-photos/eGKQvjZZgkh5SCTzTvhWQ2T6BAiggIS0TVMl2nNk.jpg', NULL, 0.00, 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `provider`, `provider_id`, `phone`, `avatar`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Manoj kumar', 'manojphp7@gmail.com', NULL, NULL, NULL, NULL, '2026-05-24 08:46:45', '$2y$12$tmycxBLxHCHis9Xw5L.l3OiQBbRA/AgkY7p2XXtj7hp39PlV.Psf2', NULL, '2026-05-24 08:24:19', '2026-05-24 08:46:45'),
(2, 'Manoj Kumar', 'manojphp71@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$UBqMJ82WkfCe55vz2FTAAOPPqMnFKkopZ6PqObxhv3JxdtBAVrNfa', NULL, '2026-05-24 08:33:24', '2026-05-24 08:33:24'),
(3, 'Admin', 'doorosupport@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$12$/U4hBTZD6ytVtlfyx/ZbMOj3ihBHJCshQjlHJa1O9Hp2ZB0sXs6KS', NULL, '2026-05-25 01:43:47', '2026-05-25 01:43:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `claims`
--
ALTER TABLE `claims`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `claims_claim_number_unique` (`claim_number`),
  ADD KEY `claims_policy_id_foreign` (`policy_id`),
  ADD KEY `claims_user_id_foreign` (`user_id`);

--
-- Indexes for table `claim_images`
--
ALTER TABLE `claim_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `claim_images_claim_id_foreign` (`claim_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `policies`
--
ALTER TABLE `policies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `policies_policy_number_unique` (`policy_number`),
  ADD KEY `policies_shop_detail_id_foreign` (`shop_detail_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `shop_details`
--
ALTER TABLE `shop_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `claims`
--
ALTER TABLE `claims`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `claim_images`
--
ALTER TABLE `claim_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `policies`
--
ALTER TABLE `policies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `shop_details`
--
ALTER TABLE `shop_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `claims`
--
ALTER TABLE `claims`
  ADD CONSTRAINT `claims_policy_id_foreign` FOREIGN KEY (`policy_id`) REFERENCES `policies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `claims_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `claim_images`
--
ALTER TABLE `claim_images`
  ADD CONSTRAINT `claim_images_claim_id_foreign` FOREIGN KEY (`claim_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `policies`
--
ALTER TABLE `policies`
  ADD CONSTRAINT `policies_shop_detail_id_foreign` FOREIGN KEY (`shop_detail_id`) REFERENCES `shop_details` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shop_details`
--
ALTER TABLE `shop_details`
  ADD CONSTRAINT `shop_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
