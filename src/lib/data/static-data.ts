// Static seed data - used directly by API routes on serverless platforms
// where SQLite is not available. Mirrors prisma/seed.ts data exactly.

export interface StaticModule {
  id: string;
  category: string;
  name: string;
  nameVi: string;
  stockQuantity: number;
  unit: string;
  deductionRate: number;
  alertThreshold: number;
  isActive: boolean;
  costPerUnit: number;
}

export interface StaticQuestion {
  id: string;
  stepNumber: number;
  themeId: string;
  questionText: string;
  answers: string; // JSON string
}

export interface StaticExclusionRule {
  module1Id: string;
  module2Id: string;
  reason: string;
}

export const MODULES: StaticModule[] = [
  // BASE
  { id: "base-tra-den", category: "BASE", name: "Black Tea", nameVi: "Trà Đen", stockQuantity: 50000, unit: "ml", deductionRate: 150, alertThreshold: 3000, isActive: true, costPerUnit: 0.5 },
  { id: "base-oolong", category: "BASE", name: "Roasted Oolong", nameVi: "Trà Oolong Rang", stockQuantity: 40000, unit: "ml", deductionRate: 150, alertThreshold: 3000, isActive: true, costPerUnit: 0.8 },
  { id: "base-nuoc-dua", category: "BASE", name: "Fresh Coconut Water", nameVi: "Nước Dừa Tươi", stockQuantity: 30000, unit: "ml", deductionRate: 150, alertThreshold: 3000, isActive: true, costPerUnit: 1.2 },
  // FLAVOR
  { id: "flavor-yuzu", category: "FLAVOR", name: "Yuzu Jam", nameVi: "Mứt Yuzu (Thanh Yên)", stockQuantity: 15000, unit: "ml", deductionRate: 30, alertThreshold: 1000, isActive: true, costPerUnit: 3.0 },
  { id: "flavor-vai", category: "FLAVOR", name: "Lychee Puree", nameVi: "Puree Vải Thiều", stockQuantity: 12000, unit: "ml", deductionRate: 30, alertThreshold: 1000, isActive: true, costPerUnit: 2.5 },
  { id: "flavor-vanilla", category: "FLAVOR", name: "Natural Vanilla Syrup", nameVi: "Syrup Vanilla Tự Nhiên", stockQuantity: 20000, unit: "ml", deductionRate: 25, alertThreshold: 1000, isActive: true, costPerUnit: 2.0 },
  // FUNCTION
  { id: "func-collagen", category: "FUNCTION", name: "Liquid Collagen", nameVi: "Tinh Chất Collagen Lỏng", stockQuantity: 5000, unit: "ml", deductionRate: 5, alertThreshold: 500, isActive: true, costPerUnit: 10.0 },
  { id: "func-theanine", category: "FUNCTION", name: "L-Theanine Extract", nameVi: "Chiết Xuất L-Theanine", stockQuantity: 5000, unit: "ml", deductionRate: 5, alertThreshold: 500, isActive: true, costPerUnit: 8.0 },
  { id: "func-electrolyte", category: "FUNCTION", name: "Electrolyte Powder", nameVi: "Bột Điện Giải Bù Nước", stockQuantity: 8000, unit: "g", deductionRate: 5, alertThreshold: 500, isActive: true, costPerUnit: 5.0 },
  // TEXTURE
  { id: "texture-mochi", category: "TEXTURE", name: "Liquid Mochi", nameVi: "Mochi Dẻo Dạng Lỏng", stockQuantity: 20000, unit: "g", deductionRate: 40, alertThreshold: 2000, isActive: true, costPerUnit: 1.5 },
  { id: "texture-milk-foam", category: "TEXTURE", name: "Sea Salt Milk Foam", nameVi: "Milk Foam Muối Biển", stockQuantity: 25000, unit: "ml", deductionRate: 40, alertThreshold: 2000, isActive: true, costPerUnit: 1.0 },
  { id: "texture-sparkling", category: "TEXTURE", name: "Sparkling/Kombucha", nameVi: "Nước Có Ga (Kombucha/Sparkling)", stockQuantity: 30000, unit: "ml", deductionRate: 50, alertThreshold: 3000, isActive: true, costPerUnit: 0.8 },
];

