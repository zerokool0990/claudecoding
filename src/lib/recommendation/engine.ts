import { MODULES, EXCLUSION_RULES } from "@/lib/data/static-data";
import type { DrinkCombo, QuizAnswers, RecommendationResult, RecipeStep, ModuleData } from "@/types";

interface ModuleRow {
  id: string;
  category: string;
  name: string;
  nameVi: string;
  stockQuantity: number;
  unit: string;
  deductionRate: number;
  alertThreshold: number;
  isActive: boolean;
}

interface ExclusionRow {
  module1Id: string;
  module2Id: string;
}

// Vietnamese drink name generation
const DRINK_NAMES: Record<string, Record<string, string>> = {
  "base-tra-den": {
    "flavor-vanilla": "Trà Đen Vanilla",
    "flavor-yuzu": "Trà Đen Yuzu",
    "flavor-vai": "Trà Đen Vải",
  },
  "base-oolong": {
    "flavor-vanilla": "Oolong Vanilla",
    "flavor-yuzu": "Oolong Yuzu",
    "flavor-vai": "Oolong Vải",
  },
  "base-nuoc-dua": {
    "flavor-vanilla": "Dừa Vanilla",
    "flavor-yuzu": "Dừa Yuzu",
    "flavor-vai": "Dừa Vải",
  },
};

const FUNCTION_SUFFIX: Record<string, string> = {
  "func-collagen": "Tỏa Sáng",
  "func-theanine": "Trầm Lắng",
  "func-electrolyte": "Tràn Đầy",
};

const TEXTURE_SUFFIX: Record<string, string> = {
  "texture-mochi": "Mochi",
  "texture-milk-foam": "Cream",
  "texture-sparkling": "Sparkling",
};

function generateDrinkName(
  base: ModuleRow,
  flavor: ModuleRow,
  func: ModuleRow,
  texture: ModuleRow
): { name: string; nameVi: string } {
  const baseName = DRINK_NAMES[base.id]?.[flavor.id] || `${base.nameVi} ${flavor.nameVi}`;
  const funcSuffix = FUNCTION_SUFFIX[func.id] || "";
  const textureSuffix = TEXTURE_SUFFIX[texture.id] || "";

  const nameVi = `${baseName} ${textureSuffix} ${funcSuffix}`.trim();
  const name = `${base.name} ${flavor.name} ${texture.name}`.trim();

  return { name, nameVi };
}

function generateRecipe(
  base: ModuleRow,
  flavor: ModuleRow,
  func: ModuleRow,
  texture: ModuleRow
): RecipeStep[] {
  const isFruit = ["flavor-yuzu", "flavor-vai"].includes(flavor.id);

  const steps: RecipeStep[] = [
    { action: "Chuẩn bị", ingredient: base.nameVi, amount: `${base.deductionRate}${base.unit}` },
    { action: "Thêm", ingredient: flavor.nameVi, amount: `${flavor.deductionRate}${flavor.unit}` },
  ];

  if (isFruit) {
    steps.push({ action: "Cân bằng acid", ingredient: "Nước cốt chanh tươi", amount: "10ml" });
  }

  steps.push(
    { action: "Thêm", ingredient: func.nameVi, amount: `${func.deductionRate}${func.unit}` },
    { action: "Lắc đều với", ingredient: "Đá viên", amount: "200g" },
    { action: "Đổ ra ly, top up", ingredient: texture.nameVi, amount: `${texture.deductionRate}${texture.unit}` }
  );

  return steps;
}

function isExcluded(
  modules: ModuleRow[],
  exclusions: ExclusionRow[]
): boolean {
  const ids = modules.map((m) => m.id);
  for (const rule of exclusions) {
    if (ids.includes(rule.module1Id) && ids.includes(rule.module2Id)) {
      return true;
    }
  }
  return false;
}

