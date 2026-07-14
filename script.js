// ============================
// CALCULADORA DE DIAS ÚTEIS
// ============================

function pad(n) {
    return String(n).padStart(2, "0");
}

// ---------------------------
// Máscara dd/mm/aaaa para os campos de data em texto
function aplicarMascaraData(event) {
    const input = event.target;
    const digitos = input.value.replace(/\D/g, "").slice(0, 8);

    let formatado = digitos;
    if (digitos.length > 4) {
        formatado = `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
    } else if (digitos.length > 2) {
        formatado = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    }
    input.value = formatado;
}

// ---------------------------
// Conversões entre dd/mm/aaaa (exibição) e aaaa-mm-dd (ISO, usado nos cálculos)
function converterBRparaISO(valorBR) {
    if (!valorBR) return null;

    const partes = valorBR.split("/");
    if (partes.length !== 3) return null;

    const [dd, mm, yyyy] = partes;
    if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) return null;

    const dia = parseInt(dd, 10);
    const mes = parseInt(mm, 10);
    const ano = parseInt(yyyy, 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;
    if (mes < 1 || mes > 12) return null;

    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) return null;

    return `${ano}-${pad(mes)}-${pad(dia)}`;
}

function converterISOparaBR(valorISO) {
    if (!valorISO) return "";
    const [yyyy, mm, dd] = valorISO.split("-");
    return `${dd}/${mm}/${yyyy}`;
}

function obterDataISO(id) {
    const input = document.getElementById(id);
    return converterBRparaISO(input.value.trim());
}

// ---------------------------
// Sincronização com o seletor de calendário nativo (oculto)
function abrirCalendario(idBase) {
    const picker = document.getElementById(`${idBase}_picker`);
    const iso = obterDataISO(idBase);

    if (iso) picker.value = iso;

    if (picker.showPicker) {
        picker.showPicker();
    } else {
        picker.focus();
        picker.click();
    }
}

function onPickerChange(idBase) {
    const picker = document.getElementById(`${idBase}_picker`);
    const textInput = document.getElementById(idBase);

    if (picker.value) {
        textInput.value = converterISOparaBR(picker.value);
        calcularDiasUteisEntreDatasAuto();
        calcularDataFinalAuto();
    }
}

// ---------------------------
// Feriados
function ehFeriado(data) {
    const formato = `${pad(data.getDate())}-${pad(data.getMonth() + 1)}-${data.getFullYear()}`;
    return FERIADOS.includes(formato);
}

function garantirFeriadosAno(ano) {
    if (!FERIADOS.some(f => f.endsWith(`-${ano}`))) {
        adicionarFeriadosAno(ano);
    }
}

// ---------------------------
// Mensagens de resultado (sem alert, para não interromper a digitação)
function mostrarResultado(mensagem, erro = false) {
    const el = document.getElementById("resultado");
    el.innerText = mensagem;
    el.classList.toggle("erro", erro);
}

// ---------------------------
// Conta os dias úteis entre duas datas (inclui o último dia informado).
// Retorna null se a data final não for posterior à inicial.
function contarDiasUteisEntre(inicioISO, fimISO, contarInicio) {
    let inicio = new Date(inicioISO + "T00:00:00");
    let fim = new Date(fimISO + "T00:00:00");

    if (fim <= inicio) return null;

    let dataAtual = new Date(inicio);
    if (!contarInicio) dataAtual.setDate(dataAtual.getDate() + 1);

    let diasUteis = 0;

    while (dataAtual <= fim) {
        garantirFeriadosAno(dataAtual.getFullYear());

        const diaSemana = dataAtual.getDay();
        const fimSemana = (diaSemana === 0 || diaSemana === 6);

        if (!fimSemana && !ehFeriado(dataAtual)) {
            diasUteis++;
        }

        dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return diasUteis;
}

// Calcula dias úteis entre duas datas (ação explícita do botão, com mensagens de erro)
function calcularDiasUteisEntreDatas() {
    const inicioISO = obterDataISO("dataInicio");
    const fimISO = obterDataISO("dataFim");
    const contarInicio = document.getElementById("contarInicio").checked;

    if (!inicioISO || !fimISO) {
        mostrarResultado("Informe as duas datas completas (dd/mm/aaaa).", true);
        return;
    }

    const diasUteis = contarDiasUteisEntre(inicioISO, fimISO, contarInicio);

    if (diasUteis === null) {
        mostrarResultado("A data final deve ser posterior à inicial.", true);
        return;
    }

    mostrarResultado(`Dias úteis: ${diasUteis}`);
}

// Recalcula os dias úteis entre datas automaticamente (ex.: ao marcar/desmarcar
// "contar data inicial"), sem mensagens de erro enquanto os campos estão incompletos.
function calcularDiasUteisEntreDatasAuto() {
    const inicioISO = obterDataISO("dataInicio");
    const fimISO = obterDataISO("dataFim");

    if (!inicioISO || !fimISO) return;

    const contarInicio = document.getElementById("contarInicio").checked;
    const diasUteis = contarDiasUteisEntre(inicioISO, fimISO, contarInicio);

    if (diasUteis === null) return;

    mostrarResultado(`Dias úteis: ${diasUteis}`);
}

// ---------------------------
// Calcula a data final a partir de um prazo em dias úteis (automático, sem travar a digitação)
function calcularDataFinalAuto() {
    const prazoRaw = document.getElementById("prazoDiasUteis").value.trim();

    // Prazo vazio: essa calculadora não está em uso agora (o campo "Data fim"
    // pode estar sendo preenchido manualmente para "Dias úteis entre datas").
    // Não mexe em nada para não apagar o que o usuário já digitou.
    if (!prazoRaw) return;

    const inicioISO = obterDataISO("dataInicio");
    const prazoDiasUteis = parseInt(prazoRaw, 10);
    const contarInicio = document.getElementById("contarInicio").checked;

    if (!inicioISO || isNaN(prazoDiasUteis) || prazoDiasUteis < 1) {
        document.getElementById("dataFim").value = "";
        mostrarResultado("");
        return;
    }

    let dataAtual = new Date(inicioISO + "T00:00:00");
    if (!contarInicio) dataAtual.setDate(dataAtual.getDate() + 1);

    let diasContados = 0;

    while (diasContados < prazoDiasUteis) {
        garantirFeriadosAno(dataAtual.getFullYear());

        const diaSemana = dataAtual.getDay();
        const fimSemana = (diaSemana === 0 || diaSemana === 6);

        if (!fimSemana && !ehFeriado(dataAtual)) {
            diasContados++;
        }

        if (diasContados < prazoDiasUteis) {
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
    }

    const dataFinalISO = `${dataAtual.getFullYear()}-${pad(dataAtual.getMonth() + 1)}-${pad(dataAtual.getDate())}`;
    const dataFinalBR = converterISOparaBR(dataFinalISO);

    document.getElementById("dataFim").value = dataFinalBR;
    mostrarResultado(`Data final do prazo: ${dataFinalBR}`);
}

// ---------------------------
// Copiar "Data fim" para a área de transferência
function copiarDataFim() {
    const valor = document.getElementById("dataFim").value;
    if (!valor) return;

    const btn = document.getElementById("btnCopiarDataFim");

    function mostrarFeedback() {
        btn.classList.add("copiado");
        setTimeout(() => btn.classList.remove("copiado"), 1200);
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(valor).then(mostrarFeedback).catch(() => copiarFallback(valor, mostrarFeedback));
    } else {
        copiarFallback(valor, mostrarFeedback);
    }
}

function copiarFallback(valor, callback) {
    const temp = document.createElement("textarea");
    temp.value = valor;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();

    try {
        document.execCommand("copy");
        callback();
    } catch (e) {
        // cópia não suportada neste navegador
    }

    document.body.removeChild(temp);
}

// ---------------------------
// Função para limpar campos
function limparCampos() {
    document.getElementById("dataInicio").value = "";
    document.getElementById("prazoDiasUteis").value = "";
    document.getElementById("dataFim").value = "";
    document.getElementById("contarInicio").checked = false;
    mostrarResultado("");
}

// ============================
// CALCULADORA DE HORAS
// ============================
function calcularPeriodoHoras() {
    const inicioVal = document.getElementById("horaInicio").value;
    const fimVal = document.getElementById("horaFim").value;
    const resultadoEl = document.getElementById("resultadoHoras");

    if (!inicioVal || !fimVal) {
        resultadoEl.innerText = "Informe as duas horas.";
        resultadoEl.classList.add("erro");
        return;
    }

    const [h1, m1] = inicioVal.split(":").map(Number);
    const [h2, m2] = fimVal.split(":").map(Number);

    const minutosInicio = h1 * 60 + m1;
    const minutosFim = h2 * 60 + m2;

    let diferenca = minutosFim - minutosInicio;
    if (diferenca < 0) diferenca += 24 * 60;

    const horas = Math.floor(diferenca / 60);
    const minutos = diferenca % 60;

    resultadoEl.classList.remove("erro");
    resultadoEl.innerText = `Período: ${pad(horas)}:${pad(minutos)}`;
}

function limparHoras() {
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFim").value = "";

    const resultadoEl = document.getElementById("resultadoHoras");
    resultadoEl.innerText = "";
    resultadoEl.classList.remove("erro");
}

// ============================
// ABAS
// ============================
function mudarAba(nome) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === nome);
    });
    document.querySelectorAll(".tab-content").forEach(conteudo => {
        conteudo.classList.toggle("active", conteudo.id === `tab-${nome}`);
    });
}

// ============================
// TEMA CLARO / ESCURO
// ============================
function atualizarIconeTema(tema) {
    const btn = document.getElementById("btnTema");
    if (btn) btn.textContent = tema === "escuro" ? "☀️" : "🌙";
}

function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
    atualizarIconeTema(tema);
}

function alternarTema() {
    const atual = document.documentElement.getAttribute("data-theme") || "claro";
    aplicarTema(atual === "escuro" ? "claro" : "escuro");
}

atualizarIconeTema(document.documentElement.getAttribute("data-theme") || "claro");