export const EXCLUSION_RULES: StaticExclusionRule[] = [
  { module1Id: "base-nuoc-dua", module2Id: "texture-milk-foam", reason: "Nước dừa và Milk Foam gây kết tủa, mất hương vị" },
  { module1Id: "base-nuoc-dua", module2Id: "flavor-vanilla", reason: "Nước dừa tươi và Vanilla không hòa hợp về hương" },
  { module1Id: "texture-sparkling", module2Id: "texture-milk-foam", reason: "Nước có ga và Milk Foam gây trào bọt" },
  { module1Id: "flavor-vai", module2Id: "base-tra-den", reason: "Puree Vải chỉ phù hợp với Base Oolong hoặc Nước Dừa" },
];

const step1Questions = [
  { themeId: "os", questionText: "Tình trạng pin của giao diện bạn hôm nay thế nào?", answers: [{ label: "🔋 Đang thở oxy cần sạc gấp", value: "A", logicMapping: "base-tra-den" }, { label: "⚡ 50% bình ổn", value: "B", logicMapping: "base-oolong" }, { label: "💯 100% sẵn sàng quẩy đục nước", value: "C", logicMapping: "base-nuoc-dua" }] },
  { themeId: "music", questionText: "Nhịp điệu (Tempo) cơ thể bạn lúc này đang đập ở mức nào?", answers: [{ label: "🎵 Lofi cạn kiệt", value: "A", logicMapping: "base-tra-den" }, { label: "🎶 Pop sương sương", value: "B", logicMapping: "base-oolong" }, { label: "🎸 EDM giật đùng đùng", value: "C", logicMapping: "base-nuoc-dua" }] },
  { themeId: "weather", questionText: "Bầu trời trong bạn lúc này trông ra sao?", answers: [{ label: "🌫️ Sương mù ảm đạm", value: "A", logicMapping: "base-tra-den" }, { label: "🌤️ Nắng nhẹ nhàng ấm áp", value: "B", logicMapping: "base-oolong" }, { label: "☀️ Rực rỡ chói chang", value: "C", logicMapping: "base-nuoc-dua" }] },
  { themeId: "speed", questionText: "Bạn muốn động cơ của mình chạy ở tốc độ nào?", answers: [{ label: "🚀 Tăng áp tối đa", value: "A", logicMapping: "base-tra-den" }, { label: "🚗 Tà tà dạo phố", value: "B", logicMapping: "base-oolong" }, { label: "🛶 Tự do thả trôi", value: "C", logicMapping: "base-nuoc-dua" }] },
  { themeId: "work", questionText: "Deadline đang dí bạn ở mức độ nào?", answers: [{ label: "🔥 Ngập cổ, cần cứu net", value: "A", logicMapping: "base-tra-den" }, { label: "📋 Túc tắc làm dần", value: "B", logicMapping: "base-oolong" }, { label: "🎉 Xong hết rồi, xõa thôi", value: "C", logicMapping: "base-nuoc-dua" }] },
];

const step2Questions = [
  { themeId: "aesthetics", questionText: "Nếu hôm nay diện một outfit nói lên tiếng lòng, bạn sẽ chọn style nào?", answers: [{ label: "🖤 Dark Academia trầm mặc", value: "A", logicMapping: "flavor-vanilla" }, { label: "✨ Y2K rực rỡ chói lọi", value: "B", logicMapping: "flavor-yuzu" }, { label: "🌿 Cottagecore trong trẻo", value: "C", logicMapping: "flavor-vai" }] },
  { themeId: "color", questionText: "Nếu phải tô màu cho tâm trạng hiện tại, bạn chọn màu gì?", answers: [{ label: "🩶 Xám trầm ấm", value: "A", logicMapping: "flavor-vanilla" }, { label: "💛 Vàng rực nắng", value: "B", logicMapping: "flavor-yuzu" }, { label: "💚 Xanh lá thanh khiết", value: "C", logicMapping: "flavor-vai" }] },
  { themeId: "tarot", questionText: "Vũ trụ đang gửi đến bạn thông điệp gì?", answers: [{ label: "🤗 Một cái ôm vỗ về an ủi", value: "A", logicMapping: "flavor-vanilla" }, { label: "🎢 Một chuyến phiêu lưu bùng nổ", value: "B", logicMapping: "flavor-yuzu" }, { label: "🧘 Sự bình yên thiền định", value: "C", logicMapping: "flavor-vai" }] },
  { themeId: "cinema", questionText: "Cuộc đời bạn lúc này giống thể loại phim nào?", answers: [{ label: "🎭 Phim Melodrama sâu lắng", value: "A", logicMapping: "flavor-vanilla" }, { label: "💥 Hành động hài hước", value: "B", logicMapping: "flavor-yuzu" }, { label: "🌸 Anime thanh xuân vườn trường", value: "C", logicMapping: "flavor-vai" }] },
  { themeId: "destination", questionText: "Nếu được mở cánh cửa thần kỳ, bạn muốn bước tới đâu?", answers: [{ label: "☕ Quán cafe vintage mưa bay", value: "A", logicMapping: "flavor-vanilla" }, { label: "🏖️ Bãi biển mùa hè rực rỡ", value: "B", logicMapping: "flavor-yuzu" }, { label: "🌲 Khu rừng sương mai", value: "C", logicMapping: "flavor-vai" }] },
];

