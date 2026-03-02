# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD) - HỆ THỐNG ĐẶT ĐỒ UỐNG CÁ NHÂN HÓA 

## 1. Yêu cầu Giao diện (UI/UX) và Luồng Đặt món (Front-end) 
Hệ thống thiết kế ưu tiên thiết bị di động (Mobile-first) dưới dạng Web-app/Mini-app hoặc Kiosk.  Giao diện cần có hiệu ứng Animation mượt mà, tương tác vuốt/chạm (swipe/tap).  Trải nghiệm cốt lõi là "Gamification" (Trò chơi hóa) với cơ chế hiển thị chủ đề (Theme) câu hỏi ngẫu nhiên để khách hàng không bị nhàm chán khi quay lại. 

### 1.1. Ngân hàng 5 câu hỏi định hình tâm trạng (Mood-Mapping Question Bank) 
Hệ thống Front-end sẽ chọn ngẫu nhiên 1 trong 5 biến thể của mỗi câu hỏi khi khách hàng bắt đầu trải nghiệm.  Dù hiển thị biến thể nào, kết quả (A, B, C) vẫn sẽ được map về cùng một tham số Logic trên Backend. 

**Câu hỏi 1: Định hình nền tảng năng lượng (Backend Logic: Base Layer)** 
* **Mục đích:** Xác định mức độ Caffeine khách hàng cần (A: Trà Đen/Cà phê, B: Oolong/Trà Nhài, C: Nước dừa/Kombucha). 
* **Biến thể 1 (Hệ điều hành):** "Tình trạng pin của giao diện bạn hôm nay thế nào?"  (A: Đang thở oxy cần sạc gấp | B: 50% bình ổn | C: 100% sẵn sàng quẩy đục nước). 
* **Biến thể 2 (Âm nhạc):** "Nhịp điệu (Tempo) cơ thể bạn lúc này đang đập ở mức nào?"  (A: Lofi cạn kiệt | B: Pop sương sương | C: EDM giật đùng đùng). 
* **Biến thể 3 (Thời tiết nội tâm):** "Bầu trời trong bạn lúc này trông ra sao?"  (A: Sương mù ảm đạm | B: Nắng nhẹ nhàng ấm áp | C: Rực rỡ chói chang). 
* **Biến thể 4 (Tốc độ):** "Bạn muốn động cơ của mình chạy ở tốc độ nào?"  (A: Tăng áp tối đa | B: Tà tà dạo phố | C: Tự do thả trôi). 
* **Biến thể 5 (Trạng thái làm việc):** "Deadline đang dí bạn ở mức độ nào?"  (A: Ngập cổ, cần cứu net | B: Túc tắc làm dần | C: Xong hết rồi, xõa thôi). 

**Câu hỏi 2: Ánh xạ Hương vị chủ đạo (Backend Logic: Flavor Core)** 
* **Mục đích:** Chọn dải hương vị (A: Trầm/Béo ngậy như Vanilla, B: Chua ngọt rực rỡ như Yuzu/Chanh dây, C: Thanh tao/Hoa cỏ như Vải thiều/Nhài). 
* **Biến thể 1 (Thẩm mỹ - Aesthetics):** "Nếu hôm nay diện một outfit nói lên tiếng lòng, bạn sẽ chọn style nào?"  (A: Dark Academia trầm mặc | B: Y2K rực rỡ chói lọi | C: Cottagecore trong trẻo). 
* **Biến thể 2 (Màu sắc):** "Nếu phải tô màu cho tâm trạng hiện tại, bạn chọn màu gì?"  (A: Xám trầm ấm | B: Vàng rực nắng | C: Xanh lá thanh khiết). 
* **Biến thể 3 (Vũ trụ/Tarot):** "Vũ trụ đang gửi đến bạn thông điệp gì?"  (A: Một cái ôm vỗ về an ủi | B: Một chuyến phiêu lưu bùng nổ | C: Sự bình yên thiền định). 
* **Biến thể 4 (Điện ảnh):** "Cuộc đời bạn lúc này giống thể loại phim nào?"  (A: Phim Melodrama sâu lắng | B: Hành động hài hước | C: Anime thanh xuân vườn trường). 
* **Biến thể 5 (Điểm đến):** "Nếu được mở cánh cửa thần kỳ, bạn muốn bước tới đâu?"  (A: Quán cafe vintage mưa bay | B: Bãi biển mùa hè rực rỡ | C: Khu rừng sương mai). 

