// CONFIGURAÇÃO GLOBAL
const LARGURA_MANTA = 1; // metros


// BANCO DE DADOS (carregado do JSON)
let vasos = [];

fetch('./produtos.json')
    .then(response => response.json())
    .then(data => {
        vasos = data.map(v => {
            const volume = (v.altura && v.comprimento && v.largura)
                ? (v.altura * v.comprimento * v.largura)
                : 0;

            return {
                ...v,
                volume: volume,
                terra: volume * 0.7,
                argila: 0,
                manta: 0
            };
        });

        console.log("Produtos carregados:", vasos);
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));


// NAVEGAÇÃO
function mostrarPagina(pagina) {
    document.getElementById("pagina-orcamento").style.display = "none";
    document.getElementById("pagina-cadastro").style.display = "none";
    document.getElementById("pagina-relatorios").style.display = "none";

    document.getElementById("pagina-" + pagina).style.display = "block";
}


// Detecta se é página 2
function isPagina2() {
    return document.body.classList.contains("pagina2");
}


// BANCO DE ORÇAMENTO
let orcamento = [];


// ADICIONAR VASO SOB MEDIDA
function adicionarVasoSobMedida() {
    const vaso = {
        nome: "Sob medida",
        codigo: "SM",
        altura: 0,
        comprimento: 0,
        largura: 0,
        volume: 0,
        terra: 0,
        argila: 0,
        manta: 0,
        editavel: true
    };

    orcamento.push({ vaso, quantidade: 1 });
    atualizarTela();
}


// ADICIONAR VASO NORMAL
function adicionarVasos() {
    if (vasos.length === 0) {
        alert("Produtos ainda não carregaram!");
        return;
    }

    const busca = document.getElementById("buscar").value.trim().toLowerCase();
    const quantidade = Number(document.getElementById("qtd").value);

    const vaso = vasos.find(v =>
        v.nome.toLowerCase().includes(busca) ||
        (v.codigo && v.codigo.toLowerCase().includes(busca))
    );

    if (!vaso) {
        alert("Vaso não encontrado!");
        return;
    }

    orcamento.push({ vaso: { ...vaso }, quantidade });
    atualizarTela();
}


// EDITAR VASO
function editarVaso(index, campo, valor) {
    const vaso = orcamento[index].vaso;

    if (campo === "nome") {
        vaso.nome = valor;
    } else {
        vaso[campo] = Number(valor);
    }

    // recalcular volume
    vaso.volume = (vaso.altura || 0) * (vaso.comprimento || 0) * (vaso.largura || 0);

    // recalcular terra
    vaso.terra = vaso.volume * 0.7;

    atualizarTela();
}


// CÁLCULOS
function calcularTotais() {
    let terra = 0;
    let argila = 0;
    let manta = 0;
    let pinus = 0;
    let seixo = 0;
    let vasosTotal = 0;

    orcamento.forEach((item) => {
        terra += (item.vaso.terra || 0) * item.quantidade;

        if (!isPagina2()) {
            argila += (item.vaso.volume || 0) * 0.15 * item.quantidade;
        }

        vasosTotal += item.quantidade;

        const comp = item.vaso.comprimento > 10 ? item.vaso.comprimento / 100 : item.vaso.comprimento;
        const larg = item.vaso.largura > 10 ? item.vaso.largura / 100 : item.vaso.largura;

        const areaBase = (comp || 0) * (larg || 0);
        manta += areaBase * 2.5 * item.quantidade;

        if (isPagina2()) {
            pinus += (item.vaso.volume || 0) * 0.45 * item.quantidade;
            seixo += (item.vaso.volume || 0) * 0.45 * item.quantidade;
        }
    });

    return { terra, argila, manta, pinus, seixo, vasosTotal };
}


