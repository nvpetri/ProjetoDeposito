
const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');

async function carregarEstoque() {
    if (!tabela) return;

    const estoqueResponse = await fetch('http://localhost:3000/materiais');
    const vendasResponse = await fetch('http://localhost:3000/vendas');
    const estoque = await estoqueResponse.json();
    const vendas = await vendasResponse.json();

    tabela.innerHTML = '';
    estoque.forEach((item) => {
        const vendasDoItem = vendas.filter(v => v.nome === item.nome);
        const totalLucro = vendasDoItem.reduce((acc, v) => acc + (v.valorUnitario * v.quantidade), 0);
        const totalGasto = vendasDoItem.reduce((acc, v) => acc + (v.custoTotal ? parseFloat(v.custoTotal) : 0), 0);
        const diferenca = (totalLucro - totalGasto).toFixed(2);
        const lucroOuPrejuizo = diferenca >= 0 ? `Lucro: R$ ${diferenca}` : `Prejuízo: R$ ${Math.abs(diferenca)}`;
        const corClasse = diferenca >= 0 ? 'text-green-600' : 'text-red-600';

        tabela.innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.tipo}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.custo.toFixed(2)}</td>
            <td>R$ ${item.venda?.toFixed(2) || '—'}</td>
            <td class="${corClasse}">${lucroOuPrejuizo}</td>
            <td class="actions">
                <button onclick="registrarVenda(${item.id})">Vender</button>
                <button onclick="removerProduto(${item.id})">Remover</button>
            </td>
        </tr>
        `;
    });
}

async function removerProduto(id) {
    await fetch(`http://localhost:3000/materiais/${id}`, { method: 'DELETE' });
    carregarEstoque();
}

async function registrarVenda(id) {
    const quantidadeVenda = parseInt(document.getElementById('quantidadeVenda').value);
    const valorVenda = parseFloat(document.getElementById('valorVendaProduto').value);

    if (isNaN(quantidadeVenda) || quantidadeVenda <= 0) {
        alert("Quantidade inválida.");
        return;
    }

    await fetch('http://localhost:3000/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: id, quantidade: quantidadeVenda, valorUnitario: valorVenda })
    });

    document.getElementById('quantidadeVenda').value = '';
    document.getElementById('valorVendaProduto').value = '';
    carregarEstoque();
    atualizarValorVenda();
}

async function atualizarValorVenda() {
    const response = await fetch('http://localhost:3000/vendas');
    const vendas = await response.json();
    const valorVendido = vendas.reduce((acc, venda) => acc + (venda.total ? parseFloat(venda.total) : 0), 0).toFixed(2);

    const valorVendaEl = document.getElementById('valorVenda');
    if (valorVendaEl) {
        valorVendaEl.innerText = `R$ ${valorVendido}`;
    }
}

async function gerarGraficoFinanceiro() {
    const response = await fetch('http://localhost:3000/vendas');
    const vendas = await response.json();

    const dadosPorData = {};
    const hoje = new Date();

    for (let i = 6; i >= 0; i--) {
        const data = new Date();
        data.setDate(hoje.getDate() - i);
        const dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        dadosPorData[dataFormatada] = { receita: 0, custo: 0 };
    }

    vendas.forEach(venda => {
        const data = venda.data.split(',')[0];
        if (dadosPorData[data]) {
            dadosPorData[data].receita += venda.valorUnitario * venda.quantidade;
            dadosPorData[data].custo += venda.custoTotal ? parseFloat(venda.custoTotal) : 0;
        }
    });

    const labels = Object.keys(dadosPorData);
    const receita = labels.map(data => dadosPorData[data].receita.toFixed(2));
    const custo = labels.map(data => dadosPorData[data].custo.toFixed(2));

    const ctx = document.getElementById('graficoFinanceiro');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Receita (R$)',
                    data: receita,
                    borderColor: 'rgb(34,197,94)',
                    backgroundColor: 'rgba(34,197,94,0.2)',
                    tension: 0.3
                },
                {
                    label: 'Custo (R$)',
                    data: custo,
                    borderColor: 'rgb(239,68,68)',
                    backgroundColor: 'rgba(239,68,68,0.2)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'R$' }
                }
            }
        }
    });
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const custo = parseFloat(document.getElementById('custo').value);
        const venda = parseFloat(document.getElementById('venda').value);

        await fetch('http://localhost:3000/materiais', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, tipo, quantidade, custo, venda })
        });

        form.reset();
        carregarEstoque();
    });
}

window.onload = () => {
    carregarEstoque();
    atualizarValorVenda();
    gerarGraficoFinanceiro();
};
