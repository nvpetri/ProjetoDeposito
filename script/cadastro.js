// script.js

const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');

function carregarEstoque() {
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
          <button onclick="registrarVenda(${index})">Vender</button>
          <button onclick="reporEstoque(${index})">Repor</button>
          <button onclick="removerProduto(${index})">Remover</button>
        </td>
      </tr>
    `;
  });
}

function removerProduto(index) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  estoque.splice(index, 1);
  localStorage.setItem('estoque', JSON.stringify(estoque));
  carregarEstoque();
}

function registrarVenda(index) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');

  const produto = estoque[index];
  const quantidadeVenda = parseInt(prompt(`Quantas unidades de "${produto.nome}" deseja vender?`));

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
    valorUnitario: produto.venda,
    data: new Date().toLocaleString(),
    total: (quantidadeVenda * produto.venda).toFixed(2),
    custoTotal: (quantidadeVenda * produto.custo).toFixed(2)
  };

  vendas.push(venda);

  localStorage.setItem('estoque', JSON.stringify(estoque));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  carregarEstoque();
}

function reporEstoque(index) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const produto = estoque[index];

  const quantidadeRepor = parseInt(prompt(`Quantas unidades de "${produto.nome}" chegaram ao estoque?`));

  if (isNaN(quantidadeRepor) || quantidadeRepor <= 0) {
    alert("Quantidade inválida.");
    return;
  }

  produto.quantidade += quantidadeRepor;
  localStorage.setItem('estoque', JSON.stringify(estoque));
  carregarEstoque();
}

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

window.onload = carregarEstoque;
