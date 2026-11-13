# Calculadora de Dias Úteis

Calculadora de prazos em dias úteis (calendário MG + Belo Horizonte), com aba de cálculo de horas.

- **Dias úteis entre duas datas** e **data final a partir de um prazo em dias úteis**
- Opção de contar ou não a data inicial
- Tema claro/escuro

Site estático: abra o `index.html` no navegador.

## Como o calendário funciona

Tudo fica em [feriados.js](feriados.js), em dois blocos independentes:

| Bloco | O que contém | Quando mexer |
| --- | --- | --- |
| `FERIADOS_FIXOS` | Feriados de data fixa: nacionais, estaduais e municipais | Só se a lei criar ou extinguir um feriado |
| `PONTOS_FACULTATIVOS` | Pontos facultativos do decreto de cada ano | **Todo ano**, quando o decreto for publicado |

Também são calculados automaticamente a partir da Páscoa: Sexta Santa (feriado), Carnaval, Quinta Santa e Corpus Christi (pontos facultativos).

### Anos sem decreto cadastrado

Para um ano que ainda não tem entrada em `PONTOS_FACULTATIVOS`, a calculadora usa uma **estimativa conservadora**: Carnaval (segunda, terça e quarta de cinzas), Quinta Santa, Corpus Christi, 24/12 e 31/12. Emendas, dia do servidor e pós-feriados **não** são estimados, porque mudam a cada decreto.

Quando o período calculado toca um ano estimado, o resultado mostra um aviso (não bloqueante): o valor pode variar em alguns dias.

## Cadastrar o decreto de um novo ano

O calendário de feriados e pontos facultativos das repartições estaduais é publicado no Diário Oficial pela Secretaria de Estado de Governo (divulgado também na Agência Minas), **sem data fixa**: o de 2026 saiu em 02/12/2025, mas o de 2025 só saiu em 08/01/2025. Verifique em dezembro e, se ainda não tiver saído, de novo em janeiro.

O dia do servidor também pode ser antecipado ou adiado (em 2025 foi para 27/10, seguindo o Governo Federal), então use sempre as datas do calendário publicado.

1. Abra [feriados.js](feriados.js) e localize `PONTOS_FACULTATIVOS`.
2. Acrescente uma entrada para o ano, no formato `"dd-mm"`, listando **todos** os pontos facultativos do decreto, inclusive Carnaval, Quinta Santa e Corpus Christi. Ao cadastrar o ano, a estimativa deixa de ser usada para ele:

   ```js
   const PONTOS_FACULTATIVOS = {
       2026: [ /* ... */ ],
       2027: [
           "08-02", // Carnaval segunda
           "09-02", // Carnaval terça
           "10-02", // quarta de cinzas
           "25-03", // quinta santa
           // ... demais datas do decreto
           "24-12",
           "31-12"
       ]
   };
   ```

3. Abra a calculadora e teste um prazo que atravesse o ano: o aviso de estimativa daquele ano deve desaparecer.

## Se a lei mudar os feriados

- Feriado novo de data fixa: acrescente em `FERIADOS_FIXOS`, no grupo certo. Se ele só vale a partir de certo ano, registre também em `FERIADOS_FIXOS_DESDE` (como o 20/11, válido desde 2024).
- Feriado extinto: remova da lista.
