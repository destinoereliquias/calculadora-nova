/** CONFIG - TODAS AS TAXAS, COMISSOES E FRETES DA CALCULADORA
 *  Edite SOMENTE este arquivo para alterar qualquer valor.
 *  O motor (calculadora.js) le tudo daqui automaticamente. */

// GLOBAIS
var MARGEM_PADRAO = 30;
var NIVEL_DESCONTO = { 5: 0.85, 4: 0.90, 3: 0.95, 2: 1.00, 1: 1.05 };

// ALIQUOTA DE IMPOSTOS POR CNPJ (%)
var CNPJ_ALIQUOTAS = {
  "LOJA DA VIVI LTDA": 12,
  "FERREIRA PROSPERITA COSMETICOS LTDA": 12,
  "RAV SHEFA DISTRIBUIDORA DE COSMETICOS LTDA": 10,
  "VIVIANE CHRISTINA FERREIRA": 12
};

// PRESENCIAL
var PRESENCIAL = { comissao: 0, taxaFixa: 0, frete: 0 };

// AMAZON
var AMAZON = { comissao: 15, frete: { ate30: 15, ate50: 12, ate79: 8, acima79: 5 } };

// CASAS BAHIA
var CASAS_BAHIA = { comissao: 10, taxaFixa: 2, frete: { ate69: 20, acima69: 0 } };

// MAGALU
var MAGALU = { comissao: 12, taxaFixa: { ate10: 3, acima10: 5 }, frete: { ate79: 15, acima79: 8 } };

// MERCADO LIVRE (NOVO: peso x preco)
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
    
