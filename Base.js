function mostrarPagina(pagina) {
    // esconde todas
    document.getElementById("pagina-orcamento").style.display = "none";
    document.getElementById("pagina-cadastro").style.display = "none";
    document.getElementById("pagina-relatorios").style.display = "none";

    // mostra a escolhida
    document.getElementById("pagina-" + pagina).style.display = "block";
}

//1- Banco de dados vasos
const vasos = [
    {
        nome: "vaso 6",
        codConceito: "56",
        altura: 10.000,
        comprimento: 20.000,
        largura: 30.000,
        volume: 22.000,
        terra: 2.000,
        argila: 0.500,
        manta: 0.200
    },
    {
        nome: "Jardineira Baixa P (30x65x26)",
        codConceito: "VJ5118",
        altura: 0.300,
        comprimento: 0.650,
        largura: 0.260,
        volume: 0.051,
        terra: 0.035,
        argila: 0.008,
        manta: 0.340
    },
    {
        nome: "Jardineira Baixa M (30x80x26)",
        codConceito: "VJ5117",
        altura: 0.300,
        comprimento: 0.800,
        largura: 0.260,
        volume: 0.063,
        terra: 0.045,
        argila: 0.010,
        manta: 0.420
    },
    {
        nome: "Vaso Japão P (36x44x27)",
        codConceito: "VJ5074",
        altura: 0.360,
        comprimento: 0.440,
        largura: 0.270,
        volume: 0.043,
        terra: 0.030,
        argila: 0.007,
        manta: 0.240
    },
    {
        nome: "Vaso Japão M (45x49x36)",
        codConceito: "VJ5075",
        altura: 0.450,
        comprimento: 0.490,
        largura: 0.360,
        volume: 0.080,
        terra: 0.056,
        argila: 0.012,
        manta: 0.350
    },
    {
        nome: "Vaso Japão G (54x59x37)",
        codConceito: "VJ5076",
        altura: 0.540,
        comprimento: 0.590,
        largura: 0.370,
        volume: 0.118,
        terra: 0.083,
        argila: 0.018,
        manta: 0.440
    },
    {
        nome: "Vaso Porto G (78x63x60)",
        codConceito: "VJ5322",
        altura: 0.780,
        comprimento: 0.630,
        largura: 0.600,
        volume: 0.295,
        terra: 0.206,
        argila: 0.044,
        manta: 0.760
    },
    {
        nome: "Vaso Vértice P (91x20x25)",
        codConceito: "VJ5309",
        altura: 0.910,
        comprimento: 0.200,
        largura: 0.250,
        volume: 0.046,
        terra: 0.032,
        argila: 0.007,
        manta: 0.100
    },
    {
        nome: "Vaso Cilindro G (90x36x36)",
        codConceito: "VJ5060",
        altura: 0.900,
        comprimento: 0.360,
        largura: 0.360,
        volume: 0.117,
        terra: 0.082,
        argila: 0.018,
        manta: 0.260
    },
    {
        nome: "Vaso Cilindro M (70x36x36)",
        codConceito: "VJ5059",
        altura: 0.700,
        comprimento: 0.360,
        largura: 0.360,
        volume: 0.091,
        terra: 0.064,
        argila: 0.014,
        manta: 0.260
    },
    {
        nome: "Caixa França G (60x60x80)",
        codConceito: "VJ5045",
        altura: 0.800,
        comprimento: 0.600,
        largura: 0.600,
        volume: 0.290,
        terra: 0.202,
        argila: 0.043,
        manta: 0.720
    },
    {
        nome: "Bacia M (21x58x26)",
        codConceito: "VJ5291",
        altura: 0.210,
        comprimento: 0.580,
        largura: 0.260,
        volume: 0.032,
        terra: 0.022,
        argila: 0.005,
        manta: 0.300
    }
];
// Detecta se é página 2
function isPagina2() {
    return document.body.classList.contains("pagina2");
}

function mostrarPagina(pagina) {
    document.getElementById("pagina-orcamento").style.display = "none";
    document.getElementById("pagina-cadastro").style.display = "none";
    document.getElementById("pagina-relatorios").style.display = "none";

    document.getElementById("pagina-" + pagina).style.display = "block";
}



// BANCO

let orcamento = [];

// ADD
function adicionarVasos() {
    const busca = document.getElementById("buscar").value.trim().toLowerCase();
    const quantidade = Number(document.getElementById("qtd").value);

    const vaso = vasos.find(v =>
        v.nome.toLowerCase().includes(busca) ||
        String(v.codConceito || "").toLowerCase() === busca
    );

    if (!vaso) {
        alert("Vaso não encontrado!");
        return;
    }

    orcamento.push({ vaso, quantidade });
    atualizarTela();
}

// CALCULO
function calcularTotais() {
    let terra = 0;
    let argila = 0;
    let manta = 0;
    let pinus = 0;
    let seixo = 0;
    let vasosTotal = 0;

    orcamento.forEach((item) => {
        terra += item.vaso.terra * item.quantidade;
        if (!isPagina2()) {
            argila += item.vaso.volume * 0.15 * item.quantidade;
        } vasosTotal += item.quantidade;

        const comp = item.vaso.comprimento > 10 ? item.vaso.comprimento / 100 : item.vaso.comprimento;
        const larg = item.vaso.largura > 10 ? item.vaso.largura / 100 : item.vaso.largura;

        const areaBase = comp * larg;
        manta += areaBase * 4 * item.quantidade;

        // 🔥 REGRA NOVA PAG2
        if (isPagina2()) {
            pinus += item.vaso.volume * 0.45 * item.quantidade;
            seixo += item.vaso.volume * 0.45 * item.quantidade;
        }
    });

    return { terra, argila, manta, pinus, seixo, vasosTotal };
}

