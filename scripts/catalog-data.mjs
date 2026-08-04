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
    id: "com-tam-suon-bi-cha",
    name: "Cơm tấm sườn bì chả",
    description: "Cơm tấm với sườn nướng, bì heo và chả trứng hấp.",
    category: "Cơm",
    emoji: "🍚",
  },
  {
    id: "com-ga-xoi-mo",
    name: "Cơm gà xối mỡ",
    description: "Gà chiên giòn ăn kèm cơm, rưới mỡ hành và tỏi phi thơm lừng.",
    category: "Cơm",
    emoji: "🍗",
  },
  {
    id: "com-chien-duong-chau",
    name: "Cơm chiên dương châu",
    description:
      "Cơm chiên kiểu Dương Châu với tôm, xá xíu, đậu Hà Lan và trứng.",
    category: "Cơm",
    emoji: "🍛",
  },
  {
    id: "bun-bo-hue",
    name: "Bún bò Huế",
    description: "Bún bò cay đậm đà kiểu Huế với thịt bò, giò heo và sả thơm.",
    category: "Bún",
    emoji: "🍜",
  },
  {
    id: "bun-cha",
    name: "Bún chả",
    description:
      "Chả viên và thịt ba chỉ nướng, ăn cùng bún và nước chấm chua ngọt.",
    category: "Bún",
    emoji: "🍖",
  },
  {
    id: "bun-thit-nuong",
    name: "Bún thịt nướng",
    description:
      "Thịt heo nướng ăn cùng bún, rau sống, đồ chua và nước mắm pha.",
    category: "Bún",
    emoji: "🥗",
  },
  {
    id: "bun-rieu",
    name: "Bún riêu",
    description: "Bún riêu cua đậm đà vị cà chua, ăn kèm đậu hũ chiên.",
    category: "Bún",
    emoji: "🍲",
  },
  {
    id: "pho-bo",
    name: "Phở bò",
    description:
      "Phở bò truyền thống với thịt bò tái, nước dùng thơm và rau thơm.",
    category: "Phở",
    emoji: "🍜",
  },
  {
    id: "pho-ga",
    name: "Phở gà",
    description: "Phở nước trong với thịt gà xé và rau thơm ăn kèm.",
    category: "Phở",
    emoji: "🥣",
  },
  {
    id: "mien-ga",
    name: "Miến gà",
    description: "Miến nấu với thịt gà xé, mộc nhĩ và rau thơm.",
    category: "Miến",
    emoji: "🍲",
  },
  {
    id: "mien-luon",
    name: "Miến lươn",
    description: "Miến ăn cùng lươn chiên giòn, hành phi và nước dùng đậm đà.",
    category: "Miến",
    emoji: "🥘",
  },
  {
    id: "xoi-man",
    name: "Xôi mặn",
    description: "Xôi mặn với lạp xưởng, ruốc, chà bông và hành phi.",
    category: "Xôi",
    emoji: "🍙",
  },
  {
    id: "xoi-ga",
    name: "Xôi gà",
    description: "Xôi ăn kèm thịt gà xé, chà bông và hành phi.",
    category: "Xôi",
    emoji: "🍙",
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
