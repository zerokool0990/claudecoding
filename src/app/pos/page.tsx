"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Home,
  BarChart3,
  ChefHat,
} from "lucide-react";

interface OrderItem {
  id: string;
  generatedName: string;
  generatedNameVi: string;
  recipe: string;
  baseModule: { nameVi: string; deductionRate: number; unit: string };
  flavorModule: { nameVi: string; deductionRate: number; unit: string };
  functionModule: { nameVi: string; deductionRate: number; unit: string };
  textureModule: { nameVi: string; deductionRate: number; unit: string };
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  cardChosen: string | null;
  createdAt: string;
  customer: { name: string | null } | null;
  items: OrderItem[];
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ pha chế",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  PREPARING: {
    label: "Đang pha chế",
    color: "bg-blue-100 text-blue-700",
    icon: ChefHat,
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const CARD_LABELS: Record<string, string> = {
  PERFECT_MATCH: "Perfect Match",
  PLOT_TWIST: "Plot Twist",
  SAFE_TREND: "Safe Trend",
};

export default function POSPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("active");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?limit=100");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "active")
      return o.status === "PENDING" || o.status === "PREPARING";
    if (filter === "completed") return o.status === "COMPLETED";
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Barista POS</h1>
              <p className="text-xs text-gray-400">
                {pendingCount} chờ • {preparingCount} đang pha
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-gray-800 px-4 pb-3">
        <div className="max-w-7xl mx-auto flex gap-2">
          {[
            { id: "active", label: `Đang xử lý (${pendingCount + preparingCount})` },
            { id: "completed", label: "Hoàn thành" },
            { id: "all", label: "Tất cả" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className={`bg-gray-800 rounded-2xl border overflow-hidden cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id
                    ? "border-orange-500"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                          ?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                        ?.label || order.status}
                    </span>
                  </div>
                  {order.customer?.name && (
                    <p className="text-sm text-gray-300">
                      Khách: {order.customer.name}
                    </p>
                  )}
                  {order.cardChosen && (
                    <p className="text-xs text-gray-500 mt-1">
                      {CARD_LABELS[order.cardChosen] || order.cardChosen}
                    </p>
                  )}
                </div>

                {/* Drink details */}
                {order.items.map((item) => (
                  <div key={item.id} className="p-4">
                    <h3 className="font-bold text-white mb-3">
                      {item.generatedNameVi}
                    </h3>

                    {/* Assembly ticket */}
                    <div className="space-y-2 bg-gray-900 rounded-xl p-3">
                      <TicketLine
                        label="Base"
                        value={item.baseModule.nameVi}
                        amount={`${item.baseModule.deductionRate}${item.baseModule.unit}`}
                      />
                      <TicketLine
                        label="Flavor"
                        value={item.flavorModule.nameVi}
                        amount={`${item.flavorModule.deductionRate}${item.flavorModule.unit}`}
                      />
                      <TicketLine
                        label="Function"
                        value={item.functionModule.nameVi}
                        amount={`${item.functionModule.deductionRate}${item.functionModule.unit}`}
                      />
                      <TicketLine
                        label="Texture"
                        value={item.textureModule.nameVi}
                        amount={`${item.textureModule.deductionRate}${item.textureModule.unit}`}
                      />
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <TicketLine
                          label="Đá viên"
                          value=""
                          amount="200g"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="p-4 pt-0">
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, "PREPARING");
                        }}
                        className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition text-sm"
                      >
                        Bắt đầu pha chế
                      </button>
                    )}
                    {order.status === "PREPARING" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, "COMPLETED");
                        }}
                        className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition text-sm"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {(order.status === "PENDING" ||
                      order.status === "PREPARING") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, "CANCELLED");
                        }}
                        className="px-4 py-3 bg-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-600 transition text-sm"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="px-4 pb-3">
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Coffee className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Chưa có đơn hàng nào</p>
              <p className="text-gray-500 text-sm mt-1">
                Đơn hàng mới sẽ tự động hiển thị tại đây
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketLine({
  label,
  value,
  amount,
}: {
  label: string;
  value: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 font-mono text-xs w-16">{label}</span>
        <span className="text-gray-300">{value}</span>
      </div>
      <span className="text-gray-400 font-mono text-xs">{amount}</span>
    </div>
  );
}