// TELA
function atualizarTela() {
    const lista = document.getElementById("lista");
    const linhas = document.getElementById("linhas");
    const pagina2 = isPagina2();

    lista.innerHTML = "";
    linhas.innerHTML = "";

    orcamento.forEach((item, index) => {

        const linhaTabela = document.createElement("div");
        linhaTabela.className = "item";

        const comp = item.vaso.comprimento > 10 ? item.vaso.comprimento / 100 : item.vaso.comprimento;
        const larg = item.vaso.largura > 10 ? item.vaso.largura / 100 : item.vaso.largura;

        const areaBase = comp * larg * item.quantidade;
        const mantaItem = areaBase * 2 * item.quantidade;

        const pinusItem = item.vaso.volume * 0.45 * item.quantidade;
        const seixoItem = item.vaso.volume * 0.45 * item.quantidade;

        linhaTabela.innerHTML = `
    <div class="celula">${item.vaso.nome}</div>
    <div class="celula">${item.vaso.codConceito || "-"}</div>
    <div class="celula">${item.vaso.altura || "-"}</div>
    <div class="celula">${item.vaso.comprimento || "-"}</div>
    <div class="celula">${item.vaso.largura || "-"}</div>
    <div class="celula">${item.vaso.volume || "-"}</div>

    ${!pagina2 ? `<div class="celula">${(item.vaso.terra * item.quantidade).toFixed(3)}</div>` : ""}

${!pagina2 ? `<div class="celula">${(item.vaso.volume * 0.15 * item.quantidade).toFixed(3)}</div>` : ""}
    ${pagina2 ? `<div class="celula">${pinusItem.toFixed(3)}</div>` : ""}
${pagina2 ? `<div class="celula">${seixoItem.toFixed(3)}</div>` : ""}
    ${!pagina2 ? `<div class="celula">${mantaItem.toFixed(3)}</div>` : ""}
`;

        linhas.appendChild(linhaTabela);

        const itemLista = document.createElement("div");
        itemLista.innerHTML = `
                ${item.quantidade}x ${item.vaso.nome}
                <button onclick="removerItem(${index})">❌</button>
            `;

        lista.appendChild(itemLista);
    });

    const totais = calcularTotais();
    const mantaML = totais.manta / 2;

    if (!pagina2) {
        const sacosTerra = totais.terra / 0.02;
        const sacosArgila = (totais.argila * 1000) / 50;

        document.getElementById("resultado").innerHTML = `
        <div>Vasos: ${totais.vasosTotal}</div>
        <div>Terra: ${totais.terra.toFixed(3)} m³ / ${Math.ceil(sacosTerra)} sacos de 20L</div>
        <div>Argila: ${totais.argila.toFixed(3)} m³ / ${Math.ceil(sacosArgila)} sacos de 50L</div>
        <div>Manta: ${totais.manta.toFixed(3)} m² / ${mantaML.toFixed(2)} metro linear</div>
    `;
    } else {
        const sacosPinus = (totais.pinus * 1000) / 35;
        const sacosSeixo = (totais.seixo * 1000) / 50;

        document.getElementById("resultado").innerHTML = `
        <div>Vasos: ${totais.vasosTotal}</div>
        <div>Casca de Pinus: ${totais.pinus.toFixed(3)} m³ / ${Math.ceil(sacosPinus)} sacos de 35L</div>
<div>Argila: ${totais.seixo.toFixed(3)} m³ / ${Math.ceil(sacosSeixo)} sacos de 50L</div>    `;
    }
}

// COPIAR
function copiar() {
    let texto = "ORÇAMENTO\n\n";

    orcamento.forEach((item) => {
        texto += `${item.quantidade}x ${item.vaso.nome}\n`;
    });

    const totais = calcularTotais();
    const pagina2 = isPagina2();

    texto += `\nTOTAL:\n`;

    if (!pagina2) {
        const sacosTerra = Math.ceil(totais.terra / 0.02);
        const sacosArgila = Math.ceil((totais.argila * 1000) / 50);
        const mantaML = totais.manta / 2;

        texto += `Terra: ${totais.terra.toFixed(3)} m³ / ${sacosTerra} sacos de 20L\n`;
        texto += `Argila: ${totais.argila.toFixed(3)} m³ / ${sacosArgila} sacos de 50L\n`;
        texto += `Manta: ${totais.manta.toFixed(3)} m² / ${mantaML.toFixed(2)} ML\n`;

    } else {
        const sacosPinus = Math.ceil((totais.pinus * 1000) / 25);
        const sacosArgila = Math.ceil((totais.seixo * 1000) / 25); // (seixo = argila cenografia)

        texto += `Casca de Pinus: ${totais.pinus.toFixed(3)} m³ / ${sacosPinus} sacos\n`;
        texto += `Argila: ${totais.seixo.toFixed(3)} m³ / ${sacosArgila} sacos\n`;
    }

    navigator.clipboard.writeText(texto)
        .then(() => alert("Copiado!"))
        .catch(() => alert("Erro ao copiar"));

}

// REMOVER
function removerItem(index) {
    orcamento.splice(index, 1);
    atualizarTela();
}