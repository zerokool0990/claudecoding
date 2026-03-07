"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  AlertTriangle,
  Home,
  Coffee,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  customersWithDob: number;
  cardPreference: { card: string; count: number }[];
  moduleUsage: { name: string; category: string; count: number }[];
  inventoryStatus: {
    id: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    alertThreshold: number;
    isActive: boolean;
    percentRemaining: number;
  }[];
  moodDistribution: { mood: string; count: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  BASE: "bg-[#ede9fe] text-[#8b5cf6]",
  FLAVOR: "bg-[#fce7f3] text-[#ec4899]",
  FUNCTION: "bg-[#d1fae5] text-[#10b981]",
  TEXTURE: "bg-[#e0f2fe] text-[#0ea5e9]",
};

const CATEGORY_LABELS: Record<string, string> = {
  BASE: "Cốt Nền",
  FLAVOR: "Hương Vị",
  FUNCTION: "Chức Năng",
  TEXTURE: "Kết Cấu",
};

const PIE_COLORS = ["#8b5cf6", "#f59e0b", "#10b981"];

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "analytics">("overview");

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.error) {
        console.error("Analytics API error:", json.error);
        return;
      }
      setData(json);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#fef9f0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#8b5cf6] border-t-transparent rounded-full" />
      </div>
    );
  }

  const lowStockItems = data.inventoryStatus.filter(
    (m) => m.stock <= m.alertThreshold
  );

  return (
    <div className="min-h-screen bg-[#fef9f0]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#fef9f0]/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ede9fe] rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <h1 className="text-lg font-display font-bold text-gray-900">
              AI Drink Admin
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/pos"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Barista POS
            </Link>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-4 pt-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-1 shadow-sm inline-flex gap-1 overflow-x-auto">
            {[
              { id: "overview" as const, label: "Tổng quan", icon: TrendingUp },
              { id: "inventory" as const, label: "Kho hàng", icon: Package },
              { id: "analytics" as const, label: "Phân tích", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Tổng đơn hàng"
                value={data.totalOrders.toString()}
                icon={<ShoppingBag className="w-5 h-5 text-[#8b5cf6]" />}
                iconBg="bg-[#ede9fe]"
              />
              <StatCard
                title="Hôm nay"
                value={data.todayOrders.toString()}
                icon={<TrendingUp className="w-5 h-5 text-[#0ea5e9]" />}
                iconBg="bg-[#e0f2fe]"
              />
              <StatCard
                title="Doanh thu"
                value={`${(data.totalRevenue / 1000).toFixed(0)}K`}
                icon={<DollarSign className="w-5 h-5 text-[#10b981]" />}
                iconBg="bg-[#d1fae5]"
              />
              <StatCard
                title="Khách hàng"
                value={data.totalCustomers.toString()}
                icon={<Users className="w-5 h-5 text-[#f59e0b]" />}
                iconBg="bg-[#fef3c7]"
              />
            </div>

            {/* Alerts */}
            {lowStockItems.length > 0 && (
              <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  Cảnh báo tồn kho thấp
                </div>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white rounded-xl px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                            CATEGORY_COLORS[item.category]
                          }`}
                        >
                          {CATEGORY_LABELS[item.category]}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">
                        {item.stock} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Preference Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Tỷ lệ chọn thẻ đề xuất
              </h3>
              <div className="h-64 md:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.cardPreference}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="card"
                      label={(props) =>
                        `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {data.cardPreference.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Live Mood Board - Tâm trạng khách hàng
              </h3>
              <div className="h-64 md:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.moodDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mood" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <InventoryTab
            inventoryStatus={data.inventoryStatus}
            onRefresh={fetchData}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Module Usage */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Ma trận sử dụng nguyên liệu
              </h3>
              <div className="h-80 md:h-96 lg:h-[28rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.moduleUsage.slice(0, 12)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Hồ sơ khách hàng
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#ede9fe] rounded-2xl p-4 text-center">
                  <p className="text-3xl font-display font-bold text-[#8b5cf6]">
                    {data.totalCustomers}
                  </p>
                  <p className="text-sm text-[#8b5cf6]/70 mt-1">
                    Tổng khách đăng ký
                  </p>
                </div>
                <div className="bg-[#fce7f3] rounded-2xl p-4 text-center">
                  <p className="text-3xl font-display font-bold text-[#ec4899]">
                    {data.customersWithDob}
                  </p>
                  <p className="text-sm text-[#ec4899]/70 mt-1">
                    Có ngày sinh
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-3xl font-display font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function InventoryTab({
  inventoryStatus,
  onRefresh,
}: {
  inventoryStatus: AnalyticsData["inventoryStatus"];
  onRefresh: () => void;
}) {
  const [importModuleId, setImportModuleId] = useState("");
  const [importQty, setImportQty] = useState("");
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!importModuleId || !importQty) return;
    setImporting(true);

    try {
      await fetch("/api/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: importModuleId,
          quantity: parseFloat(importQty),
          note: "Nhập hàng từ Admin Dashboard",
        }),
      });
      setImportModuleId("");
      setImportQty("");
      onRefresh();
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  const categories = ["BASE", "FLAVOR", "FUNCTION", "TEXTURE"];

  return (
    <div className="space-y-6">
      {/* Import form */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Nhập Kho Nguyên Liệu
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={importModuleId}
            onChange={(e) => setImportModuleId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ede9fe] outline-none text-gray-700"
          >
            <option value="">Chọn nguyên liệu...</option>
            {inventoryStatus.map((m) => (
              <option key={m.id} value={m.id}>
                [{CATEGORY_LABELS[m.category]}] {m.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={importQty}
            onChange={(e) => setImportQty(e.target.value)}
            placeholder="Số lượng"
            className="w-full md:w-40 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ede9fe] outline-none text-gray-700"
          />
          <button
            onClick={handleImport}
            disabled={importing || !importModuleId || !importQty}
            className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {importing ? "Đang nhập..." : "Nhập kho"}
          </button>
        </div>
      </div>

      {/* Inventory by category */}
      {categories.map((cat) => {
        const items = inventoryStatus.filter((m) => m.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[cat]}`}
              >
                {CATEGORY_LABELS[cat]}
              </span>
              <h3 className="text-base font-semibold text-gray-800">
                ({items.length} loại)
              </h3>
            </div>
            <div className="space-y-2">
              {items.map((item) => {
                const isLow = item.stock <= item.alertThreshold;
                const isOut = !item.isActive;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 p-3 mb-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Ngưỡng cảnh báo: {item.alertThreshold} {item.unit}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-lg font-bold text-gray-900">
                        {item.stock.toLocaleString()} {item.unit}
                      </p>
                      {isOut && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <span className="text-xs text-red-500 font-medium">HẾT HÀNG</span>
                        </div>
                      )}
                      {isLow && !isOut && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          <span className="text-xs text-amber-500 font-medium">SẮP HẾT</span>
                        </div>
                      )}
                      {!isLow && !isOut && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          <span className="text-xs text-green-500 font-medium">OK</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