**Câu hỏi 3: Lựa chọn Chức năng bổ sung (Backend Logic: Functional Add-in)** 
* **Mục đích:** Bổ sung giá trị sức khỏe (A: Collagen đẹp da, B: L-Theanine giảm căng thẳng, C: Điện giải bù nước). 
* **Biến thể 1 (Khám bệnh Gen Z):** "Bạn đang muốn gửi tín hiệu SOS cho bộ phận nào?"  (A: Xin một làn da glow up | B: Xin đăng xuất khỏi overthinking | C: Xin cơn mưa rào tưới mát cơ thể). 
* **Biến thể 2 (Siêu năng lực):** "Nếu được chọn một siêu năng lực ngay bây giờ, bạn chọn gì?"  (A: Trẻ hóa tức thì | B: Đóng băng thời gian để nghỉ ngơi | C: Hồi full 100% HP máu). 
* **Biến thể 3 (Thẻ bài):** "Bạn muốn rút thẻ bài bùa lợi (buff) nào?"  (A: The Beauty - Tỏa sáng | B: The Hermit - Tĩnh tâm | C: The Oasis - Hồi sinh). 
* **Biến thể 4 (Gaming Potion):** "Bạn sẽ uống bình thuốc phép thuật nào?"  (A: Lọ thuốc Nhan sắc | B: Lọ thuốc Tinh thần | C: Lọ thuốc Thể lực). 
* **Biến thể 5 (Lời nguyện cầu):** "Hôm nay đi đu idol, bạn muốn xin vía gì?"  (A: Vía visual phát sáng | B: Vía tâm lý vững vàng | C: Vía năng lượng không mệt mỏi). 

**Câu hỏi 4: Trải nghiệm xúc giác (Backend Logic: Texture/Topping)** 
* **Mục đích:** Chọn cấu trúc ly nước (A: Mochi/Trân châu nhai dẻo, B: Milk Foam êm ái, C: Kombucha/Ga sảng khoái). 
* **Biến thể 1 (ASMR/Âm thanh):** "Bạn muốn vòm miệng mình lắng nghe âm thanh nào?"  (A: Tiếng nhai rộp rộp dai dẻo | B: Sự tĩnh lặng tan chảy mượt mà | C: Tiếng sủi bọt lăn tăn xèo xèo). 
* **Biến thể 2 (Nhịp độ cơ hàm):** "Cơ hàm của bạn muốn hoạt động thế nào?"  (A: Tập thể dục cho đỡ buồn miệng | B: Lười lắm, chỉ muốn trôi tuột êm ái | C: Cần một cú kick xông thẳng lên não). 
* **Biến thể 3 (Xúc giác đồ vật):** "Cảm giác nào làm bạn thấy đã nhất?"  (A: Bóp đất nặn Slime đàn hồi | B: Chạm vào đám mây nhung lụa | C: Cảm nhận pháo hoa lách tách). 
* **Biến thể 4 (Tính cách loài vật):** "Nết ăn uống của bạn giống bé thu cưng nào?"  (A: Cún con thích gặm nhấm | B: Mèo lười nằm ườn nũng nịu | C: Chim gõ kiến lanh chanh). 
* **Biến thể 5 (Địa hình):** "Trải nghiệm trượt ống nước của bạn sẽ là?"  (A: Đường gập ghềnh vui nhộn | B: Đường trượt băng êm ru | C: Rơi tõm vào bể sục khoáng sảng khoái). 

