# TÀI LIỆU KIẾN TRÚC PHẦN MỀM (SOFTWARE ARCHITECTURE) - HỆ THỐNG ĐẶT ĐỒ UỐNG CÁ NHÂN HÓA

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống được thiết kế theo mô hình Client-Server với kiến trúc Microservices (hoặc Modular Monolith) ở Backend nhằm đảm bảo khả năng mở rộng. Do tính chất realtime của việc trừ lùi kho và hiển thị đơn hàng, hệ thống kết hợp giữa RESTful API và WebSockets.

Hệ thống bao gồm 3 phân hệ (Client) chính:

* **Customer App / Kiosk (Front-end):** Giao diện tương tác trò chơi hóa (Gamified UI) cho khách hàng, hỗ trợ lưu trữ hồ sơ cá nhân.
* **Barista POS (Front-end):** Màn hình nhận đơn và in phiếu lắp ráp (Assembly Ticket) tại quầy.
* **Admin Web Dashboard (Front-end):** Giao diện quản trị kho trung tâm, cấu hình ngân hàng câu hỏi và xem báo cáo realtime.

---

## 2. Lựa chọn Công nghệ (Tech Stack)

### 2.1. Front-end (Client-side)

* **Customer App (Mini-app/Web-app):**
    * **Framework:** ReactJS / Next.js hoặc tích hợp thành Zalo/MoMo Mini App để tận dụng việc đăng nhập nhanh (lấy Zalo ID làm Customer ID) giúp tối ưu phễu thu thập thông tin khách hàng.
    * **UI/Animation:** Framer Motion hoặc Lottie cho các hiệu ứng tương tác 5 câu hỏi.
    * **State Management:** Zustand hoặc Redux Toolkit.
* **Admin Dashboard & Barista POS:**
    * **Framework:** ReactJS / TailwindCSS.
    * **Biểu đồ (Charts):** Recharts hoặc Chart.js.

### 2.2. Back-end (Server-side)

* **Ngôn ngữ & Framework:** Node.js với NestJS (hỗ trợ TypeScript mạnh mẽ, cấu trúc rõ ràng, phù hợp cho logic Matrix Menu).
* **Giao thức giao tiếp:**
    * **RESTful API:** Cho các tác vụ CRUD thông thường.
    * **WebSockets (Socket.io):** Đẩy đơn hàng realtime xuống POS và cập nhật Live Mood Board.

### 2.3. Cơ sở dữ liệu (Database)

* **Primary Database:** PostgreSQL (Phù hợp với dữ liệu có tính quan hệ chặt chẽ giữa Đơn hàng, Nguyên liệu, Tồn kho và Khách hàng).
* **In-memory Cache:** Redis (Quản lý Session khảo sát, cache bộ câu hỏi random, và xử lý khóa số lượng tồn kho tạm thời để tránh race condition).

---

## 3. Thiết kế Cơ sở dữ liệu Mở rộng (Database Schema)

Dưới đây là cấu trúc Entity-Relationship (ERD) cốt lõi:

**1. Bảng Customers (Quản lý Hồ sơ - Tùy chọn)**
* `id` (PK - UUID hoặc Zalo ID/SĐT)
* `name` (String - Nullable)
* `dob` (Date - Nullable)
* `zodiac_sign` (String - Nullable, Backend tự động tính toán dựa trên dob)
* `saved_preferences` (JSON - Lưu lịch sử tần suất chọn Module Base/Flavor của khách)
* `created_at` (Timestamp)

**2. Bảng Questions (Ngân hàng câu hỏi)**
* `id` (PK)
* `step_number` (Int - từ 1 đến 5)
* `theme_id` (String - VD: "music", "weather")
* `question_text` (String)
* `answers` (JSON - mảng chứa A, B, C kèm logic mapping)

**3. Bảng Modules (Nguyên liệu Matrix & Tồn kho)**
* `id` (PK)
* `category` (Enum: BASE, FLAVOR, FUNCTION, TEXTURE)
* `name` (String)
* `stock_quantity` (Float - Tồn kho hiện tại)
* `unit` (String - "ml", "gram")
* `deduction_rate` (Float - Định lượng trừ đi cho 1 ly)
* `is_active` (Boolean)

**4. Bảng Exclusion_Rules (Luật loại trừ tổ hợp)**
* `id` (PK)
* `module_1_id` (FK - Tham chiếu Modules)
* `module_2_id` (FK - Tham chiếu Modules)
* `reason` (String - VD: "Nước dừa và Milk Foam gây kết tủa")

