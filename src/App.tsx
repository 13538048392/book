import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Search,
  Download,
  Plus,
  X,
  Bell,
  Mail,
  User,
  AlertCircle,
  Save,
  RotateCcw,
  Trash2,
  Table as TableIcon,
  ShieldCheck,
  Check,
  FileText,
  Paperclip,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  History,
  Send,
  Eraser,
  Zap,
  RefreshCw,
  Edit3,
} from "lucide-react";
import {
  MOCK_INSTITUTIONS,
  MOCK_MAPPINGS,
  NAV_ITEMS,
  MOCK_TRADER_MAPPINGS,
  MOCK_BONDS,
  MOCK_RISK_LIMITS,
  MOCK_BOOK_RECORDS,
  MOCK_CONFIRM_RECORDS,
} from "./constants.ts";
import {
  Institution,
  IsValidFilter,
  DataSourceFilter,
  InstitutionFilter,
  MappingEntry,
  NavMenu,
  TraderMappingEntry,
  Bond,
  BondFilter,
  RiskLimit,
  TradeRecord,
  TradeRecognitionResult,
  BookRecord,
  ConfirmRecord,
} from "./types.ts";

// Secondary Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确定",
}: ConfirmModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-[420px] rounded border border-gray-100 shadow-2xl overflow-hidden p-8"
        >
          <div className="flex gap-5 items-start">
            <div className="w-12 h-12 rounded-full bg-[#fffbe6] flex items-center justify-center shrink-0">
              <AlertCircle className="text-[#faad14]" size={28} />
            </div>
            <div className="space-y-3 flex-1 pt-1">
              <h3 className="font-bold text-[#262626] text-[18px]">
                {title || "操作确认"}
              </h3>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center gap-8 mt-10">
            <button
              onClick={onClose}
              className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors font-medium border-none bg-transparent cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-10 py-2.5 bg-[#1890ff] text-white rounded font-bold text-[13px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
            >
              确定
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// Risk Limit Edit Modal
interface RiskLimitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  limit: RiskLimit | null;
  onSave: (updatedLimit: RiskLimit) => void;
  onConfirmRequest: (updatedLimit: RiskLimit) => void;
}

