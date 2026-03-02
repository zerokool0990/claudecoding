import prisma from "@/lib/db/prisma";
import type { DrinkCombo } from "@/types";

export async function deductInventory(drink: DrinkCombo): Promise<{
  success: boolean;
  alerts: string[];
}> {
  const alerts: string[] = [];
  const modulesToDeduct = [
    { id: drink.base.id, rate: drink.base.deductionRate, name: drink.base.nameVi },
    { id: drink.flavor.id, rate: drink.flavor.deductionRate, name: drink.flavor.nameVi },
    { id: drink.function.id, rate: drink.function.deductionRate, name: drink.function.nameVi },
    { id: drink.texture.id, rate: drink.texture.deductionRate, name: drink.texture.nameVi },
  ];

  // Use transaction for ACID compliance
  try {
    await prisma.$transaction(async (tx) => {
      for (const mod of modulesToDeduct) {
        // Deduct stock
        const updated = await tx.module.update({
          where: { id: mod.id },
          data: {
            stockQuantity: { decrement: mod.rate },
          },
        });

        // Log the deduction
        await tx.inventoryLog.create({
          data: {
            moduleId: mod.id,
            type: "DEDUCTION",
            quantity: -mod.rate,
            note: `Trừ lùi cho đơn hàng`,
          },
        });

        // Check alert threshold
        if (updated.stockQuantity <= updated.alertThreshold) {
          alerts.push(
            `⚠️ ${mod.name}: còn ${updated.stockQuantity}${updated.unit} (ngưỡng cảnh báo: ${updated.alertThreshold})`
          );

          // Deactivate if stock is critically low (below 1 serving)
          if (updated.stockQuantity < mod.rate) {
            await tx.module.update({
              where: { id: mod.id },
              data: { isActive: false },
            });
            alerts.push(`🚫 ${mod.name}: ĐÃ HẾT HÀNG - đã tắt khỏi menu`);
          }
        }
      }
    });

    return { success: true, alerts };
  } catch (error) {
    console.error("Inventory deduction failed:", error);
    return { success: false, alerts: ["Lỗi hệ thống khi trừ kho"] };
  }
}

export async function importInventory(
  moduleId: string,
  quantity: number,
  note?: string
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.module.update({
        where: { id: moduleId },
        data: {
          stockQuantity: { increment: quantity },
          isActive: true,
        },
      });

      await tx.inventoryLog.create({
        data: {
          moduleId,
          type: "IMPORT",
          quantity,
          note: note || "Nhập hàng",
        },
      });
    });
    return true;
  } catch (error) {
    console.error("Import inventory failed:", error);
    return false;
  }
}
