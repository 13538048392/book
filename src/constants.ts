import { Bond, Institution, MappingEntry, NavMenu, TraderMappingEntry, RiskLimit, BookRecord, ConfirmRecord } from './types.ts';

export const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: '1',
    index: 1,
    shortName: '中银国际',
    fullName: '中银国际证券有限公司',
    englishName: 'BOCI Securities Limited',
    socialCreditCode: '91310000710931189H',
    isValid: true,
    dataSource: 'Manual',
  },
  {
    id: '2',
    index: 2,
    shortName: '工银国际',
    fullName: '工银国际证券有限公司',
    englishName: 'ICBC International Securities Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '3',
    index: 3,
    shortName: '建银国际',
    fullName: '建银国际证券有限公司',
    englishName: 'CCB International Securities Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '4',
    index: 4,
    shortName: '农银国际',
    fullName: '农银国际证券有限公司',
    englishName: 'ABCI Securities Company Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '5',
    index: 5,
    shortName: '交银国际',
    fullName: '交银国际证券有限公司',
    englishName: 'BOCOM International Securities Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '6',
    index: 6,
    shortName: '中信证券',
    fullName: '中信证券经纪(香港)有限公司',
    englishName: 'CITIC Securities Brokerage (HK) Limited',
    socialCreditCode: '91440300710916998T',
    isValid: true,
    dataSource: 'Manual',
  },
  {
    id: '7',
    index: 7,
    shortName: '中金香港',
    fullName: '中国国际金融香港证券有限公司',
    englishName: 'China International Capital Corporation (Hong Kong) Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '8',
    index: 8,
    shortName: '华泰国际',
    fullName: '华泰金融控股(香港)有限公司',
    englishName: 'Huatai Financial Holdings (Hong Kong) Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '9',
    index: 9,
    shortName: '国泰君安国际',
    fullName: '国泰君安证券(香港)有限公司',
    englishName: 'Guotai Junan Securities (Hong Kong) Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
  {
    id: '10',
    index: 10,
    shortName: '海通国际',
    fullName: '海通国际证券有限公司',
    englishName: 'Haitong International Securities Company Limited',
    socialCreditCode: '',
    isValid: true,
    dataSource: 'System',
  },
];

export const MOCK_MAPPINGS: MappingEntry[] = [
  {
    id: 'm1',
    index: 1,
    englishName: 'CICC Hong Kong',
    fullName: '中国国际金融香港证券有限公司',
    shortName: '中金香港',
    mappedNames: ['CICC HK Securities', 'CICC HK', 'CICC']
  },
  {
    id: 'm2',
    index: 2,
    englishName: 'BOC Hong Kong',
    fullName: '中国银行（香港）有限公司',
    shortName: '中银香港',
    mappedNames: ['BOCHK']
  },
  {
    id: 'm3',
    index: 3,
    englishName: 'ICBC Asia',
    fullName: '中国工商银行（亚洲）有限公司',
    shortName: '工银亚洲',
    mappedNames: ['ICBC (Asia)', 'ICBC']
  },
  {
    id: 'm4',
    index: 4,
    englishName: 'CCB Asia',
    fullName: '中国建设银行（亚洲）股份有限公司',
    shortName: '建银亚洲',
    mappedNames: ['CCB Asia', 'CCB']
  },
  {
    id: 'm5',
    index: 5,
    englishName: 'BOCOM HK Branch',
    fullName: '交通银行股份有限公司香港分行',
    shortName: '交行香港分行',
    mappedNames: ['BOCOM HK Branch']
  },
  {
    id: 'm6',
    index: 6,
    englishName: 'CITIC International',
    fullName: '中信银行（国际）有限公司',
    shortName: '中信国际',
    mappedNames: ['CITIC International', 'CITIC']
  },
  {
    id: 'm7',
    index: 7,
    englishName: 'CMB Wing Lung',
    fullName: '招商永隆银行有限公司',
    shortName: '招商永隆',
    mappedNames: ['CM Wing Lung', 'CM']
  },
  {
    id: 'm8',
    index: 8,
    englishName: 'Haitong International',
    fullName: '海通国际证券有限公司',
    shortName: '海通国际',
    mappedNames: ['Haitong International']
  },
  {
    id: 'm9',
    index: 9,
    englishName: 'HTIHK',
    fullName: '华泰金融控股（香港）有限公司',
    shortName: '华泰香港',
    mappedNames: ['HTIHK']
  }
];

