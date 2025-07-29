
const tabelaEntradas = document.getElementById('tabelaEntradas');
const totalInvestidoElement = document.getElementById('totalInvestido');
const totalRepostosElement = document.getElementById('totalRepostos');

async function carregarEntradas() {
    const response = await fetch('http://localhost:3000/materiais');
    const estoque = await response.json();

    let totalInvestido = 0;
    let totalProdutosRepostos = 0;

    tabelaEntradas.innerHTML = '';

    estoque.forEach((produto) => {
        if (produto.quantidade > 0) {
            const totalInvestidoProduto = produto.custo * produto.quantidade;
            totalInvestido += totalInvestidoProduto;
            totalProdutosRepostos += produto.quantidade;

            tabelaEntradas.innerHTML += `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${produto.quantidade}</td>
                    <td>R$ ${produto.custo.toFixed(2)}</td>
                    <td>R$ ${totalInvestidoProduto.toFixed(2)}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
            `;
        }
    });

    totalInvestidoElement.textContent = `R$ ${totalInvestido.toFixed(2)}`;
    totalRepostosElement.textContent = totalProdutosRepostos;
}

window.onload = carregarEntradas;