**5. Bảng Orders (Đơn hàng)**
* `id` (PK)
* `customer_id` (FK - Nullable, tham chiếu Customers)
* `total_price` (Decimal)
* `status` (Enum: PENDING, PREPARING, COMPLETED, CANCELLED)
* `mood_tags` (JSON - Lưu lại các tag tâm trạng khách đã chọn)

**6. Bảng Order_Items (Chi tiết Đơn hàng)**
* `id` (PK)
* `order_id` (FK)
* `generated_name` (String - Tên món ghép tự động)
* `base_module_id`, `flavor_module_id`, `function_module_id`, `texture_module_id` (FKs)

---

## 4. Thiết kế Thuật toán Cốt lõi (Core Algorithms)

### 4.1. Hàm Randomizer Theme Câu hỏi
* **Logic:** Khi session bắt đầu, Backend kiểm tra `customer_id` (nếu khách đã đăng nhập). Nếu là tháng sinh nhật của khách (dựa vào `dob`), hệ thống ưu tiên chọn Theme câu hỏi "Tarot/Cung Hoàng Đạo". Ngược lại, random 1 `theme_id` cho 5 câu hỏi và gửi xuống Frontend.

### 4.2. Recommendation Engine & Mapping Function
* **Input:** Mảng 5 giá trị khách chọn + `customer_id` (nếu có).
* **Process:**
    1.  **Lọc Tồn kho:** Truy vấn bảng Modules, loại bỏ các module có `stock_quantity < deduction_rate`.
    2.  **Lắp ráp & Loại trừ:** Kết hợp các tag thành tổ hợp 4 module. Đối chiếu với `Exclusion_Rules`. Nếu vi phạm, tự động đổi Flavor sang module hợp lệ.
    3.  **Phân nhánh 3 Lựa chọn (Risk Tolerance):**
        * **Thẻ 1 (Perfect Match):** Khớp 100% logic thuật toán.
        * **Thẻ 2 (Plot Twist):** Đổi ngẫu nhiên module Hương vị sang một loại đối lập.
        * **Thẻ 3 (The Safe Trend / History):**
            * Nếu `customer_id` tồn tại và có `saved_preferences`: Xuất ra công thức khách hay uống nhất ("Món quen của bạn").
            * Nếu là khách mới: Lấy công thức Best-seller có cùng Base.

### 4.3. Hàm Trừ lùi Tồn kho (Inventory Deduction)
* Sử dụng Database Transaction (ACID) để đảm bảo tính nhất quán.
* Khi Order chuyển sang thanh toán thành công, hệ thống bóc tách 4 module trong `Order_Items` -> thực hiện `UPDATE stock_quantity = stock_quantity - deduction_rate`.
* Nếu `stock_quantity` chạm ngưỡng Alert, gửi event qua WebSocket báo động lên Admin Dashboard, đồng thời trigger hàm Update `is_active = false` để Front-end ngừng suggest nguyên liệu này.

---

## 5. Phương án Triển khai (Deployment & DevOps)

### 5.1. Hạ tầng Đám mây (Cloud Infrastructure)
* **Frontend (App/POS/Admin):** Đóng gói và Deploy tĩnh lên Vercel hoặc AWS S3 + CloudFront (Tối ưu chi phí, chịu tải lớn khi quét QR hàng loạt).
* **Backend API:** Deploy dưới dạng Docker Container lên AWS ECS (Elastic Container Service) hoặc Google Cloud Run. Cấu hình Auto-scaling tự động tăng phiên bản (instances) vào các khung giờ cao điểm (VD: 12h trưa, 7h tối).
* **Database:** Sử dụng Managed Database (AWS RDS cho PostgreSQL và AWS ElastiCache cho Redis) để tự động backup, dễ dàng scale up khi dữ liệu Customer Profiling lớn dần.

### 5.2. CI/CD & Giám sát
* **CI/CD:** Dùng GitHub Actions. Tự động chạy Unit Test cho hàm Recommendation và Inventory Deduction trước khi build Docker Image. Deploy Zero-downtime.
* **Monitoring:** Tích hợp Sentry để theo dõi lỗi logic mapping ở Frontend và Backend. Cấu hình Bot Telegram/Zalo gửi báo cáo doanh thu và cảnh báo kho nguyên liệu tự động.