// ATUALIZAR TELA
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

        const areaBase = (comp || 0) * (larg || 0);
        const mantaItem = areaBase * 2.5 * item.quantidade;

        const pinusItem = (item.vaso.volume || 0) * 0.45 * item.quantidade;
        const seixoItem = (item.vaso.volume || 0) * 0.45 * item.quantidade;

        //  SE FOR EDITÁVEL
        if (item.vaso.editavel) {
            linhaTabela.innerHTML = `
                <div class="celula">
                    <input value="${item.vaso.nome}" onchange="editarVaso(${index}, 'nome', this.value)">
                </div>
                <div class="celula">SM</div>
                <div class="celula">
                    <input type="number" value="${item.vaso.altura}" onchange="editarVaso(${index}, 'altura', this.value)">
                </div>
                <div class="celula">
                    <input type="number" value="${item.vaso.comprimento}" onchange="editarVaso(${index}, 'comprimento', this.value)">
                </div>
                <div class="celula">
                    <input type="number" value="${item.vaso.largura}" onchange="editarVaso(${index}, 'largura', this.value)">
                </div>
                <div class="celula">${item.vaso.volume.toFixed(3)}</div>
            `;
        } else {
            linhaTabela.innerHTML = `
                <div class="celula">${item.vaso.nome}</div>
                <div class="celula">${item.vaso.codigo || "-"}</div>
                <div class="celula">${item.vaso.altura || "-"}</div>
                <div class="celula">${item.vaso.comprimento || "-"}</div>
                <div class="celula">${item.vaso.largura || "-"}</div>
                <div class="celula">${item.vaso.volume.toFixed(3)}</div>

                ${!pagina2 ? `<div class="celula">${((item.vaso.terra || 0) * item.quantidade).toFixed(3)}</div>` : ""}
                ${!pagina2 ? `<div class="celula">${((item.vaso.volume || 0) * 0.15 * item.quantidade).toFixed(3)}</div>` : ""}

                ${pagina2 ? `<div class="celula">${pinusItem.toFixed(3)}</div>` : ""}
                ${pagina2 ? `<div class="celula">${seixoItem.toFixed(3)}</div>` : ""}

                ${!pagina2 ? `<div class="celula">${mantaItem.toFixed(3)}</div>` : ""}
            `;
        }

        linhas.appendChild(linhaTabela);

        const itemLista = document.createElement("div");
        itemLista.innerHTML = `
            ${item.quantidade}x ${item.vaso.nome}
            <button type="button" onclick="removerItem(${index})">❌</button>
        `;

        lista.appendChild(itemLista);
    });

    const totais = calcularTotais();
    const mantaML = totais.manta / LARGURA_MANTA;

    if (!pagina2) {
        const sacosTerra = totais.terra / 0.025;
        const sacosArgila = (totais.argila * 1000) / 50;

        document.getElementById("resultado").innerHTML = `
        <div>Vasos: ${totais.vasosTotal}</div>
        <div>Terra: ${totais.terra.toFixed(3)} m³ / ${Math.ceil(sacosTerra)} sacos de 25L</div>
        <div>Argila: ${totais.argila.toFixed(3)} m³ / ${Math.ceil(sacosArgila)} sacos de 50L</div>
        <div>Manta: ${totais.manta.toFixed(3)} m² / ${mantaML.toFixed(2)} metro linear</div>
    `;
    } else {
        const sacosPinus = (totais.pinus * 1000) / 40;
        const sacosSeixo = (totais.seixo * 1000) / 50;

        document.getElementById("resultado").innerHTML = `
        <div>Vasos: ${totais.vasosTotal}</div>
        <div>Casca de Pinus: ${totais.pinus.toFixed(3)} m³ / ${Math.ceil(sacosPinus)} sacos de 40L</div>
        <div>Argila: ${totais.seixo.toFixed(3)} m³ / ${Math.ceil(sacosSeixo)} sacos de 50L</div>
    `;
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
        const sacosTerra = Math.ceil(totais.terra / 0.025);
        const sacosArgila = Math.ceil((totais.argila * 1000) / 50);
        const mantaML = totais.manta / LARGURA_MANTA;

        texto += `Terra: ${totais.terra.toFixed(3)} m³ / ${sacosTerra} sacos de 25L\n`;
        texto += `Argila: ${totais.argila.toFixed(3)} m³ / ${sacosArgila} sacos de 50L\n`;
        texto += `Manta: ${totais.manta.toFixed(3)} m² / ${mantaML.toFixed(2)} ML\n`;

    } else {
        const sacosPinus = Math.ceil((totais.pinus * 1000) / 40);
        const sacosArgila = Math.ceil((totais.seixo * 1000) / 50);

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