export const MOCK_TRADER_MAPPINGS: TraderMappingEntry[] = [
  { id: 't1', index: 1, name: 'James', fullName: '中银国际证券有限公司', shortName: '中银国际', mappedNames: ['James', 'Jms', 'James.W'] },
  { id: 't2', index: 2, name: 'Mary', fullName: '工银国际证券有限公司', shortName: '工银国际', mappedNames: ['Mary', 'Mry'] },
  { id: 't3', index: 3, name: 'Robert', fullName: '建银国际证券有限公司', shortName: '建银国际', mappedNames: ['Robert', 'Rob', 'Berto'] },
  { id: 't4', index: 4, name: 'Patricia', fullName: '农银国际证券有限公司', shortName: '农银国际', mappedNames: ['Patricia', 'Pat', 'Trish'] },
  { id: 't5', index: 5, name: 'John', fullName: '交银国际证券有限公司', shortName: '交银国际', mappedNames: ['John', 'Jn'] },
  { id: 't6', index: 6, name: 'Jennifer', fullName: '中信证券经纪(香港)有限公司', shortName: '中信证券', mappedNames: ['Jennifer', 'Jen', 'Jenny'] },
  { id: 't7', index: 7, name: 'Michael', fullName: '中国国际金融香港证券有限公司', shortName: '中金香港', mappedNames: ['Michael', 'Mike', 'Micky'] },
  { id: 't8', index: 8, name: 'Linda', fullName: '华泰金融控股(香港)有限公司', shortName: '华泰国际', mappedNames: ['Linda', 'Lnd'] },
  { id: 't9', index: 9, name: 'David', fullName: '国泰君安证券(香港)有限公司', shortName: '国泰君安国际', mappedNames: ['David', 'Dvd', 'Dave'] },
];

