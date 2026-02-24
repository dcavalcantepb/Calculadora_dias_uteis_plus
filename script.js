// ============================
// CALCULADORA DE DIAS ÚTEIS
// ============================

// ---------------------------
// Função para calcular dias úteis entre duas datas
function calcularDiasUteisEntreDatas() {
    const inicioInput = document.getElementById("dataInicio").value;
    const fimInput = document.getElementById("dataFim").value;
    const contarInicio = document.getElementById("contarInicio").checked;

    if (!inicioInput || !fimInput) {
        alert("Informe as duas datas.");
        return;
    }

    let inicio = new Date(inicioInput + "T00:00:00");
    let fim = new Date(fimInput + "T00:00:00");

    if (fim <= inicio) {
        alert("A data final deve ser posterior à inicial.");
        return;
    }

    let dataAtual = new Date(inicio);
    if (!contarInicio) dataAtual.setDate(dataAtual.getDate() + 1);

    let diasUteis = 0;

    function ehFeriado(data) {
        const dd = String(data.getDate()).padStart(2,"0");
        const mm = String(data.getMonth()+1).padStart(2,"0");
        const yyyy = data.getFullYear();
        const formato = `${dd}-${mm}-${yyyy}`;
        return FERIADOS.includes(formato);
    }

    while (dataAtual <= fim) {
        // adiciona feriados do ano atual se necessário
        const anoAtualLoop = dataAtual.getFullYear();
        if (!FERIADOS.some(f => f.endsWith(`-${anoAtualLoop}`))) {
            adicionarFeriadosAno(anoAtualLoop);
        }

        const diaSemana = dataAtual.getDay();
        const fimSemana = (diaSemana === 0 || diaSemana === 6);

        if (!fimSemana && !ehFeriado(dataAtual)) {
            diasUteis++;
        }

        dataAtual.setDate(dataAtual.getDate() + 1);
    }

    document.getElementById("resultado").innerText = `Dias úteis: ${diasUteis}`;
}

// ---------------------------
// Função para calcular a data final a partir de prazo em dias úteis
function calcularDataFinal() {
    const inicioInput = document.getElementById("dataInicio").value;
    const prazoDiasUteis = parseInt(document.getElementById("prazoDiasUteis").value);
    const contarInicio = document.getElementById("contarInicio").checked;

    if (!inicioInput || isNaN(prazoDiasUteis) || prazoDiasUteis < 1) {
        alert("Informe a data inicial e o prazo em dias úteis (maior que 0).");
        return;
    }

    let dataAtual = new Date(inicioInput + "T00:00:00");
    if (!contarInicio) dataAtual.setDate(dataAtual.getDate() + 1);

    let diasContados = 0;

    function ehFeriado(data) {
        const dd = String(data.getDate()).padStart(2,"0");
        const mm = String(data.getMonth()+1).padStart(2,"0");
        const yyyy = data.getFullYear();
        const formato = `${dd}-${mm}-${yyyy}`;
        return FERIADOS.includes(formato);
    }

    while (diasContados < prazoDiasUteis) {
        // adiciona feriados do ano atual se necessário
        const anoAtualLoop = dataAtual.getFullYear();
        if (!FERIADOS.some(f => f.endsWith(`-${anoAtualLoop}`))) {
            adicionarFeriadosAno(anoAtualLoop);
        }

        const diaSemana = dataAtual.getDay();
        const fimSemana = (diaSemana === 0 || diaSemana === 6);

        if (!fimSemana && !ehFeriado(dataAtual)) {
            diasContados++;
        }

        if (diasContados < prazoDiasUteis) {
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
    }

    const yyyy = dataAtual.getFullYear();
    const mm = String(dataAtual.getMonth() + 1).padStart(2,"0");
    const dd = String(dataAtual.getDate()).padStart(2,"0");
    const dataFinalFormatada = `${yyyy}-${mm}-${dd}`;

    document.getElementById("dataFim").value = dataFinalFormatada;
    document.getElementById("resultado").innerText = `Data final do prazo: ${dd}/${mm}/${yyyy}`;
}

// ---------------------------
// Função para limpar campos
function limparCampos() {
    document.getElementById("dataInicio").value = "";
    document.getElementById("prazoDiasUteis").value = "";
    document.getElementById("dataFim").value = "";
    document.getElementById("resultado").innerText = "";
}