**Câu hỏi 5: Độ mạo hiểm (Backend Logic: Risk Tolerance)** 
* **Mục đích:** Chọn thuật toán công thức (A: An toàn/Best-seller, B: Thêm 1 vị lạ/Twist, C: Độc bản/Đối lập). 
* **Biến thể 1 (Cờ Đỏ - Cờ Xanh):** "Khi đứng trước một tổ hợp hương vị lạ, bạn sẽ làm gì?"  (A: Xin nhả vía ở lại Green Flag an toàn | B: Mập mờ thử một chút xem sao | C: Red Flag lao vào luôn, càng dị càng mê). 
* **Biến thể 2 (Độ khó Game):** "Bạn muốn set độ khó (Difficulty) nào cho ly nước hôm nay?"  (A: Easy - Quốc dân ai cũng khen | B: Medium - Quen quen nhưng có cú twist | C: Hardcore - Độc bản hên xui). 
* **Biến thể 3 (Phong cách sống):** "Trong một chuyến du lịch, bạn là kiểu người nào?"  (A: Đi theo lịch trình có sẵn | B: Lâu lâu rẽ bừa vào một hẻm nhỏ | C: Đi lạc mới là chân ái). 
* **Biến thể 4 (Ứng dụng hẹn hò):** "Bạn thích kiểu match (tương hợp) nào?"  (A: Quẹt trúng người quen cho chắc | B: Tương hợp người lạ cùng gu | C: Blind date (hẹn hò ẩn danh) 100%). 
* **Biến thể 5 (Đầu tư):** "Khẩu vị rủi ro của bạn ở mức nào?"  (A: Gửi tiết kiệm không bao giờ lỗ | B: Lướt sóng nhẹ nhàng kiếm chênh lệch | C: Bắt đáy All-in, được ăn cả ngã về không). 

### 1.2. Màn hình Kết quả (Suggest 3 Options) 
Thay vì xuất 1 món, hệ thống hiển thị 3 thẻ (Card) đồ uống.  Khách hàng có thể quẹt trái/phải để chọn: 
1. **Thẻ 1 - "The Perfect Match" (Đồng điệu hoàn hảo):** Khớp 100% logic thuật toán từ các câu trả lời. 
2. **Thẻ 2 - "The Plot Twist" (Cú lật bất ngờ):** Giữ nguyên Base/Chức năng của The Perfect Match, nhưng hệ thống tự random đổi mô-đun Hương vị sang một hệ lạ hơn. 
3. **Thẻ 3 - "The Safe Trend" (Lựa chọn an toàn):** Món Best-seller của quán gần với Cốt nền (Base) khách chọn nhất. 

### 1.3. Màn hình Khởi tạo Hồ sơ (Optional Profiling & Value Exchange) 
* **Mục đích:** Tăng tỷ lệ giữ chân khách hàng (Retention) và xây dựng lòng trung thành (Loyalty) bằng cách thu thập dữ liệu minh bạch. 
* **UI/UX:** Một Pop-up hoặc Bottom Sheet xuất hiện nhẹ nhàng sau khi khách bấm chọn 1 trong 3 đồ uống (trước khi ra mã QR thanh toán hoặc gửi đơn).  Phải có nút "Bỏ qua / Lần sau nhé" thật rõ ràng để không gây cản trở (friction) cho khách vội. 
* **Nội dung (Copywriting):** "Vũ trụ đã ghi nhận 'vibe' của bạn hôm nay 🔮. Để mình nhớ tên bạn cho lần sau gọi món chỉ trong 1 chạm, và chuẩn bị quà bí mật cho sinh nhật bạn, cho mình xin thông tin nhé!" 
* **Trường nhập liệu (Fields):** Tên/Biệt danh (Tùy chọn) và Ngày/Tháng/Năm sinh (Tùy chọn). 
* **Logic cá nhân hóa:** Khảo sát cho thấy Gen Z sẵn sàng trao đổi thông tin cá nhân lấy các quyền lợi thiết thực và trải nghiệm mượt mà.  Khi khách nhập Ngày sinh, hệ thống có thể lưu lại và sử dụng thuật toán cung hoàng đạo (Zodiac Sign) để thay đổi Theme câu hỏi hoặc gợi ý món đặc biệt vào tháng sinh nhật của họ ở những lần truy cập sau. 