const RiskLimitEditModal = ({
  isOpen,
  onClose,
  limit,
  onConfirmRequest,
}: RiskLimitEditModalProps) => {
  const [localLimit, setLocalLimit] = useState<RiskLimit | null>(limit);

  useEffect(() => {
    if (isOpen) setLocalLimit(limit);
  }, [isOpen, limit]);

  if (!localLimit) return null;

  // Helper to parse indicator value and unit
  const parsedIndicator = (() => {
    const val = localLimit.limitValue;
    let numeric = val;
    let suffix = "";

    if (localLimit.id === "r7") {
      numeric = val.replace("% * 证券公司速动资金", "").trim();
      if (!numeric.endsWith("%")) numeric += "%";
      suffix = "* 证券公司速动资金";
    } else if (["r11", "r12", "r13", "r14", "r15"].includes(localLimit.id)) {
      numeric = val.replace("% * 组合规模", "").trim();
      if (!numeric.endsWith("%")) numeric += "%";
      suffix = "* 组合规模";
    } else if (val.includes("亿港币")) {
      numeric = val.replace("亿港币", "").trim();
      suffix = "亿港币";
    } else if (val.includes("万港币")) {
      numeric = val.replace("万港币", "").trim();
      suffix = "万港币";
    } else if (val.includes("只")) {
      numeric = val.replace("只", "").trim();
      suffix = "只";
    } else if (val.endsWith("%")) {
      numeric = val.replace("%", "").trim();
      suffix = "%";
    }

    return { numeric, suffix };
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white w-full max-w-[640px] rounded shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[17px] font-medium text-gray-800">修改风险限额</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-7">
              {/* 限额分类 */}
              <div className="flex items-center gap-6">
                <label className="w-24 text-right text-[14px] text-gray-600">限额分类：</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2.5 text-[14px] outline-none focus:border-blue-500 hover:border-blue-300 transition-colors"
                  value={localLimit.category}
                  onChange={(e) => setLocalLimit({ ...localLimit, category: e.target.value })}
                />
              </div>
              
              {/* 指标说明 */}
              <div className="flex items-center gap-6">
                <label className="w-24 text-right text-[14px] text-gray-600">指标说明：</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2.5 text-[14px] outline-none focus:border-blue-500 hover:border-blue-300 transition-colors"
                  value={localLimit.description}
                  onChange={(e) => setLocalLimit({ ...localLimit, description: e.target.value })}
                />
              </div>

              {/* 限额指标 */}
              <div className="flex items-center gap-6">
                <label className="w-24 text-right text-[14px] text-gray-600">限额指标：</label>
                <div className="flex-1 flex gap-3 items-center">
                  <select
                    className="w-40 border border-gray-300 rounded px-3 py-2.5 text-[14px] outline-none focus:border-blue-500 hover:border-blue-300 transition-colors bg-white appearance-none pr-10 relative"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    value={localLimit.operator}
                    onChange={(e) => setLocalLimit({ ...localLimit, operator: e.target.value })}
                  >
                    <option value="≤">≤</option>
                    <option value="≥">≥</option>
                    <option value="<">&lt;</option>
                    <option value=">">&gt;</option>
                    <option value="=">=</option>
                  </select>
                  <div className="flex-1 flex border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 hover:border-blue-300 transition-colors items-center">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2.5 text-[14px] outline-none border-none"
                      value={parsedIndicator.numeric}
                      onChange={(e) => {
                        const newNumeric = e.target.value;
                        let finalVal = newNumeric;
                        if (parsedIndicator.suffix.includes("*")) {
                          // Already includes % logic if needed
                          finalVal = newNumeric.endsWith("%") ? newNumeric + " " + parsedIndicator.suffix : newNumeric + "% " + parsedIndicator.suffix;
                        } else {
                          finalVal = newNumeric + parsedIndicator.suffix;
                        }
                        setLocalLimit({ ...localLimit, limitValue: finalVal.trim() });
                      }}
                    />
                    {parsedIndicator.suffix && (
                      <span className="px-3 text-[13px] text-gray-500 bg-blue-50/50 py-2.5 border-l border-gray-100 whitespace-nowrap">
                        {parsedIndicator.suffix}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 是否生效 */}
              <div className="flex items-center gap-6">
                <label className="w-24 text-right text-[14px] text-gray-600">是否生效：</label>
                <div className="flex-1 relative">
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] outline-none focus:border-blue-500 hover:border-blue-300 transition-colors bg-white appearance-none pr-10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    value={localLimit.isActive ? "true" : "false"}
                    onChange={(e) => setLocalLimit({ ...localLimit, isActive: e.target.value === "true" })}
                  >
                    <option value="true">已生效</option>
                    <option value="false">未生效</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-8 py-2 text-[14px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onConfirmRequest(localLimit);
                }}
                className="px-8 py-2 bg-[#1890ff] text-white rounded text-[14px] hover:bg-blue-600 transition-all shadow-sm"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Risk Parameter Configuration Modal
interface RiskParamModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: {
    fixedIncomeLoss: { sign: string; value: string };
    actualOwnedCapital: string;
    fastMoney: string;
    repoScale: string;
  };
  onSave: (newParams: any) => void;
}

const RiskParamModal = ({
  isOpen,
  onClose,
  params,
  onSave,
}: RiskParamModalProps) => {
  const [localParams, setLocalParams] = useState(params);

  useEffect(() => {
    if (isOpen) setLocalParams(params);
  }, [isOpen, params]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white w-full max-w-[500px] rounded-xl border border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-[16px] font-bold text-gray-800">参数配置</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 block">
                    固收类业务亏损金额：附加调整项
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="w-20 border border-gray-300 rounded px-2 py-2 text-[13px] outline-none focus:border-blue-500 font-bold bg-white"
                      value={localParams.fixedIncomeLoss.sign}
                      onChange={(e) =>
                        setLocalParams({
                          ...localParams,
                          fixedIncomeLoss: {
                            ...localParams.fixedIncomeLoss,
                            sign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="+">+</option>
                      <option value="-">-</option>
                      <option value="*">×</option>
                      <option value="/">÷</option>
                    </select>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono"
                      value={localParams.fixedIncomeLoss.value}
                      onChange={(e) =>
                        setLocalParams({
                          ...localParams,
                          fixedIncomeLoss: {
                            ...localParams.fixedIncomeLoss,
                            value: e.target.value,
                          },
                        })
                      }
                      placeholder="请输入金额"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 block">
                    实际自有资金投入规模 (亿港币)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono"
                    value={localParams.actualOwnedCapital}
                    onChange={(e) =>
                      setLocalParams({
                        ...localParams,
                        actualOwnedCapital: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 block">
                    证券公司速动资金 (亿港币)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono"
                    value={localParams.fastMoney}
                    onChange={(e) =>
                      setLocalParams({
                        ...localParams,
                        fastMoney: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700 block">
                    存续回购规模 (亿港币)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono"
                    value={localParams.repoScale}
                    onChange={(e) =>
                      setLocalParams({
                        ...localParams,
                        repoScale: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-[13px] text-gray-500 hover:bg-gray-100 rounded transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onSave(localParams);
                  onClose();
                }}
                className="px-8 py-2 bg-[#1890ff] text-white rounded text-[13px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                保存变更
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const GenericConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-[400px] rounded-xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-[16px] font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
              {message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-[13px] text-gray-500 hover:bg-gray-100 rounded transition-colors font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-6 py-2 bg-[#1890ff] text-white rounded text-[13px] font-bold hover:bg-blue-600 transition-all shadow-md"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// Exchange Rate Configuration Modal
interface ExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: {
    cnhHkd: string;
    usdHkd: string;
  };
  onSave: (newRates: any) => void;
  onConfirmRequest: (newRates: any) => void;
}

const ExchangeRateModal = ({
  isOpen,
  onClose,
  rates,
  onSave,
  onConfirmRequest,
}: ExchangeRateModalProps) => {
  const [localRates, setLocalRates] = useState(rates);

  useEffect(() => {
    if (isOpen) setLocalRates(rates);
  }, [isOpen, rates]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white w-full max-w-[450px] rounded-xl border border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-[16px] font-bold text-gray-800">汇率配置</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2 mb-2">
                <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[12px] text-blue-700">
                  当前基准货币已统一为 HKD，请输入相对于 1 HKD 的各币种汇率。
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                    CNH / HKD
                  </label>
                  <input
                    type="text"
                    className="w-48 border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono text-right"
                    value={localRates.cnhHkd}
                    onChange={(e) =>
                      setLocalRates({ ...localRates, cnhHkd: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                    USD / HKD
                  </label>
                  <input
                    type="text"
                    className="w-48 border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-blue-500 font-mono text-right"
                    value={localRates.usdHkd}
                    onChange={(e) =>
                      setLocalRates({ ...localRates, usdHkd: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-[13px] text-gray-500 hover:bg-gray-100 rounded transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onConfirmRequest(localRates);
                }}
                className="px-8 py-2 bg-[#1890ff] text-white rounded text-[13px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                保存变更
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Approval Flow Detail Modal (Dark Theme from Image)
interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ConfirmRecord | null;
}

const ApprovalDetailModal = ({
  isOpen,
  onClose,
  record,
}: ApprovalDetailModalProps) => {
  if (!record) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white w-full max-w-[700px] rounded shadow-2xl overflow-hidden text-gray-900"
          >
            {/* Header - White background, Black text, blue emphasis */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-[#1890ff]" size={18} />
                </div>
                <h3 className="text-[16px] font-bold flex items-center gap-3 text-gray-900">
                  审批流详情 - {record.bondName}
                  <span className="bg-blue-50 text-[#1890ff] border border-blue-100 px-2.5 py-0.5 rounded text-[12px] font-mono font-medium">
                    {record.isin}
                  </span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-header info - Clean layout */}
            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-50">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-[12px] text-gray-400 uppercase tracking-wider">
                    对手方机构
                  </div>
                  <div className="text-[14px] text-gray-900 font-semibold">
                    {record.counterparty}
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="space-y-1">
                    <div className="text-[12px] text-gray-400 uppercase tracking-wider">
                      收益率
                    </div>
                    <div className="text-[15px] text-gray-900 font-bold font-mono underline decoration-blue-200 decoration-2 underline-offset-4">
                      {record.yield}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[12px] text-gray-400 uppercase tracking-wider">
                      净价
                    </div>
                    <div className="text-[15px] text-gray-900 font-bold font-mono">
                      {record.cleanPrice}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[12px] text-gray-400 uppercase tracking-wider">
                      全价
                    </div>
                    <div className="text-[15px] text-gray-900 font-bold font-mono">
                      {record.fullPrice}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Body - Better spacing & colors */}
            <div className="p-10 bg-white">
              <div className="space-y-0">
                {/* Step 1: Submitter */}
                <div className="relative pl-10 pb-12">
                  <div className="absolute left-[4px] top-4 w-[2px] h-full bg-emerald-100"></div>
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  <div className="flex items-start justify-between bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-gray-900">
                        提交人：{record.executor}
                      </div>
                      <div className="text-emerald-600 text-[12px] flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        <ShieldCheck size={12} /> 已提交
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-400 font-mono italic bg-gray-50 px-2 py-1 rounded">
                      {record.creationTime}
                    </div>
                  </div>
                </div>

                {/* Step 2: Trader */}
                <div className="relative pl-10 pb-12">
                  <div className="absolute left-[4px] top-4 w-[2px] h-full bg-emerald-100"></div>
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  <div className="flex items-start justify-between bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-gray-900">
                        交易员审批：李静
                      </div>
                      <div className="text-emerald-600 text-[12px] flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        <ShieldCheck size={12} /> 审批通过
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-400 font-mono italic bg-gray-50 px-2 py-1 rounded">
                      2026-04-09 14:30
                    </div>
                  </div>
                </div>

                {/* Step 3: Investment Manager */}
                <div className="relative pl-10 pb-12">
                  <div className="absolute left-[4px] top-4 w-[2px] h-full bg-gray-100"></div>
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  <div className="flex items-start justify-between bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-gray-900">
                        投资经理审批：王经理
                      </div>
                      <div className="text-emerald-600 text-[12px] flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        <ShieldCheck size={12} /> 审批通过
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-400 font-mono italic bg-gray-50 px-2 py-1 rounded">
                      2026-04-09 15:00
                    </div>
                  </div>
                </div>

                {/* Step 4: Risk Control */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-50"></div>
                  <div className="flex items-start justify-between bg-white border border-orange-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-orange-50/10">
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-gray-900">
                        风控审批：赵风控
                      </div>
                      <div className="text-orange-600 text-[12px] font-bold bg-orange-50 px-2 py-0.5 rounded w-fit flex items-center gap-1">
                        <RotateCcw size={12} className="animate-spin-slow" />{" "}
                        审批中
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-400 italic bg-gray-50 px-2 py-1 rounded">
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-10 py-2.5 bg-[#1890ff] text-white rounded font-bold text-[13px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default function App() {
  const [institutions, setInstitutions] =
    useState<Institution[]>(MOCK_INSTITUTIONS);
  const [mappings, setMappings] = useState<MappingEntry[]>(MOCK_MAPPINGS);
  const [activeTab, setActiveTab] = useState("首页");
  const [tabs, setTabs] = useState(["首页"]);
  const [currentPath, setCurrentPath] = useState<string[]>(["首页"]);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Filter States
  const [filters, setFilters] = useState<InstitutionFilter>({
    info: "",
    socialCreditCode: "",
    isValid: "Yes",
    dataSource: "All",
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Institution | null>(null);

  // Form States (for Modal)
  const [formData, setFormData] = useState<Partial<Institution>>({
    shortName: "",
    fullName: "",
    englishName: "",
    socialCreditCode: "",
    isValid: true,
    dataSource: "Manual",
  });

  const [isBondModalOpen, setIsBondModalOpen] = useState(false);
  const [editingBond, setEditingBond] = useState<Bond | null>(null);
  const [bondFormData, setBondFormData] = useState<Partial<Bond>>({
    isin: "",
    shortName: "",
    code: "",
    currency: "USD",
    issuer: "",
    bondRating: "-",
    issuerRating: "-",
    library: "A",
    type: "中资美元债",
    isLGFV: false,
    lgfvRegion: "-",
    isHighYield: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateItems, setDuplicateItems] = useState<Institution[]>([]);

  // Confirmation States
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    type: "edit" | "delete" | "deleteAlias" | "editBond" | "deleteBond" | null;
    itemId: string | null;
    itemShortName: string | null;
    aliasName?: string;
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    itemShortName: null,
  });

  // Mapping Page States (Moved up to fix initialization order)
  const [mapSearch, setMapSearch] = useState("");
  const [mappingErrors, setMappingErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [mappingSuccess, setMappingSuccess] = useState(false);
  const [searchingRowId, setSearchingRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMappingIds, setEditingMappingIds] = useState<Set<string>>(
    new Set(),
  );
  const [duplicateMappingError, setDuplicateMappingError] = useState<{
    isOpen: boolean;
    mappingName: string;
    conflictingInstitution: MappingEntry | null;
  }>({
    isOpen: false,
    mappingName: "",
    conflictingInstitution: null,
  });

  const [traderMappings, setTraderMappings] =
    useState<TraderMappingEntry[]>(MOCK_TRADER_MAPPINGS);
  const [traderSearch, setTraderSearch] = useState("");
  const [editingTraderIds, setEditingTraderIds] = useState<Set<string>>(
    new Set(),
  );

  // Bond Page States
  const [bonds, setBonds] = useState<Bond[]>(MOCK_BONDS);
  const [bondFilters, setBondFilters] = useState<BondFilter>({
    bondSearch: "",
    type: "全部",
    library: "全部",
    isLGFV: "All",
    isHighYield: "All",
  });
  const [editingBondIds, setEditingBondIds] = useState<Set<string>>(new Set());
  const [showBondSearchDropdown, setShowBondSearchDropdown] = useState(false);

  // Risk Limit Page States
  const [riskLimits, setRiskLimits] = useState<RiskLimit[]>(MOCK_RISK_LIMITS);
  const [riskLimitView, setRiskLimitView] = useState<"Config" | "Report">(
    "Config",
  );
  const [riskSearch, setRiskSearch] = useState("");
  const [editingLimitIds, setEditingLimitIds] = useState<Set<string>>(
    new Set(),
  );
  const [showOnlyActiveRisk, setShowOnlyActiveRisk] = useState(true);
  const [isRiskGlobalEditing, setIsRiskGlobalEditing] = useState(false);
  const [riskEditingRowId, setRiskEditingRowId] = useState<string | null>(null);
  const [isRiskParamModalOpen, setIsRiskParamModalOpen] = useState(false);
  const [isRiskLimitEditModalOpen, setIsRiskLimitEditModalOpen] = useState(false);
  const [editingRiskLimit, setEditingRiskLimit] = useState<RiskLimit | null>(null);
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({
    cnhHkd: "0.9142", // CNH per 1 HKD
    usdHkd: "0.1279", // USD per 1 HKD
  });
  const [riskParams, setRiskParams] = useState({
    fixedIncomeLoss: { sign: "-", value: "0.00" },
    actualOwnedCapital: "1000.00",
    fastMoney: "500.00",
    repoScale: "6.00",
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // New Trade Execution States
  const [tradeDate, setTradeDate] = useState("2026/04/21");
  const [tradeRecognitionText, setTradeRecognitionText] =
    useState(`For below we SELL the bond.

Order B:
NOMURA 7 PERP
size: 3Mio
ISIN: US65535HCC16
Clean px 101.772 Full px 103.424
2026/04/14 Settle
please contact: mary@cicc.com.cn`);
  const [tradeRecognitionHistory, setTradeRecognitionHistory] = useState<
    TradeRecognitionResult[]
  >([
    {
      id: "h1",
      institutionName: "中金香港",
      isin: "US65535HCC16",
      valuation: "101.772",
      isNew: true,
      side: "卖出",
    },
  ]);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([
    {
      id: "tr1",
      index: 1,
      bondName: "野村控股 7% 永续 A4EDC0.F",
      isin: "US65535HCC16",
      side: "卖出",
      yield: "2%",
      cleanPrice: "101.772",
      fullPrice: "103.424",
      valuation: "101.7212",
      faceAmount: "300",
      currency: "USD",
      counterparty: "中金香港",
      counterpartyTrader: "Mary",
      settlementAmount: "31027.44",
      executionDate: "2026/04/21",
      settlementDate: "2026/04/21",
      settlementSpeed: "T+0",
      user: "",
      businessType: "自营",
      internalAccount: "请选择",
      executor: "王执行",
      remarks: "",
    },
    {
      id: "tr_rejected",
      index: 2,
      bondName: "中广核 2.15% CND10002BDM2",
      isin: "CND10002BDM2",
      side: "买入",
      yield: "2.45%",
      cleanPrice: "98.75",
      fullPrice: "99.20",
      valuation: "98.80",
      faceAmount: "1200",
      currency: "CNY",
      counterparty: "招商银行",
      counterpartyTrader: "王明",
      settlementAmount: "11904000.00",
      executionDate: "2026/04/11",
      settlementDate: "2026/04/11",
      settlementSpeed: "T+1",
      user: "陈杰",
      businessType: "自营",
      internalAccount: "陈杰",
      executor: "王明",
      remarks: "收益率偏离过大，请修改",
      isRejected: true,
    },
  ]);

  // BOOK 流水 States
  const [bookRecords, setBookRecords] =
    useState<BookRecord[]>(MOCK_BOOK_RECORDS);
  const [bookFilters, setBookFilters] = useState({
    dateType: "约定日期",
    startDate: "2026/04/22",
    endDate: "2026/04/22",
    status: "全部",
    bondSearch: "",
    institutionSearch: "",
    ourTrader: "请选择",
    executor: "请选择",
    quickDate: "当日约定",
  });

  // 确认状态 States
  const [confirmRecords, setConfirmRecords] =
    useState<ConfirmRecord[]>(MOCK_CONFIRM_RECORDS);
  const [showApprovalNotification, setShowApprovalNotification] = useState(false);

  const pendingApprovalsData = useMemo(() => {
    const todayStr = "2026/05/07";
    const pending = confirmRecords.filter((r) =>
      ["交易员审批", "投资经理审批", "风控审批"].includes(r.status),
    );

    const today = pending.filter((r) => r.executionDate === todayStr);
    const historical = pending.filter((r) => r.executionDate < todayStr);

    return {
      total: pending.length,
      today: today.length,
      historical: historical.length,
    };
  }, [confirmRecords]);

  const bellControls = ({
    animate: {
      rotate: pendingApprovalsData.total > 0 ? [-10, 10, -10, 10, 0] : 0,
      transition: {
        repeat: Infinity,
        duration: 0.5,
        repeatDelay: 2,
      },
    },
  });
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 新增：置顶编辑状态
  const [pinnedTradeIds, setPinnedTradeIds] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeUploadId) {
      const filePromises = Array.from(files).map((file: File) => {
        return new Promise<{ name: string; type: string; url: string }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                type: file.type,
                url: event.target?.result as string,
              });
            };
            reader.readAsDataURL(file);
          },
        );
      });

      Promise.all(filePromises).then((newAttachments) => {
        setTradeRecords((prev) =>
          prev.map((tr) =>
            tr.id === activeUploadId
              ? {
                  ...tr,
                  attachments: [...(tr.attachments || []), ...newAttachments],
                }
              : tr,
          ),
        );
        setActiveUploadId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
    }
  };
  const sortedTradeRecords = useMemo(() => {
    return [...tradeRecords].sort((a, b) => {
      const aPinned = pinnedTradeIds.includes(a.id);
      const bPinned = pinnedTradeIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [tradeRecords, pinnedTradeIds]);

  const [confirmFilters, setConfirmFilters] = useState({
    dateType: "约定日期",
    startDate: "2026/04/23",
    endDate: "2026/04/23",
    quickDate: "T+0",
    bondSearch: "",
    institutionSearch: "",
    traderSearch: "全部",
    executorSearch: "全部",
    statusTab: "全部",
  });
  const [newStatusFilters, setNewStatusFilters] = useState({
    dateType: "约定日期",
    startDate: "2026/04/23",
    endDate: "2026/04/23",
    status: "全部",
    bondSearch: "",
    institutionSearch: "",
    traderSearch: "全部",
  });
  const [confirmSubTab, setConfirmSubTab] = useState<
    "当日未确认" | "历史未确认"
  >("当日未确认");
  const [selectedBondId, setSelectedBondId] = useState<string>("US46625HAM60");
  const [selectedConfirmIds, setSelectedConfirmIds] = useState<string[]>([]);
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    type: "single" | "batch";
    record?: any;
  }>({ isOpen: false, type: "single" });
  const [secondaryConfirm, setSecondaryConfirm] = useState<{
    isOpen: boolean;
    type: "pass" | "reject";
  }>({ isOpen: false, type: "pass" });
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [limitModal, setLimitModal] = useState<{
    isOpen: boolean;
    record?: any;
  }>({ isOpen: false });
  const [approvalFlowModal, setApprovalFlowModal] = useState<{
    isOpen: boolean;
    record?: any;
  }>({ isOpen: false });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedConfirmIds(confirmRecords.map((r) => r.id));
    } else {
      setSelectedConfirmIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedConfirmIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const pendingTodayCount = confirmRecords.filter(
    (r) => r.tradeDate === "2026/04/10",
  ).length; // Mock today is 04/10 in constants
  const pendingHistoryCount = confirmRecords.filter(
    (r) => r.tradeDate !== "2026/04/10",
  ).length;
  const totalPendingCount = confirmRecords.filter(
    (r) => r.status === "待处理",
  ).length;

  const [tradeOperationalMode, setTradeOperationalMode] = useState<
    "Recognition" | "Manual"
  >("Recognition");
  const [tradeFilters, setTradeFilters] = useState({
    bondSearch: "",
    institutionSearch: "",
    internalAccount: "",
    settlementSpeed: "下拉选择",
    executor: "",
  });

  const handleMenuClick = (p1: string, p2: string, p3?: string) => {
    const tabName = p3 || p2;
    const newPath = p3 ? [p1, p2, p3] : [p1, p2];
    setCurrentPath(newPath);
    setActiveTab(tabName);

    setTabs((prev) => {
      if (prev.includes(tabName)) return prev;
      return [...prev, tabName];
    });
  };

  const handleCloseTab = (e: React.MouseEvent, tabToClose: string) => {
    e.stopPropagation();
    if (tabToClose === "首页") return; // Don't close home tab

    setTabs((prev) => {
      const newTabs = prev.filter((t) => t !== tabToClose);
      if (activeTab === tabToClose) {
        setActiveTab(newTabs[newTabs.length - 1]);
      }
      return newTabs;
    });
  };

  // Filtering Logic
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      // 1. Info Filter (Fuzzy search in multiple fields)
      const infoMatch =
        !filters.info ||
        inst.shortName.toLowerCase().includes(filters.info.toLowerCase()) ||
        inst.fullName.toLowerCase().includes(filters.info.toLowerCase()) ||
        inst.englishName.toLowerCase().includes(filters.info.toLowerCase());

      // 2. Social Credit Code (Exact search)
      const codeMatch =
        !filters.socialCreditCode ||
        inst.socialCreditCode === filters.socialCreditCode;

      // 3. Is Valid
      const validMatch =
        filters.isValid === "All" ||
        (filters.isValid === "Yes" && inst.isValid) ||
        (filters.isValid === "No" && !inst.isValid);

      // 4. Data Source
      const sourceMatch =
        filters.dataSource === "All" || inst.dataSource === filters.dataSource;

      return infoMatch && codeMatch && validMatch && sourceMatch;
    });
  }, [institutions, filters]);

  // filtering logic for bonds
  const filteredBonds = useMemo(() => {
    return bonds.filter((b) => {
      const searchMatch =
        !bondFilters.bondSearch ||
        b.shortName
          .toLowerCase()
          .includes(bondFilters.bondSearch.toLowerCase()) ||
        b.code.toLowerCase().includes(bondFilters.bondSearch.toLowerCase()) ||
        b.isin.toLowerCase().includes(bondFilters.bondSearch.toLowerCase());

      const typeMatch =
        bondFilters.type === "全部" || b.type === bondFilters.type;
      const libraryMatch =
        bondFilters.library === "全部" || b.library === bondFilters.library;

      const lgfvMatch =
        bondFilters.isLGFV === "All" ||
        (bondFilters.isLGFV === "Yes" && b.isLGFV) ||
        (bondFilters.isLGFV === "No" && !b.isLGFV);

      const hyMatch =
        bondFilters.isHighYield === "All" ||
        (bondFilters.isHighYield === "Yes" && b.isHighYield) ||
        (bondFilters.isHighYield === "No" && !b.isHighYield);

      return searchMatch && typeMatch && libraryMatch && lgfvMatch && hyMatch;
    });
  }, [bonds, bondFilters]);

  const filteredRiskLimits = useMemo(() => {
    return riskLimits.filter((r) => {
      const matchesSearch =
        r.category.includes(riskSearch) || r.indicator.includes(riskSearch);
      
      let matchesActive = true;
      if (riskLimitView === "Report") {
        matchesActive = r.isActive;
      } else {
        matchesActive = showOnlyActiveRisk ? r.isActive : true;
      }
      
      return matchesSearch && matchesActive;
    });
  }, [riskLimits, riskSearch, showOnlyActiveRisk, riskLimitView]);

  const filteredBookRecords = useMemo(() => {
    return bookRecords.filter((r) => {
      const bondMatch =
        !bookFilters.bondSearch ||
        r.bondName
          .toLowerCase()
          .includes(bookFilters.bondSearch.toLowerCase()) ||
        r.bondCode
          .toLowerCase()
          .includes(bookFilters.bondSearch.toLowerCase()) ||
        r.isin.toLowerCase().includes(bookFilters.bondSearch.toLowerCase());

      const instMatch =
        !bookFilters.institutionSearch ||
        r.marketMaker
          .toLowerCase()
          .includes(bookFilters.institutionSearch.toLowerCase()) ||
        r.counterparty
          .toLowerCase()
          .includes(bookFilters.institutionSearch.toLowerCase());

      return bondMatch && instMatch;
    });
  }, [bookRecords, bookFilters]);

  const filteredConfirmRecords = useMemo(() => {
    return confirmRecords.filter((r) => {
      const bondMatch =
        !confirmFilters.bondSearch ||
        r.bondName
          .toLowerCase()
          .includes(confirmFilters.bondSearch.toLowerCase()) ||
        r.bondCode
          .toLowerCase()
          .includes(confirmFilters.bondSearch.toLowerCase()) ||
        r.isin.toLowerCase().includes(confirmFilters.bondSearch.toLowerCase());

      const instMatch =
        !confirmFilters.institutionSearch ||
        r.counterparty
          .toLowerCase()
          .includes(confirmFilters.institutionSearch.toLowerCase());

      const tabMatch =
        confirmFilters.statusTab === "全部" ||
        r.status === confirmFilters.statusTab ||
        (confirmFilters.statusTab === "审批驳回" && r.status === "驳回");

      // Date filter
      const recordDate =
        confirmFilters.dateType === "约定日期" ? r.tradeDate : r.executionDate;
      const dateMatch =
        (!confirmFilters.startDate ||
          recordDate.replace(/\//g, "-") >=
            confirmFilters.startDate.replace(/\//g, "-")) &&
        (!confirmFilters.endDate ||
          recordDate.replace(/\//g, "-") <=
            confirmFilters.endDate.replace(/\//g, "-"));

      return bondMatch && instMatch && tabMatch && dateMatch;
    });
  }, [confirmRecords, confirmFilters]);

  const handleOpenModal = (item: Institution | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        shortName: "",
        fullName: "",
        englishName: "",
        socialCreditCode: "",
        isValid: true,
        dataSource: "Manual",
      });
    }
    setErrors({});
    setDuplicateItems([]);
    setIsModalOpen(true);
  };

  const validateUniqueness = (
    short: string,
    full: string,
    excludeId?: string,
  ) => {
    return institutions.filter(
      (item) =>
        item.id !== excludeId &&
        (item.shortName === short || item.fullName === full),
    );
  };

  // Add click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchingRowId && !target.closest(".dropdown-container")) {
        setSearchingRowId(null);
        setSearchQuery("");
      }
      if (showBondSearchDropdown && !target.closest(".dropdown-container")) {
        setShowBondSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchingRowId, showBondSearchDropdown]);

  const handleApplySave = () => {
    const dataToSave = { ...(formData as Institution) };
    if (editingItem) {
      setInstitutions((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...dataToSave } : item,
        ),
      );
    } else {
      const newInst: Institution = {
        ...dataToSave,
        id: Math.random().toString(36).substr(2, 9),
        index: institutions.length + 1,
        dataSource: "Manual",
      };
      setInstitutions((prev) => [...prev, newInst]);
    }
    setIsModalOpen(false);
    setConfirmState({
      isOpen: false,
      type: null,
      itemId: null,
      itemShortName: null,
    });
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "请输入机构中文全称";
    if (!formData.shortName) newErrors.shortName = "请输入机构中文简称";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setDuplicateItems([]);
      return;
    }

    // Uniqueness validation
    const duplicates = validateUniqueness(
      formData.shortName!,
      formData.fullName!,
      editingItem?.id,
    );
    if (duplicates.length > 0) {
      setDuplicateItems(duplicates);
      setErrors({});
      return;
    }

    if (editingItem) {
      // Trigger secondary confirmation for Edit
      setConfirmState({
        isOpen: true,
        type: "edit",
        itemId: editingItem.id,
        itemShortName: editingItem.shortName,
      });
    } else {
      handleApplySave();
    }
  };

  const handleDeleteRequest = (item: Institution) => {
    setConfirmState({
      isOpen: true,
      type: "delete",
      itemId: item.id,
      itemShortName: item.shortName,
    });
  };

  const filteredTraderMappings = useMemo(() => {
    return traderMappings.filter(
      (m) =>
        !traderSearch ||
        m.name.toLowerCase().includes(traderSearch.toLowerCase()) ||
        m.mappedNames.some((n) =>
          n.toLowerCase().includes(traderSearch.toLowerCase()),
        ),
    );
  }, [traderMappings, traderSearch]);

  const maxTraderAliases = useMemo(() => {
    const counts = traderMappings.map((m) => m.mappedNames.length);
    return Math.max(3, ...counts);
  }, [traderMappings]);

  // Dynamic header calculation
  const maxMappedNames = useMemo(() => {
    const counts = mappings.map((m) => m.mappedNames.length);
    return Math.max(3, ...counts);
  }, [mappings]);

  const handleAddMapping = () => {
    const entry: MappingEntry = {
      id: Math.random().toString(36).substr(2, 9),
      index: 1,
      englishName: "",
      fullName: "",
      shortName: "",
      mappedNames: [""],
    };
    setMappings((prev) => {
      const newList = [entry, ...prev];
      return newList.map((item, idx) => ({ ...item, index: idx + 1 }));
    });
    setEditingMappingIds((prev) => new Set(prev).add(entry.id));
  };

  const handleSaveMappings = () => {
    const errors: string[] = [];
    const newFieldErrors: Record<string, Record<string, boolean>> = {};

    // 1. Mandatory Field Validation
    mappings.forEach((m) => {
      const rowErrors: Record<string, boolean> = {};
      if (!m.englishName) rowErrors.englishName = true;
      if (!m.fullName) rowErrors.fullName = true;
      if (!m.shortName) rowErrors.shortName = true;
      m.mappedNames.forEach((val, i) => {
        if (!val) rowErrors[`mappedName${i}`] = true;
      });

      if (Object.keys(rowErrors).length > 0) {
        newFieldErrors[m.id] = rowErrors;
        errors.push(`第 ${m.index} 行：必填项不能为空`);
      }
    });

    if (errors.length > 0) {
      setMappingErrors([...new Set(errors)]);
      setFieldErrors(newFieldErrors);
      setMappingSuccess(false);
      return;
    }

    // 2. Duplicate Validation
    // A) English Name Duplicate check
    const nameMap = new Map<string, MappingEntry>();
    for (const m of mappings) {
      if (nameMap.has(m.englishName)) {
        setDuplicateMappingError({
          isOpen: true,
          mappingName: m.englishName,
          conflictingInstitution: nameMap.get(m.englishName)!,
        });
        return;
      }
      nameMap.set(m.englishName, m);
    }

    // B) Any mapping name Duplicate check
    const aliasMap = new Map<string, MappingEntry>();
    for (const m of mappings) {
      for (const name of m.mappedNames) {
        if (aliasMap.has(name)) {
          setDuplicateMappingError({
            isOpen: true,
            mappingName: name,
            conflictingInstitution: aliasMap.get(name)!,
          });
          return;
        }
        aliasMap.set(name, m);
      }
    }

    setFieldErrors({});
    setMappingErrors([]);
    setMappingSuccess(true);
    setEditingMappingIds(new Set());
    setTimeout(() => setMappingSuccess(false), 3000);
  };

  const handleUpdateMappingField = (
    id: string,
    field: "fullName" | "shortName" | "englishName",
    value: string,
  ) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
    // Clear validation error when typing
    if (fieldErrors[id]) {
      const newF = { ...fieldErrors };
      delete newF[id][field];
      setFieldErrors(newF);
    }
  };

  const handleSelectInstitutionForMapping = (
    rowId: string,
    inst: Institution,
  ) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.id === rowId
          ? { ...m, fullName: inst.fullName, shortName: inst.shortName }
          : m,
      ),
    );
    setSearchingRowId(null);
    setSearchQuery("");
    setFieldErrors((prev) => {
      const newF = { ...prev };
      if (newF[rowId]) {
        delete newF[rowId].fullName;
        delete newF[rowId].shortName;
      }
      return newF;
    });
  };

  const filteredMappings = useMemo(() => {
    return mappings
      .filter(
        (m) =>
          m.fullName.includes(mapSearch) ||
          m.shortName.includes(mapSearch) ||
          m.mappedNames.some((mn) =>
            mn.toLowerCase().includes(mapSearch.toLowerCase()),
          ),
      )
      .map((m, i) => ({ ...m, index: i + 1 })); // Dynamic indexing
  }, [mappings, mapSearch]);

  const handleAddMappedName = (mappingId: string) => {
    setMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId) {
          return { ...m, mappedNames: [...m.mappedNames, ""] };
        }
        return m;
      }),
    );
  };

  const handleUpdateMappedName = (
    mappingId: string,
    index: number,
    value: string,
  ) => {
    setMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId) {
          const newNames = [...m.mappedNames];
          newNames[index] = value;
          return { ...m, mappedNames: newNames };
        }
        return m;
      }),
    );
  };

  const handleRemoveMappedName = (mappingId: string, index: number) => {
    setMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId) {
          const newNames = m.mappedNames.filter((_, i) => i !== index);
          return { ...m, mappedNames: newNames };
        }
        return m;
      }),
    );
  };

  const handleDeleteMapping = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
    setEditingMappingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleConfirmAction = () => {
    if (
      (confirmState.type === "delete" || confirmState.type === "deleteAlias") &&
      confirmState.itemId
    ) {
      if (activeTab === "机构维护") {
        setInstitutions((prev) =>
          prev.filter((item) => item.id !== confirmState.itemId),
        );
      } else if (activeTab === "机构名称") {
        if (confirmState.type === "deleteAlias") {
          const [mId, mIndex] = confirmState.itemId.split("-");
          handleRemoveMappedName(mId, parseInt(mIndex));
        } else {
          setMappings((prev) => {
            const newList = prev.filter(
              (item) => item.id !== confirmState.itemId,
            );
            return newList.map((item, idx) => ({ ...item, index: idx + 1 }));
          });
        }
      } else if (activeTab === "对手方交易员") {
        if (confirmState.type === "deleteAlias") {
          const [tId, tIndex] = confirmState.itemId.split("-");
          handleRemoveTraderAlias(tId, parseInt(tIndex));
        } else {
          setTraderMappings((prev) => {
            const newList = prev.filter(
              (item) => item.id !== confirmState.itemId,
            );
            return newList.map((item, idx) => ({ ...item, index: idx + 1 }));
          });
        }
      } else if (activeTab === "债券数据") {
        setBonds((prev) => {
          const newList = prev.filter(
            (item) => item.id !== confirmState.itemId,
          );
          return newList.map((item, idx) => ({ ...item, index: idx + 1 }));
        });
      }
    } else if (confirmState.type === "edit") {
      handleApplySave();
    }
    setConfirmState({
      isOpen: false,
      type: null,
      itemId: null,
      itemShortName: null,
    });
  };

  const handleAddTraderMapping = () => {
    const entry: TraderMappingEntry = {
      id: Math.random().toString(36).substr(2, 9),
      index: 1,
      name: "",
      fullName: "",
      shortName: "",
      mappedNames: [""],
    };
    setTraderMappings((prev) => {
      const newList = [entry, ...prev];
      return newList.map((item, idx) => ({ ...item, index: idx + 1 }));
    });
    setEditingTraderIds((prev) => new Set(prev).add(entry.id));
  };

  const handleUpdateTraderMappingField = (
    id: string,
    field: "name" | "fullName" | "shortName",
    value: string,
  ) => {
    setTraderMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
    // Clear validation error when typing
    if (fieldErrors[id]) {
      const newF = { ...fieldErrors };
      delete newF[id][field];
      setFieldErrors(newF);
    }
  };

  const handleSelectTraderInstitution = (rowId: string, inst: Institution) => {
    setTraderMappings((prev) =>
      prev.map((m) =>
        m.id === rowId
          ? { ...m, fullName: inst.fullName, shortName: inst.shortName }
          : m,
      ),
    );
    setSearchingRowId(null);
    setSearchQuery("");
    setFieldErrors((prev) => {
      const newF = { ...prev };
      if (newF[rowId]) {
        delete newF[rowId].fullName;
        delete newF[rowId].shortName;
      }
      return newF;
    });
  };

  const handleUpdateTraderAlias = (
    id: string,
    index: number,
    value: string,
  ) => {
    setTraderMappings((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = [...m.mappedNames];
          next[index] = value;
          return { ...m, mappedNames: next };
        }
        return m;
      }),
    );
    // Clear validation error when typing
    if (fieldErrors[id] && fieldErrors[id][`mappedName${index}`]) {
      const newF = { ...fieldErrors };
      delete newF[id][`mappedName${index}`];
      setFieldErrors(newF);
    }
  };

  const handleAddTraderAlias = (id: string) => {
    setTraderMappings((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, mappedNames: [...m.mappedNames, ""] } : m,
      ),
    );
  };

  const handleRemoveTraderAlias = (id: string, index: number) => {
    setTraderMappings((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.mappedNames.filter((_, i) => i !== index);
          return { ...m, mappedNames: next };
        }
        return m;
      }),
    );
  };

  const handleSaveTraderMappings = () => {
    const errors: string[] = [];
    const newFieldErrors: Record<string, Record<string, boolean>> = {};

    traderMappings.forEach((m) => {
      const rowErrors: Record<string, boolean> = {};
      if (!m.name) rowErrors.name = true;
      if (!m.fullName) rowErrors.fullName = true;
      if (!m.shortName) rowErrors.shortName = true;
      m.mappedNames.forEach((val, i) => {
        if (!val) rowErrors[`mappedName${i}`] = true;
      });

      if (Object.keys(rowErrors).length > 0) {
        newFieldErrors[m.id] = rowErrors;
        errors.push(`第 ${m.index} 行：必填项不能为空`);
      }
    });

    if (errors.length > 0) {
      setMappingErrors([...new Set(errors)]);
      setFieldErrors(newFieldErrors);
      setMappingSuccess(false);
      return;
    }

    // 2. Duplicate Validation
    // A) Trader Name Duplicate check
    const nameMap = new Map<string, TraderMappingEntry>();
    for (const m of traderMappings) {
      if (nameMap.has(m.name)) {
        setDuplicateMappingError({
          isOpen: true,
          mappingName: m.name,
          conflictingInstitution: {
            ...nameMap.get(m.name)!,
            traderName: nameMap.get(m.name)!.name, // Map name to traderName for Modal compatibility
          } as any,
        });
        return;
      }
      nameMap.set(m.name, m);
    }

    // B) Any mapping name Duplicate check
    const aliasMap = new Map<string, TraderMappingEntry>();
    for (const m of traderMappings) {
      for (const alias of m.mappedNames) {
        if (!alias) continue;
        if (aliasMap.has(alias)) {
          setDuplicateMappingError({
            isOpen: true,
            mappingName: alias,
            conflictingInstitution: {
              ...aliasMap.get(alias)!,
              traderName: aliasMap.get(alias)!.name,
            } as any,
          });
          return;
        }
        aliasMap.set(alias, m);
      }
    }

    setEditingTraderIds(new Set());
    setFieldErrors({});
    setMappingErrors([]);
    setMappingSuccess(true);
    setTimeout(() => setMappingSuccess(false), 3000);
  };

  // Bond CRUD Functions
  const handleOpenBondModal = (bond: Bond | null = null) => {
    if (bond) {
      setEditingBond(bond);
      setBondFormData({ ...bond });
    } else {
      setEditingBond(null);
      setBondFormData({
        isin: "",
        shortName: "",
        code: "",
        currency: "USD",
        issuer: "",
        bondRating: "-",
        issuerRating: "-",
        library: "A",
        type: "中资美元债",
        isLGFV: false,
        lgfvRegion: "-",
        isHighYield: false,
      });
    }
    setIsBondModalOpen(true);
  };

  const handleSaveBond = () => {
    if (editingBond) {
      setBonds((prev) =>
        prev.map((b) =>
          b.id === editingBond.id ? { ...b, ...bondFormData } : b,
        ),
      );
    } else {
      const newBond: Bond = {
        ...(bondFormData as Bond),
        id: Math.random().toString(36).substr(2, 9),
        index: bonds.length + 1,
      };
      setBonds((prev) => {
        const newList = [newBond, ...prev];
        return newList.map((b, idx) => ({ ...b, index: idx + 1 }));
      });
    }
    setIsBondModalOpen(false);
    setMappingSuccess(true);
    setTimeout(() => setMappingSuccess(false), 3000);
  };

  const handleAddBond = () => {
    handleOpenBondModal();
  };

  const handleUpdateBondField = (id: string, field: keyof Bond, value: any) => {
    setBonds((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    );
  };

  const handleSaveBonds = () => {
    // Simple validation could go here
    setEditingBondIds(new Set());
    setMappingSuccess(true); // Reusing the success notification
    setTimeout(() => setMappingSuccess(false), 3000);
  };

  const deleteBond = (id: string) => {
    setBonds((prev) => {
      const newList = prev.filter((b) => b.id !== id);
      return newList.map((b, idx) => ({ ...b, index: idx + 1 }));
    });
  };

  const handleUpdateRiskLimit = (
    id: string,
    field: keyof RiskLimit,
    value: any,
  ) => {
    setRiskLimits((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleSaveRiskParams = (newParams: typeof riskParams) => {
    setRiskParams(newParams);
    // Update linked indicator parameters
    setRiskLimits((prev) =>
      prev.map((r) => {
        if (r.id === "r1") {
          return {
            ...r,
            parameterValue: newParams.actualOwnedCapital,
            adjustmentSign: newParams.fixedIncomeLoss.sign as any,
            adjustmentValue: newParams.fixedIncomeLoss.value,
          };
        }
        if (r.id === "r2") {
          return {
            ...r,
            parameterValue: newParams.actualOwnedCapital,
          };
        }
        if (r.id === "r7") {
          return { ...r, parameterValue: newParams.fastMoney };
        }
        if (r.id === "r10") {
          return { ...r, parameterValue: newParams.repoScale };
        }
        return r;
      }),
    );
  };

  const toggleRiskLimitActive = (id: string) => {
    setRiskLimits((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0f2f5]">
      {/* Secondary Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() =>
          setConfirmState({
            isOpen: false,
            type: null,
            itemId: null,
            itemShortName: null,
          })
        }
        onConfirm={handleConfirmAction}
        title="操作确认"
        message={
          confirmState.type === "edit"
            ? `确定要修改机构【${confirmState.itemShortName}】的信息吗？`
            : confirmState.type === "deleteAlias"
              ? `确定要删除【${confirmState.itemShortName}】的映射名称【${confirmState.aliasName}】吗？`
              : activeTab === "债券数据"
                ? `确定要删除债券【${confirmState.itemShortName}】吗？`
                : `确定要删除机构【${confirmState.itemShortName}】吗？`
        }
      />

      {/* 1. Global Navigation Bar */}
      <nav className="bg-[#1d2c3c] h-12 flex items-center px-4 text-white shrink-0 relative z-50">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
            B
          </div>
          <span className="font-bold text-sm tracking-tight text-nowrap">
            国际业务中台
          </span>
        </div>

        <div className="flex items-center gap-2 text-[13px] opacity-90 h-full">
          {NAV_ITEMS.map((menu) => (
            <div
              key={menu.name}
              className="relative h-full flex items-center px-4 cursor-pointer hover:bg-white/10"
              onMouseEnter={() => setHoveredMenu(menu.name)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <div className="flex items-center gap-1">
                {menu.name}
                {menu.children && (
                  <ChevronDown size={14} className="opacity-60" />
                )}
              </div>

              {/* Mega Dropdown */}
              <AnimatePresence>
                {hoveredMenu === menu.name && menu.children && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-12 left-0 min-w-[200px] bg-white text-gray-800 shadow-xl border border-gray-100 py-2 rounded-b-md"
                  >
                    {menu.children.map((child) => (
                      <div key={child.name} className="group/child relative">
                        <div className="px-4 py-2 hover:bg-blue-50 flex items-center justify-between">
                          {child.name}
                          {child.children && (
                            <ChevronDown
                              size={14}
                              className="-rotate-90 opacity-40"
                            />
                          )}
                        </div>

                        {/* Level 3 */}
                        {child.children && (
                          <div className="hidden group-hover/child:block absolute left-full top-0 min-w-[160px] bg-white shadow-xl border border-gray-100 py-2 ml-px rounded-md">
                            {child.children.map((sub) => (
                              <div
                                key={sub}
                                onClick={() =>
                                  handleMenuClick(menu.name, child.name, sub)
                                }
                                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
                              >
                                {sub}
                              </div>
                            ))}
                          </div>
                        )}
                        {!child.children && (
                          <div
                            className="absolute inset-0 z-10"
                            onClick={() =>
                              handleMenuClick(menu.name, child.name)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-5 opacity-80">
          <Search size={18} className="cursor-pointer hover:opacity-100" />
          <div className="relative cursor-pointer hover:opacity-100">
            <Mail size={18} />
          </div>
          <div className="relative">
            <motion.div
              onClick={() => setShowApprovalNotification(!showApprovalNotification)}
              animate={pendingApprovalsData.total > 0 ? {
                rotate: [0, -10, 10, -10, 10, 0],
              } : {}}
              transition={pendingApprovalsData.total > 0 ? {
                repeat: Infinity,
                duration: 0.5,
                repeatDelay: 2,
                ease: "easeInOut"
              } : {}}
              className="cursor-pointer hover:opacity-100 flex items-center justify-center p-1.5"
            >
              <Bell size={18} />
              {pendingApprovalsData.total > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white ring-1 ring-[#1d2c3c] font-bold">
                  {pendingApprovalsData.total}
                </span>
              )}
            </motion.div>

            {/* Notification Popover */}
            <AnimatePresence>
              {showApprovalNotification && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowApprovalNotification(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-lg shadow-2xl z-50 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-[18px] font-bold text-gray-800 mb-6 font-sans">审批提醒</h3>
                      
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-[14px] text-gray-500 font-sans">待审批：</span>
                        <span className="text-[36px] font-bold text-[#1890ff] font-sans leading-none">
                          {pendingApprovalsData.total}
                        </span>
                      </div>

                      <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-blue-50 rounded-md p-3 flex justify-between items-center border border-blue-100 shadow-sm">
                          <span className="text-[13px] text-blue-700 font-medium">当日待审批</span>
                          <span className="text-[13px] text-blue-700 font-bold ml-2">
                             {pendingApprovalsData.total === 0 ? 0 : pendingApprovalsData.today}
                          </span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-md p-3 flex justify-between items-center border border-gray-100 shadow-sm">
                          <span className="text-[13px] text-gray-600 font-medium">历史待审批</span>
                          <span className="text-[13px] text-blue-600 font-bold ml-2">
                             {pendingApprovalsData.total === 0 ? 0 : pendingApprovalsData.historical}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            handleMenuClick("交易管理", "现券管理", "交易审批");
                            setShowApprovalNotification(false);
                          }}
                          className="text-[#1890ff] text-[14px] font-medium hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          去审批
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-100">
            <User size={18} />
          </div>
        </div>
      </nav>

      {/* 2. Secondary Tab Bar */}
      <div className="bg-white border-b border-[#f0f2f5] px-2 flex items-center pt-1 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-1.5 text-[12px] flex items-center gap-2 rounded-t transition-all cursor-pointer border-x border-t
                ${
                  activeTab === tab
                    ? "bg-[#1890ff] text-white border-[#1890ff]"
                    : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
                }
              `}
            >
              {tab}
              {tab !== "首页" && (
                <X
                  size={12}
                  title="关闭"
                  className={
                    activeTab === tab
                      ? "opacity-100 cursor-pointer"
                      : "opacity-40 hover:opacity-100 cursor-pointer"
                  }
                  onClick={(e) => handleCloseTab(e, tab)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Breadcrumbs */}
      <div className="px-4 py-2 text-[12px] text-gray-500 bg-white shadow-sm">
        {currentPath.map((p, i) => (
          <span key={p}>
            {p}{" "}
            {i < currentPath.length - 1 && (
              <span className="mx-1 text-gray-300">/</span>
            )}
          </span>
        ))}
      </div>

      {/* 4. Main Workspace */}
      <main className="p-4 flex-1 h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "机构数据" ? (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-0 h-full flex flex-col bg-white"
            >
              {/* Filters Group */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 shrink-0">
                <div className="flex flex-wrap gap-x-12 gap-y-6 text-[12px] mb-8">
                  <div className="flex flex-col gap-2 w-80">
                    <label className="text-gray-500">机构信息</label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="请输入名称/简称/英文名"
                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 pr-10"
                        value={filters.info}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            info: e.target.value,
                          }))
                        }
                      />
                      <Search
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-80">
                    <label className="text-gray-500">是否有效</label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                        value={filters.isValid}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            isValid: e.target.value as IsValidFilter,
                          }))
                        }
                      >
                        <option value="All">全选</option>
                        <option value="Yes">是</option>
                        <option value="No">否</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setFilters({
                        info: "",
                        socialCreditCode: "",
                        isValid: "All",
                        dataSource: "All",
                      })
                    }
                    className="px-6 py-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 transition-colors text-[13px]"
                  >
                    重置
                  </button>
                  <button className="bg-[#1890ff] text-white px-8 py-1.5 rounded font-medium hover:bg-blue-600 transition-all shadow-sm text-[13px]">
                    搜索
                  </button>
                  <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#1890ff] text-white px-8 py-1.5 rounded font-medium hover:bg-blue-600 transition-all shadow-sm text-[13px]"
                  >
                    新增机构
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#f9fbfd] p-4">
                <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden flex-1 flex flex-col">
                  <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[#fafafa] border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                          <th className="px-4 py-3 w-12 text-center">
                            <input
                              type="checkbox"
                              className="accent-blue-500"
                            />
                          </th>
                          <th className="px-4 py-3 w-16">序号</th>
                          <th className="px-4 py-3 w-48">机构名称简称</th>
                          <th className="px-4 py-3">机构中文全称</th>
                          <th className="px-4 py-3">机构英文全称</th>
                          <th className="px-4 py-3 w-28">是否有效</th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100 text-center">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px] text-[#262626]">
                        <AnimatePresence mode="popLayout">
                          {filteredInstitutions.length > 0 ? (
                            filteredInstitutions.map((inst) => (
                              <motion.tr
                                key={inst.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="border-b border-gray-100 hover:bg-[#f5f9ff] transition-colors group"
                              >
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 opacity-90">
                                  {inst.index}
                                </td>
                                <td className="px-4 py-3 truncate font-medium">
                                  {inst.shortName}
                                </td>
                                <td className="px-4 py-3 truncate">
                                  {inst.fullName}
                                </td>
                                <td className="px-4 py-3 truncate opacity-80">
                                  {inst.englishName}
                                </td>
                                <td className="px-4 py-3 opacity-90">
                                  {inst.isValid ? "是" : "否"}
                                </td>
                                <td className="px-4 py-3 sticky right-0 bg-inherit group-hover:bg-[#f5f9ff]">
                                  <div className="flex gap-4 items-center justify-center">
                                    <button
                                      onClick={() => handleOpenModal(inst)}
                                      className="text-[#1890ff] hover:text-blue-700 font-medium"
                                    >
                                      编辑
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRequest(inst)}
                                      className="text-[#1890ff] hover:text-red-500 font-medium"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                className="py-20 text-center text-gray-400"
                              >
                                未找到记录
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "对手方交易员" ? (

            <motion.div
              key="trader_mapping"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Light Toolbar */}
              <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-gray-600">
                      对手方交易员
                    </span>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="请输入姓名/映射"
                        className="border border-gray-300 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#1890ff] focus:ring-4 focus:ring-blue-50 transition-all w-64 text-gray-800"
                        value={traderSearch}
                        onChange={(e) => setTraderSearch(e.target.value)}
                      />
                      <Search
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1890ff]"
                      />
                    </div>
                  </div>
                  <button className="bg-[#1890ff] text-white px-8 py-1.5 rounded flex items-center gap-2 hover:bg-blue-600 transition-all font-medium text-[13px] shadow-sm">
                    搜索
                  </button>
                  <button
                    onClick={() => setTraderSearch("")}
                    className="text-gray-500 px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all text-[13px]"
                  >
                    重置
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddTraderMapping}
                    className="bg-white text-[#1890ff] border border-[#1890ff] px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-50 transition-all font-medium text-[13px] shadow-sm"
                  >
                    <Plus size={14} /> 新增
                  </button>
                  <button
                    onClick={handleSaveTraderMappings}
                    className="bg-[#1890ff] text-white px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-600 transition-all font-medium text-[13px] shadow-sm"
                  >
                    <Save size={14} /> 保存
                  </button>
                  <button
                    onClick={() => setActiveTab("首页")}
                    className="text-gray-500 px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all text-[13px]"
                  >
                    返回首页
                  </button>
                </div>
              </div>

              {/* Success/Error Alerts */}
              <AnimatePresence>
                {mappingSuccess && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div className="text-[12px] text-emerald-600">
                      交易员映射数据保存成功
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table Body - White theme */}
              <div className="flex-1 overflow-auto no-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                      <th className="px-4 py-3 w-16 text-center sticky top-0 z-10 bg-[#fafafa]">
                        序号
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[180px]">
                        对手方交易员姓名*
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[240px]">
                        机构全称*
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[180px]">
                        机构简称*
                      </th>
                      {Array.from({ length: maxTraderAliases }).map((_, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa]"
                        >
                          映射名称{i + 1}
                        </th>
                      ))}
                      <th className="px-4 py-3 w-20 sticky top-0 right-0 z-20 bg-[#fafafa] shadow-[-2px_0_4px_rgba(0,0,0,0.05)] text-center">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#262626]">
                    {filteredTraderMappings.map((m, idx) => {
                      const isEditing = editingTraderIds.has(m.id);
                      return (
                        <tr
                          key={m.id}
                          className={`border-b border-gray-100 hover:bg-[#f5f9ff] transition-colors group ${isEditing ? "bg-[#f5f9ff]" : ""}`}
                        >
                          <td className="px-4 py-3 text-center">{m.index}</td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                className={`bg-white border ${fieldErrors[m.id]?.name ? "border-red-400" : "border-gray-200"} focus:border-blue-400 outline-none w-full px-2 py-1 rounded transition-all text-gray-700 text-[13px]`}
                                value={m.name}
                                onChange={(e) =>
                                  handleUpdateTraderMappingField(
                                    m.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="输入姓名"
                                autoFocus
                              />
                            ) : (
                              <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                                {m.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 relative overflow-visible">
                            {isEditing ? (
                              <div className="relative">
                                <input
                                  className={`bg-white border ${fieldErrors[m.id]?.fullName ? "border-red-400" : "border-gray-200"} focus:border-blue-400 outline-none w-full px-2 py-1 rounded transition-all text-[13px]`}
                                  value={
                                    searchingRowId === m.id
                                      ? searchQuery
                                      : m.fullName
                                  }
                                  onFocus={() => {
                                    setSearchingRowId(m.id);
                                    setSearchQuery(m.fullName);
                                  }}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  placeholder={
                                    fieldErrors[m.id]?.fullName
                                      ? "请输入机构全称"
                                      : "输入机构全称搜索"
                                  }
                                />
                                {searchingRowId === m.id && (
                                  <div className="absolute top-full left-0 w-[400px] bg-white shadow-xl border border-gray-100 rounded-md mt-1 z-50 py-1 max-h-[300px] overflow-auto no-scrollbar">
                                    {institutions.filter(
                                      (i) =>
                                        i.fullName.includes(searchQuery) ||
                                        i.shortName.includes(searchQuery),
                                    ).length > 0 ? (
                                      institutions
                                        .filter(
                                          (i) =>
                                            i.fullName.includes(searchQuery) ||
                                            i.shortName.includes(searchQuery),
                                        )
                                        .map((inst) => (
                                          <div
                                            key={inst.id}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-50 last:border-0"
                                            onClick={() =>
                                              handleSelectTraderInstitution(
                                                m.id,
                                                inst,
                                              )
                                            }
                                          >
                                            <div className="text-[13px] font-medium text-gray-900">
                                              {inst.fullName}
                                            </div>
                                            <div className="text-[11px] text-gray-500">
                                              {inst.shortName}
                                            </div>
                                          </div>
                                        ))
                                    ) : (
                                      <div className="px-4 py-3 text-center">
                                        <div className="text-gray-400 text-[12px] mb-2">
                                          无法找到，手动新增
                                        </div>
                                        <button
                                          onClick={() =>
                                            setActiveTab("机构维护")
                                          }
                                          className="text-blue-500 hover:underline text-[13px] font-medium"
                                        >
                                          跳转至【机构维护】
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-700">
                                {m.fullName}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                className={`bg-gray-50 border ${fieldErrors[m.id]?.shortName ? "border-red-400" : "border-gray-100"} outline-none w-full px-2 py-1 rounded text-gray-500 cursor-not-allowed text-[13px]`}
                                value={m.shortName}
                                readOnly
                                placeholder="简称 (自动关联)"
                              />
                            ) : (
                              <span className="text-gray-500 italic">
                                {m.shortName}
                              </span>
                            )}
                          </td>

                          {Array.from({ length: maxTraderAliases }).map(
                            (_, i) => (
                              <td
                                key={i}
                                className="px-4 py-3 relative group/alias"
                              >
                                {m.mappedNames[i] !== undefined ? (
                                  isEditing ? (
                                    <div
                                      className={`flex-1 flex items-center justify-between bg-white px-2 py-0.5 rounded border ${fieldErrors[m.id]?.[`mappedName${i}`] ? "border-red-400" : "border-gray-200"} transition-all shadow-blue-50`}
                                    >
                                      <input
                                        className="bg-transparent outline-none flex-1 text-gray-700 w-0 text-[13px]"
                                        value={m.mappedNames[i]}
                                        onChange={(e) =>
                                          handleUpdateTraderAlias(
                                            m.id,
                                            i,
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <X
                                        size={12}
                                        className="text-gray-300 hover:text-red-500 cursor-pointer shrink-0 ml-1"
                                        onClick={() => {
                                          if (!m.mappedNames[i]) {
                                            handleRemoveTraderAlias(m.id, i);
                                          } else {
                                            setConfirmState({
                                              isOpen: true,
                                              type: "deleteAlias",
                                              itemId: `${m.id}-${i}`,
                                              itemShortName: m.name,
                                              aliasName: m.mappedNames[i],
                                            });
                                          }
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between bg-gray-100 px-2 py-0.5 rounded text-[12px] min-h-[24px]">
                                      <span className="text-gray-600">
                                        {m.mappedNames[i]}
                                      </span>
                                    </div>
                                  )
                                ) : isEditing && i === m.mappedNames.length ? (
                                  <button
                                    onClick={() => handleAddTraderAlias(m.id)}
                                    className="text-[#1890ff] hover:scale-110 transition-transform flex items-center gap-1 opacity-100 group-hover:font-bold"
                                  >
                                    <Plus size={16} />{" "}
                                    <span className="text-[11px]">
                                      添加 {i + 1}
                                    </span>
                                  </button>
                                ) : null}
                              </td>
                            ),
                          )}

                          <td className="px-4 py-3 sticky right-0 bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.02)] group-hover:bg-[#f5f9ff] text-center">
                            <div className="flex items-center justify-center gap-3">
                              {isEditing ? (
                                <button
                                  onClick={handleSaveTraderMappings}
                                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                  保存
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingTraderIds((prev) =>
                                      new Set(prev).add(m.id),
                                    )
                                  }
                                  className="text-[#1890ff] hover:text-blue-700 font-medium"
                                >
                                  编辑
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setConfirmState({
                                    isOpen: true,
                                    type: "delete",
                                    itemId: m.id,
                                    itemShortName: m.name,
                                  });
                                }}
                                className="text-[#1890ff] hover:text-blue-700 font-medium"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === "机构名称" ? (
            <motion.div
              key="mapping"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Toolbar - White theme */}
              <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-gray-600">
                      机构名称
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="模糊搜索名称/映射"
                        className="border border-gray-300 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#1890ff] focus:ring-4 focus:ring-blue-50 transition-all w-64"
                        value={mapSearch}
                        onChange={(e) => setMapSearch(e.target.value)}
                      />
                      <Search
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                  <button className="bg-[#1890ff] text-white px-8 py-1.5 rounded flex items-center gap-2 hover:bg-blue-600 transition-all font-medium text-[13px] shadow-sm">
                    搜索
                  </button>
                  <button
                    onClick={() => setMapSearch("")}
                    className="text-gray-500 px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all text-[13px]"
                  >
                    重置
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddMapping}
                    className="bg-white text-[#1890ff] border border-[#1890ff] px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-50 transition-all font-medium text-[13px] shadow-sm"
                  >
                    <Plus size={14} /> 新增
                  </button>
                  <button
                    onClick={handleSaveMappings}
                    className="bg-[#1890ff] text-white px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-600 transition-all font-medium text-[13px] shadow-sm"
                  >
                    <Save size={14} /> 保存
                  </button>
                  <button
                    onClick={() => setActiveTab("首页")}
                    className="text-gray-500 px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all text-[13px]"
                  >
                    返回首页
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {mappingErrors.length > 0 && (
                <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-500 mt-0.5 shrink-0"
                  />
                  <div className="text-[12px] text-red-600">
                    {mappingErrors.map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                  <X
                    size={14}
                    className="ml-auto cursor-pointer text-red-300 hover:text-red-500"
                    onClick={() => setMappingErrors([])}
                  />
                </div>
              )}
              {mappingSuccess && (
                <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                  <div className="text-[12px] text-emerald-600">
                    映射数据保存成功
                  </div>
                </div>
              )}

              {/* Table Body - Following Institution Maintenance Table Style */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                      <th className="px-4 py-3 w-16 text-center sticky top-0 z-10 bg-[#fafafa]">
                        序号
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[180px]">
                        机构英文全称
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[240px]">
                        机构全称*
                      </th>
                      <th className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa] w-[180px]">
                        机构简称*
                      </th>
                      {Array.from({ length: maxMappedNames }).map((_, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 sticky top-0 z-10 bg-[#fafafa]"
                        >
                          映射名称 {i + 1}
                        </th>
                      ))}
                      <th className="px-4 py-3 w-20 sticky top-0 right-0 z-20 bg-[#fafafa] shadow-[-2px_0_4px_rgba(0,0,0,0.05)] text-center">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#262626]">
                    {filteredMappings.map((m) => {
                      const isEditing = editingMappingIds.has(m.id);
                      return (
                        <tr
                          key={m.id}
                          className="border-b border-gray-100 hover:bg-[#f5f9ff] transition-colors group"
                        >
                          <td className="px-4 py-3 text-center">{m.index}</td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                className={`bg-white border ${fieldErrors[m.id]?.englishName ? "border-red-400" : "border-gray-200"} focus:border-blue-400 outline-none w-full px-2 py-1 rounded transition-all text-gray-700 text-[13px]`}
                                value={m.englishName}
                                onChange={(e) =>
                                  handleUpdateMappingField(
                                    m.id,
                                    "englishName",
                                    e.target.value,
                                  )
                                }
                                placeholder="请输入全称"
                              />
                            ) : (
                              <span>{m.englishName}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 relative overflow-visible">
                            {isEditing ? (
                              <div className="relative">
                                <input
                                  className={`bg-white border ${fieldErrors[m.id]?.fullName ? "border-red-400" : "border-gray-200"} focus:border-blue-400 outline-none w-full px-2 py-1 rounded transition-all text-[13px]`}
                                  value={
                                    searchingRowId === m.id
                                      ? searchQuery
                                      : m.fullName
                                  }
                                  onFocus={() => {
                                    setSearchingRowId(m.id);
                                    setSearchQuery(m.fullName);
                                  }}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  placeholder={
                                    fieldErrors[m.id]?.fullName
                                      ? "请输入机构全称"
                                      : "输入机构全称搜索"
                                  }
                                />
                                {searchingRowId === m.id && (
                                  <div className="absolute top-full left-0 w-[400px] bg-white shadow-xl border border-gray-100 rounded-md mt-1 z-50 py-1 max-h-[300px] overflow-auto no-scrollbar">
                                    {institutions.filter(
                                      (i) =>
                                        i.fullName.includes(searchQuery) ||
                                        i.shortName.includes(searchQuery),
                                    ).length > 0 ? (
                                      institutions
                                        .filter(
                                          (i) =>
                                            i.fullName.includes(searchQuery) ||
                                            i.shortName.includes(searchQuery),
                                        )
                                        .map((inst) => (
                                          <div
                                            key={inst.id}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-50 last:border-0"
                                            onClick={() =>
                                              handleSelectInstitutionForMapping(
                                                m.id,
                                                inst,
                                              )
                                            }
                                          >
                                            <div className="text-[13px] font-medium text-gray-900">
                                              {inst.fullName}
                                            </div>
                                            <div className="text-[11px] text-gray-500">
                                              {inst.shortName}
                                            </div>
                                          </div>
                                        ))
                                    ) : (
                                      <div className="px-4 py-3 text-center">
                                        <div className="text-gray-400 text-[12px] mb-2">
                                          无法找到，手动新增
                                        </div>
                                        <button
                                          onClick={() =>
                                            setActiveTab("机构维护")
                                          }
                                          className="text-blue-500 hover:underline text-[13px] font-medium"
                                        >
                                          跳转至【机构维护】
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-700">
                                {m.fullName}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                className={`bg-gray-50 border ${fieldErrors[m.id]?.shortName ? "border-red-400" : "border-gray-100"} outline-none w-full px-2 py-1 rounded text-gray-500 cursor-not-allowed text-[13px]`}
                                value={m.shortName}
                                readOnly
                                placeholder="简称 (自动关联)"
                              />
                            ) : (
                              <span className="text-gray-500 italic">
                                {m.shortName}
                              </span>
                            )}
                          </td>
                          {/* Render Mapped Names */}
                          {Array.from({ length: maxMappedNames }).map(
                            (_, i) => (
                              <td key={i} className="px-4 py-3">
                                <div className="flex items-center gap-2 group/input min-h-[24px]">
                                  {m.mappedNames[i] !== undefined ? (
                                    isEditing ? (
                                      <div
                                        className={`flex-1 flex items-center justify-between bg-white px-2 py-0.5 rounded border ${fieldErrors[m.id]?.[`mappedName${i}`] ? "border-red-400" : "border-gray-200"} transition-all shadow-blue-50`}
                                      >
                                        <input
                                          className="bg-transparent outline-none flex-1 text-gray-700 w-0 text-[13px]"
                                          value={m.mappedNames[i]}
                                          onChange={(e) => {
                                            handleUpdateMappedName(
                                              m.id,
                                              i,
                                              e.target.value,
                                            );
                                            if (
                                              fieldErrors[m.id]?.[
                                                `mappedName${i}`
                                              ]
                                            ) {
                                              const newF = { ...fieldErrors };
                                              delete newF[m.id][
                                                `mappedName${i}`
                                              ];
                                              setFieldErrors(newF);
                                            }
                                          }}
                                          placeholder={
                                            i === 0 &&
                                            fieldErrors[m.id]?.mappedName0
                                              ? "请输入映射名称"
                                              : ""
                                          }
                                        />
                                        <X
                                          size={12}
                                          className="text-gray-300 hover:text-red-500 cursor-pointer shrink-0 ml-1"
                                          onClick={() => {
                                            if (!m.mappedNames[i]) {
                                              handleRemoveMappedName(m.id, i);
                                            } else {
                                              setConfirmState({
                                                isOpen: true,
                                                type: "deleteAlias",
                                                itemId: `${m.id}-${i}`,
                                                itemShortName:
                                                  m.traderName || m.shortName,
                                                aliasName: m.mappedNames[i],
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-[12px]">
                                        {m.mappedNames[i]}
                                      </span>
                                    )
                                  ) : i === m.mappedNames.length &&
                                    isEditing ? (
                                    <button
                                      onClick={() => handleAddMappedName(m.id)}
                                      className="text-[#1890ff] hover:scale-110 transition-transform flex items-center gap-1 opacity-100 group-hover:font-bold"
                                    >
                                      <Plus size={16} />{" "}
                                      <span className="text-[11px]">
                                        添加 {i + 1}
                                      </span>
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            ),
                          )}
                          <td className="px-4 py-3 sticky right-0 bg-inherit shadow-[-2px_0_4px_rgba(0,0,0,0.02)] group-hover:bg-[#f5f9ff] text-center">
                            <div className="flex items-center justify-center gap-3">
                              {isEditing ? (
                                <button
                                  onClick={handleSaveMappings}
                                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                  保存
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingMappingIds((prev) =>
                                      new Set(prev).add(m.id),
                                    )
                                  }
                                  className="text-[#1890ff] hover:text-blue-700 font-medium"
                                >
                                  编辑
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setConfirmState({
                                    isOpen: true,
                                    type: "delete",
                                    itemId: m.id,
                                    itemShortName: m.traderName || m.shortName,
                                  });
                                }}
                                className="text-[#1890ff] hover:text-blue-700 font-medium"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === "债券数据" ? (
            <motion.div
              key="bond"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Toolbar - Bond Data specific */}
              <div className="bg-white p-4 border-b border-gray-100 shrink-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Bond Search */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600">
                        债券
                      </span>
                      <div className="relative dropdown-container">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="简称/代码/ISIN"
                            className="border border-gray-300 rounded px-3 py-1.5 text-[12px] outline-none focus:border-[#1890ff] focus:ring-4 focus:ring-blue-50 transition-all w-48"
                            value={bondFilters.bondSearch}
                            onChange={(e) => {
                              setBondFilters((prev) => ({
                                ...prev,
                                bondSearch: e.target.value,
                              }));
                              setShowBondSearchDropdown(true);
                            }}
                            onFocus={() => setShowBondSearchDropdown(true)}
                          />
                          <Search
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        {showBondSearchDropdown && bondFilters.bondSearch && (
                          <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-md mt-1 z-50 py-1 max-h-[200px] overflow-auto no-scrollbar">
                            {bonds
                              .filter(
                                (b) =>
                                  b.shortName.includes(
                                    bondFilters.bondSearch,
                                  ) ||
                                  b.code.includes(bondFilters.bondSearch) ||
                                  b.isin.includes(bondFilters.bondSearch),
                              )
                              .map((b) => (
                                <div
                                  key={b.id}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[12px] border-b border-gray-50 last:border-0"
                                  onClick={() => {
                                    setBondFilters((prev) => ({
                                      ...prev,
                                      bondSearch: b.shortName,
                                    }));
                                    setShowBondSearchDropdown(false);
                                  }}
                                >
                                  <div className="font-medium text-gray-900">
                                    {b.shortName}
                                  </div>
                                  <div className="text-gray-400 text-[10px]">
                                    {b.code} | {b.isin}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bond Type */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600">
                        债券类别
                      </span>
                      <select
                        className="border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#1890ff] transition-all"
                        value={bondFilters.type}
                        onChange={(e) =>
                          setBondFilters((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                      >
                        <option value="全部">全部</option>
                        <option value="利率债">利率债</option>
                        <option value="金融债">金融债</option>
                        <option value="地方企业债">地方企业债</option>
                        <option value="中资美元债">中资美元债</option>
                      </select>
                    </div>

                    {/* Library */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600">
                        债券库
                      </span>
                      <select
                        className="border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#1890ff] transition-all"
                        value={bondFilters.library}
                        onChange={(e) =>
                          setBondFilters((prev) => ({
                            ...prev,
                            library: e.target.value,
                          }))
                        }
                      >
                        <option value="全部">全部</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="未入库">未入库</option>
                      </select>
                    </div>

                    {/* Is LGFV */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600">
                        是否城投
                      </span>
                      <select
                        className="border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#1890ff] transition-all"
                        value={bondFilters.isLGFV}
                        onChange={(e) =>
                          setBondFilters((prev) => ({
                            ...prev,
                            isLGFV: e.target.value as IsValidFilter,
                          }))
                        }
                      >
                        <option value="All">全部</option>
                        <option value="Yes">是</option>
                        <option value="No">否</option>
                      </select>
                    </div>

                    {/* Is High Yield */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-600">
                        是否高收益债
                      </span>
                      <select
                        className="border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#1890ff] transition-all"
                        value={bondFilters.isHighYield}
                        onChange={(e) =>
                          setBondFilters((prev) => ({
                            ...prev,
                            isHighYield: e.target.value as IsValidFilter,
                          }))
                        }
                      >
                        <option value="All">全部</option>
                        <option value="Yes">是</option>
                        <option value="No">否</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddBond}
                      className="bg-white text-[#1890ff] border border-[#1890ff] px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-50 transition-all font-medium text-[13px] shadow-sm"
                    >
                      <Plus size={14} /> 新增
                    </button>
                    <button
                      onClick={handleSaveBonds}
                      className="bg-[#1890ff] text-white px-6 py-1.5 rounded flex items-center gap-2 hover:bg-blue-600 transition-all font-medium text-[13px] shadow-sm"
                    >
                      <Save size={14} /> 保存
                    </button>
                  </div>
                </div>
              </div>

              {/* Success Alert */}
              <AnimatePresence>
                {mappingSuccess && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 shadow-inner"
                  >
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      ✓
                    </div>
                    <div className="text-[12px] text-emerald-600">
                      债券数据保存成功
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table - Bond Data */}
              <div className="flex-1 overflow-auto bg-gray-50/30">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-gray-200 text-[12px] font-semibold text-gray-700">
                      <th className="px-3 py-3 w-12 text-center sticky top-0 z-10 bg-[#fafafa]">
                        序号
                      </th>
                      <th className="px-3 py-3 w-140 sticky top-0 z-10 bg-[#fafafa]">
                        ISIN简称
                      </th>
                      <th className="px-3 py-3 w-140 sticky top-0 z-10 bg-[#fafafa]">
                        债券简称
                      </th>
                      <th className="px-3 py-3 w-120 sticky top-0 z-10 bg-[#fafafa]">
                        债券代码
                      </th>
                      <th className="px-3 py-3 w-80 sticky top-0 z-10 bg-[#fafafa]">
                        货币币种
                      </th>
                      <th className="px-3 py-3 w-180 sticky top-0 z-10 bg-[#fafafa]">
                        发行主体
                      </th>
                      <th className="px-3 py-3 w-100 sticky top-0 z-10 bg-[#fafafa]">
                        债券债项评级
                      </th>
                      <th className="px-3 py-3 w-100 sticky top-0 z-10 bg-[#fafafa]">
                        债券主体评级
                      </th>
                      <th className="px-3 py-3 w-100 sticky top-0 z-10 bg-[#fafafa]">
                        债券库
                      </th>
                      <th className="px-3 py-3 w-100 sticky top-0 z-10 bg-[#fafafa]">
                        债券类型
                      </th>
                      <th className="px-3 py-3 w-80 sticky top-0 z-10 bg-[#fafafa]">
                        是否城投
                      </th>
                      <th className="px-3 py-3 w-120 sticky top-0 z-10 bg-[#fafafa]">
                        城投债所在地区
                      </th>
                      <th className="px-3 py-3 w-20 sticky top-0 right-0 z-20 bg-[#fafafa] shadow-[-2px_0_4px_rgba(0,0,0,0.05)] text-center">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-[#262626]">
                    {filteredBonds.map((b) => {
                      const isEditing = editingBondIds.has(b.id);
                      return (
                        <tr
                          key={b.id}
                          className="border-b border-gray-100 hover:bg-[#f5f9ff] transition-colors group bg-white"
                        >
                          <td className="px-3 py-3 text-center">{b.index}</td>
                          <td className="px-3 py-3">
                            {isEditing ? (
                              <input
                                className="bg-white border border-gray-200 focus:border-blue-400 outline-none w-full px-2 py-1 rounded text-[12px]"
                                value={b.isin}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "isin",
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              <span className="text-gray-800 font-medium">
                                {b.isin}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {isEditing ? (
                              <input
                                className="bg-white border border-gray-200 focus:border-blue-400 outline-none w-full px-2 py-1 rounded text-[12px]"
                                value={b.shortName}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "shortName",
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              <span className="text-gray-800">
                                {b.shortName}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {isEditing ? (
                              <input
                                className="bg-white border border-gray-200 focus:border-blue-400 outline-none w-full px-2 py-1 rounded text-[12px]"
                                value={b.code}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "code",
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              <span className="text-gray-600">{b.code}</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {isEditing ? (
                              <select
                                className="border border-gray-200 rounded px-1 py-1 w-full text-[12px]"
                                value={b.currency}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "currency",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="CNY">CNY</option>
                                <option value="USD">USD</option>
                                <option value="HKD">HKD</option>
                              </select>
                            ) : (
                              b.currency
                            )}
                          </td>
                          <td className="px-3 py-3 font-medium text-gray-700">
                            {b.issuer}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <input
                                className="border border-gray-200 rounded px-2 py-1 w-full text-[12px]"
                                value={b.bondRating}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "bondRating",
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              b.bondRating
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {b.issuerRating}
                          </td>
                          <td className="px-3 py-3">
                            {isEditing ? (
                              <select
                                className="border border-gray-200 rounded px-1 py-1 w-full text-[12px]"
                                value={b.library}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "library",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="未入库">未入库</option>
                              </select>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] ${
                                  b.library === "A"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : b.library === "B"
                                      ? "bg-blue-50 text-blue-600"
                                      : b.library === "C"
                                        ? "bg-amber-50 text-amber-600"
                                        : b.library === "D"
                                          ? "bg-orange-50 text-orange-600"
                                          : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {b.library}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-gray-500 italic">
                            {b.type}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isEditing ? (
                              <input
                                type="checkbox"
                                checked={b.isLGFV}
                                onChange={(e) =>
                                  handleUpdateBondField(
                                    b.id,
                                    "isLGFV",
                                    e.target.checked,
                                  )
                                }
                              />
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${b.isLGFV ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"}`}
                              >
                                {b.isLGFV ? "是" : "否"}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {b.lgfvRegion}
                          </td>
                          <td className="px-3 py-3 sticky right-0 bg-inherit shadow-[-2px_0_4px_rgba(0,0,0,0.02)] group-hover:bg-[#f5f9ff] text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleOpenBondModal(b)}
                                className="text-[#1890ff] hover:text-blue-700 font-medium"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmState({
                                    isOpen: true,
                                    type: "delete",
                                    itemId: b.id,
                                    itemShortName: b.shortName,
                                  });
                                }}
                                className="text-[#1890ff] hover:text-blue-700 font-medium"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === "查看状态（新）" ? (
            <motion.div
              key="view_status_new"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full bg-[#fcfcfc] overflow-hidden"
            >
              {/* Filter Area - Mirroring exactly the request image layout */}
              <div className="bg-white p-5 border-b border-gray-100 shrink-0">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none hover:border-blue-400 transition-colors"
                        value={newStatusFilters.dateType}
                        onChange={(e) =>
                          setNewStatusFilters((prev) => ({
                            ...prev,
                            dateType: e.target.value,
                          }))
                        }
                      >
                        <option>约定日期</option>
                        <option>结算日期</option>
                        <option>执行日期</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          className="border border-gray-200 rounded px-3 py-1.5 text-[12px] w-28 outline-none font-mono text-center"
                          value={newStatusFilters.startDate}
                          onChange={(e) =>
                            setNewStatusFilters((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <span className="text-gray-300">→</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          className="border border-gray-200 rounded px-3 py-1.5 text-[12px] w-28 outline-none font-mono text-center"
                          value={newStatusFilters.endDate}
                          onChange={(e) =>
                            setNewStatusFilters((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                        <div className="ml-2 text-gray-300">
                          <Calendar size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500 min-w-8">
                      状态
                    </span>
                    <div className="relative w-[180px]">
                      <select
                        className="w-full appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none hover:border-blue-400"
                        value={newStatusFilters.status}
                        onChange={(e) =>
                          setNewStatusFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                      >
                        <option value="全部">全部</option>
                        <option value="交易员审批">交易员审批</option>
                        <option value="驳回">驳回</option>
                        <option value="废弃">废弃</option>
                        <option value="审批通过">审批通过</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Bond Info */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">债券信息</span>
                    <input
                      type="text"
                      placeholder="请输入债券名称/代码/ISIN"
                      className="border border-gray-200 rounded px-3 py-1.5 text-[12px] w-[220px] outline-none hover:border-blue-400 placeholder:text-gray-300"
                    />
                  </div>

                  {/* Institution Info */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">机构信息</span>
                    <input
                      type="text"
                      placeholder="请输入对手方代码"
                      className="border border-gray-200 rounded px-3 py-1.5 text-[12px] w-[200px] outline-none hover:border-blue-400 placeholder:text-gray-300"
                    />
                  </div>

                  {/* Own Trader dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">
                      本方交易员
                    </span>
                    <div className="relative w-[100px]">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none hover:border-blue-400">
                        <option value="全部">全部</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="bg-[#1890ff] text-white px-6 py-1.5 rounded text-[13px] font-medium hover:bg-blue-600 shadow-sm shadow-blue-100">
                      搜索
                    </button>
                    <button className="bg-[#1890ff] text-white px-6 py-1.5 rounded text-[13px] font-medium hover:bg-blue-600 shadow-sm shadow-blue-100">
                      重置
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Body Area */}
              <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse table-fixed min-w-[2800px]">
                  <thead>
                    <tr className="bg-[#fafafa] text-[12px] font-black text-gray-900 border-b border-gray-100">
                      <th className="px-4 py-4 w-16 text-center">序号</th>
                      <th className="px-4 py-4 w-32 text-center">状态</th>
                      <th className="px-4 py-4 w-32 text-center">当前处理人</th>
                      <th className="px-4 py-4 w-40">ISIN</th>
                      <th className="px-4 py-4 w-52">债券名称</th>
                      <th className="px-4 py-4 w-40">债券代码</th>
                      <th className="px-4 py-4 w-24 text-center">方向</th>
                      <th className="px-4 py-4 w-36">到期收益率(%)</th>
                      <th className="px-4 py-4 w-32">交易净价</th>
                      <th className="px-4 py-4 w-32">全价</th>
                      <th className="px-4 py-4 w-32">净价估值</th>
                      <th className="px-4 py-4 w-24">币种</th>
                      <th className="px-4 py-4 w-36">券面总额(万)</th>
                      <th className="px-4 py-4 w-56">对手机构</th>
                      <th className="px-4 py-4 w-36">结算金额</th>
                      <th className="px-4 py-4 w-32 font-mono">约定日期</th>
                      <th className="px-4 py-4 w-32 font-mono">执行日期</th>
                      <th className="px-4 py-4 w-32 font-mono">结算日期</th>
                      <th className="px-4 py-4 w-24 text-center">清算速度</th>
                      <th className="px-4 py-4 w-32">本方交易员</th>
                      <th className="px-4 py-4 w-32">执行人员</th>
                      <th className="px-4 py-4 w-60">备注</th>
                      <th className="px-4 py-4 w-32 text-center">附件</th>
                      <th className="px-4 py-4 w-32 text-center sticky right-0 bg-[#fafafa] shadow-[-2px_0_5px_rgba(0,0,0,0.02)] border-l border-gray-100 z-10">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-black">
                    {confirmRecords.map((r, idx) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-50 hover:bg-blue-50/20 transition-all group"
                      >
                        <td className="px-4 py-5 text-center text-black font-mono">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              r.status === "审批通过"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : r.status === "驳回" || r.status === "撤回"
                                  ? "bg-orange-50 text-orange-600 border-orange-100"
                                  : r.status === "废弃"
                                    ? "bg-gray-100 text-gray-500 border-gray-200"
                                    : "bg-blue-50 text-blue-600 border-blue-100"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center font-black">
                          {r.currentHandler === "执行人员"
                            ? "本人"
                            : r.currentHandler}
                        </td>
                        <td className="px-4 py-5 text-black font-mono tracking-tight">
                          {r.isin}
                        </td>
                        <td className="px-4 py-5 font-black leading-tight">
                          {r.bondName}
                        </td>
                        <td className="px-4 py-5 text-black font-mono">
                          {r.bondCode}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <div className="flex items-center justify-center gap-1 group">
                            <span
                              className={`font-black ${r.side === "买入" ? "text-red-500" : "text-emerald-500"}`}
                            >
                              {r.side}
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-black">
                              <span>到期</span>
                              <ChevronDown size={12} />
                            </div>
                            <span className="font-black text-[14px] font-mono">
                              {r.yield}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5 font-black font-mono text-[14px]">
                          {r.cleanPrice}
                        </td>
                        <td className="px-4 py-5 font-black font-mono text-[14px]">
                          {r.fullPrice}
                        </td>
                        <td className="px-4 py-5 font-mono">{r.valuation}</td>
                        <td className="px-4 py-5 font-medium">{r.currency}</td>
                        <td className="px-4 py-5 font-black font-mono">
                          {r.amount}
                        </td>
                        <td className="px-4 py-5 font-medium">
                          {r.counterparty}
                        </td>
                        <td className="px-4 py-5 font-bold font-mono">
                          {r.settlementAmount}
                        </td>
                        <td className="px-4 py-5 text-black font-mono">
                          {r.tradeDate}
                        </td>
                        <td className="px-4 py-5 text-black font-mono">
                          {r.executionDate}
                        </td>
                        <td className="px-4 py-5 text-black font-mono">
                          {r.executionDate}
                        </td>
                        <td className="px-4 py-5 text-center font-bold">
                          {r.settlementSpeed}
                        </td>
                        <td className="px-4 py-5">{r.user}</td>
                        <td className="px-4 py-5">{r.executor}</td>
                        <td className="px-4 py-5 italic leading-tight">
                          {r.remarks}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Paperclip size={14} />
                          </button>
                        </td>
                        <td className="px-4 py-5 text-center sticky right-0 bg-white group-hover:bg-blue-50/20 transition-all shadow-[-2px_0_5px_rgba(0,0,0,0.02)] border-l border-gray-100 z-10">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => {
                                setApprovalFlowModal({
                                  isOpen: true,
                                  record: r,
                                });
                              }}
                              className="text-blue-500 hover:text-blue-700 whitespace-nowrap"
                            >
                              查看审批状态
                            </button>

                            {/* 动态操作按钮逻辑 */}
                            {(r.status === "审批中" ||
                              r.status === "交易员审批") && (
                              <button className="text-blue-500 hover:text-blue-700 whitespace-nowrap">
                                撤回
                              </button>
                            )}

                            {(r.status === "驳回" || r.status === "撤回") && (
                              <>
                                <button
                                  onClick={() => {
                                    // 1. Ensure the record is in tradeRecords (New Trade list)
                                    setTradeRecords((prev) => {
                                      if (prev.some((t) => t.id === r.id))
                                        return prev;
                                      const newTrade: TradeRecord = {
                                        ...r,
                                        faceAmount: r.amount, // Map amount to faceAmount
                                        isRejected: true,
                                        counterpartyTrader: "", // Initial value if not in ConfirmRecord
                                      };
                                      return [newTrade, ...prev];
                                    });
                                    // 2. 设置置顶记录
                                    setPinnedTradeIds((prev) => [
                                      ...new Set([r.id, ...prev]),
                                    ]);
                                    // 3. 跳转至新录交易页面
                                    setActiveTab("新录交易");
                                  }}
                                  className="text-blue-500 hover:text-blue-700 whitespace-nowrap"
                                >
                                  修改
                                </button>
                                <button className="text-blue-500 hover:text-blue-700 whitespace-nowrap">
                                  废弃
                                </button>
                              </>
                            )}

                            {r.status === "审批通过" && (
                              <button className="text-blue-500 hover:text-blue-700 whitespace-nowrap">
                                废弃
                              </button>
                            )}

                            {r.status === "废弃" &&
                              // No additional actions except "View Status" which is already there
                              null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Horizontal Scroll Bar Placeholder - Aesthetic like image */}
              <div className="h-4 bg-[#f8f9fa] border-t border-gray-100 relative group shrink-0">
                <div className="absolute left-8 top-1 bottom-1 w-[600px] bg-gray-400/50 rounded-full cursor-pointer hover:bg-gray-500/50 transition-colors" />
                <ChevronLeft
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <ChevronRight
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </motion.div>
          ) : activeTab === "新录交易" ? (
            <motion.div
              key="new_trade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full space-y-4"
            >
              {/* Header Toolbar */}
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  <span>交易管理</span>
                  <ChevronDown size={14} className="-rotate-90" />
                  <span>交易执行</span>
                  <ChevronDown size={14} className="-rotate-90" />
                  <span className="text-gray-900 font-medium">新录交易</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm transition-all">
                    <RotateCcw size={14} /> 清除过滤
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm transition-all">
                    <FileText size={14} /> 查看申请单
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 shadow-sm transition-all">
                    <ShieldCheck size={14} /> 确认状态
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 shadow-sm transition-all">
                    <ChevronLeft size={14} /> 返回前页
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 shadow-sm rounded border border-gray-100 shrink-0 space-y-4">
                <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[13px]">
                  {/* Date Filter */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-600 whitespace-nowrap">
                      约定日期
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tradeDate}
                        onChange={(e) => setTradeDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 w-36 outline-none focus:border-blue-400 transition-all font-mono"
                      />
                      <Calendar
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <div className="flex border border-gray-200 rounded overflow-hidden">
                      {[
                        "前一日",
                        "T-2",
                        "T-1",
                        "T+0",
                        "T+1",
                        "T+2",
                        "后一日",
                      ].map((t) => (
                        <button
                          key={t}
                          className={`px-3 py-1.5 border-r border-gray-200 last:border-0 hover:bg-gray-50 transition-all ${t === "T+0" ? "bg-blue-500 text-white border-blue-500 font-bold" : "text-gray-600"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code/Short Search */}
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="请输入代码/简称"
                        value={tradeFilters.bondSearch}
                        onChange={(e) =>
                          setTradeFilters((prev) => ({
                            ...prev,
                            bondSearch: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-3 py-1.5 w-48 outline-none focus:border-blue-400 transition-all pr-12 text-[12px]"
                      />
                      <button className="absolute right-0 top-0 h-full px-2 text-white bg-[#1890ff] rounded-r flex items-center gap-1 hover:bg-blue-600 transition-all text-[11px]">
                        <Search size={12} /> 搜索
                      </button>
                    </div>
                  </div>

                  {/* Institution Search */}
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="请输入机构"
                        value={tradeFilters.institutionSearch}
                        onChange={(e) =>
                          setTradeFilters((prev) => ({
                            ...prev,
                            institutionSearch: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-3 py-1.5 w-48 outline-none focus:border-blue-400 transition-all pr-12 text-[12px]"
                      />
                      <button className="absolute right-0 top-0 h-full px-2 text-white bg-[#1890ff] rounded-r flex items-center gap-1 hover:bg-blue-600 transition-all text-[11px]">
                        <Search size={12} /> 搜索
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[13px] pt-1">
                  {/* Internal Account */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-600 whitespace-nowrap">
                      内部账户
                    </label>
                    <div className="relative">
                      <select className="border border-gray-300 rounded px-3 py-1.5 w-48 outline-none focus:border-blue-400 appearance-none bg-white text-gray-400">
                        <option>请选择</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Settlement Speed */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-600 whitespace-nowrap">
                      清算速度
                    </label>
                    <div className="relative">
                      <select className="border border-gray-300 rounded px-3 py-1.5 w-36 outline-none focus:border-blue-400 appearance-none bg-white">
                        <option>下拉选择</option>
                        <option>T+0</option>
                        <option>T+1</option>
                        <option>T+2</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Executor */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-600 whitespace-nowrap">
                      执行人员
                    </label>
                    <div className="relative">
                      <select className="border border-gray-300 rounded px-3 py-1.5 w-36 outline-none focus:border-blue-400 appearance-none bg-white text-gray-400">
                        <option>请选择</option>
                        <option>王执行</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Recognition Workspace */}
              <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
                <div className="bg-white rounded shadow-sm border border-gray-100 flex items-center shrink-0 overflow-hidden">
                  {["文本识别", "手工录入"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        const newMode =
                          mode === "文本识别" ? "Recognition" : "Manual";
                        setTradeOperationalMode(newMode);
                        if (newMode === "Manual") {
                          setTradeRecords([
                            {
                              id: "new_temp",
                              index: 1,
                              bondName: "",
                              isin: "",
                              side: "买入",
                              yield: "",
                              cleanPrice: "",
                              fullPrice: "",
                              valuation: "",
                              faceAmount: "",
                              currency: "USD",
                              counterparty: "",
                              counterpartyTrader: "",
                              settlementAmount: "",
                              executionDate: "",
                              settlementDate: "",
                              settlementSpeed: "",
                              user: "",
                              businessType: "",
                              internalAccount: "",
                              executor: "",
                              remarks: "",
                            },
                          ]);
                        }
                      }}
                      className={`px-8 py-2.5 text-[13px] font-medium transition-all border-r border-gray-200 ${
                        (mode === "文本识别" &&
                          tradeOperationalMode === "Recognition") ||
                        (mode === "手工录入" &&
                          tradeOperationalMode === "Manual")
                          ? "bg-blue-600 text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                  {tradeOperationalMode === "Recognition" && (
                    <>
                      <div className="flex-1 h-full" />
                      <div className="px-4 flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] bg-orange-500 text-white rounded hover:bg-orange-600 transition-all shadow-sm font-medium">
                          开始识别
                        </button>
                        <button
                          onClick={() => setTradeRecognitionText("")}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all shadow-sm font-medium"
                        >
                          清空
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {tradeOperationalMode === "Recognition" && (
                  <div className="flex-1 flex gap-4 min-h-0">
                    <div className="flex-1 bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                      <div className="flex-1 p-4 flex flex-col min-h-0">
                        <textarea
                          className="flex-1 w-full bg-gray-50 text-gray-800 p-6 rounded-md font-mono text-[14px] leading-relaxed resize-none outline-none focus:ring-2 focus:ring-blue-500/20 border border-gray-200"
                          value={tradeRecognitionText}
                          onChange={(e) =>
                            setTradeRecognitionText(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Right History Sidebar */}
                    <div className="w-[320px] bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                      <div className="px-4 py-3 bg-[#f8f9fa] border-b border-gray-100 text-[13px] font-medium text-gray-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <History size={14} className="text-blue-500" />
                          历史识别结果
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-4 space-y-4">
                        <div className="space-y-3">
                          <h4 className="text-[12px] text-gray-400 font-medium px-1">
                            已匹配对手方识别内容
                          </h4>
                          {tradeRecognitionHistory.map((h) => (
                            <div
                              key={h.id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-400 hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                <span className="font-bold text-gray-800 text-[14px]">
                                  {h.institutionName}
                                </span>
                                {h.isNew && (
                                  <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded italic font-bold uppercase tracking-wider">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div className="space-y-2 text-[12px]">
                                <div className="flex items-center gap-4">
                                  <span className="text-gray-400 w-10">
                                    ISIN:
                                  </span>
                                  <span className="text-gray-600 font-mono font-medium">
                                    {h.isin}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500">
                                  <span className="w-10 text-gray-400">
                                    净价:
                                  </span>
                                  <span className="font-bold text-gray-700">
                                    {h.valuation}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${h.side === "买入" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                              >
                                {h.side}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Results Table */}
                <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 shrink-0">
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
                    <div className="flex items-center gap-2"></div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-6 py-2 text-[12px] bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all shadow-sm font-medium">
                        <Save size={14} /> 保存
                      </button>
                      <button className="flex items-center gap-1.5 px-6 py-2 text-[12px] bg-[#3a4b5a] text-white rounded hover:bg-slate-700 transition-all shadow-sm font-medium">
                        <Trash2 size={14} /> 删除
                      </button>
                      <button className="flex items-center gap-1.5 px-8 py-2 text-[12px] bg-orange-500 text-white rounded hover:bg-orange-600 transition-all shadow-sm font-medium">
                        <Send size={14} /> 发送交易员确认
                      </button>
                    </div>
                  </div>
                  <div className="overflow-auto flex-1 text-black">
                    <table className="w-full text-left border-collapse table-fixed min-w-[2000px]">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[#fafafa] border-b border-gray-200 text-[12px] font-semibold text-gray-900">
                          <th className="px-4 py-3 w-10 text-center border-r border-gray-100" />
                          <th className="px-4 py-3 w-12 text-center border-r border-gray-100">
                            序号
                          </th>
                          <th className="px-4 py-3 w-10 text-center border-r border-gray-100">
                            <input
                              type="checkbox"
                              className="accent-blue-500"
                            />
                          </th>
                          <th className="px-4 py-3 w-60 border-r border-gray-100">
                            债券名称/债券代码
                          </th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100">
                            ISIN
                          </th>
                          <th className="px-4 py-3 w-24 border-r border-gray-100">
                            方向
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100 font-sans">
                            收益率(%)
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            交易净价
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            全价
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            估值
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            券面总额(万)
                          </th>
                          <th className="px-4 py-3 w-24 border-r border-gray-100">
                            币种
                          </th>
                          <th className="px-4 py-3 w-52 border-r border-gray-100">
                            做市机构/对手方机构
                          </th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100">
                            对手方交易员
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100 font-sans">
                            结算金额
                          </th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100">
                            约定/执行日期
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            清算速度
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            用户
                          </th>
                          <th className="px-4 py-3 w-48 border-r border-gray-100">
                            业务类型/内部账户
                          </th>
                          <th className="px-4 py-3 w-52">执行人员/备注</th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100">
                            附件上传
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[12px] text-black">
                        {sortedTradeRecords.map((tr) => (
                          <tr
                            key={tr.id}
                            className={`border-b border-gray-100 hover:bg-blue-50/10 transition-all group ${
                              pinnedTradeIds.includes(tr.id)
                                ? "bg-[#fff7ed]"
                                : tr.isRejected
                                  ? "bg-red-50/20"
                                  : "bg-white"
                            }`}
                          >
                            <td className="px-4 py-3 text-center border-r border-gray-50"></td>
                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-50">
                              <div className="flex items-center justify-center gap-1">
                                {pinnedTradeIds.includes(tr.id) && (
                                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm mr-1">
                                    <Zap size={12} fill="currentColor" />
                                  </div>
                                )}
                                <span>{tr.index}</span>
                                {tr.isRejected &&
                                  !pinnedTradeIds.includes(tr.id) && (
                                    <AlertCircle
                                      size={14}
                                      className="text-red-500 ml-1"
                                      title="已驳回"
                                    />
                                  )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-50">
                              <input
                                type="checkbox"
                                className="accent-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50 font-sans text-black">
                              <div className="flex flex-col">
                                <span className="font-bold">
                                  {tr.bondName.split(" ")[0]}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {tr.bondName.split(" ").slice(1).join(" ")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-gray-50 text-black">
                              {tr.isin}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`font-bold ${tr.side === "买入" ? "text-red-500" : "text-emerald-500"}`}
                                >
                                  {tr.side}
                                </span>
                                <ChevronDown
                                  size={14}
                                  className="text-gray-300"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                  <span>到期</span>
                                  <ChevronDown size={12} />
                                </div>
                                <span className="font-bold">{tr.yield}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-[14px] border-r border-gray-50 text-black">
                              {tr.cleanPrice}
                            </td>
                            <td className="px-4 py-3 font-bold text-[14px] border-r border-gray-50 text-black">
                              {tr.fullPrice}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-gray-50 text-black">
                              {tr.valuation}
                            </td>
                            <td className="px-4 py-3 font-bold text-[14px] border-r border-gray-50 text-black">
                              {tr.faceAmount}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex items-center gap-1">
                                <span className="text-black">
                                  {tr.currency}
                                </span>
                                <ChevronDown
                                  size={14}
                                  className="text-gray-300"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex flex-col space-y-1">
                                <div className="text-gray-400 flex items-center justify-between pr-4">
                                  <span>请选择</span>
                                  <ChevronDown size={12} />
                                </div>
                                <span className="text-black font-medium">
                                  {tr.counterparty}
                                </span>
                                <ChevronDown
                                  size={12}
                                  className="text-gray-400 ml-auto"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <span className="text-black">
                                {tr.counterpartyTrader}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <span className="font-bold text-[14px] font-mono text-black">
                                {tr.settlementAmount}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex flex-col text-[11px] text-gray-600 gap-1 font-mono">
                                <div className="flex items-center justify-between">
                                  <span>{tr.executionDate}</span>
                                  <Calendar
                                    size={12}
                                    className="text-gray-300"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-black">
                                  <span>{tr.settlementDate}</span>
                                  <Calendar
                                    size={12}
                                    className="text-gray-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex items-center gap-1 text-black">
                                <span className="font-medium">
                                  {tr.settlementSpeed}
                                </span>
                                <ChevronDown
                                  size={14}
                                  className="text-gray-400 ml-auto"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <span className="text-gray-400">-</span>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-black">
                                    {tr.businessType}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-gray-400">
                                  <span>{tr.internalAccount}</span>
                                  <ChevronDown size={12} />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="flex items-center gap-3">
                                <span className="text-black whitespace-nowrap">
                                  {tr.executor}
                                </span>
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    placeholder="添加备注..."
                                    className="w-full bg-transparent border-b border-gray-100 outline-none text-[11px] focus:border-blue-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1.5">
                                {tr.attachments &&
                                  tr.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                      {tr.attachments.map((file, fIdx) => (
                                        <div
                                          key={fIdx}
                                          className="flex items-center gap-1.5 max-w-[120px]"
                                        >
                                          <button
                                            onClick={() => setPreviewFile(file)}
                                            className="text-blue-500 hover:text-blue-700 truncate text-[11px] underline cursor-pointer"
                                            title={file.name}
                                          >
                                            {file.name}
                                          </button>
                                          <button
                                            onClick={() =>
                                              setTradeRecords((prev) =>
                                                prev.map((item) =>
                                                  item.id === tr.id
                                                    ? {
                                                        ...item,
                                                        attachments:
                                                          item.attachments?.filter(
                                                            (_, i) =>
                                                              i !== fIdx,
                                                          ),
                                                      }
                                                    : item,
                                                ),
                                              )
                                            }
                                            className="text-gray-400 hover:text-red-500 shrink-0 cursor-pointer"
                                          >
                                            <X size={10} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                <button
                                  onClick={() => {
                                    setActiveUploadId(tr.id);
                                    fileInputRef.current?.click();
                                  }}
                                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-[11px] font-bold transition-colors cursor-pointer group w-fit"
                                >
                                  <Paperclip
                                    size={12}
                                    className="group-hover:rotate-12 transition-transform"
                                  />
                                  {tr.attachments && tr.attachments.length > 0
                                    ? "继续上传"
                                    : "上传附件"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "BOOK流水" ? (
            <motion.div
              key="book_flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Filters Area */}
              <div className="bg-white p-4 border-b border-gray-100 flex flex-col gap-4 shrink-0">
                {/* Top Filter Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500 whitespace-nowrap">
                        日期类型
                      </span>
                      <div className="relative">
                        <select
                          className="appearance-none bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none hover:border-blue-400 transition-all font-medium"
                          value={bookFilters.dateType}
                          onChange={(e) =>
                            setBookFilters((prev) => ({
                              ...prev,
                              dateType: e.target.value,
                            }))
                          }
                        >
                          <option>约定日期</option>
                          <option>执行日期</option>
                          <option>结算日期</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500 whitespace-nowrap">
                        状态
                      </span>
                      <div className="relative">
                        <select
                          className="appearance-none bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none hover:border-blue-400 transition-all font-medium min-w-[100px]"
                          value={bookFilters.status}
                          onChange={(e) =>
                            setBookFilters((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option>全部</option>
                          <option>交易员审批</option>
                          <option>投资经理审批</option>
                          <option>风控审批</option>
                          <option>审批驳回</option>
                          <option>审批通过</option>
                          <option>废弃</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500">日期</span>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            className="bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] w-32 outline-none font-mono"
                            value={bookFilters.startDate}
                            onChange={(e) =>
                              setBookFilters((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                          />
                          <Calendar
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative">
                          <input
                            type="text"
                            className="bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] w-32 outline-none font-mono"
                            value={bookFilters.endDate}
                            onChange={(e) =>
                              setBookFilters((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                            }
                          />
                          <Calendar
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="债券名称/代码/ISIN"
                        className="bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-10 text-[12px] w-48 outline-none focus:bg-white focus:border-blue-400 transition-all"
                        value={bookFilters.bondSearch}
                        onChange={(e) =>
                          setBookFilters((prev) => ({
                            ...prev,
                            bondSearch: e.target.value,
                          }))
                        }
                      />
                      <button className="absolute right-0 top-0 h-full px-2.5 bg-[#1890ff] text-white rounded-r flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <Search size={14} />
                      </button>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="对手方机构"
                        className="bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-10 text-[12px] w-48 outline-none focus:bg-white focus:border-blue-400 transition-all"
                        value={bookFilters.institutionSearch}
                        onChange={(e) =>
                          setBookFilters((prev) => ({
                            ...prev,
                            institutionSearch: e.target.value,
                          }))
                        }
                      />
                      <button className="absolute right-0 top-0 h-full px-2.5 bg-[#1890ff] text-white rounded-r flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <Search size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] border border-emerald-200 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100 transition-all font-medium">
                      <RotateCcw size={14} /> 重置
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] bg-orange-500 text-white rounded hover:bg-orange-600 transition-all font-medium shadow-sm">
                      <ShieldCheck size={14} /> 交易审批
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] bg-[#1890ff] text-white rounded hover:bg-blue-600 transition-all font-medium shadow-sm">
                      <TableIcon size={14} /> 自营报表
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-all font-medium shadow-sm">
                      <Download size={14} /> 导出
                    </button>
                  </div>
                </div>

                {/* Bottom Filter Row */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-gray-400 mr-2">
                      默认日期
                    </span>
                    <div className="flex items-center bg-gray-100 p-1 rounded">
                      {["当日约定", "当日执行", "当日发远期", "往日发当日"].map(
                        (d) => (
                          <button
                            key={d}
                            onClick={() =>
                              setBookFilters((prev) => ({
                                ...prev,
                                quickDate: d,
                              }))
                            }
                            className={`px-4 py-1 rounded text-[12px] transition-all ${bookFilters.quickDate === d ? "bg-[#1890ff] text-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}
                          >
                            {d}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">本方交易员</span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none min-w-[120px]"
                        value={bookFilters.ourTrader}
                        onChange={(e) =>
                          setBookFilters((prev) => ({
                            ...prev,
                            ourTrader: e.target.value,
                          }))
                        }
                      >
                        <option>全部</option>
                        <option>交易员A</option>
                        <option>交易员B</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">执行人员</span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-100 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[12px] outline-none min-w-[120px]"
                        value={bookFilters.executor}
                        onChange={(e) =>
                          setBookFilters((prev) => ({
                            ...prev,
                            executor: e.target.value,
                          }))
                        }
                      >
                        <option>全部</option>
                        <option>王执行</option>
                        <option>李执行</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-auto bg-gray-50/10">
                <table className="w-full text-left border-collapse table-fixed min-w-[2800px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-[#fafafa] border-b border-gray-200 text-[12px] font-semibold text-gray-900">
                      <th className="px-4 py-3 w-16 text-center border-r border-gray-100">
                        序号
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        状态
                      </th>
                      <th className="px-4 py-3 w-40 border-r border-gray-100">
                        ISIN
                      </th>
                      <th className="px-4 py-3 w-60 border-r border-gray-100">
                        债券名称
                      </th>
                      <th className="px-4 py-3 w-40 border-r border-gray-100">
                        债券代码
                      </th>
                      <th className="px-4 py-3 w-28 border-r border-gray-100">
                        方向
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        到期收益率 (%)
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        净价
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        全价
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        净价估值
                      </th>
                      <th className="px-4 py-3 w-28 border-r border-gray-100">
                        币种
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        券面总额(万)
                      </th>
                      <th className="px-4 py-3 w-48 border-r border-gray-100">
                        对手机构
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        结算金额
                      </th>
                      <th className="px-4 py-3 w-36 border-r border-gray-100">
                        约定日期
                      </th>
                      <th className="px-4 py-3 w-36 border-r border-gray-100">
                        执行日期
                      </th>
                      <th className="px-4 py-3 w-36 border-r border-gray-100 font-sans">
                        结算日期
                      </th>
                      <th className="px-4 py-3 w-28 border-r border-gray-100 text-center">
                        清算速度
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        本方交易员
                      </th>
                      <th className="px-4 py-3 w-32 border-r border-gray-100">
                        执行人员
                      </th>
                      <th className="px-4 py-3 w-60 border-r border-gray-100">
                        备注
                      </th>
                      <th className="px-4 py-3 w-24 text-center">附件</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-black">
                    {filteredBookRecords.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-100 hover:bg-blue-50/10 transition-colors bg-white text-[12px]"
                      >
                        <td className="px-4 py-3 text-center border-r border-gray-50 text-gray-500 whitespace-nowrap">
                          {r.index}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-center whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded inline-block text-[11px] font-medium border ${
                              r.auditStatus === "审批通过"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : r.auditStatus === "审批中"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {r.auditStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black whitespace-nowrap">
                          {r.isin}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-medium text-black whitespace-nowrap">
                          {r.bondName}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black whitespace-nowrap">
                          {r.bondCode}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 whitespace-nowrap">
                          <span
                            className={`font-bold ${r.side === "买入" ? "text-red-500" : "text-emerald-500"}`}
                          >
                            {r.side}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-bold text-black font-mono italic whitespace-nowrap">
                          {r.yield}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-bold text-black font-mono whitespace-nowrap">
                          {r.cleanPrice}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-bold text-black font-mono whitespace-nowrap">
                          {r.fullPrice}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-gray-500 italic whitespace-nowrap">
                          100.221
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-black whitespace-nowrap">
                          {r.currency}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-bold text-black font-mono whitespace-nowrap">
                          {r.amount}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-black whitespace-nowrap">
                          {r.counterparty}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black italic whitespace-nowrap">
                          500,000.00
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black whitespace-nowrap">
                          {r.tradeDate}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black whitespace-nowrap">
                          {r.executionDate}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 font-mono text-black whitespace-nowrap">
                          {r.settlementDate}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-center font-bold text-black italic font-mono whitespace-nowrap">
                          {r.settlementSpeed}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-black whitespace-nowrap">
                          {r.user}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-black whitespace-nowrap">
                          王执行
                        </td>
                        <td className="px-4 py-3 border-r border-gray-50 text-black italic whitespace-nowrap">
                          {r.remarks}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Paperclip size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === "交易审批" ? (
            <motion.div
              key="trade_confirmation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full bg-[#f0f2f5] overflow-hidden font-sans"
            >
              {/* Breadcrumb Path */}
              <div className="bg-white px-4 py-2 flex items-center gap-2 text-[12px] text-gray-500 border-b border-gray-50 shrink-0">
                <span className="hover:text-blue-500 cursor-pointer transition-colors">
                  交易管理
                </span>
                <ChevronRight size={14} className="opacity-40" />
                <span className="hover:text-blue-500 cursor-pointer transition-colors">
                  现券管理
                </span>
                <ChevronRight size={14} className="opacity-40" />
                <span className="text-gray-900 font-bold">交易审批</span>
              </div>

              {/* Filters Area */}
              <div className="bg-white p-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded-l px-2 py-1.5 pr-6 text-[12px] outline-none hover:border-blue-400 transition-colors cursor-pointer text-gray-700"
                        value={confirmFilters.dateType}
                        onChange={(e) =>
                          setConfirmFilters((prev) => ({
                            ...prev,
                            dateType: e.target.value,
                          }))
                        }
                      >
                        <option>约定日期</option>
                        <option>执行日期</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="border border-gray-200 px-2 py-1.5 text-[12px] w-28 outline-none hover:border-blue-400 transition-colors text-black font-medium"
                        value={confirmFilters.startDate}
                        onChange={(e) =>
                          setConfirmFilters((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                      <div className="px-1 text-gray-400 bg-white border-y border-gray-200 h-[30px] flex items-center">
                        <ArrowRight size={12} />
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          className="border border-gray-200 border-r-0 px-2 py-1.5 text-[12px] w-28 outline-none hover:border-blue-400 transition-colors text-black font-medium"
                          value={confirmFilters.endDate}
                          onChange={(e) =>
                            setConfirmFilters((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                        <div className="border border-gray-200 border-l-0 rounded-r px-1.5 py-[6px] bg-white text-gray-400">
                          <Calendar size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      状态
                    </span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded px-2 py-1.3 pr-7 text-[12px] outline-none hover:border-blue-400 transition-colors min-w-[70px] text-black"
                        value={confirmFilters.statusTab}
                        onChange={(e) =>
                          setConfirmFilters((prev) => ({
                            ...prev,
                            statusTab: e.target.value,
                          }))
                        }
                      >
                        <option>全部</option>
                        <option>进行中</option>
                        <option>已成交</option>
                        <option>已驳回</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      债券
                    </span>
                    <input
                      type="text"
                      placeholder="代码/名称"
                      className="border border-gray-200 rounded px-2 py-1.3 text-[12px] w-24 outline-none hover:border-blue-400"
                      value={confirmFilters.bondSearch}
                      onChange={(e) =>
                        setConfirmFilters((prev) => ({
                          ...prev,
                          bondSearch: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      机构
                    </span>
                    <input
                      type="text"
                      placeholder="对手机构"
                      className="border border-gray-200 rounded px-2 py-1.3 text-[12px] w-24 outline-none hover:border-blue-400"
                      value={confirmFilters.institutionSearch}
                      onChange={(e) =>
                        setConfirmFilters((prev) => ({
                          ...prev,
                          institutionSearch: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      本方交易员
                    </span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded px-2 py-1.3 pr-7 text-[12px] outline-none hover:border-blue-400 min-w-[80px]"
                        value={confirmFilters.traderSearch}
                        onChange={(e) =>
                          setConfirmFilters((prev) => ({
                            ...prev,
                            traderSearch: e.target.value,
                          }))
                        }
                      >
                        <option>全部</option>
                        <option>交易员A</option>
                        <option>交易员B</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      执行人员
                    </span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded px-2 py-1.3 pr-7 text-[12px] outline-none hover:border-blue-400 min-w-[80px]"
                        value={confirmFilters.executorSearch}
                        onChange={(e) =>
                          setConfirmFilters((prev) => ({
                            ...prev,
                            executorSearch: e.target.value,
                          }))
                        }
                      >
                        <option>全部</option>
                        <option>执行员X</option>
                        <option>执行员Y</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button className="bg-[#1890ff] text-white px-4 py-1.3 rounded text-[12px] font-medium hover:bg-blue-600 transition-colors shadow-sm">
                      搜索
                    </button>
                    <button className="bg-white text-[#1890ff] border border-[#1890ff] px-4 py-1.3 rounded text-[12px] font-medium hover:bg-blue-50 transition-colors shadow-sm">
                      重置
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="bg-white px-4 border-b border-gray-100 flex items-center gap-8 shrink-0">
                <button
                  onClick={() => setConfirmSubTab("当日未确认")}
                  className={`py-3 text-[14px] font-medium relative transition-colors flex items-center gap-2 ${confirmSubTab === "当日未确认" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  当日未确认
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${confirmSubTab === "当日未确认" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {pendingTodayCount}
                  </span>
                  {confirmSubTab === "当日未确认" && (
                    <motion.div
                      layoutId="subtab_line"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </button>
                <button
                  onClick={() => setConfirmSubTab("历史未确认")}
                  className={`py-3 text-[14px] font-medium relative transition-colors flex items-center gap-2 ${confirmSubTab === "历史未确认" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  历史未确认
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${confirmSubTab === "历史未确认" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {pendingHistoryCount}
                  </span>
                  {confirmSubTab === "历史未确认" && (
                    <motion.div
                      layoutId="subtab_line"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </button>
              </div>
              {/* Sub Tab: All */}
              <div className="bg-white px-4 py-2 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-1">
                  <button className="text-blue-500 text-[13px] font-medium border-b-2 border-blue-500 pb-1 px-1">
                    全部
                  </button>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] text-white font-black bg-red-400">
                    {totalPendingCount}
                  </span>
                </div>
              </div>

              {/* Content Area with Sidebar */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Bond List */}
                <div className="w-[200px] bg-white border-r border-gray-100 flex flex-col shrink-0">
                  <div className="flex-1 overflow-auto py-2">
                    {[
                      {
                        id: "US46625HAM60",
                        name: "中国主权债3.787%",
                        count: 4,
                      },
                      { id: "US01609WAP77", name: "阿里巴巴3.40%", count: 2 },
                      { id: "US05675AK40", name: "百度4.375%", count: 2 },
                      { id: "US47215PAB37", name: "京东3.375%", count: 2 },
                    ].map((bond) => (
                      <button
                        key={bond.id}
                        onClick={() => setSelectedBondId(bond.id)}
                        className={`w-full px-4 py-3 flex flex-col text-left transition-colors relative group ${selectedBondId === bond.id ? "bg-[#f0f7ff]" : "hover:bg-gray-50"}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`text-[13px] font-bold ${selectedBondId === bond.id ? "text-blue-600" : "text-gray-800"}`}
                          >
                            {bond.id}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] text-white font-black bg-red-400">
                            {bond.count}
                          </span>
                        </div>
                        <span className="text-[12px] text-gray-500">
                          {bond.name}
                        </span>
                        {selectedBondId === bond.id && (
                          <div className="absolute top-0 right-0 bottom-0 w-1 bg-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Detail Table Container */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  {/* Detail Header Summary */}
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 h-12">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold text-[13px]">
                        {selectedBondId}
                      </span>
                      <span className="text-gray-500 text-[13px]">
                        {selectedBondId === "US46625HAM60"
                          ? "中国主权债3.787%"
                          : selectedBondId === "US01609WAP77"
                            ? "阿里巴巴3.40%"
                            : "债券名称数据"}
                      </span>
                      <span className="text-gray-400 text-[13px]">
                        {selectedBondId === "US46625HAM60" ? "46625HAM6" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-6 mr-4">
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="text-gray-600">交易净头寸(万):</span>
                          <span className="text-red-500 font-bold font-mono">
                            0.00
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="text-gray-600">交易DV01(万):</span>
                          <span className="text-red-500 font-bold font-mono">
                            0.00
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          selectedConfirmIds.length > 0 &&
                          setApprovalModal({ isOpen: true, type: "batch" })
                        }
                        disabled={selectedConfirmIds.length === 0}
                        className={`px-4 py-1 rounded text-[12px] font-bold transition-all shadow-sm ${selectedConfirmIds.length > 0 ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      >
                        审批 ({selectedConfirmIds.length})
                      </button>
                    </div>
                  </div>

                  {/* Main Table */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[2000px]">
                      <thead className="sticky top-0 z-20">
                        <tr className="bg-[#f8f9fa] border-b border-gray-100 text-[12px] font-medium text-gray-600">
                          <th className="px-4 py-3 w-12 text-center border-r border-gray-100 sticky left-0 bg-[#f8f9fa] z-30 shadow-[1px_0_0_0_rgb(243,244,246)]">
                            <input
                              type="checkbox"
                              className="accent-blue-500"
                              checked={
                                selectedConfirmIds.length ===
                                  confirmRecords.length &&
                                confirmRecords.length > 0
                              }
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th className="px-2 py-3 w-14 text-center border-r border-gray-100">
                            方向
                          </th>
                          <th className="px-4 py-3 w-56 border-r border-gray-100">
                            债券名称
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            债券代码
                          </th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100">
                            ISIN
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            到期收益率(%)
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            交易净价
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            全价
                          </th>
                          <th className="px-4 py-3 w-28 border-r border-gray-100">
                            估值
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            券面总额(万)
                          </th>
                          <th className="px-4 py-3 w-24 border-r border-gray-100">
                            币种
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            本方交易员
                          </th>
                          <th className="px-4 py-3 w-40 border-r border-gray-100 text-right">
                            结算金额
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            约定日期
                          </th>
                          <th className="px-4 py-3 w-32 border-r border-gray-100">
                            执行日期
                          </th>
                          <th className="px-4 py-3 w-24 text-center sticky right-0 bg-[#f8f9fa] z-30 shadow-[-1px_0_0_0_rgb(243,244,246)]">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[12px] text-black bg-white">
                        {confirmRecords
                          .filter(
                            (r) =>
                              r.status === "审批通过" ||
                              r.status === "待处理" ||
                              r.status === "全部",
                          )
                          .map((r, i) => (
                            <tr
                              key={r.id}
                              className="border-b border-gray-50 hover:bg-blue-50/10 transition-colors group"
                            >
                              <td className="px-4 py-3 text-center border-r border-gray-50 sticky left-0 bg-white z-10 group-hover:bg-[#fcfdfe] transition-colors shadow-[1px_0_0_0_rgb(243,244,246)]">
                                <input
                                  type="checkbox"
                                  className="accent-blue-500"
                                  checked={selectedConfirmIds.includes(r.id)}
                                  onChange={() => handleSelectOne(r.id)}
                                />
                              </td>
                              <td className="px-2 py-3 text-center border-r border-gray-50">
                                <span
                                  className={`font-bold ${r.side === "买入" ? "text-red-500" : "text-emerald-500"}`}
                                >
                                  {r.side}
                                </span>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 truncate text-gray-800 font-bold">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="truncate">{r.bondName}</span>
                                  {r.triggeredLimit && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLimitModal({
                                          isOpen: true,
                                          record: r,
                                        });
                                      }}
                                      className="shrink-0 text-red-500 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                      <AlertCircle size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-mono text-gray-500">
                                {r.bondCode}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-mono text-gray-600">
                                {r.isin}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-gray-700 font-mono italic">
                                {r.yield}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-gray-700 font-mono">
                                {r.cleanPrice}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-gray-700 font-mono">
                                {r.fullPrice}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-gray-500 font-mono text-[11px]">
                                {r.valuation}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-gray-700 font-mono">
                                {r.amount}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 text-gray-600 uppercase font-bold">
                                {r.currency}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 text-gray-700 font-medium">
                                {r.currentHandler}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 font-bold text-blue-500 font-mono text-right text-[13px] group-hover:underline cursor-pointer">
                                {r.settlementAmount}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 text-gray-600 font-mono text-[11px]">
                                {r.tradeDate}
                              </td>
                              <td className="px-4 py-3 border-r border-gray-50 text-gray-400 font-mono text-[11px]">
                                {r.executionDate}
                              </td>
                              <td className="px-4 py-3 text-center sticky right-0 bg-white z-10 group-hover:bg-[#fcfdfe] transition-colors shadow-[-1px_0_0_0_rgb(243,244,246)]">
                                <button
                                  onClick={() =>
                                    setApprovalModal({
                                      isOpen: true,
                                      type: "single",
                                      record: r,
                                    })
                                  }
                                  className="text-blue-500 hover:text-blue-700 font-bold text-[13px] transition-colors"
                                >
                                  审批
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Approval Modals */}
              <AnimatePresence>
                {limitModal.isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[150] flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-lg shadow-4xl w-[1000px] overflow-hidden border border-gray-200"
                    >
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-black">
                        <h3 className="text-[15px] font-black tracking-tight">
                          交易限额监控
                        </h3>
                        <button
                          onClick={() => setLimitModal({ isOpen: false })}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="border border-gray-100 rounded-lg overflow-hidden bg-[#fcfcfc]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#f8f9fa] border-b border-gray-100 text-[13px] text-gray-900 font-black">
                                <th className="px-6 py-4">触发时间</th>
                                <th className="px-6 py-4">本方交易员</th>
                                <th className="px-6 py-4">结算日</th>
                                <th className="px-6 py-4">交易要素</th>
                                <th className="px-6 py-4">限额内容</th>
                                <th className="px-6 py-4">备注</th>
                              </tr>
                            </thead>
                            <tbody className="text-[13px]">
                              <tr className="bg-white">
                                <td className="px-6 py-8 text-black font-medium">
                                  2026-04-10 17:01:24
                                </td>
                                <td className="px-6 py-8 text-black">王交易</td>
                                <td className="px-6 py-8 text-black font-mono">
                                  2026-04-10
                                </td>
                                <td className="px-6 py-8">
                                  <div className="space-y-1">
                                    <div className="text-black font-bold">
                                      {limitModal.record?.bondName}{" "}
                                      {limitModal.record?.bondCode}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-red-500 font-bold whitespace-nowrap">
                                        {limitModal.record?.side}
                                      </span>
                                      <span className="text-gray-500 font-mono">
                                        净价:{limitModal.record?.cleanPrice}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-8 text-black leading-relaxed max-w-[300px]">
                                  单一发行主体资金投入规模集中度{" "}
                                  <span className="text-red-500 font-bold">
                                    触发限额
                                  </span>
                                </td>
                                <td className="px-6 py-8 text-gray-400 italic">
                                  --
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-100">
                        <button
                          onClick={() => setLimitModal({ isOpen: false })}
                          className="px-8 py-2.5 bg-blue-500 text-white rounded text-[13px] font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-100 cursor-pointer"
                        >
                          确定
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {approvalModal.isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="bg-white rounded-lg shadow-2xl w-[420px] overflow-hidden border border-gray-100"
                    >
                      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white text-black">
                        <h3 className="text-[14px] font-black">业务审批</h3>
                        <button
                          onClick={() => {
                            setApprovalModal({
                              ...approvalModal,
                              isOpen: false,
                            });
                            setShowRejectInput(false);
                            setRejectReason("");
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="px-8 py-6 space-y-5">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} className="text-blue-500" />
                          </div>
                          <div className="text-black text-left">
                            <p className="text-[13px] font-bold">
                              确认审批以下交易？
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                              {approvalModal.type === "batch"
                                ? `已选择批量审批共 ${selectedConfirmIds.length} 条记录`
                                : `审批债券: ${approvalModal.record?.bondName} (${approvalModal.record?.bondCode})`}
                            </p>
                          </div>
                        </div>

                        {/* Triggered Limit Field */}
                        <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100/50">
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="text-gray-500 font-bold">
                              是否触发限额：
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${approvalModal.record?.triggeredLimit ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
                              />
                              <span
                                className={`font-black ${approvalModal.record?.triggeredLimit ? "text-red-500" : "text-emerald-500"}`}
                              >
                                {approvalModal.record?.triggeredLimit
                                  ? "是"
                                  : "否"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight block text-left">
                            审批操作
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setSecondaryConfirm({
                                  isOpen: true,
                                  type: "pass",
                                });
                                setShowRejectInput(false);
                              }}
                              className="h-9 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] rounded flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                            >
                              <span className="text-[13px] font-bold text-white">
                                通过
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setShowRejectInput(true);
                                setRejectReason("");
                              }}
                              className={`h-9 active:scale-[0.98] rounded flex items-center justify-center transition-all cursor-pointer shadow-sm group ${showRejectInput ? "bg-red-600" : "bg-red-500 hover:bg-red-600"}`}
                            >
                              <span className="text-[13px] font-bold text-white">
                                驳回
                              </span>
                            </button>
                          </div>
                        </div>

                        {showRejectInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-2"
                          >
                            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">
                              驳回原因 (必填)
                            </label>
                            <div className="space-y-3">
                              <textarea
                                autoFocus
                                className="w-full h-24 bg-gray-50 border border-gray-100 rounded p-2.5 text-[12px] outline-none focus:border-red-400 focus:bg-white transition-all resize-none text-black"
                                placeholder="请输入具体的驳回理由..."
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                              />
                              <button
                                onClick={() => {
                                  setApprovalModal({
                                    ...approvalModal,
                                    isOpen: false,
                                  });
                                  setShowRejectInput(false);
                                  setRejectReason("");
                                  // In a real app, call reject API here
                                }}
                                disabled={!rejectReason.trim()}
                                className="w-full py-2 bg-red-500 text-white rounded text-[12px] font-bold hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all cursor-pointer shadow-sm shadow-red-100"
                              >
                                确认驳回归档
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="px-6 py-4 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50/50">
                        <button
                          onClick={() => {
                            setApprovalModal({
                              ...approvalModal,
                              isOpen: false,
                            });
                            setShowRejectInput(false);
                            setRejectReason("");
                          }}
                          className="px-6 py-2 text-[12px] font-medium text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {secondaryConfirm.isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[110] flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-lg shadow-3xl w-[400px] overflow-hidden border border-gray-100"
                    >
                      <div className="p-6 text-black text-left">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${secondaryConfirm.type === "pass" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}
                          >
                            <History size={20} />
                          </div>
                          <h4 className="text-[16px] font-black">
                            {secondaryConfirm.type === "pass"
                              ? "审批通过确认"
                              : "确认驳回"}
                          </h4>
                        </div>

                        <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                          {secondaryConfirm.type === "pass"
                            ? "您确定要通过该项审批吗？通过后流程将进入下一阶段。"
                            : "驳回后，该交易将返回给发起人重新修改，请确认。"}
                        </p>

                        {secondaryConfirm.type === "reject" && (
                          <div className="mb-6">
                            <label className="block text-[12px] font-bold text-gray-400 mb-2">
                              驳回原因 (必填)
                            </label>
                            <textarea
                              className="w-full h-24 bg-gray-50 border border-gray-100 rounded-lg p-3 text-[13px] outline-none focus:border-red-400 focus:bg-white transition-all resize-none"
                              placeholder="请输入具体的驳回理由..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              setSecondaryConfirm({
                                ...secondaryConfirm,
                                isOpen: false,
                              })
                            }
                            className="flex-1 py-3 text-[13px] font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          >
                            返回
                          </button>
                          <button
                            onClick={() => {
                              if (
                                secondaryConfirm.type === "reject" &&
                                !rejectReason.trim()
                              )
                                return;
                              setSecondaryConfirm({
                                ...secondaryConfirm,
                                isOpen: false,
                              });
                              setApprovalModal({
                                ...approvalModal,
                                isOpen: false,
                              });
                              setSelectedConfirmIds([]);
                            }}
                            disabled={
                              secondaryConfirm.type === "reject" &&
                              !rejectReason.trim()
                            }
                            className={`flex-1 py-3 text-[13px] font-bold text-white rounded-lg transition-all shadow-lg ${secondaryConfirm.type === "pass" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50" : "bg-red-500 hover:bg-red-600 shadow-red-200/50 disabled:bg-gray-300 disabled:shadow-none cursor-pointer"}`}
                          >
                            确认
                            {secondaryConfirm.type === "pass" ? "通过" : "驳回"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : activeTab === "限额管理" ? (
            <motion.div
              key="risk"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header with Search and View Toggle */}
              <div className="bg-white p-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1 bg-[#f0f2f5] p-1 rounded-lg">
                    <button
                      onClick={() => setRiskLimitView("Config")}
                      className={`px-6 py-1.5 rounded-md text-[13px] font-medium transition-all flex items-center gap-2 ${riskLimitView === "Config" ? "bg-white text-[#1890ff] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <Settings size={14} /> 指标配置
                    </button>
                    <button
                      onClick={() => setRiskLimitView("Report")}
                      className={`px-6 py-1.5 rounded-md text-[13px] font-medium transition-all flex items-center gap-2 ${riskLimitView === "Report" ? "bg-white text-[#1890ff] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <FileText size={14} /> 综合报表
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索限额分类/指标"
                      className="border border-gray-300 rounded px-3 py-1.5 text-[12px] outline-none focus:border-[#1890ff] focus:ring-4 focus:ring-blue-50 transition-all w-64"
                      value={riskSearch}
                      onChange={(e) => setRiskSearch(e.target.value)}
                    />
                    <Search
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {/* Toggle Active Filter - ONLY show in Config view */}
                  {riskLimitView === "Config" && (
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => setShowOnlyActiveRisk(!showOnlyActiveRisk)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${showOnlyActiveRisk ? "bg-blue-500" : "bg-gray-300"}`}
                      >
                        <motion.div
                          animate={{ x: showOnlyActiveRisk ? 22 : 4 }}
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </div>
                      <span className="text-[12px] text-gray-600">
                        {showOnlyActiveRisk ? "显示全部指标" : "只显示生效指标"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {riskLimitView === "Config" && (
                    <>
                      <button
                        onClick={() => setIsRiskParamModalOpen(true)}
                        className="px-4 py-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-all text-[13px] flex items-center gap-2 font-medium shadow-sm"
                      >
                        <Settings size={14} /> 参数配置
                      </button>
                      <button
                        onClick={() => setIsExchangeRateModalOpen(true)}
                        className="px-4 py-1.5 rounded border border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-all text-[13px] flex items-center gap-2 font-medium shadow-sm"
                      >
                        <RefreshCw size={14} /> 汇率配置
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Exchange Rates Display */}
              <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-6 text-[12px]">
                <span className="text-gray-400 font-medium select-none">
                  当前汇率 (Exchange Rates):
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 uppercase font-mono">
                      CNH/HKD:
                    </span>
                    <span className="text-[#1890ff] font-bold">{exchangeRates.cnhHkd}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 uppercase font-mono">
                      USD/HKD:
                    </span>
                    <span className="text-[#1890ff] font-bold">{exchangeRates.usdHkd}</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-auto bg-gray-50/20">
                <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                      <th className="px-6 py-3 w-24 text-center sticky top-0 z-10 bg-[#fafafa]">
                        序号
                      </th>
                      <th className="px-6 py-3 w-[240px] sticky top-0 z-10 bg-[#fafafa]">
                        限额分类
                      </th>
                      {riskLimitView === "Config" && (
                        <th className="px-6 py-3 min-w-[300px] sticky top-0 z-10 bg-[#fafafa]">
                          指标说明
                        </th>
                      )}
                      <th className="px-6 py-3 w-[220px] sticky top-0 z-10 bg-[#fafafa]">
                        限额指标
                      </th>
                      {riskLimitView === "Config" ? (
                        <>
                          <th className="px-6 py-3 w-[120px] sticky top-0 z-10 bg-[#fafafa] text-center">
                            是否生效
                          </th>
                          <th className="px-6 py-3 w-[150px] sticky top-0 z-10 bg-[#fafafa] text-center">
                            操作
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 w-[150px] sticky top-0 z-10 bg-[#fafafa]">
                            当前结果
                          </th>
                          <th className="px-6 py-3 w-[120px] sticky top-0 z-10 bg-[#fafafa] text-center">
                            符合情况
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#262626]">
                    {filteredRiskLimits.map((r, idx) => {
                      const isEditing = riskEditingRowId === r.id;
                      return (
                        <tr
                          key={r.id}
                          className="border-b border-gray-100 hover:bg-[#f5f9ff] transition-colors group bg-white"
                        >
                          <td className="px-6 py-4 text-center text-gray-400">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-50">
                            {isEditing ? (
                              <input
                                className="w-full border border-blue-200 rounded px-2 py-1 text-[12px] outline-none"
                                value={r.category}
                                onChange={(e) =>
                                  handleUpdateRiskLimit(
                                    r.id,
                                    "category",
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              r.category
                            )}
                          </td>
                          {riskLimitView === "Config" && (
                            <td className="px-6 py-4 text-gray-700 border-r border-gray-50">
                              {isEditing ? (
                                <textarea
                                  className="w-full border border-blue-200 rounded px-2 py-1 text-[12px] outline-none h-12"
                                  value={r.description}
                                  onChange={(e) =>
                                    handleUpdateRiskLimit(
                                      r.id,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                />
                              ) : (
                                r.description || "-"
                              )}
                            </td>
                          )}
                          <td className="px-6 py-4 border-r border-gray-50">
                            {isEditing ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="relative w-full">
                                  <select
                                    className="w-full border border-blue-200 rounded px-1.5 py-1 text-[12px] outline-none appearance-none bg-white font-bold"
                                    value={r.operator || "≤"}
                                    onChange={(e) =>
                                      handleUpdateRiskLimit(
                                        r.id,
                                        "operator",
                                        e.target.value as any,
                                      )
                                    }
                                  >
                                    <option value="=">=</option>
                                    <option value="<">&lt;</option>
                                    <option value=">">&gt;</option>
                                    <option value="≤">≤</option>
                                    <option value="≥">≥</option>
                                    <option value="in">in</option>
                                  </select>
                                  <ChevronDown
                                    size={10}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    const numericPart = r.limitValue.replace(
                                      /[^0-9.]/g,
                                      "",
                                    );
                                    const unitText = (() => {
                                      if (r.id === "r7")
                                        return "% * 证券公司速动资金";
                                      if (
                                        [
                                          "r11",
                                          "r12",
                                          "r13",
                                          "r14",
                                          "r15",
                                        ].includes(r.id)
                                      )
                                        return "% * 组合规模";
                                      if (r.id === "r21" || r.id === "r20") {
                                        // Applying to r21 (counts) and r20 (proportions) as per request
                                        if (
                                          r.category.includes("数量") ||
                                          r.limitValue.includes("只")
                                        )
                                          return "只";
                                      }
                                      if (r.limitValue.includes("亿港币"))
                                        return "亿港币";
                                      if (r.limitValue.includes("万港币"))
                                        return "万港币";
                                      if (r.limitValue.endsWith("%"))
                                        return "%";
                                      return "";
                                    })();

                                    return (
                                      <>
                                        <input
                                          className="flex-1 border border-blue-200 rounded px-2 py-1 text-[12px] outline-none font-bold min-w-[50px] bg-white transition-all focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(24,144,255,0.1)]"
                                          value={numericPart}
                                          onChange={(e) => {
                                            const newNum = e.target.value;
                                            // Reconstruct the value with original unit logic
                                            let finalVal = newNum;
                                            if (
                                              r.id === "r7" ||
                                              [
                                                "r11",
                                                "r12",
                                                "r13",
                                                "r14",
                                                "r15",
                                              ].includes(r.id) ||
                                              r.limitValue.endsWith("%")
                                            ) {
                                              finalVal = newNum + "%";
                                            } else if (unitText) {
                                              finalVal = newNum + unitText;
                                            }
                                            handleUpdateRiskLimit(
                                              r.id,
                                              "limitValue",
                                              finalVal,
                                            );
                                          }}
                                        />
                                        {unitText && (
                                          <span className="text-[11px] text-gray-500 whitespace-nowrap bg-gray-50 px-1.5 py-1 rounded border border-gray-100 select-none">
                                            {unitText}
                                          </span>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span className="font-bold text-[#1890ff]">
                                  {r.operator || "≤"}
                                </span>
                                <span className="font-bold">
                                  {r.id === "r7" ? (
                                    <>
                                      {r.limitValue.replace(/[^0-9.]/g, "")}% *
                                      证券公司速动资金
                                    </>
                                  ) : [
                                      "r11",
                                      "r12",
                                      "r13",
                                      "r14",
                                      "r15",
                                    ].includes(r.id) ? (
                                    <>
                                      {r.limitValue.replace(/[^0-9.]/g, "")}% *
                                      组合规模
                                    </>
                                  ) : (
                                    r.limitValue
                                  )}
                                </span>
                              </div>
                            )}
                          </td>

                          {riskLimitView === "Config" ? (
                            <>
                              <td className="px-6 py-4 text-center border-r border-gray-50">
                                <div className="flex items-center justify-center">
                                  {r.isActive ? (
                                    <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[12px] border border-yellow-200">
                                      已生效
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[12px] border border-gray-200">
                                      未生效
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                  {isEditing ? (
                                    <>
                                      <button
                                        className="text-[#1890ff] hover:text-blue-700 font-medium text-[13px]"
                                        onClick={() => setRiskEditingRowId(null)}
                                      >
                                        保存
                                      </button>
                                      <button
                                        className="text-gray-400 hover:text-gray-600 font-medium text-[13px]"
                                        onClick={() => setRiskEditingRowId(null)}
                                      >
                                        取消
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="text-[#1890ff] hover:text-blue-700 font-medium text-[13px]"
                                        onClick={() => {
                                          setEditingRiskLimit(r);
                                          setIsRiskLimitEditModalOpen(true);
                                        }}
                                      >
                                        编辑
                                      </button>
                                      <button
                                        className="text-[#1890ff] hover:text-red-500 font-medium text-[13px]"
                                        onClick={() => {
                                          setConfirmModal({
                                            isOpen: true,
                                            title: "删除确认",
                                            message: `指标删除后无法恢复，是否确认删除指标：${r.category}？`,
                                            onConfirm: () => {
                                              setRiskLimits((prev) =>
                                                prev.filter((id) => id.id !== r.id),
                                              );
                                            },
                                          });
                                        }}
                                      >
                                        删除
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 font-bold text-gray-900 underline decoration-dotted decoration-blue-200 underline-offset-4">
                                {r.currentResult}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {r.isActive ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${r.isCompliant ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"}`}
                                    />
                                    <span
                                      className={`font-bold ${r.isCompliant ? "text-emerald-600" : "text-red-600"}`}
                                    >
                                      {r.isCompliant ? "符合" : "不符合"}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <span className="text-gray-400 font-bold">
                                      不涉及
                                    </span>
                                  </div>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-4">
              <TableIcon size={64} className="opacity-10" />
              <span>此页面（{activeTab}）正在开发中...</span>
            </div>
          )}
        </AnimatePresence>
      </main>

      <RiskLimitEditModal
        isOpen={isRiskLimitEditModalOpen}
        onClose={() => setIsRiskLimitEditModalOpen(false)}
        limit={editingRiskLimit}
        onSave={(updated) => {
          setRiskLimits((prev) =>
            prev.map((l) => (l.id === updated.id ? updated : l)),
          );
        }}
        onConfirmRequest={(updated) => {
          setConfirmModal({
            isOpen: true,
            title: "修改确认",
            message: "是否确认修改该风险限额配置？",
            onConfirm: () => {
              setRiskLimits((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l)),
              );
              setIsRiskLimitEditModalOpen(false);
            },
          });
        }}
      />

      <RiskParamModal
        isOpen={isRiskParamModalOpen}
        onClose={() => setIsRiskParamModalOpen(false)}
        params={riskParams}
        onSave={handleSaveRiskParams}
      />

      <ExchangeRateModal
        isOpen={isExchangeRateModalOpen}
        onClose={() => setIsExchangeRateModalOpen(false)}
        rates={exchangeRates}
        onSave={setExchangeRates}
        onConfirmRequest={(newRates) => {
          setConfirmModal({
            isOpen: true,
            title: "汇率修改确认",
            message: "汇率修改后，所有限额指标与报表将会重新计算，请确认",
            onConfirm: () => {
              setExchangeRates(newRates);
              setIsExchangeRateModalOpen(false);
            },
          });
        }}
      />

      <GenericConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Bond Add / Edit Modal */}
      <AnimatePresence>
        {isBondModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBondModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-[600px] rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-semibold text-lg text-gray-900">
                  {editingBond ? "编辑债券" : "新增债券"}
                </h3>
                <X
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setIsBondModalOpen(false)}
                />
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">ISIN简称</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.isin}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, isin: e.target.value }))}
                      placeholder="请输入ISIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券简称</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.shortName}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, shortName: e.target.value }))}
                      placeholder="请输入简称"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券代码</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.code}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="请输入代码"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">货币币种</label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.currency}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="CNY">CNY</option>
                      <option value="USD">USD</option>
                      <option value="HKD">HKD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-700">发行主体</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                    value={bondFormData.issuer}
                    onChange={(e) => setBondFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="请输入发行主体"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券债项评级</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.bondRating}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, bondRating: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券主体评级</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.issuerRating}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, issuerRating: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券库</label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.library}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, library: e.target.value }))}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="未入库">未入库</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-700">债券类型</label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-[13px]"
                      value={bondFormData.type}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="利率债">利率债</option>
                      <option value="金融债">金融债</option>
                      <option value="地方企业债">地方企业债</option>
                      <option value="中资美元债">中资美元债</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="isLGFV"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={bondFormData.isLGFV}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, isLGFV: e.target.checked }))}
                    />
                    <label htmlFor="isLGFV" className="text-[13px] font-medium text-gray-700 cursor-pointer">
                      是否城投
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="isHighYield"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={bondFormData.isHighYield}
                      onChange={(e) => setBondFormData(prev => ({ ...prev, isHighYield: e.target.checked }))}
                    />
                    <label htmlFor="isHighYield" className="text-[13px] font-medium text-gray-700 cursor-pointer">
                      是否高收益债
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end gap-3 items-center">
                <button
                  onClick={() => setIsBondModalOpen(false)}
                  className="px-6 py-2 text-[13px] text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveBond}
                  className="px-12 py-2 text-[13px] bg-[#1890ff] text-white rounded font-medium hover:bg-blue-600 hover:shadow-lg transition-all shadow-blue-100"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-[560px] rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Modal Header - White background, Black text */}
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-semibold text-lg text-gray-900">
                  {editingItem ? "编辑机构" : "新增机构"}
                </h3>
                <X
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>

              {/* Modal Body - New field order */}
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Duplicate Data Reminder */}
                {duplicateItems.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-5 space-y-3">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-[14px]">
                      <AlertCircle size={18} />
                      <span>数据已存在，不支持新增。</span>
                    </div>
                    {duplicateItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-gray-600 bg-white/50 p-3 rounded-md border border-red-50"
                      >
                        <div>
                          <span className="text-gray-400">中文全称：</span>
                          {item.fullName}
                        </div>
                        <div>
                          <span className="text-gray-400">中文简称：</span>
                          {item.shortName}
                        </div>
                        <div>
                          <span className="text-gray-400">是否有效：</span>
                          {item.isValid ? "是" : "否"}
                        </div>
                        <div>
                          <span className="text-gray-400">数据来源：</span>
                          {item.dataSource === "Manual"
                            ? "手工维护"
                            : "系统同步"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1. Institution Full Name */}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 font-bold mr-1">*</span>{" "}
                    机构中文全称
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.fullName ? "border-red-500 ring-2 ring-red-50" : "border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"} rounded px-3 py-2 outline-none transition-all text-[13px]`}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="请输入机构中文全称"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Institution Short Name */}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 font-bold mr-1">*</span>{" "}
                    机构中文简称
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.shortName ? "border-red-500 ring-2 ring-red-50" : "border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"} rounded px-3 py-2 outline-none transition-all text-[13px]`}
                    value={formData.shortName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortName: e.target.value,
                      }))
                    }
                    placeholder="请输入机构中文简称"
                  />
                  {errors.shortName && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.shortName}
                    </p>
                  )}
                </div>

                {/* 3. Institution English Name */}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-700 block">
                    机构英文全称
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-[13px]"
                    value={formData.englishName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        englishName: e.target.value,
                      }))
                    }
                    placeholder="请输入机构英文名称"
                  />
                </div>

                {/* 4. Is Valid - Click selection */}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-700 block">
                    是否有效
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, isValid: true }))
                      }
                      className={`flex-1 py-2 rounded border text-[13px] font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.isValid
                          ? "bg-blue-50 border-blue-200 text-blue-600 ring-1 ring-blue-100 font-bold"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      是
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, isValid: false }))
                      }
                      className={`flex-1 py-2 rounded border text-[13px] font-medium transition-all flex items-center justify-center gap-2 ${
                        !formData.isValid
                          ? "bg-red-50 border-red-200 text-red-600 ring-1 ring-red-100 font-bold"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      否
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end gap-3 items-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-[13px] text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-12 py-2 text-[13px] bg-[#1890ff] text-white rounded font-medium hover:bg-blue-600 hover:shadow-lg transition-all shadow-blue-100"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Duplicate Mapping Error Modal */}
      <AnimatePresence>
        {duplicateMappingError.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setDuplicateMappingError((prev) => ({ ...prev, isOpen: false }))
              }
              className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden p-8"
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">数据重复</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100 space-y-3 text-[13px]">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-24 shrink-0">
                        冲突映射名称:
                      </span>
                      <span className="text-red-600 font-bold">
                        {duplicateMappingError.mappingName}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-24 shrink-0">
                        对手方交易员:
                      </span>
                      <span className="text-gray-800">
                        {
                          duplicateMappingError.conflictingInstitution
                            ?.traderName
                        }
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-24 shrink-0">
                        对应机构全称:
                      </span>
                      <span className="text-gray-800">
                        {duplicateMappingError.conflictingInstitution?.fullName}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-24 shrink-0">
                        对应机构简称:
                      </span>
                      <span className="text-gray-800">
                        {
                          duplicateMappingError.conflictingInstitution
                            ?.shortName
                        }
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-24 shrink-0">
                        全部映射名称:
                      </span>
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {duplicateMappingError.conflictingInstitution?.mappedNames.map(
                          (name, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600 text-[11px]"
                            >
                              {name}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() =>
                    setDuplicateMappingError((prev) => ({
                      ...prev,
                      isOpen: false,
                    }))
                  }
                  className="px-10 py-2 text-[13px] bg-[#1890ff] text-white rounded font-medium hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Upload & Preview Components */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        multiple
      />

      <AnimatePresence>
        {approvalFlowModal.isOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApprovalFlowModal({ isOpen: false })}
              className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-[650px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">
                    审批流详情
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[13px] font-bold font-mono border border-blue-100 shadow-sm">
                    {approvalFlowModal.record?.isin}
                  </span>
                </div>
                <button
                  onClick={() => setApprovalFlowModal({ isOpen: false })}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Top Info Bar */}
              <div className="bg-[#f8fbff] px-8 py-6 space-y-4 border-b border-blue-50/50">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-[14px]">
                  <span className="text-gray-400">对手方机构:</span>
                  <span className="text-gray-700 font-bold">
                    {approvalFlowModal.record?.counterparty}
                  </span>
                </div>
                <div className="flex items-center gap-12 text-[14px]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">收益率:</span>
                    <span className="text-gray-700 font-black font-mono">
                      {approvalFlowModal.record?.yield}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">净价:</span>
                    <span className="text-gray-700 font-black font-mono">
                      {approvalFlowModal.record?.cleanPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">全价:</span>
                    <span className="text-gray-700 font-black font-mono">
                      {approvalFlowModal.record?.fullPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Body */}
              <div className="flex-1 p-8 overflow-auto bg-white min-h-[400px]">
                <div className="relative pl-10 space-y-8">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-blue-100" />

                  {(() => {
                    const baseSteps = [
                      {
                        role: "提交人",
                        name: "王执行",
                        status: "已提交",
                        time: "2026-04-23 10:00",
                        type: "done",
                      },
                      {
                        role: "交易员审批",
                        name: "李静",
                        status: "审批通过",
                        time: "2026-04-23 10:05",
                        type: "done",
                      },
                      {
                        role: "投资经理审批",
                        name: "王经理",
                        status: "审批通过",
                        time: "2026-04-23 10:10",
                        type: "done",
                      },
                      {
                        role: "风控审批",
                        name: "赵风控",
                        status: "审批通过",
                        time: "2026-04-23 10:15",
                        type: "done",
                      },
                    ];

                    if (
                      approvalFlowModal.record?.status === "驳回" ||
                      approvalFlowModal.record?.status === "撤回"
                    ) {
                      return [
                        {
                          role: "提交人",
                          name: "王执行",
                          status: "已提交",
                          time: "2026-04-23 10:00",
                          type: "done",
                        },
                        {
                          role: "交易员审批",
                          name: "本人",
                          status:
                            approvalFlowModal.record?.status === "驳回"
                              ? "已驳回"
                              : "已撤回",
                          time: "2026-04-23 10:05",
                          type: "rejected",
                        },
                      ];
                    }

                    if (
                      approvalFlowModal.record?.status === "交易员审批" ||
                      approvalFlowModal.record?.status === "审批中"
                    ) {
                      return [
                        {
                          role: "提交人",
                          name: "王执行",
                          status: "已提交",
                          time: "2026-04-23 10:00",
                          type: "done",
                        },
                        {
                          role: "交易员审批",
                          name: "李静",
                          status: "审批中",
                          time: null,
                          type: "active",
                        },
                      ];
                    }

                    return baseSteps;
                  })().map((step, idx) => (
                    <div
                      key={idx}
                      className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {/* Icon Marker */}
                      <div
                        className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                          step.type === "done"
                            ? "bg-blue-500 text-white"
                            : step.type === "active"
                              ? "bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                              : "bg-gray-300 text-white"
                        }`}
                      >
                        {step.type === "done" ? (
                          <Check size={14} strokeWidth={4} />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3 text-[14px]">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-black">
                            {step.role}:
                          </span>
                          <span className="text-gray-600 font-bold">
                            {step.name}
                          </span>
                        </div>
                        {step.time && (
                          <span className="font-mono text-gray-400 text-[13px]">
                            {step.time}
                          </span>
                        )}
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold border ${
                          step.type === "done"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : step.type === "active"
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}
                      >
                        {step.type === "done" && (
                          <Check size={14} strokeWidth={4} />
                        )}
                        <span>{step.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-gray-100 bg-[#fafafa] flex justify-end shrink-0">
                <button
                  onClick={() => setApprovalFlowModal({ isOpen: false })}
                  className="px-10 py-2.5 bg-blue-500 text-white rounded-lg text-[14px] font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 transform active:scale-95"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-[800px] h-[80vh] rounded-lg shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {previewFile.name}
                    </h3>
                    <p className="text-[11px] text-gray-400">文件预览</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 bg-gray-100/50 p-8 overflow-auto flex items-center justify-center">
                {previewFile.type.startsWith("image/") ? (
                  <img
                    src={previewFile.url}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain shadow-lg"
                  />
                ) : previewFile.type === "application/pdf" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white rounded-lg shadow-sm">
                    <FileText size={64} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">
                      PDF 文件预览 (模拟)
                    </p>
                    <a
                      href={previewFile.url}
                      download={previewFile.name}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full text-[13px] font-bold hover:bg-blue-600 transition-all"
                    >
                      下载查看
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white rounded-lg shadow-sm">
                    <FileText size={64} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">
                      {previewFile.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      此文件类型不支持在线预览
                    </p>
                    <a
                      href={previewFile.url}
                      download={previewFile.name}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full text-[13px] font-bold hover:bg-blue-600 transition-all"
                    >
                      下载文件
                    </a>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-8 py-2 bg-white border border-gray-200 text-gray-600 rounded text-[13px] font-bold hover:bg-gray-50 transition-all"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input::placeholder { color: #d1d5db; }
      `}</style>
    </div>
  );
}