function toModuleData(m: ModuleRow): ModuleData {
  return {
    id: m.id,
    category: m.category as ModuleData["category"],
    name: m.name,
    nameVi: m.nameVi,
    stockQuantity: m.stockQuantity,
    unit: m.unit,
    deductionRate: m.deductionRate,
    alertThreshold: m.alertThreshold,
    isActive: m.isActive,
  };
}

// Answer value -> module ID mapping per step
const ANSWER_MAP: Record<number, Record<string, string>> = {
  1: { A: "base-tra-den", B: "base-oolong", C: "base-nuoc-dua" },
  2: { A: "flavor-vanilla", B: "flavor-yuzu", C: "flavor-vai" },
  3: { A: "func-collagen", B: "func-theanine", C: "func-electrolyte" },
  4: { A: "texture-mochi", B: "texture-milk-foam", C: "texture-sparkling" },
};

export async function getRecommendations(
  answers: QuizAnswers,
  customerId?: string
): Promise<RecommendationResult> {
  // Use static data - works on any platform including serverless
  const allModules: ModuleRow[] = MODULES.filter((m) => m.isActive);
  const exclusions: ExclusionRow[] = EXCLUSION_RULES;

  // Map answers to module selections
  const baseId = ANSWER_MAP[1][answers.step1];
  const flavorId = ANSWER_MAP[2][answers.step2];
  const funcId = ANSWER_MAP[3][answers.step3];
  const textureId = ANSWER_MAP[4][answers.step4];

  const findModule = (id: string) => allModules.find((m) => m.id === id)!;

  let base = findModule(baseId);
  let flavor = findModule(flavorId);
  let func = findModule(funcId);
  let texture = findModule(textureId);

  // Check stock availability - fall back to alternatives
  const getAvailable = (category: string, preferredId: string) => {
    const preferred = allModules.find(
      (m) => m.id === preferredId && m.stockQuantity >= m.deductionRate
    );
    if (preferred) return preferred;
    return allModules.find(
      (m) => m.category === category && m.stockQuantity >= m.deductionRate
    )!;
  };

  base = getAvailable("BASE", baseId);
  flavor = getAvailable("FLAVOR", flavorId);
  func = getAvailable("FUNCTION", funcId);
  texture = getAvailable("TEXTURE", textureId);

  // Resolve exclusion conflicts
  if (isExcluded([base, flavor, func, texture], exclusions)) {
    // Try swapping flavor first
    const altFlavors = allModules.filter(
      (m) =>
        m.category === "FLAVOR" &&
        m.id !== flavor.id &&
        m.stockQuantity >= m.deductionRate
    );
    for (const alt of altFlavors) {
      if (!isExcluded([base, alt, func, texture], exclusions)) {
        flavor = alt;
        break;
      }
    }

    // If still excluded, try swapping texture
    if (isExcluded([base, flavor, func, texture], exclusions)) {
      const altTextures = allModules.filter(
        (m) =>
          m.category === "TEXTURE" &&
          m.id !== texture.id &&
          m.stockQuantity >= m.deductionRate
      );
      for (const alt of altTextures) {
        if (!isExcluded([base, flavor, func, alt], exclusions)) {
          texture = alt;
          break;
        }
      }
    }
  }

  // === Card 1: Perfect Match ===
  const perfectNames = generateDrinkName(base, flavor, func, texture);
  const perfectMatch: DrinkCombo = {
    base: toModuleData(base),
    flavor: toModuleData(flavor),
    function: toModuleData(func),
    texture: toModuleData(texture),
    generatedName: perfectNames.name,
    generatedNameVi: perfectNames.nameVi,
    recipe: generateRecipe(base, flavor, func, texture),
  };

  // === Card 2: Plot Twist - swap flavor to opposite ===
  const altFlavorForTwist = allModules.find(
    (m) =>
      m.category === "FLAVOR" &&
      m.id !== flavor.id &&
      m.stockQuantity >= m.deductionRate &&
      !isExcluded([base, m, func, texture], exclusions)
  ) || flavor;

  const twistNames = generateDrinkName(base, altFlavorForTwist, func, texture);
  const plotTwist: DrinkCombo = {
    base: toModuleData(base),
    flavor: toModuleData(altFlavorForTwist),
    function: toModuleData(func),
    texture: toModuleData(texture),
    generatedName: twistNames.name,
    generatedNameVi: twistNames.nameVi,
    recipe: generateRecipe(base, altFlavorForTwist, func, texture),
  };

  // === Card 3: Safe Trend - returning customer OR bestseller ===
  let safeTrend: DrinkCombo | null = null;

  // Check returning customer history (dynamic import keeps engine testable without DB)
  if (customerId) {
    try {
      const { default: prisma } = await import("@/lib/db/prisma");
      const pastItems = await prisma.orderItem.findMany({
        where: {
          order: {
            customerId,
            status: "COMPLETED",
          },
        },
        include: {
          baseModule: true,
          flavorModule: true,
          functionModule: true,
          textureModule: true,
        },
        orderBy: { id: "desc" },
        take: 20,
      });

      if (pastItems.length > 0) {
        // Find most-ordered combo
        const comboCount = new Map<
          string,
          { count: number; item: typeof pastItems[0] }
        >();
        for (const item of pastItems) {
          const key = `${item.baseModuleId}|${item.flavorModuleId}|${item.functionModuleId}|${item.textureModuleId}`;
          const existing = comboCount.get(key);
          if (existing) {
            existing.count++;
          } else {
            comboCount.set(key, { count: 1, item });
          }
        }

        const bestCombo = Array.from(comboCount.values()).sort(
          (a, b) => b.count - a.count
        )[0];
        const { item } = bestCombo;

        // Verify all modules are still active and in stock
        const mods = [
          item.baseModule,
          item.flavorModule,
          item.functionModule,
          item.textureModule,
        ];
        const allActive = mods.every(
          (m) => m.isActive && m.stockQuantity >= m.deductionRate
        );

        if (allActive) {
          const returningNames = generateDrinkName(
            item.baseModule,
            item.flavorModule,
            item.functionModule,
            item.textureModule
          );
          safeTrend = {
            base: toModuleData(item.baseModule),
            flavor: toModuleData(item.flavorModule),
            function: toModuleData(item.functionModule),
            texture: toModuleData(item.textureModule),
            generatedName: returningNames.name,
            generatedNameVi: returningNames.nameVi + " (Quen thuộc)",
            recipe: generateRecipe(
              item.baseModule,
              item.flavorModule,
              item.functionModule,
              item.textureModule
            ),
          };
        }
      }
    } catch {
      // Non-critical: fall back to bestseller if DB lookup fails
      safeTrend = null;
    }
  }

  // Fallback: bestseller with same base
  if (!safeTrend) {
    const safeFlavor = allModules.find(
      (m) =>
        m.category === "FLAVOR" &&
        m.name === "Natural Vanilla Syrup" &&
        m.stockQuantity >= m.deductionRate &&
        !isExcluded([base, m, func, texture], exclusions)
    ) || flavor;

    const safeTexture = allModules.find(
      (m) =>
        m.category === "TEXTURE" &&
        m.name === "Sea Salt Milk Foam" &&
        m.stockQuantity >= m.deductionRate &&
        !isExcluded([base, safeFlavor, func, m], exclusions)
    ) || texture;

    const safeFunc = allModules.find(
      (m) =>
        m.category === "FUNCTION" &&
        m.name === "L-Theanine Extract" &&
        m.stockQuantity >= m.deductionRate
    ) || func;

    const safeNames = generateDrinkName(base, safeFlavor, safeFunc, safeTexture);
    safeTrend = {
      base: toModuleData(base),
      flavor: toModuleData(safeFlavor),
      function: toModuleData(safeFunc),
      texture: toModuleData(safeTexture),
      generatedName: safeNames.name,
      generatedNameVi: safeNames.nameVi,
      recipe: generateRecipe(base, safeFlavor, safeFunc, safeTexture),
    };
  }

  return { perfectMatch, plotTwist, safeTrend };
}
