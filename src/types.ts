export interface Institution {
  id: string;
  index: number;
  shortName: string;
  fullName: string;
  englishName: string;
  socialCreditCode: string;
  isValid: boolean;
  dataSource: 'System' | 'Manual';
}

export interface MappingEntry {
  id: string;
  index: number;
  englishName: string;
  fullName: string;
  shortName: string;
  mappedNames: string[];
}

export interface TraderMappingEntry {
  id: string;
  index: number;
  name: string;
  fullName: string;
  shortName: string;
  mappedNames: string[];
}

export type IsValidFilter = 'All' | 'Yes' | 'No';
export type DataSourceFilter = 'All' | 'System' | 'Manual';

export interface InstitutionFilter {
  info: string;
  socialCreditCode: string;
  isValid: IsValidFilter;
  dataSource: DataSourceFilter;
}

export interface NavMenu {
  name: string;
  children?: NavLevel2[];
}

export interface NavLevel2 {
  name: string;
  children?: string[];
}

export interface Bond {
  id: string;
  index: number;
  isin: string;
  shortName: string;
  code: string;
  currency: string;
  issuer: string;
  bondRating: string;
  issuerRating: string;
  library: string;
  type: string;
  isLGFV: boolean;
  lgfvRegion: string;
  isHighYield: boolean;
}

export interface RiskLimit {
  id: string;
  category: string;
  description: string;
  indicator: string;
  limitValue: string;
  currentResult: string;
  isCompliant: boolean;
  isActive: boolean;
  index: number;
  parameterValue?: string;
  parameterLabel?: string;
  targetScope?: string;
  adjustmentSign?: '+' | '-';
  adjustmentValue?: string;
  operator?: '=' | '<' | '>' | '≤' | '≥' | 'in';
  reportStatus?: 'Compliant' | 'Non-Compliant' | 'Not-Applicable';
}

export interface BondFilter {
  bondSearch: string;
  type: string;
  library: string;
  isLGFV: IsValidFilter;
  isHighYield: IsValidFilter;
}

export interface TradeRecord {
  id: string;
  index: number;
  bondName: string;
  isin: string;
  side: '买入' | '卖出';
  yield: string;
  cleanPrice: string;
  fullPrice: string;
  valuation: string;
  faceAmount: string; // 万
  currency: string;
  counterparty: string;
  counterpartyTrader: string;
  settlementAmount: string;
  executionDate: string;
  settlementDate: string;
  settlementSpeed: string;
  user: string;
  businessType: string;
  internalAccount: string;
  executor: string;
  remarks: string;
  isRejected?: boolean;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

export interface TradeRecognitionResult {
  id: string;
  institutionName: string;
  isin: string;
  valuation: string;
  isNew?: boolean;
  side: '买入' | '卖出';
}

export interface BookRecord {
  id: string;
  index: number;
  auditStatus: '审批通过' | '新建' | '审批中';
  creationTime: string;
  bondName: string;
  bondCode: string;
  isin: string;
  side: '买入' | '卖出';
  yield: string;
  cleanPrice: string;
  fullPrice: string;
  amount: string; // 万
  currency: string;
  internalAccount: string;
  user: string;
  marketMaker: string;
  counterparty: string;
  tradeDate: string;
  executionDate: string;
  settlementSpeed: string;
  settlementDate: string;
  operationTime: string;
  remarks: string;
}

export interface ConfirmRecord {
  id: string;
  index: number;
  status: string;
  currentHandler: string;
  creationTime: string;
  bondName: string;
  bondCode: string;
  isin: string;
  side: '买入' | '卖出';
  yield: string;
  cleanPrice: string;
  fullPrice: string;
  valuation: string;
  amount: string; // 万
  currency: string;
  counterparty: string;
  settlementAmount: string;
  tradeDate: string;
  executionDate: string;
  settlementSpeed: string;
  user: string;
  businessType: string;
  internalAccount: string;
  executor: string;
  remarks: string;
  triggeredLimit?: boolean;
}
