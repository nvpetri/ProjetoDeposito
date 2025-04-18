// entradas.js

const tabelaEntradas = document.getElementById('tabelaEntradas');
const totalInvestidoElement = document.getElementById('totalInvestido');
const totalRepostosElement = document.getElementById('totalRepostos');

// Carregar entradas de estoque
function carregarEntradas() {
    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    let totalInvestido = 0;
    let totalProdutosRepostos = 0;
    
    tabelaEntradas.innerHTML = '';

    // Percorre o estoque e exibe os produtos que foram repostos
    estoque.forEach((produto) => {
        if (produto.quantidade > 0) { // Considerando apenas produtos com estoque positivo
            const totalInvestidoProduto = produto.custo * produto.quantidade;
            totalInvestido += totalInvestidoProduto;
            totalProdutosRepostos += produto.quantidade;

            // Exibe a linha na tabela
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

// Carrega as entradas quando a página for carregada
window.onload = carregarEntradas;
