const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaEstoque');

function carregarEstoque() {
  const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
  tabela.innerHTML = '';
  estoque.forEach((item, index) => {
    const total = (item.custo * item.quantidade).toFixed(2);
    tabela.innerHTML += `
      <tr class="border-t">
        <td class="px-4 py-2 whitespace-nowrap">${item.nome}</td>
        <td class="px-4 py-2 whitespace-nowrap">${item.tipo}</td>
        <td class="px-4 py-2 whitespace-nowrap">${item.quantidade}</td>
        <td class="px-4 py-2 whitespace-nowrap">R$ ${item.custo.toFixed(2)}</td>
        <td class="px-4 py-2 whitespace-nowrap">R$ ${item.venda.toFixed(2)}</td>
        <td class="px-4 py-2 whitespace-nowrap">R$ ${total}</td>
        <td class="px-4 py-2 whitespace-nowrap">
          <button onclick="removerProduto(${index})" class="text-red-600 hover:underline">Remover</button>
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