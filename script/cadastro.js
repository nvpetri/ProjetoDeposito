
const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');
const modalVenda = new bootstrap.Modal(document.getElementById('modalVenda'));
const modalReposicao = new bootstrap.Modal(document.getElementById('modalReposicao'));
const formVenda = document.getElementById('formVenda');
const formReposicao = document.getElementById('formReposicao');

async function carregarEstoque() {
  const response = await fetch('http://localhost:3000/materiais');
  const estoque = await response.json();
  tabela.innerHTML = '';
  estoque.forEach((item) => {
    tabela.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.tipo}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.custo.toFixed(2)}</td>
        <td class="actions">
          <button onclick="abrirModalVenda(${item.id})">Vender</button>
          <button onclick="abrirModalReposicao(${item.id})">Reposição</button>
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

function abrirModalVenda(id) {
  document.getElementById('vendaIndex').value = id;
  document.getElementById('quantidadeVenda').value = '';
  document.getElementById('valorVenda').value = '';
  modalVenda.show();
}

function abrirModalReposicao(id) {
  document.getElementById('reposicaoIndex').value = id;
  document.getElementById('quantidadeReposicao').value = '';
  modalReposicao.show();
}

async function registrarVenda(id, quantidadeVenda, valorVenda) {
  await fetch('http://localhost:3000/vendas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ materialId: id, quantidade: quantidadeVenda, valorUnitario: valorVenda })
  });
  carregarEstoque();
}

async function reposicionarEstoque(id, quantidadeReposicao) {
  await fetch(`http://localhost:3000/materiais/${id}/reposicao`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade: quantidadeReposicao })
  });
  carregarEstoque();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const tipo = document.getElementById('tipo').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const custo = parseFloat(document.getElementById('custo').value);

  await fetch('http://localhost:3000/materiais', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, tipo, quantidade, custo })
  });

  form.reset();
  carregarEstoque();
});

formVenda.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('vendaIndex').value;
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

  await registrarVenda(id, quantidadeVenda, valorVenda);
  modalVenda.hide();
});

formReposicao.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('reposicaoIndex').value;
  const quantidadeReposicao = parseInt(document.getElementById('quantidadeReposicao').value);

  if (isNaN(quantidadeReposicao) || quantidadeReposicao <= 0) {
    alert('Quantidade inválida.');
    return;
  }

  await reposicionarEstoque(id, quantidadeReposicao);
  modalReposicao.hide();
});

window.onload = carregarEstoque;