export const MOCK_BONDS: Bond[] = [
  {
    id: 'b1', index: 1, isin: 'US01609WAU25', shortName: 'BABA 3.4 27', code: 'BABA 27', currency: 'USD',
    issuer: 'Alibaba Group Holding Ltd', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b2', index: 2, isin: 'US88033GAK58', shortName: 'TENCENT 3.6 28', code: 'TENCENT 28', currency: 'USD',
    issuer: 'Tencent Holdings Ltd', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b3', index: 3, isin: 'USG82003AL30', shortName: 'SINOPE 3.25 27', code: 'SINOPEC 27', currency: 'USD',
    issuer: 'Sinopec Group Overseas Development', bondRating: 'A+', issuerRating: 'A+', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b4', index: 4, isin: 'USG47137AJ09', shortName: 'ICBC 3.5 24', code: 'ICBC 24', currency: 'USD',
    issuer: 'Industrial & Commercial Bank of China', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b5', index: 5, isin: 'US98422DAA41', shortName: 'XIAOMI 3.4 30', code: 'XIAOMI 30', currency: 'USD',
    issuer: 'Xiaomi Best Time Intl', bondRating: 'BBB', issuerRating: 'BBB', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b6', index: 6, isin: 'US58733RAA42', shortName: 'MEITUA 3.05 30', code: 'MEITUAN 30', currency: 'USD',
    issuer: 'Meituan', bondRating: 'BBB-', issuerRating: 'BBB-', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b7', index: 7, isin: 'XS2203957262', shortName: 'SINOCE 4.75 25', code: 'SINOCEAN 25', currency: 'USD',
    issuer: 'Sino-Ocean Land Treasure IV', bondRating: 'C', issuerRating: 'C', library: 'D', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b8', index: 8, isin: 'XS2050761113', shortName: 'LONGFO 3.95 29', code: 'LONGFOR 29', currency: 'USD',
    issuer: 'Longfor Group Holdings Ltd', bondRating: 'BBB-', issuerRating: 'BBB-', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b9', index: 9, isin: 'USG8419PAE27', shortName: 'STGRID 2.9 28', code: 'STATEGRID 28', currency: 'USD',
    issuer: 'State Grid Overseas Investment', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b10', index: 10, isin: 'US06120MAE09', shortName: 'BOC 3.6 29', code: 'BOC 29', currency: 'USD',
    issuer: 'Bank of China Ltd', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b11', index: 11, isin: 'XS2185012581', shortName: 'HUARON 2.1 23', code: 'HUARONG 23', currency: 'USD',
    issuer: 'Huarong Finance 2019', bondRating: 'BBB+', issuerRating: 'BBB+', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b12', index: 12, isin: 'XS2243343226', shortName: 'AGILE 5.5 25', code: 'AGILE 25', currency: 'USD',
    issuer: 'Agile Group Holdings Ltd', bondRating: 'C', issuerRating: 'C', library: 'D', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b13', index: 13, isin: 'US12592BAE39', shortName: 'CNOOC 3.3 49', code: 'CNOOC 49', currency: 'USD',
    issuer: 'CNOOC Finance (2015)', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b14', index: 14, isin: 'XS2016335194', shortName: 'GRNLND 6.75 23', code: 'GREENLAND 23', currency: 'USD',
    issuer: 'Greenland Global Investment', bondRating: 'D', issuerRating: 'D', library: '未入库', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b15', index: 15, isin: 'US056752AK41', shortName: 'BAIDU 3.4 30', code: 'BAIDU 30', currency: 'USD',
    issuer: 'Baidu Inc', bondRating: 'A3', issuerRating: 'A3', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b16', index: 16, isin: 'XS2277103175', shortName: 'SHIMAO 3.45 31', code: 'SHIMAO 31', currency: 'USD',
    issuer: 'Shimao Group Holdings Ltd', bondRating: 'D', issuerRating: 'D', library: '未入库', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b17', index: 17, isin: 'XS2361284768', shortName: 'JINMAO 3.2 26', code: 'JINMAO 26', currency: 'USD',
    issuer: 'China Jinmao Holdings Group', bondRating: 'BBB-', issuerRating: 'BBB-', library: 'C', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b18', index: 18, isin: 'XS1959287315', shortName: 'POLYRE 3.8 24', code: 'POLY 24', currency: 'USD',
    issuer: 'Poly Real Estate Finance', bondRating: 'BBB+', issuerRating: 'BBB+', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b19', index: 19, isin: 'USG2117AAB51', shortName: 'CHGRID 3.5 27', code: 'CHGRID 27', currency: 'USD',
    issuer: 'China State Grid Ltd', bondRating: 'A1', issuerRating: 'A1', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b20', index: 20, isin: 'USG23530AB11', shortName: 'CHMER 3.0 25', code: 'CHMER 25', currency: 'USD',
    issuer: 'China Merchants Bank', bondRating: 'A3', issuerRating: 'A3', library: 'A', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b21', index: 21, isin: 'US455780AB12', shortName: 'INDVKE 4.0 26', code: 'VANKE 26', currency: 'USD',
    issuer: 'Vanke Real Estate (HK)', bondRating: 'BB+', issuerRating: 'BB+', library: 'C', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b22', index: 22, isin: 'US900123AB34', shortName: 'LENOVO 5.8 28', code: 'LENOVO 28', currency: 'USD',
    issuer: 'Lenovo Group Ltd', bondRating: 'BBB', issuerRating: 'BBB', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b23', index: 23, isin: 'XS2400000001', shortName: 'WANDA 11 25', code: 'WANDA 25', currency: 'USD',
    issuer: 'Dalian Wanda Commercial', bondRating: 'C', issuerRating: 'C', library: 'D', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: true
  },
  {
    id: 'b24', index: 24, isin: 'USN23456AB12', shortName: 'GEELY 3.0 26', code: 'GEELY 26', currency: 'USD',
    issuer: 'Geely Automobile Holdings', bondRating: 'BBB-', issuerRating: 'BBB-', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b25', index: 25, isin: 'US94106LAD20', shortName: 'WB 3.375 30', code: 'WB 30', currency: 'USD',
    issuer: 'Weibo Corp', bondRating: 'BBB', issuerRating: 'BBB', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  },
  {
    id: 'b26', index: 26, isin: 'USY64708AC67', shortName: 'NETEAS 3.7 24', code: 'NETEAS 24', currency: 'USD',
    issuer: 'NetEase Inc', bondRating: 'BBB+', issuerRating: 'BBB+', library: 'B', type: '中资美元债', isLGFV: false, lgfvRegion: '-', isHighYield: false
  }
];

