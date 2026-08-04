// Edit this file, then ask me to "push"/"seed" it — I'll run scripts/seed-catalog.mjs to write
// it into your Firestore project's `foods` and `people` collections.
//
// This file is just data (plain JS objects/arrays), safe to hand-edit. No other code in the app
// reads this file directly — it only exists as the source you edit before I push it to Firestore.
//
// ── FOODS ────────────────────────────────────────────────────────────────────────────────────
// Each entry becomes one document in the Firestore "foods" collection, with `id` used as the
// document ID. Fields:
//   id          Stable identifier. Also becomes the Firestore document ID, so keep it
//               lowercase, ASCII-only, hyphen-separated (e.g. "com-tam-suon-bi-cha"), and
//               unique. Changing an existing id later creates a NEW document instead of
//               updating the old one (the old one won't be auto-removed — see note at bottom).
//   name        Display name shown on the vote card and results list (any text/diacritics OK).
//   description Short one-line description shown on the vote card.
//   category    Groups dishes for the filter chips on the Cast Vote tab (e.g. "Cơm", "Bún",
//               "Phở", "Miến", "Xôi"). Any string works; a new category value automatically
//               gets its own filter chip — no code changes needed.
//   emoji       A single emoji shown on the card and in the results list.
// Order in this array = display order in the app (top to bottom, left to right in the grid).
export const FOODS = [
  {
    id: "com-bun-rieu",
    name: "Quán cơm bún riêu",
    description:
      "Một bữa cơm giản dị, thêm tô bún riêu đậm đà cho những ngày muốn ăn thật ngon.",
    category: "Cơm",
    emoji: "🍚",
  },
  {
    id: "com-o-ngo",
    name: "Quán cơm ở ngõ",
    description:
      "Một quán cơm nép mình trong con ngõ nhỏ, mang đến cảm giác thân quen như một bữa cơm nhà.",
    category: "Cơm",
    emoji: "🍚",
  },
  {
    id: "bun-cha-ba-gia",
    name: "Bún chả bà già",
    description:
      "Mùi thịt nướng thơm lừng, chả viên vàng ruộm quyện cùng bát nước chấm chua ngọt đậm đà.",
    category: "Bún",
    emoji: "🍖",
  },
  {
    id: "banh-canh",
    name: "Bánh canh",
    description:
      "Những sợi bánh canh mềm dai trong làn nước dùng nóng hổi, giản dị mà cuốn hút.",
    category: "Bánh canh",
    emoji: "🍜",
  },
  {
    id: "bun-ca-nga-tu",
    name: "Bún cá ngã tư",
    description:
      "Tô bún cá nóng hổi với miếng cá thơm giòn, nước dùng thanh ngọt cho một bữa ăn nhẹ nhàng.",
    category: "Bún",
    emoji: "🐟",
  },
  {
    id: "bun-bo-hue",
    name: "Bún bò Huế",
    description:
      "Vị cay nồng của sa tế, hương sả thơm lừng hòa quyện trong nước dùng đậm đà chuẩn vị miền Trung.",
    category: "Bún",
    emoji: "🍜",
  },
  {
    id: "bun-dau-hoa-binh",
    name: "Bún đậu Hòa Bình",
    description:
      "Mẹt bún đậu dân dã với đậu chiên vàng giòn, chả thơm béo và chén mắm tôm dậy vị.",
    category: "Bún",
    emoji: "🥢",
  },
  {
    id: "mien-ngan-nga-tu",
    name: "Miến ngan ngã tư",
    description:
      "Miến mềm trong veo, thịt ngan ngọt thơm cùng nước dùng nóng hổi, vừa thanh vừa đậm đà.",
    category: "Miến",
    emoji: "🍲",
  },
  {
    id: "bun-thang",
    name: "Bún thang",
    description:
      "Một tô bún thanh tao với thịt gà, trứng thái sợi và giò, tinh tế trong từng lớp hương vị.",
    category: "Bún",
    emoji: "🍜",
  },
  {
    id: "com-ga-bao-ngoc",
    name: "Cơm gà Bảo Ngọc",
    description:
      "Đĩa cơm gà vàng óng, thịt gà mềm thơm và đậm vị, gợi nhớ một bữa cơm ngon lành, trọn vẹn.",
    category: "Cơm",
    emoji: "🍗",
  },
];

// ── PEOPLE ───────────────────────────────────────────────────────────────────────────────────
// Each entry becomes one document in the Firestore "people" collection. Just a list of plain
// name strings — the document ID is auto-derived from the name (lowercased, no diacritics,
// hyphenated), so you can freely rename/reorder/add/remove entries here without worrying about
// IDs yourself. This is the list shown in the "Tên của bạn" combobox on the Cast Vote tab.
// Order in this array = order shown in that dropdown.
export const PEOPLE = [
  "Thầy Hiếu - Giám đốc",
  "Anh Vũ - Hoạ sĩ",
  "Cô Khánh - Altacom",
  "Anh Việt - Backend",
  "Anh Cảnh - PM",
  "Anh Thắng - IoT",
  "Anh Cường - Frontend",
  "Anh Đạt gầy - Frontend",
  "Anh Hiếu - IoT",
  "Tuấn - Mobile",
  "Kiên gầy - Mobile",
  "Anh Đạt béo - Frontend",
  "Chị Giang - Tester & BA",
  "Anh Sơn - DevOps",
  "Kiên béo - Backend",
  "Anh Tung - Frontend",
  "Chị Thoả - Kế toán",
];

// ── NOTE on removing/renaming entries ──────────────────────────────────────────────────────
// Seeding is an upsert: it only ever creates/overwrites documents for what's listed above. If
// you DELETE a line from this file (or change a food's `id`), the corresponding old Firestore
// document is NOT automatically removed — just tell me afterwards and I'll clean up anything
// that's no longer in this file.
