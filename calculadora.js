/**
 * CALCULADORA — MOTOR DE CÁLCULO
 *
 * Lê os valores de config.js e calcula os preços dos canais
 * nos 3 modos (Manual, Valor Líquido, Percentual).
 * Edite apenas o config.js para mudar taxas.
 */

// Converte "1.234,56" ou "1234.56" em número
function parseNumero(texto) {
  if (typeof texto === "number") return texto;
  let v = String(texto).trim().replace(/[^\d.,-]/g, "");
  if (v.includes(".") && v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
  else if (v.includes(",")) v = v.replace(",", ".");
  return parseFloat(v) || 0;
}

// Formata como moeda brasileira
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Custo de envio do Mercado Livre pela tabela peso x preço
function custoEnvioML(pesoKg, precoProduto) {
  const linha = MERCADO_LIVRE.faixasPeso.find((f) => pesoKg <= f.pesoMax);
  const coluna = MERCADO_LIVRE.faixasPreco.findIndex((f) => precoProduto <= f.limite);
  return linha.custos[coluna];
}

// Escolhe valor por faixa de preço (objeto {ateX, acimaY} ou número fixo)
function porFaixa(obj, preco) {
  if (typeof obj === "number") return obj;
  const chaves = Object.keys(obj).sort((a, b) => {
    const na = parseFloat(a.replace("ate", "").replace("acima", "999999"));
    const nb = parseFloat(b.replace("ate", "").replace("acima", "999999"));
    return na - nb;
  });
  for (const chave of chaves) {
    if (chave.startsWith("ate") && preco <= parseFloat(chave.replace("ate", ""))) return obj[chave];
  }
  return obj.acima79 ?? obj.acima50 ?? obj.acima200 ?? obj.acima69 ?? obj.acima49 ?? 0;
}

// Cálculo principal
function calcularPreco(entradas) {
  const {
    custo, cnpj, nivel = 5, pesoKg = 0, plano = "classico",
    modo = "manual", valorManual = 0, valorLiq = 0, pctLiq = 0,
    margem = MARGEM_PADRAO,
  } = entradas;

  const aliquota = (CNPJ_ALIQUOTAS[cnpj] ?? 12) / 100;
  const constNivel = NIVEL_DESCONTO[nivel] ?? 1;
  const resultados = {};

  for (const [canal, cfg] of Object.entries(CANAIS)) {
    // Comissão do canal
    let comissaoPct;
    if (typeof cfg.comissao === "number") comissaoPct = cfg.comissao;
    else if (cfg.comissao[plano] !== undefined) comissaoPct = cfg.comissao[plano];
    else comissaoPct = porFaixa(cfg.comissao, 0);

    const denominador = 1 - aliquota - comissaoPct / 100;

    // Frete (ML usa peso x preço; demais usam faixa de preço)
    const fretePara = (preco) => {
      if (canal === "mercadoLivre") return custoEnvioML(pesoKg, preco);
      if (typeof cfg.frete === "number") return cfg.frete;
      return porFaixa(cfg.frete, preco) * constNivel;
    };

    // Taxa fixa
    const taxaPara = (preco) => (cfg.taxaFixa ? porFaixa(cfg.taxaFixa, preco) : 0);

    // Modo MANUAL: quanto sobra
    if (modo === "manual") {
      const frete = fretePara(valorManual);
      const taxa = taxaPara(valorManual);
      const liquido = valorManual * (1 - aliquota - comissaoPct / 100) - custo - frete - taxa;
      resultados[canal] = { valor: liquido, frete, taxa };
    }

    // Modo VALOR LÍQUIDO: preço para receber X
    if (modo === "valorLiq") {
      const frete = fretePara(valorLiq);
      const taxa = taxaPara(valorLiq);
      const preco = (valorLiq + custo + frete + taxa) / denominador;
      resultados[canal] = { valor: preco, frete, taxa };
    }

    // Modo PERCENTUAL: preço para margem X%
    if (modo === "pctLiq") {
      const custoComMargem = custo * (1 + pctLiq / 100);
      const frete = fretePara(custoComMargem);
      const taxa = taxaPara(custoComMargem);
      const preco = (custoComMargem + frete + taxa) / denominador;
      resultados[canal] = { valor: preco, frete, taxa };
    }
  }

  return resultados;
}