---

## 2. Chiến lược Menu Ma trận (Modular Matrix) - Giới hạn < 30 đồ uống 
Để tối ưu vận hành, hệ thống lưu 4 Nhóm Module độc lập. 

### 2.1. Danh mục Module Nguyên liệu cốt lõi 
* **Mô-đun 1 (Base - Nền):** Nước dừa tươi, Trà Oolong rang, Trà Đen. 
* **Mô-đun 2 (Flavor - Vị):** Mứt Yuzu (Thanh yên), Puree Vải thiều, Syrup Vanilla tự nhiên. 
* **Mô-đun 3 (Function - Chức năng):** Tinh chất Collagen lỏng, Chiết xuất L-Theanine tĩnh tâm, Bột Điện giải bù nước. 
* **Mô-đun 4 (Texture - Cấu trúc):** Mochi dẻo dạng lỏng, Milk Foam muối biển, Nước có ga (Kombucha/Sparkling). 

### 2.2. Thuật toán giới hạn tổ hợp (Exclusion Rules) 
Cần thiết lập Rule loại trừ để các hương vị không bị "đánh nhau", giữ tổng số món hợp lệ xuất ra POS dưới 30: 
* **Rule 1:** Không mix "Nước dừa tươi" với "Milk Foam" và "Vanilla". 
* **Rule 2:** Không mix "Nước có ga" với "Milk Foam" (gây trào bọt). 
* **Rule 3:** "Puree Vải thiều" chỉ map với "Base Oolong" hoặc "Base Nước dừa". 

Hệ thống sẽ dựa trên các tổ hợp hợp lệ để tự động ghép tên hoa mỹ (VD: Oolong Vải Mochi Theanine -> "Oolong Vải Trầm Lắng"). 

---

## 3. Yêu cầu Công thức Tỷ lệ Pha chế (Quy chuẩn ly 500ml) 
Mọi tổ hợp do hệ thống sinh ra phải khớp với "Tỷ lệ vàng" định lượng sẵn để Barista pha chế dưới 2 phút. 

### 3.1. Tỷ lệ cấu trúc chung (Master Formula) 
* **Cốt nền (Base):** 150ml (Trà/Nước dừa). 
* **Hương vị (Flavor Core):** 25ml - 30ml (Mứt/Syrup/Puree). 
* **Cân bằng Acid:** 10ml nước cốt chanh tươi (Bắt buộc nếu Flavor là Trái cây để cắt gắt). 
* **Chất chức năng (Add-in):** 5g dạng bột hoặc 5ml dạng dung dịch. 
* **Đá viên:** 200g. 
* **Topping/Kết cấu:** Đổ màng Foam 40ml hoặc 1 vá Mochi dẻo 40g hoặc Top-up 50ml nước có Ga. 

### 3.2. Form In Phiếu Barista (Barista Ticket Format) 
Phiếu POS không in tên mỹ miều mà in mã lệnh lắp ráp: 

> **Ví dụ Đơn hàng 1 (Năng lượng cạn, Thích trầm ấm, Giảm stress, Thích êm ái, An toàn):** 
> * **Base:** 150ml Trà Đen 
> * **Flavor:** 20ml Syrup Vanilla 
> * **Function:** 5ml L-Theanine 
> * **Texture:** 40ml Milk Foam 
> * *(Ghi chú Barista: Lắc Base + Flavor + Function + 200g Đá. Đổ ra ly, top up Texture).* 