export const MOCK_RISK_LIMITS: RiskLimit[] = [
  { id: 'r1', index: 1, category: '固收类业务风险限额', description: '固收类业务亏损金额 / 实际自有资金投入规模', indicator: '4%', limitValue: '4%', currentResult: '2.5%', isCompliant: true, isActive: true, parameterLabel: '实际自有资金投入规模', parameterValue: '1000.00', targetScope: '固收部-张三', operator: '≤', adjustmentSign: '-', adjustmentValue: '0.00', reportStatus: 'Compliant' },
  { id: 'r2', index: 2, category: '固收类业务杠杆', description: '债权买入成本 / 实际自有资金投入规模', indicator: '300%', limitValue: '300%', currentResult: '240%', isCompliant: true, isActive: true, parameterLabel: '实际自有资金投入规模', parameterValue: '1000.00', targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r3', index: 3, category: '信用债持仓规模 (境外债+债券通)', description: '买入成本加总', indicator: '18亿港币', limitValue: '18亿港币', currentResult: '19.5亿港币', isCompliant: false, isActive: true, targetScope: '交易一部', operator: '≤', reportStatus: 'Non-Compliant' },
  { id: 'r4', index: 4, category: '中低等级信用债', description: '', indicator: '8亿港币', limitValue: '8亿港币', currentResult: '6.5亿港币', isCompliant: true, isActive: true, targetScope: '风险管理部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r5', index: 5, category: '高收益债资金投入规模', description: '', indicator: '2亿港币', limitValue: '2亿港币', currentResult: '1.2亿港币', isCompliant: true, isActive: false, targetScope: '固收部', operator: '≤', reportStatus: 'Not-Applicable' },
  { id: 'r6', index: 6, category: '境外债', description: '', indicator: '15亿港币', limitValue: '15亿港币', currentResult: '12亿港币', isCompliant: true, isActive: true, targetScope: '全球业务部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r7', index: 7, category: '债券通（含点心债）', description: '', indicator: '30% * 证券公司速动资金', limitValue: '30%', currentResult: '35%', isCompliant: false, isActive: true, parameterLabel: '证券公司速动资金', parameterValue: '500.00', targetScope: '固收部', operator: '≤', reportStatus: 'Non-Compliant' },
  { id: 'r8', index: 8, category: '单一发行主体资金投入规模集中度', description: '按主体加总', indicator: '1亿港币', limitValue: '1亿港币', currentResult: '0.85亿港币', isCompliant: true, isActive: true, targetScope: '所有部门', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r9', index: 9, category: 'DV01限额', description: '', indicator: '120万港币', limitValue: '120万港币', currentResult: '95万港币', isCompliant: true, isActive: true, targetScope: '交易员-李四', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r10', index: 10, category: '回购金额', description: '存续回购规模', indicator: '6亿港币', limitValue: '6亿港币', currentResult: '5.2亿港币', isCompliant: true, isActive: false, parameterLabel: '存续回购规模', parameterValue: '6.00', targetScope: '固收部', operator: '≤', reportStatus: 'Not-Applicable' },
  { id: 'r11', index: 11, category: '地产类总买入成本', description: '（总维度） 按买入成本计算', indicator: '30% * 组合规模', limitValue: '30%', currentResult: '18%', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r12', index: 12, category: '城投类总买入成本', description: '按买入成本计算 （手动维护）', indicator: '60% * 组合规模', limitValue: '60%', currentResult: '45%', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r13', index: 13, category: '金融类总买入成本', description: '按买入成本计算', indicator: '50% * 组合规模', limitValue: '50%', currentResult: '35%', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r14', index: 14, category: '其他类总买入成本', description: '按买入成本计算', indicator: '50% * 组合规模', limitValue: '50%', currentResult: '28%', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r15', index: 15, category: '国债/政策性金融债总买入成本', description: '按买入成本计算', indicator: '-', limitValue: '-', currentResult: '-', isCompliant: true, isActive: false, targetScope: '固收部', operator: '=', reportStatus: 'Not-Applicable' },
  { id: 'r16', index: 16, category: '地產类 单主体买入成本', description: '（按单一发行人计算） 按买入成本计算', indicator: '1亿港币', limitValue: '1亿港币', currentResult: '1.2亿港币', isCompliant: false, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Non-Compliant' },
  { id: 'r17', index: 17, category: '城投类 单主体买入成本', description: '按买入成本计算', indicator: '1亿港币', limitValue: '1亿港币', currentResult: '0.75亿港币', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r18', index: 18, category: '金融类 单主体买入成本', description: '按买入成本计算', indicator: '1亿港币', limitValue: '1亿港币', currentResult: '0.4亿港币', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r19', index: 19, category: '其他类 单主体买入成本', description: '按买入成本计算', indicator: '1亿港币', limitValue: '1亿港币', currentResult: '0.3亿港币', isCompliant: true, isActive: true, targetScope: '固收部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r20', index: 20, category: '外部主体评级B3/B-及以下级别（债项或主体孰高）投资规模占整个投资组合占比', description: '', indicator: '10%', limitValue: '10%', currentResult: '7.5%', isCompliant: true, isActive: true, targetScope: '风险管理部', operator: '≤', reportStatus: 'Compliant' },
  { id: 'r21', index: 21, category: '外部主体评级B3/B-及以下级别（债项或主体孰高）的信用债（不含高收益债）数量（买入控制，不含持有期间债券评级降低的情形）', description: '', indicator: '5只', limitValue: '5只', currentResult: '3只', isCompliant: true, isActive: true, targetScope: '风险管理部', operator: '≤', reportStatus: 'Compliant' }
];

export const NAV_ITEMS: NavMenu[] = [
  { 
    name: '交易管理', 
    children: [
      { 
        name: '交易执行', 
        children: ['新录交易', '查看状态（新）', '确认状态'] 
      },
      { 
        name: '现券管理', 
        children: ['BOOK流水', '交易审批', '自营报表'] 
      }
    ] 
  },
  {
    name: '风控管理',
    children: [
      { name: '限额管理' }
    ]
  },
  { 
    name: '数据维护', 
    children: [
      { name: '机构数据' },
      { name: '债券数据' },
      { 
        name: '文本识别管理', 
        children: ['对手方交易员（废弃）', '机构名称'] 
      }
    ] 
  },
  { 
    name: '个人中心', 
    children: [
      { name: '用户部门管理' },
      { name: '角色权限管理' },
      { name: '菜单按钮配置' }
    ] 
  }
];

export const MOCK_BOOK_RECORDS: BookRecord[] = [
  {
    id: 'bk1',
    index: 1,
    auditStatus: '审批通过',
    creationTime: '2026-04-09 10:00',
    bondName: '腾讯控股 3.975%',
    bondCode: 'US88033GCT79',
    isin: 'US88033GCT79',
    side: '买入',
    yield: '4.10%',
    cleanPrice: '98.50',
    fullPrice: '99.10',
    amount: '500',
    currency: 'USD',
    internalAccount: '王芳',
    user: '王芳',
    marketMaker: '中金香港',
    counterparty: '高盛 (亚洲)',
    tradeDate: '2026-04-09',
    executionDate: '2026-04-10',
    settlementSpeed: 'T+1',
    settlementDate: '2026-04-10',
    operationTime: '2026-04-09 10:05',
    remarks: '常规买入操作'
  },
  {
    id: 'bk2',
    index: 2,
    auditStatus: '新建',
    creationTime: '2026-04-09 11:30',
    bondName: '阿里巴巴 3.40%',
    bondCode: 'US01609WAP77',
    isin: 'US01609WAP77',
    side: '卖出',
    yield: '3.55%',
    cleanPrice: '97.80',
    fullPrice: '98.40',
    amount: '1000',
    currency: 'USD',
    internalAccount: '李静',
    user: '李静',
    marketMaker: '中金香港',
    counterparty: '摩根士丹利',
    tradeDate: '2026-04-09',
    executionDate: '2026-04-09',
    settlementSpeed: 'T+0',
    settlementDate: '2026-04-09',
    operationTime: '2026-04-09 11:35',
    remarks: '获利了结'
  },
  {
    id: 'bk3',
    index: 3,
    auditStatus: '审批中',
    creationTime: '2026-04-10 09:00',
    bondName: '美团 3.05%',
    bondCode: 'US58543RAB03',
    isin: 'US58543RAB03',
    side: '买入',
    yield: '3.20%',
    cleanPrice: '96.50',
    fullPrice: '97.10',
    amount: '300',
    currency: 'USD',
    internalAccount: '刘洋',
    user: '刘洋',
    marketMaker: '中金香港',
    counterparty: '摩根大通',
    tradeDate: '2026-04-10',
    executionDate: '2026-04-10',
    settlementSpeed: 'T+0',
    settlementDate: '2026-04-10',
    operationTime: '2026-04-10 09:05',
    remarks: '补仓'
  },
  {
    id: 'bk4',
    index: 4,
    auditStatus: '新建',
    creationTime: '2026-04-10 14:00',
    bondName: '百度 4.375%',
    bondCode: 'US056752AK40',
    isin: 'US056752AK40',
    side: '卖出',
    yield: '4.50%',
    cleanPrice: '99.20',
    fullPrice: '99.80',
    amount: '800',
    currency: 'USD',
    internalAccount: '陈杰',
    user: '陈杰',
    marketMaker: '中金香港',
    counterparty: '瑞银集团',
    tradeDate: '2026-04-10',
    executionDate: '2026-04-11',
    settlementSpeed: 'T+1',
    settlementDate: '2026-04-11',
    operationTime: '2026-04-10 14:10',
    remarks: '调仓'
  },
  {
    id: 'bk5',
    index: 5,
    auditStatus: '新建',
    creationTime: '2026-04-10 16:30',
    bondName: '京东 3.375%',
    bondCode: 'US47215PAB37',
    isin: 'US47215PAB37',
    side: '买入',
    yield: '3.45%',
    cleanPrice: '98.10',
    fullPrice: '98.70',
    amount: '600',
    currency: 'USD',
    internalAccount: '赵敏',
    user: '赵敏',
    marketMaker: '中金香港',
    counterparty: '花旗银行',
    tradeDate: '2026-04-10',
    executionDate: '2026-04-12',
    settlementSpeed: 'T+2',
    settlementDate: '2026-04-12',
    operationTime: '2026-04-10 16:35',
    remarks: '长期持有'
  }
];

export const MOCK_CONFIRM_RECORDS: ConfirmRecord[] = [
  {
    id: 'cf1',
    index: 1,
    status: '交易员审批',
    currentHandler: '交易员',
    creationTime: '2026-05-06 14:25',
    bondName: '中国主权债 3.787%',
    bondCode: '46625HAM6',
    isin: 'US46625HAM60',
    side: '买入',
    yield: '3.12%',
    cleanPrice: '100.25',
    fullPrice: '101.45',
    valuation: '101.7212',
    amount: '500',
    currency: 'USD',
    counterparty: '中国银行 (香港) 有限公司',
    settlementAmount: '50725.00',
    tradeDate: '2026/05/06',
    executionDate: '2026/05/07',
    settlementSpeed: 'T+1',
    user: '李静',
    businessType: '自营',
    internalAccount: '李静',
    executor: '王执行',
    remarks: '该笔交易已核对无误，等待交易员审批'
  },
  {
    id: 'cf2',
    index: 2,
    status: '投资经理审批',
    currentHandler: '投资经理',
    creationTime: '2026-05-07 10:10',
    bondName: '国开债 210210',
    bondCode: '210210',
    isin: 'CND10004BDM1',
    side: '卖出',
    yield: '2.85%',
    cleanPrice: '99.85',
    fullPrice: '100.12',
    valuation: '99.90',
    amount: '1000',
    currency: 'CNY',
    counterparty: '工商银行',
    settlementAmount: '10012000.00',
    tradeDate: '2026/05/07',
    executionDate: '2026/05/07',
    settlementSpeed: 'T+0',
    user: '赵敏',
    businessType: '自营',
    internalAccount: '赵敏',
    executor: '李交易',
    remarks: '交易员已过，请投资经理审批'
  },
  {
    id: 'cf3',
    index: 3,
    status: '风控审批',
    currentHandler: '风控',
    creationTime: '2026-05-06 09:30',
    bondName: '农发债 200405',
    bondCode: '200405',
    isin: 'CND10003BDM3',
    side: '买入',
    yield: '3.05%',
    cleanPrice: '102.10',
    fullPrice: '103.50',
    valuation: '102.05',
    amount: '2000',
    currency: 'CNY',
    counterparty: '建设银行',
    settlementAmount: '20700000.00',
    tradeDate: '2026/05/06',
    executionDate: '2026/05/06',
    settlementSpeed: 'T+0',
    user: '周通',
    businessType: '自营',
    internalAccount: '周通',
    executor: '张三',
    remarks: '大额交易，需风控审批',
    triggeredLimit: true
  },
  {
    id: 'cf4',
    index: 4,
    status: '审批通过',
    currentHandler: '无',
    creationTime: '2026-05-07 11:20',
    bondName: '进出口 210312',
    bondCode: '210312',
    isin: 'CND10005BDM5',
    side: '卖出',
    yield: '2.95%',
    cleanPrice: '100.50',
    fullPrice: '101.00',
    valuation: '100.55',
    amount: '800',
    currency: 'CNY',
    counterparty: '交通银行',
    settlementAmount: '8080000.00',
    tradeDate: '2026/05/07',
    executionDate: '2026/05/07',
    settlementSpeed: 'T+0',
    user: '孙亮',
    businessType: '自营',
    internalAccount: '孙亮',
    executor: '李执行',
    remarks: '流程已全部走完',
    triggeredLimit: true
  },
  {
    id: 'cf5',
    index: 5,
    status: '交易员审批',
    currentHandler: '交易员',
    creationTime: '2026-05-01 14:00',
    bondName: '中广核 2.15%',
    bondCode: '012100',
    isin: 'CND10002BDM2',
    side: '买入',
    yield: '2.45%',
    cleanPrice: '98.75',
    fullPrice: '99.20',
    valuation: '98.80',
    amount: '1200',
    currency: 'CNY',
    counterparty: '招商银行',
    settlementAmount: '11904000.00',
    tradeDate: '2026/05/01',
    executionDate: '2026/05/02',
    settlementSpeed: 'T+1',
    user: '陈杰',
    businessType: '自营',
    internalAccount: '陈杰',
    executor: '王明',
    remarks: '请尽快处理'
  },
  {
    id: 'cf6',
    index: 6,
    status: '风控审批',
    currentHandler: '风控',
    creationTime: '2026-05-05 16:30',
    bondName: '腾讯控股 2030',
    bondCode: 'TENCENT',
    isin: 'US88032XAD17',
    side: '卖出',
    yield: '4.50%',
    cleanPrice: '95.20',
    fullPrice: '96.50',
    valuation: '95.10',
    amount: '300',
    currency: 'USD',
    counterparty: 'Morgan Stanley',
    settlementAmount: '289500.00',
    tradeDate: '2026/05/05',
    executionDate: '2026/05/05',
    settlementSpeed: 'T+0',
    user: '刘洋',
    businessType: '自营',
    internalAccount: '刘洋',
    executor: '执行A',
    remarks: '核对中'
  },
  {
    id: 'cf7',
    index: 7,
    status: '投资经理审批',
    currentHandler: '投资经理',
    creationTime: '2026-05-07 09:00',
    bondName: '阿里巴巴 2027',
    bondCode: 'BABA',
    isin: 'US01609WAU25',
    side: '买入',
    yield: '3.40%',
    cleanPrice: '97.50',
    fullPrice: '98.10',
    valuation: '97.60',
    amount: '500',
    currency: 'USD',
    counterparty: 'BOCI',
    settlementAmount: '490500.00',
    tradeDate: '2026/05/07',
    executionDate: '2026/05/07',
    settlementSpeed: 'T+0',
    user: '张亮',
    businessType: '自营',
    internalAccount: '张亮',
    executor: '王五',
    remarks: '今日到期'
  },
  {
    id: 'cf8',
    index: 8,
    status: '交易员审批',
    currentHandler: '交易员',
    creationTime: '2026-05-07 08:30',
    bondName: '美团 2030',
    bondCode: 'MEITUAN',
    isin: 'US58733RAA42',
    side: '卖出',
    yield: '3.05%',
    cleanPrice: '96.20',
    fullPrice: '96.80',
    valuation: '96.30',
    amount: '200',
    currency: 'USD',
    counterparty: 'HSBC',
    settlementAmount: '193600.00',
    tradeDate: '2026/05/07',
    executionDate: '2026/05/08',
    settlementSpeed: 'T+1',
    user: '赵钱',
    businessType: '自营',
    internalAccount: '赵钱',
    executor: '孙李',
    remarks: '明日到期'
  },
  {
    id: 'cf9',
    index: 9,
    status: '投资经理审批',
    currentHandler: '投资经理',
    creationTime: '2026-05-04 11:00',
    bondName: '小米 2030',
    bondCode: 'XIAOMI',
    isin: 'US98422DAA41',
    side: '买入',
    yield: '3.40%',
    cleanPrice: '94.50',
    fullPrice: '95.10',
    valuation: '94.60',
    amount: '400',
    currency: 'USD',
    counterparty: 'SPDB',
    settlementAmount: '380400.00',
    tradeDate: '2026/05/04',
    executionDate: '2026/05/05',
    settlementSpeed: 'T+1',
    user: '周吴',
    businessType: '自营',
    internalAccount: '周吴',
    executor: '郑王',
    remarks: '历史积压'
  },
  {
    id: 'cf10',
    index: 10,
    status: '风控审批',
    currentHandler: '风控',
    creationTime: '2026-05-07 10:45',
    bondName: '商汤 2026',
    bondCode: 'SENSETIME',
    isin: 'XS2345678901',
    side: '买入',
    yield: '4.20%',
    cleanPrice: '99.00',
    fullPrice: '99.60',
    valuation: '99.10',
    amount: '1500',
    currency: 'USD',
    counterparty: 'CS',
    settlementAmount: '1494000.00',
    tradeDate: '2026/05/07',
    executionDate: '2026/05/07',
    settlementSpeed: 'T+0',
    user: '冯陈',
    businessType: '自营',
    internalAccount: '冯陈',
    executor: '褚卫',
    remarks: '常规审批'
  }
];