const step3Questions = [
  { themeId: "genz-health", questionText: "Bạn đang muốn gửi tín hiệu SOS cho bộ phận nào?", answers: [{ label: "✨ Xin một làn da glow up", value: "A", logicMapping: "func-collagen" }, { label: "🧠 Xin đăng xuất khỏi overthinking", value: "B", logicMapping: "func-theanine" }, { label: "💧 Xin cơn mưa rào tưới mát cơ thể", value: "C", logicMapping: "func-electrolyte" }] },
  { themeId: "superpower", questionText: "Nếu được chọn một siêu năng lực ngay bây giờ, bạn chọn gì?", answers: [{ label: "🦋 Trẻ hóa tức thì", value: "A", logicMapping: "func-collagen" }, { label: "⏸️ Đóng băng thời gian để nghỉ ngơi", value: "B", logicMapping: "func-theanine" }, { label: "❤️‍🔥 Hồi full 100% HP máu", value: "C", logicMapping: "func-electrolyte" }] },
  { themeId: "card", questionText: "Bạn muốn rút thẻ bài bùa lợi (buff) nào?", answers: [{ label: "👑 The Beauty - Tỏa sáng", value: "A", logicMapping: "func-collagen" }, { label: "🔮 The Hermit - Tĩnh tâm", value: "B", logicMapping: "func-theanine" }, { label: "🏝️ The Oasis - Hồi sinh", value: "C", logicMapping: "func-electrolyte" }] },
  { themeId: "gaming", questionText: "Bạn sẽ uống bình thuốc phép thuật nào?", answers: [{ label: "💎 Lọ thuốc Nhan sắc", value: "A", logicMapping: "func-collagen" }, { label: "🧪 Lọ thuốc Tinh thần", value: "B", logicMapping: "func-theanine" }, { label: "⚗️ Lọ thuốc Thể lực", value: "C", logicMapping: "func-electrolyte" }] },
  { themeId: "idol", questionText: "Hôm nay đi đu idol, bạn muốn xin vía gì?", answers: [{ label: "💅 Vía visual phát sáng", value: "A", logicMapping: "func-collagen" }, { label: "🧘 Vía tâm lý vững vàng", value: "B", logicMapping: "func-theanine" }, { label: "⚡ Vía năng lượng không mệt mỏi", value: "C", logicMapping: "func-electrolyte" }] },
];

const step4Questions = [
  { themeId: "asmr", questionText: "Bạn muốn vòm miệng mình lắng nghe âm thanh nào?", answers: [{ label: "🫧 Tiếng nhai rộp rộp dai dẻo", value: "A", logicMapping: "texture-mochi" }, { label: "☁️ Sự tĩnh lặng tan chảy mượt mà", value: "B", logicMapping: "texture-milk-foam" }, { label: "🫧 Tiếng sủi bọt lăn tăn xèo xèo", value: "C", logicMapping: "texture-sparkling" }] },
  { themeId: "jaw", questionText: "Cơ hàm của bạn muốn hoạt động thế nào?", answers: [{ label: "💪 Tập thể dục cho đỡ buồn miệng", value: "A", logicMapping: "texture-mochi" }, { label: "😴 Lười lắm, chỉ muốn trôi tuột êm ái", value: "B", logicMapping: "texture-milk-foam" }, { label: "⚡ Cần một cú kick xông thẳng lên não", value: "C", logicMapping: "texture-sparkling" }] },
  { themeId: "tactile", questionText: "Cảm giác nào làm bạn thấy đã nhất?", answers: [{ label: "🟣 Bóp đất nặn Slime đàn hồi", value: "A", logicMapping: "texture-mochi" }, { label: "☁️ Chạm vào đám mây nhung lụa", value: "B", logicMapping: "texture-milk-foam" }, { label: "🎆 Cảm nhận pháo hoa lách tách", value: "C", logicMapping: "texture-sparkling" }] },
  { themeId: "pet", questionText: "Nết ăn uống của bạn giống bé thú cưng nào?", answers: [{ label: "🐶 Cún con thích gặm nhấm", value: "A", logicMapping: "texture-mochi" }, { label: "🐱 Mèo lười nằm ườn nũng nịu", value: "B", logicMapping: "texture-milk-foam" }, { label: "🐦 Chim gõ kiến lanh chanh", value: "C", logicMapping: "texture-sparkling" }] },
  { themeId: "waterslide", questionText: "Trải nghiệm trượt ống nước của bạn sẽ là?", answers: [{ label: "🎢 Đường gập ghềnh vui nhộn", value: "A", logicMapping: "texture-mochi" }, { label: "🧊 Đường trượt băng êm ru", value: "B", logicMapping: "texture-milk-foam" }, { label: "🌊 Rơi tõm vào bể sục khoáng sảng khoái", value: "C", logicMapping: "texture-sparkling" }] },
];

