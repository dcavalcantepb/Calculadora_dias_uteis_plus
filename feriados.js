// ================================
// CALENDÁRIO OFICIAL MG + BH
// Feriados automáticos
// ================================
//
// Dois blocos independentes:
//   1) FERIADOS_FIXOS ........ feriados de data fixa (nacionais, estaduais, municipais)
//   2) PONTOS_FACULTATIVOS ... decreto oficial de cada ano (publicado no Diário Oficial)
//
// Anos sem decreto cadastrado usam uma ESTIMATIVA por regra (ver estimarPontosFacultativos).

// ================================
// 1) FERIADOS FIXOS (formato "dd-mm")
// ================================
const FERIADOS_FIXOS = {
    nacionais: [
        "01-01", // Confraternização Universal
        "21-04", // Tiradentes
        "01-05", // Dia do Trabalho
        "07-09", // Independência
        "12-10", // Nossa Senhora Aparecida
        "02-11", // Finados
        "15-11", // Proclamação da República
        "20-11", // Consciência Negra
        "25-12"  // Natal
    ],
    estaduais: [
        // MG: sem feriado estadual de data fixa além dos nacionais
    ],
    municipais: [
        "15-08", // Assunção de N. Sra. (BH)
        "08-12"  // Imaculada Conceição (BH)
    ]
};

// Feriados fixos que só passaram a valer a partir de certo ano ("dd-mm": ano inicial)
const FERIADOS_FIXOS_DESDE = {
    "20-11": 2024 // Consciência Negra: feriado nacional desde a Lei 14.759/2023
};

// ================================
// 2) PONTOS FACULTATIVOS POR ANO (formato "dd-mm")
// Preencher uma entrada nova a cada decreto publicado.
// ================================
const PONTOS_FACULTATIVOS = {
    2026: [
        "02-01", // pós confraternização universal
        "16-02", // Carnaval segunda
        "17-02", // Carnaval terça
        "18-02", // quarta de cinzas
        "02-04", // quinta santa
        "20-04", // véspera Tiradentes
        "04-06", // Corpus Christi
        "05-06", // pós Corpus Christi
        "30-10", // dia do servidor público
        "07-12", // véspera Imaculada Conceição (BH)
        "24-12", // véspera Natal
        "31-12"  // véspera Ano Novo
    ]
};

// ================================
// Funções auxiliares
// ================================
function formatarData(data){
    const dd = String(data.getDate()).padStart(2,"0");
    const mm = String(data.getMonth()+1).padStart(2,"0");
    const yyyy = data.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function somarDias(data, dias){
    const nova = new Date(data);
    nova.setDate(nova.getDate() + dias);
    return nova;
}

function dataFixa(diaMes, ano){
    const [dd, mm] = diaMes.split("-");
    return new Date(ano, parseInt(mm, 10) - 1, parseInt(dd, 10));
}

// ================================
// Cálculo da Páscoa
// ================================
function calcularPascoa(ano){
    const a = ano % 19;
    const b = Math.floor(ano/100);
    const c = ano % 100;
    const d = Math.floor(b/4);
    const e = b % 4;
    const f = Math.floor((b+8)/25);
    const g = Math.floor((b-f+1)/3);
    const h = (19*a+b-d-g+15)%30;
    const i = Math.floor(c/4);
    const k = c%4;
    const l = (32+2*e+2*i-h-k)%7;
    const m = Math.floor((a+11*h+22*l)/451);
    const mes = Math.floor((h+l-7*m+114)/31);
    const dia = ((h+l-7*m+114)%31)+1;
    return new Date(ano, mes-1, dia);
}

// ================================
// Feriados de um ano (fixos + móveis oficiais)
// ================================
function gerarFeriadosOficiais(ano){
    const datas = [];

    Object.values(FERIADOS_FIXOS).forEach(lista => {
        lista.forEach(diaMes => {
            if (ano < (FERIADOS_FIXOS_DESDE[diaMes] || 0)) return;
            datas.push(dataFixa(diaMes, ano));
        });
    });

    // Sexta-feira santa (feriado nacional móvel)
    datas.push(somarDias(calcularPascoa(ano), -2));

    return datas;
}

// ================================
// Estimativa de pontos facultativos para anos SEM decreto cadastrado
// Conservadora: só o que se repete todo ano nos decretos anteriores.
//   - Carnaval (seg/ter/cinzas), quinta santa e Corpus Christi: seguem a Páscoa
//   - 24/12 e 31/12: véspera de Natal e de Ano Novo
// Não estima emendas, dia do servidor nem pós-feriados (variam a cada decreto).
// ================================
function estimarPontosFacultativos(ano){
    const pascoa = calcularPascoa(ano);

    return [
        somarDias(pascoa, -48), // Carnaval segunda
        somarDias(pascoa, -47), // Carnaval terça
        somarDias(pascoa, -46), // quarta de cinzas
        somarDias(pascoa, -3),  // quinta santa
        somarDias(pascoa, 60),  // Corpus Christi
        dataFixa("24-12", ano), // véspera Natal
        dataFixa("31-12", ano)  // véspera Ano Novo
    ];
}

// Há decreto cadastrado para o ano?
function temDecretoPontosFacultativos(ano){
    return Object.prototype.hasOwnProperty.call(PONTOS_FACULTATIVOS, ano);
}

function gerarPontosFacultativos(ano){
    if (temDecretoPontosFacultativos(ano)){
        return PONTOS_FACULTATIVOS[ano].map(diaMes => dataFixa(diaMes, ano));
    }
    return estimarPontosFacultativos(ano);
}

// ================================
// Gera todos os dias não úteis de um determinado ano
// ================================
function gerarFeriados(ano){
    return [
        ...gerarFeriadosOficiais(ano),
        ...gerarPontosFacultativos(ano)
    ].map(formatarData);
}

// ================================
// Anos do intervalo que usam estimativa (sem decreto cadastrado)
// ================================
function anosSemDecreto(anoInicio, anoFim){
    const anos = [];
    for (let ano = anoInicio; ano <= anoFim; ano++){
        if (!temDecretoPontosFacultativos(ano)) anos.push(ano);
    }
    return anos;
}

// ================================
// Exporta FERIADOS para o ano atual e próximos anos
// ================================
const anoAtual = new Date().getFullYear();
let FERIADOS = gerarFeriados(anoAtual);

// Função auxiliar para incluir feriados de um ano específico
function adicionarFeriadosAno(ano){
    const novos = gerarFeriados(ano);
    FERIADOS = [...FERIADOS, ...novos];
}
