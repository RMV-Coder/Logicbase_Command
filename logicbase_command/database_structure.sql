-- 1. Create database and switch to it
CREATE DATABASE IF NOT EXISTS `logicbase_com_db`;
USE `logicbase_com_db`;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100)     NOT NULL,
  last_name  VARCHAR(100)     NOT NULL,
  email      VARCHAR(100)     NOT NULL UNIQUE,
  birthdate  DATE             NOT NULL,
  password   VARCHAR(255)     NOT NULL,  -- hashed
  company_name   VARCHAR(100),
  designation    VARCHAR(100),
  preset         INT,
  registered_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  profile_image  LONGTEXT,
  last_login     TIMESTAMP,
  isActive       TINYINT,
  gender         ENUM('Male','Female'),
  contact_number VARCHAR(20)
) ENGINE=InnoDB;

-- 3. Clients table
CREATE TABLE IF NOT EXISTS clients (
  client_id     INT AUTO_INCREMENT PRIMARY KEY,
  client_name   VARCHAR(30)  NOT NULL,
  client_location VARCHAR(255) NOT NULL,
  client_config JSON
) ENGINE=InnoDB;

-- 4. Projects table (with FKs to client and owner/user)
CREATE TABLE IF NOT EXISTS projects (
  project_id     INT AUTO_INCREMENT PRIMARY KEY,
  project_name   VARCHAR(30)   NOT NULL,
  project_details VARCHAR(255) NOT NULL,
  project_due    DATE          NOT NULL,
  project_status ENUM(
    'Completed','Planned','On going','Planning','Past Due','To be Discussed'
  ) DEFAULT 'To be Discussed',
  project_config JSON,
  client_id INT NULL,
  owner_id  INT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Concerns table
-- CREATE TABLE IF NOT EXISTS concerns (
--   concern_id   INT AUTO_INCREMENT PRIMARY KEY,
--   user_id      INT            NOT NULL,
--   subject      ENUM('Bug Report','Inquiry','Feature Request') NOT NULL,
--   description  TEXT           NOT NULL,
--   status       ENUM('Open','In Progress','Closed') DEFAULT 'Open',
--   created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (user_id) REFERENCES users(user_id)
--     ON UPDATE CASCADE
--     ON DELETE CASCADE
-- ) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS concerns (
  concern_id   INT AUTO_INCREMENT PRIMARY KEY,
  full_name	   VARCHAR(100),
  contact_number VARCHAR(20),
  email        VARCHAR(100),
  company	   VARCHAR(30),
  subject      VARCHAR(100),
  message  TEXT           NOT NULL,
  status       ENUM('Open','In Progress','Closed') DEFAULT 'Open',
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  preferred_start DATE,
  preferred_end DATE
) ENGINE=InnoDB;
-- ALTER TABLE logicbase_com_db.concerns modify subject varchar(100);
-- ALTER TABLE logicbase_com_db.concerns ADD preferred_start DATE, ADD preferred_end DATE;

-- 6. Chats table
CREATE TABLE IF NOT EXISTS chats (
  chat_id      INT AUTO_INCREMENT PRIMARY KEY,
  chat_token   VARCHAR(255) NOT NULL,
  chat_config  JSON
) ENGINE=InnoDB;

-- 7. Chat members join table
CREATE TABLE IF NOT EXISTS chat_members (
  chat_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
    ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Chat messages table
CREATE TABLE IF NOT EXISTS chat_message (
  message_id         INT AUTO_INCREMENT PRIMARY KEY,
  message_text       VARCHAR(255) NOT NULL,
  message_timestamp  DATETIME     NOT NULL,
  message_sender_id  INT,
  message_chat_id    INT,
  message_react_config JSON,
  message_status     VARCHAR(40),
  FOREIGN KEY (message_sender_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (message_chat_id) REFERENCES chats(chat_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;
USE `logicbase_com_db`;
-- 9. Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  log_id     INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT            NOT NULL,
  entity     ENUM('project','client','message','profile') NOT NULL, -- type may refer to entity
  action     VARCHAR(50)    NOT NULL,  -- e.g. 'created','updated'
  created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  start 	DATETIME,
  end		DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Project members join table
CREATE TABLE IF NOT EXISTS project_members (
  project_id INT    NOT NULL,
  user_id    INT    NOT NULL,
  role       VARCHAR(50),
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