---

## 4. Phân hệ Quản trị (Admin Dashboard & CMS) 
Phân hệ dành riêng cho Chủ quán/Quản lý cửa hàng để kiểm soát luồng vận hành ma trận và thấu hiểu hành vi khách hàng. 

### 4.1. Quản lý Kho & Nguyên vật liệu Ma trận (Matrix Inventory Management) 
Vì không có thực đơn cố định, hệ thống kho không quản lý theo "Ly đồ uống" mà quản lý trừ lùi theo "Mô-đun Nguyên liệu" (Ingredient Level).  Mọi thuộc tính và biến thể đều được định nghĩa độc lập để tự động đồng bộ. 
* **Cơ chế Trừ lùi Tự động (Auto-deduction):** Khi một mã lệnh đồ uống hoàn tất thanh toán, hệ thống tự động bóc tách và trừ đi định lượng chuẩn trong kho ảo.  (Ví dụ: Trừ 150ml cốt Oolong, 30ml Puree Vải, 40g Mochi, 1 ly nhựa, 1 ống hút). 
* **Đồng bộ Hàng Tồn (Inventory Sync) và Cảnh báo:** Quản lý có thể thiết lập định mức tồn kho tối thiểu.  Khi một nguyên liệu (ví dụ: Mứt Yuzu) sắp hết, hệ thống sẽ gửi cảnh báo.  Đặc biệt, Thuật toán Front-end sẽ tự động nhận tín hiệu và loại bỏ/giảm trọng số của các lựa chọn câu hỏi dẫn đến việc order mứt Yuzu để tránh tình trạng khách hàng đặt món nhưng không thể phục vụ. 
* **Quản lý Nhập/Xuất:** Giao diện cho phép nhập số liệu mua hàng từ nhà cung cấp, đối soát hao hụt (so sánh số lượng tồn kho trên phần mềm và số lượng thực tế kiểm đếm) để kiểm soát tỷ lệ thất thoát. 

### 4.2. Phân tích Dữ liệu Thời gian thực & Xu hướng (Real-time Data & Trend Analytics) 
Biến quá trình đặt đồ uống thành một công cụ thu thập "tín hiệu tâm lý" của khách hàng Gen Z, từ đó đưa ra các quyết định kinh doanh chiến lược. 
* **Dashboard Tâm trạng Hiện tại (Live Mood Board):** Biểu đồ hiển thị thống kê thời gian thực về tâm trạng của khách hàng trong ngày/tuần. 
* **Tỷ lệ Chuyển đổi Đề xuất (Recommendation Conversion Rate):** Thống kê xem trong 3 option được suggest, khách hàng có xu hướng chọn thẻ nào nhất (Perfect Match, Plot Twist hay Safe Trend). 
* **Ma trận Phân tích Thực đơn (Menu Engineering Matrix):** Phân loại các Tổ hợp đồ uống hoặc Mô-đun Hương vị thành 4 nhóm nhằm tối ưu hóa lợi nhuận (Ngôi sao, Ngựa cày, Câu đố, Chó sói). 
* **Báo cáo Hồ sơ Khách hàng (Customer Insights):** Thống kê tỷ lệ khách hàng cung cấp dữ liệu Tên/Ngày sinh, tần suất khách hàng quay lại dựa trên lịch sử lưu trữ sở thích cá nhân. 

### Ghi chú cho AI (Claude/Dev Team): 
1. Thiết lập DB Schema cập nhật thêm bảng Customers (với các trường Name, DOB, Zodiac). 
2. Xây dựng UI/UX Component dạng pop-up non-intrusive cho bước 1.3 (Thu thập thông tin). 
3. Cập nhật hàm Recommendation Engine để nếu hệ thống nhận diện được customer_id cũ, "Thẻ 3 - Lựa chọn an toàn" sẽ thay thế bằng "Món bạn đã uống lần trước". 