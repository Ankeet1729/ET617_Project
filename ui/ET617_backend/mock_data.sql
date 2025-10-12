-- Expanded Mock Student Data Across Multiple Grades
-- Password for all accounts: "student123" (hash with bcrypt before use)
-- Replace '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S' with actual bcrypt hashes
-- This includes 20+ students distributed across all NEP stages (Grades 1-12)

-- Clear existing mock data (optional - uncomment if needed)
-- DELETE FROM users WHERE username LIKE '%mock%';

-- Foundational Stage (Grades 1-2): 4 students
INSERT INTO users (username, password_hash, email, grade) VALUES
('mock_student1', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock1@foundational.edu', 1),
('mock_student2', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock2@foundational.edu', 1),
('mock_student3', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock3@foundational.edu', 2),
('mock_student4', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock4@foundational.edu', 2);

-- Preparatory Stage (Grades 3-5): 6 students
INSERT INTO users (username, password_hash, email, grade) VALUES
('mock_student5', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock5@preparatory.edu', 3),
('mock_student6', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock6@preparatory.edu', 3),
('mock_student7', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock7@preparatory.edu', 4),
('mock_student8', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock8@preparatory.edu', 4),
('mock_student9', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock9@preparatory.edu', 5),
('mock_student10', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock10@preparatory.edu', 5);

-- Middle Stage (Grades 6-8): 6 students
INSERT INTO users (username, password_hash, email, grade) VALUES
('mock_student11', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock11@middle.edu', 6),
('mock_student12', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock12@middle.edu', 6),
('mock_student13', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock13@middle.edu', 7),
('mock_student14', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock14@middle.edu', 7),
('mock_student15', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock15@middle.edu', 8),
('mock_student16', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock16@middle.edu', 8);

-- Secondary Stage (Grades 9-12): 6 students
INSERT INTO users (username, password_hash, email, grade) VALUES
('mock_student17', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock17@secondary.edu', 9),
('mock_student18', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock18@secondary.edu', 9),
('mock_student19', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock19@secondary.edu', 10),
('mock_student20', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock20@secondary.edu', 10),
('mock_student21', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock21@secondary.edu', 11),
('mock_student22', '$2b$10$mBDF6ga6FaZSiHwQasm31.My.ws/JLWArVOnigkJ2pcPZCpeSas0S', 'mock22@secondary.edu', 12);
-- Add Admin User to Database
-- Username: root, Password: admin (hashed with bcrypt)
INSERT INTO users (username, password_hash, email, grade) VALUES
('root', '$2b$10$BCAIdxbTq8VvSyHyUSIu0uRtEEuq7H8UYumFtxCPUavrbZLzV7MiW', 'root@admin.edu', NULL);

