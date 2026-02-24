// ================================
// CALENDÁRIO OFICIAL MG + BH
// Feriados automáticos
// ================================

// Pontos facultativos MG (atualizar todo ano)
const PONTOS_FACULTATIVOS_MG = [
    "02-01", // pós confraternização universal
    "16-02", // Carnaval segunda
    "17-02", // Carnaval terça
    "18-02", // quarta cinzas
    "02-04", // quinta santa
    "20-04", // véspera Tiradentes
    "05-06", // pós corpus christi
    "30-10", // dia servidor público
    "07-12", // Imaculada Conceição BH (ponto)
    "24-12", // véspera natal
    "31-12"  // véspera ano novo
];

// ================================
// Funções auxiliares
// ================================
function formatarData(data){
    const dd = String(data.getDate()).padStart(2,"0");
    const mm = String(data.getMonth()+1).padStart(2,"0");
    const yyyy = data.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
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
// Gera feriados de um determinado ano
// ================================
function gerarFeriados(ano){
    let feriados = [];

    // Feriados nacionais fixos
    feriados.push(
        `01-01-${ano}`, `21-04-${ano}`, `01-05-${ano}`,
        `07-09-${ano}`, `12-10-${ano}`, `02-11-${ano}`,
        `15-11-${ano}`, `20-11-${ano}`, `25-12-${ano}`
    );

    // Municipais BH fixos
    feriados.push(`15-08-${ano}`, `08-12-${ano}`);

    // Móveis via Páscoa
    const pascoa = calcularPascoa(ano);

    // Carnaval segunda
    let carnavalSeg = new Date(pascoa);
    carnavalSeg.setDate(pascoa.getDate()-48);
    feriados.push(formatarData(carnavalSeg));

    // Carnaval terça
    let carnavalTer = new Date(pascoa);
    carnavalTer.setDate(pascoa.getDate()-47);
    feriados.push(formatarData(carnavalTer));

    // Quarta cinzas
    let cinzas = new Date(pascoa);
    cinzas.setDate(pascoa.getDate()-46);
    feriados.push(formatarData(cinzas));

    // Sexta santa
    let sextaSanta = new Date(pascoa);
    sextaSanta.setDate(pascoa.getDate()-2);
    feriados.push(formatarData(sextaSanta));

    // Corpus Christi
    let corpus = new Date(pascoa);
    corpus.setDate(pascoa.getDate()+60);
    feriados.push(formatarData(corpus));

    // Adiciona pontos facultativos (com ano atual)
    PONTOS_FACULTATIVOS_MG.forEach(diaMes => {
        const [dd, mm] = diaMes.split("-");
        feriados.push(`${dd}-${mm}-${ano}`);
    });

    return feriados;
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
