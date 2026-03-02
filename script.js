// ---------------------------
// Função para calcular a data final a partir de prazo em dias úteis
function calcularDataFinal() {

    const inicioInput =
        document.getElementById("dataInicio").value;

    const prazoDiasUteis =
        parseInt(
            document.getElementById("prazoDiasUteis").value
        );

    // validações básicas
    if (!inicioInput) {
        alert("Informe a data inicial.");
        return;
    }

    if (isNaN(prazoDiasUteis) || prazoDiasUteis <= 0) {
        alert("Informe um prazo válido em dias úteis.");
        return;
    }

    let dataAtual = new Date(inicioInput);

    if (isNaN(dataAtual.getTime())) {
        alert("Data inicial inválida.");
        return;
    }

    let diasContados = 0;

    // ---------------------------
    // verifica feriado
    function ehFeriado(data) {

        const dd =
            String(data.getDate()).padStart(2, "0");

        const mm =
            String(data.getMonth() + 1).padStart(2, "0");

        const yyyy =
            data.getFullYear();

        const formato =
            `${dd}-${mm}-${yyyy}`;

        return FERIADOS.includes(formato);
    }

    // ---------------------------
    // verifica dia útil
    function ehDiaUtil(data) {

        const ano = data.getFullYear();

        // adiciona feriados do ano caso não existam
        if (!FERIADOS.some(f => f.endsWith(`-${ano}`))) {
            adicionarFeriadosAno(ano);
        }

        const diaSemana = data.getDay();

        const fimSemana =
            (diaSemana === 0 || diaSemana === 6);

        return !fimSemana && !ehFeriado(data);
    }

    // ---------------------------
    // começa sempre no próximo dia útil
    let tentativaSeguranca = 0;

    do {

        dataAtual.setDate(
            dataAtual.getDate() + 1
        );

        tentativaSeguranca++;

        // proteção contra loop infinito
        if (tentativaSeguranca > 370) {
            alert("Erro ao localizar próximo dia útil.");
            return;
        }

    } while (!ehDiaUtil(dataAtual));


    // ---------------------------
    // conta dias úteis
    while (diasContados < prazoDiasUteis) {

        if (ehDiaUtil(dataAtual)) {
            diasContados++;
        }

        if (diasContados < prazoDiasUteis) {

            dataAtual.setDate(
                dataAtual.getDate() + 1
            );

        }
    }

    // ---------------------------
    // formata resultado YYYY-MM-DD
    const yyyy =
        dataAtual.getFullYear();

    const mm =
        String(dataAtual.getMonth() + 1)
            .padStart(2, "0");

    const dd =
        String(dataAtual.getDate())
            .padStart(2, "0");

    const dataFinalFormatada =
        `${yyyy}-${mm}-${dd}`;

    document.getElementById("dataFim").value =
        dataFinalFormatada;
}
