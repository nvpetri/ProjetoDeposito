const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');

// Função para carregar o estoque e exibir os produtos na tabela
function carregarEstoque() {
    if (!tabela) return; // Só tenta preencher se a tabela existir

    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    tabela.innerHTML = '';
    estoque.forEach((item, index) => {
        const total = (item.custo * item.quantidade).toFixed(2);

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
            <td>R$ ${item.venda.toFixed(2)}</td>
            <td class="${corClasse}">${lucroOuPrejuizo}</td>
            <td class="actions">
                <button onclick="registrarVenda(${index})" data-toggle="modal" data-target="#vendaModal">Vender</button>
                <button onclick="removerProduto(${index})">Remover</button>
            </td>
        </tr>
        `;
    });
}

// Função para remover um produto do estoque
function removerProduto(index) {
    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    estoque.splice(index, 1);
    localStorage.setItem('estoque', JSON.stringify(estoque));
    carregarEstoque();
}

// Função para registrar uma venda
function registrarVenda(index) {
    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');

    const produto = estoque[index];
    const quantidadeVenda = parseInt(document.getElementById('quantidadeVenda').value);
    const valorVenda = parseFloat(document.getElementById('valorVendaProduto').value);

    if (isNaN(quantidadeVenda) || quantidadeVenda <= 0) {
        alert("Quantidade inválida.");
        return;
    }

    if (quantidadeVenda > produto.quantidade) {
        alert("Estoque insuficiente.");
        return;
    }

    produto.quantidade -= quantidadeVenda;

    const venda = {
        nome: produto.nome,
        tipo: produto.tipo,
        quantidade: quantidadeVenda,
        valorUnitario: valorVenda,
        data: new Date().toLocaleString(),
        total: (quantidadeVenda * valorVenda).toFixed(2)
    };

    vendas.push(venda);

    localStorage.setItem('estoque', JSON.stringify(estoque));
    localStorage.setItem('vendas', JSON.stringify(vendas));

    document.getElementById('quantidadeVenda').value = '';
    document.getElementById('valorVendaProduto').value = '';

    carregarEstoque();
    atualizarValorVenda();
}

// Atualiza o valor de vendas no dashboard
function atualizarValorVenda() {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const valorVendido = vendas.reduce((acc, venda) => acc + parseFloat(venda.total), 0).toFixed(2);

    const valorVendaEl = document.getElementById('valorVenda');
    if (valorVendaEl) {
        valorVendaEl.innerText = `R$ ${valorVendido}`;
    }
}

// Só adiciona o event listener se o form existir na página
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const custo = parseFloat(document.getElementById('custo').value);
        const venda = parseFloat(document.getElementById('venda').value);

        const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
        estoque.push({ nome, tipo, quantidade, custo, venda });
        localStorage.setItem('estoque', JSON.stringify(estoque));

        form.reset();
        carregarEstoque();
    });
}
function gerarGraficoFinanceiro() {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');

    // Objeto para armazenar por data
    const dadosPorData = {};

    const hoje = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const data = new Date();
        data.setDate(hoje.getDate() - i);
        const dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // "18/04/2025"
        dadosPorData[dataFormatada] = { receita: 0, custo: 0 };
    }

    vendas.forEach(venda => {
        const data = venda.data.split(',')[0]; // pega só a data
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



// Quando a página carregar
window.onload = () => {
    carregarEstoque();
    atualizarValorVenda();
    gerarGraficoFinanceiro();
};
