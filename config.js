var MARGEM_PADRAO = 30;
var NIVEL_DESCONTO = { 5: 0.85, 4: 0.90, 3: 0.95, 2: 1.00, 1: 1.05 };
var CNPJ_ALIQUOTAS = {
  "LOJA DA VIVI LTDA": 12,
  "FERREIRA PROSPERITA COSMETICOS LTDA": 12,
  "RAV SHEFA DISTRIBUIDORA DE COSMETICOS LTDA": 10,
  "VIVIANE CHRISTINA FERREIRA": 12
};
var PRESENCIAL = { comissao: 0, taxaFixa: 0, frete: 0 };
var AMAZON = { comissao: 15, frete: { ate30: 15, ate50: 12, ate79: 8, acima79: 5 } };
var CASAS_BAHIA = { comissao: 10, taxaFixa: 2, frete: { ate69: 20, acima69: 0 } };
var MAGALU = { comissao: 12, taxaFixa: { ate10: 3, acima10: 5 }, frete: { ate79: 15, acima79: 8 } };
var MERCADO_LIVRE = {
  comissao: { classico: 13, premium: 17.5 },
  faixasPreco: [
    { limite: 18.99 }, { limite: 48.99 }, { limite: 78.99 }, { limite: 99.99 },
    { limite: 119.99 }, { limite: 149.99 }, { limite: 199.99 }, { limite: Infinity }
  ],
  faixasPeso: [
    { pesoMax: 0.3,  custos: [5.65, 6.85, 8.15, 12.95, 14.95, 16.95, 19.05, 21.65] },
    { pesoMax: 0.5,  custos: [5.95, 6.95, 8.25, 13.85, 16.15, 18.15, 20.45, 23.25] },
    { pesoMax: 1,    custos: [6.05, 7.15, 8.45, 14.45, 16.85, 19.05, 21.35, 24.45] },
    { pesoMax: 1.5,  custos: [6.15, 7.35, 8.65, 14.75, 17.15, 19.45, 21.75, 25.45] },
    { pesoMax: 2,    custos: [6.25, 7.45, 8.75, 15.05, 17.65, 19.85, 22.25, 25.55] },
    { pesoMax: 3,    custos: [6.35, 8.65, 9.15, 16.45, 19.15, 21.65, 24.35, 27.05] },
    { pesoMax: 4,    custos: [6.45, 8.75, 9.75, 17.85, 20.75, 23.35, 26.35, 29.25] },
    { pesoMax: 5,    custos: [6.55, 8.85, 10.25, 19.75, 22.85, 26.05, 29.25, 32.45] },
    { pesoMax: 6,    custos: [6.65, 8.95, 10.35, 25.95, 29.15, 33.35, 36.45, 40.85] },
    { pesoMax: 7,    custos: [6.75, 9.05, 10.45, 27.55, 30.75, 35.15, 38.25, 42.85] },
    { pesoMax: 8,    custos: [6.85, 9.25, 10.65, 29.45, 32.95, 37.45, 40.85, 45.85] },
    { pesoMax: 9,    custos: [6.95, 9.45, 10.85, 30.25, 33.95, 38.65, 42.25, 47.45] },
    { pesoMax: 10,   custos: [7.05, 9.65, 11.05, 38.25, 42.65, 48.85, 52.95, 59.45] },
    { pesoMax: 11,   custos: [7.05, 9.65, 11.05, 41.65, 48.55, 55.45, 62.35, 69.35] },
    { pesoMax: 13,   custos: [7.15, 10.05, 11.45, 42.55, 49.75, 56.85, 63.85, 70.95] },
    { pesoMax: 15,   custos: [7.25, 10.25, 11.65, 45.55, 52.95, 60.55, 68.15, 75.65] },
    { pesoMax: 17,   custos: [7.35, 10.45, 11.85, 48.95, 56.55, 64.05, 71.35, 79.35] },
    { pesoMax: 20,   custos: [7.45, 10.65, 12.05, 55.15, 64.35, 73.55, 82.75, 91.95] },
    { pesoMax: 25,   custos: [7.65, 11.05, 12.25, 64.55, 75.75, 85.45, 96.25, 106.85] },
    { pesoMax: 30,   custos: [7.75, 11.25, 12.45, 66.45, 76.05, 86.25, 97.15, 107.85] },
    { pesoMax: 40,   custos: [7.85, 11.45, 12.65, 68.35, 79.65, 89.75, 100.05, 107.95] },
    { pesoMax: 50,   custos: [7.95, 11.65, 12.85, 70.95, 81.85, 92.85, 103.45, 111.65] },
    { pesoMax: 60,   custos: [8.05, 11.85, 13.05, 75.55, 87.25, 99.05, 110.25, 119.05] },
    { pesoMax: 70,   custos: [8.15, 12.05, 13.25, 80.95, 93.75, 105.95, 118.05, 127.45] },
    { pesoMax: 80,   custos: [8.25, 12.25, 13.45, 84.65, 97.95, 110.75, 123.35, 133.15] },
    { pesoMax: 90,   custos: [8.35, 12.45, 13.65, 94.05, 108.35, 122.95, 136.95, 147.85] },
    { pesoMax: 100,  custos: [8.45, 12.65, 13.85, 107.45, 124.85, 140.45, 156.45, 168.85] },
    { pesoMax: 125,  custos: [8.55, 12.85, 14.05, 120.15, 138.95, 156.95, 174.85, 188.85] },
    { pesoMax: 150,  custos: [8.65, 12.85, 14.25, 127.45, 147.05, 166.55, 185.55, 200.35] },
    { pesoMax: Infinity, custos: [8.75, 12.85, 14.45, 167.05, 193.35, 218.45, 243.45, 262.85] }
  ]
};
var OLIST = { comissao: 10, taxaFixa: 2, frete: { ate79: 15, acima79: 8 } };
var RD = { comissao: 8, frete: 10 };
var SHEIN = { comissao: 12, taxaFixa: 2, frete: { ate49: 12, acima49: 8 } };
var SHOPEE = { comissao: { ate79: 14, acima79: 16 }, taxaFixa: { ate79: 4, ate99: 5, ate199: 6, acima200: 8 }, frete: 12 };
var TEMU = { comissao: 0, taxaFixa: 0, frete: 0 };
var TIKTOK = { comissao: { ate50: 10, acima50: 6 }, taxaFixa: { ate50: 4, acima50: 6 }, frete: 10 };
var CANAIS = {
  presencial: PRESENCIAL,
  amazon: AMAZON,
  casasBahia: CASAS_BAHIA,
  magalu: MAGALU,
  mercadoLivre: MERCADO_LIVRE,
  olist: OLIST,
  rd: RD,
  shein: SHEIN,
  shopee: SHOPEE,
  temu: TEMU,
  tiktok: TIKTOK
};
