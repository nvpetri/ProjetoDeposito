// script.js

const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');
const modalVenda = new bootstrap.Modal(document.getElementById('modalVenda'));
const modalReposicao = new bootstrap.Modal(document.getElementById('modalReposicao'));
const formVenda = document.getElementById('formVenda');
const formReposicao = document.getElementById('formReposicao');

function carregarEstoque() {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
  tabela.innerHTML = '';
  estoque.forEach((item, index) => {
    const total = (item.custo * item.quantidade).toFixed(2);

    // Calculando total de vendas e total de custo
    const vendasDoItem = vendas.filter(v => v.nome === item.nome);
    const totalLucro = vendasDoItem.reduce((acc, v) => acc + (v.valorUnitario * v.quantidade), 0);
    const totalGasto = vendasDoItem.reduce((acc, v) => acc + (v.custoTotal ? parseFloat(v.custoTotal) : 0), 0);
    

    tabela.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.tipo}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.custo.toFixed(2)}</td>
        <td class="actions">
          <button onclick="abrirModalVenda(${index})">Vender</button>
          <button onclick="abrirModalReposicao(${index})">Reposição</button>
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

function abrirModalVenda(index) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const produto = estoque[index];

  // Preencher os campos do modal
  document.getElementById('vendaIndex').value = index;
  document.getElementById('quantidadeVenda').value = '';
  document.getElementById('valorVenda').value = '';
  modalVenda.show();
}

function abrirModalReposicao(index) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const produto = estoque[index];

  // Preencher os campos do modal
  document.getElementById('reposicaoIndex').value = index;
  document.getElementById('quantidadeReposicao').value = '';
  modalReposicao.show();
}

function registrarVenda(index, quantidadeVenda, valorVenda) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');

  const produto = estoque[index];

  if (quantidadeVenda > produto.quantidade) {
    alert('Estoque insuficiente.');
    return;
  }

  produto.quantidade -= quantidadeVenda;

  const venda = {
    nome: produto.nome,
    tipo: produto.tipo,
    quantidade: quantidadeVenda,
    valorUnitario: valorVenda,
    data: new Date().toLocaleString(),
    total: (quantidadeVenda * valorVenda).toFixed(2),
    custoTotal: (quantidadeVenda * produto.custo).toFixed(2)
  };

  vendas.push(venda);

  localStorage.setItem('estoque', JSON.stringify(estoque));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  carregarEstoque();
}

function reposicionarEstoque(index, quantidadeReposicao) {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');

  const produto = estoque[index];
  produto.quantidade += quantidadeReposicao;

  localStorage.setItem('estoque', JSON.stringify(estoque));
  carregarEstoque();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const tipo = document.getElementById('tipo').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const custo = parseFloat(document.getElementById('custo').value);

  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  estoque.push({ nome, tipo, quantidade, custo });
  localStorage.setItem('estoque', JSON.stringify(estoque));

  form.reset();
  carregarEstoque();
});

formVenda.addEventListener('submit', (e) => {
  e.preventDefault();
  const index = document.getElementById('vendaIndex').value;
  const quantidadeVenda = parseInt(document.getElementById('quantidadeVenda').value);
  const valorVenda = parseFloat(document.getElementById('valorVenda').value);

  if (isNaN(quantidadeVenda) || quantidadeVenda <= 0) {
    alert('Quantidade inválida.');
    return;
  }

  if (isNaN(valorVenda) || valorVenda <= 0) {
    alert('Valor de venda inválido.');
    return;
  }

  registrarVenda(index, quantidadeVenda, valorVenda);
  modalVenda.hide();
});

formReposicao.addEventListener('submit', (e) => {
  e.preventDefault();
  const index = document.getElementById('reposicaoIndex').value;
  const quantidadeReposicao = parseInt(document.getElementById('quantidadeReposicao').value);

  if (isNaN(quantidadeReposicao) || quantidadeReposicao <= 0) {
    alert('Quantidade inválida.');
    return;
  }

  reposicionarEstoque(index, quantidadeReposicao);
  modalReposicao.hide();
});

window.onload = carregarEstoque;
