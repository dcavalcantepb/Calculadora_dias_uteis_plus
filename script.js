diff --git a/script.js b/script.js
index f37b8b947bccabd7faaaea189086f8404920cdb1..0f4666a68b976b969c9c48b3bf0859bbfde9439f 100644
--- a/script.js
+++ b/script.js
@@ -38,70 +38,84 @@ function calcularDiasUteisEntreDatas() {
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
-    const contarInicio = document.getElementById("contarInicio").checked;
 
     if (!inicioInput || isNaN(prazoDiasUteis) || prazoDiasUteis < 1) {
         alert("Informe a data inicial e o prazo em dias úteis (maior que 0).");
         return;
     }
 
     let dataAtual = new Date(inicioInput + "T00:00:00");
-    if (!contarInicio) dataAtual.setDate(dataAtual.getDate() + 1);
 
     let diasContados = 0;
 
     function ehFeriado(data) {
         const dd = String(data.getDate()).padStart(2,"0");
         const mm = String(data.getMonth()+1).padStart(2,"0");
         const yyyy = data.getFullYear();
         const formato = `${dd}-${mm}-${yyyy}`;
         return FERIADOS.includes(formato);
     }
 
+    function ehDiaUtil(data) {
+        const ano = data.getFullYear();
+        if (!FERIADOS.some(f => f.endsWith(`-${ano}`))) {
+            adicionarFeriadosAno(ano);
+        }
+
+        const diaSemana = data.getDay();
+        const fimSemana = (diaSemana === 0 || diaSemana === 6);
+        return !fimSemana && !ehFeriado(data);
+    }
+
+    // começa sempre no próximo dia útil após a data inicial
+    do {
+        dataAtual.setDate(dataAtual.getDate() + 1);
+    } while (!ehDiaUtil(dataAtual));
+
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
