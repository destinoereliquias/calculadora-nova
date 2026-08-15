/** CALCULADORA - MOTOR DE CALCULO
 *  Le os valores de config.js e calcula os precos dos canais
 *  nos 3 modos (Manual, Valor Liquido, Percentual) de uma vez.
 *  Edite apenas o config.js para mudar taxas. */

// Converte "1.234,56" ou "1234.56" em numero
function parseNumero(texto) {
  if (typeof texto === "number") return texto;
  var v = String(texto).trim().replace(/[^\d.,-]/g, "");
  if (v.indexOf(".") !== -1 && v.indexOf(",") !== -1) v = v.replace(/\./g, "").replace(",", ".");
  else if (v.indexOf(",") !== -1) v = v.replace(",", ".");
  return parseFloat(v) || 0;
}

// Formata como moeda brasileira
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Custo de envio do Mercado Livre pela tabela peso x preco
function custoEnvioML(pesoKg, precoProduto) {
  var linha = MERCADO_LIVRE.faixasPeso.find(function (f) { return pesoKg <= f.pesoMax; });
  var coluna = MERCADO_LIVRE.faixasPreco.findIndex(function (f) { return precoProduto <= f.limite; });
  return linha.custos[coluna];
}

// Escolhe valor por faixa de preco (objeto {ateX, acimaY} ou numero fixo)
function porFaixa(obj, preco) {
  if (typeof obj === "number") return obj;
  var chaves = Object.keys(obj).sort(function (a, b) {
    var na = parseFloat(a.replace("ate", "").replace("acima", "999999"));
    var nb = parseFloat(b.replace("ate", "").replace("acima", "999999"));
    return na - nb;
  });
  for (var i = 0; i < chaves.length; i++) {
    var chave = chaves[i];
    if (chave.indexOf("ate") === 0 && preco <= parseFloat(chave.replace("ate", ""))) return obj[chave];
  }
  return obj.acima79 != null ? obj.acima79
    : obj.acima50 != null ? obj.acima50
    : obj.acima200 != null ? obj.acima200
    : obj.acima69 != null ? obj.acima69
    : obj.acima49 != null ? obj.acima49 : 0;
}

// Calculo principal - retorna os 3 modos juntos por canal
function calcularPreco(entradas) {
  var custo = entradas.custo || 0;
  var cnpj = entradas.cnpj || "";
  var nivel = entradas.nivel || 5;
  var pesoKg = entradas.pesoKg || 0;
  var plano = entradas.plano || "classico";
  var valorManual = entradas.valorManual || 0;
  var valorLiq = entradas.valorLiq || 0;
  var pctLiq = entradas.pctLiq || 0;

  var aliquota = (CNPJ_ALIQUOTAS[cnpj] != null ? CNPJ_ALIQUOTAS[cnpj] : 12) / 100;
  var constNivel = NIVEL_DESCONTO[nivel] != null ? NIVEL_DESCONTO[nivel] : 1;
  var resultados = {};

  Object.keys(CANAIS).forEach(function (canal) {
    var cfg = CANAIS[canal];

    // Comissao do canal
    var comissaoPct;
    if (typeof cfg.comissao === "number") comissaoPct = cfg.comissao;
    else if (cfg.comissao[plano] !== undefined) comissaoPct = cfg.comissao[plano];
    else comissaoPct = porFaixa(cfg.comissao, 0);

    var denominador = 1 - aliquota - comissaoPct / 100;

    // Frete (ML usa peso x preco; demais usam faixa de preco)
    function fretePara(preco) {
      if (canal === "mercadoLivre") return custoEnvioML(pesoKg, preco);
      if (typeof cfg.frete === "number") return cfg.frete;
      return porFaixa(cfg.frete, preco) * constNivel;
    }

    // Taxa fixa
    function taxaPara(preco) {
      if (cfg.taxaFixa) return porFaixa(cfg.taxaFixa, preco);
      return 0;
    }

    // Modo MANUAL: quanto sobra
    var manual = null;
    if (valorManual > 0) {
      var frete1 = fretePara(valorManual);
      var taxa1 = taxaPara(valorManual);
      manual = valorManual * (1 - aliquota - comissaoPct / 100) - custo - frete1 - taxa1;
    }

    // Modo VALOR LIQUIDO: preco para receber X
    var vliq = null;
    if (valorLiq > 0) {
      var frete2 = fretePara(valorLiq);
      var taxa2 = taxaPara(valorLiq);
      vliq = (valorLiq + custo + frete2 + taxa2) / denominador;
    }

    // Modo PERCENTUAL: preco para margem X%
    var pct = null;
    if (pctLiq > 0) {
      var custoComMargem = custo * (1 + pctLiq / 100);
      var frete3 = fretePara(custoComMargem);
      var taxa3 = taxaPara(custoComMargem);
      pct = (custoComMargem + frete3 + taxa3) / denominador;
    }

    resultados[canal] = { manual: manual, vliq: vliq, pct: pct };
  });

  return resultados;
}