const step5Questions = [
  { themeId: "flag", questionText: "Khi đứng trước một tổ hợp hương vị lạ, bạn sẽ làm gì?", answers: [{ label: "🟢 Xin nhả vía ở lại Green Flag an toàn", value: "A", logicMapping: "safe" }, { label: "🟡 Mập mờ thử một chút xem sao", value: "B", logicMapping: "twist" }, { label: "🔴 Red Flag lao vào luôn, càng dị càng mê", value: "C", logicMapping: "wild" }] },
  { themeId: "game-difficulty", questionText: "Bạn muốn set độ khó (Difficulty) nào cho ly nước hôm nay?", answers: [{ label: "🎮 Easy - Quốc dân ai cũng khen", value: "A", logicMapping: "safe" }, { label: "🎯 Medium - Quen quen nhưng có cú twist", value: "B", logicMapping: "twist" }, { label: "💀 Hardcore - Độc bản hên xui", value: "C", logicMapping: "wild" }] },
  { themeId: "travel", questionText: "Trong một chuyến du lịch, bạn là kiểu người nào?", answers: [{ label: "📋 Đi theo lịch trình có sẵn", value: "A", logicMapping: "safe" }, { label: "🗺️ Lâu lâu rẽ bừa vào một hẻm nhỏ", value: "B", logicMapping: "twist" }, { label: "🧭 Đi lạc mới là chân ái", value: "C", logicMapping: "wild" }] },
  { themeId: "dating", questionText: "Bạn thích kiểu match (tương hợp) nào?", answers: [{ label: "🤝 Quẹt trúng người quen cho chắc", value: "A", logicMapping: "safe" }, { label: "💫 Tương hợp người lạ cùng gu", value: "B", logicMapping: "twist" }, { label: "🎲 Blind date 100%", value: "C", logicMapping: "wild" }] },
  { themeId: "invest", questionText: "Khẩu vị rủi ro của bạn ở mức nào?", answers: [{ label: "🏦 Gửi tiết kiệm không bao giờ lỗ", value: "A", logicMapping: "safe" }, { label: "📈 Lướt sóng nhẹ nhàng kiếm chênh lệch", value: "B", logicMapping: "twist" }, { label: "🚀 Bắt đáy All-in, được ăn cả ngã về không", value: "C", logicMapping: "wild" }] },
];

let questionIdCounter = 0;
function genId() {
  questionIdCounter++;
  return `q-${questionIdCounter}`;
}

export const QUESTIONS: StaticQuestion[] = [
  ...step1Questions.map((q) => ({ id: genId(), stepNumber: 1, themeId: q.themeId, questionText: q.questionText, answers: JSON.stringify(q.answers) })),
  ...step2Questions.map((q) => ({ id: genId(), stepNumber: 2, themeId: q.themeId, questionText: q.questionText, answers: JSON.stringify(q.answers) })),
  ...step3Questions.map((q) => ({ id: genId(), stepNumber: 3, themeId: q.themeId, questionText: q.questionText, answers: JSON.stringify(q.answers) })),
  ...step4Questions.map((q) => ({ id: genId(), stepNumber: 4, themeId: q.themeId, questionText: q.questionText, answers: JSON.stringify(q.answers) })),
  ...step5Questions.map((q) => ({ id: genId(), stepNumber: 5, themeId: q.themeId, questionText: q.questionText, answers: JSON.stringify(q.answers) })),
];
