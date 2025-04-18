// script.js para a página de Saídas

const tabelaSaidas = document.getElementById('tabelaSaidas');
const totalInvestido = document.getElementById('totalInvestido');
const totalRepostos = document.getElementById('totalRepostos');

function carregarSaidas() {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    
    tabelaSaidas.innerHTML = '';
    
    let totalVendido = 0;
    let totalQuantidadeVendida = 0;

    vendas.forEach(venda => {
        const valorTotalVenda = (venda.valorUnitario * venda.quantidade).toFixed(2);
        totalVendido += parseFloat(valorTotalVenda);
        totalQuantidadeVendida += venda.quantidade;

        tabelaSaidas.innerHTML += `
        <tr>
            <td>${venda.nome}</td>
            <td>${venda.quantidade}</td>
            <td>R$ ${venda.valorUnitario.toFixed(2)}</td>
            <td>R$ ${valorTotalVenda}</td>
            <td>${venda.data}</td>
        </tr>
        `;
    });

    // Atualiza o valor total investido (vendido) e total de produtos vendidos
    totalInvestido.innerText = `R$ ${totalVendido.toFixed(2)}`;
    totalRepostos.innerText = totalQuantidadeVendida;

    // Armazena o total vendido no localStorage para uso em outras páginas (como o Dashboard)
    localStorage.setItem('totalVendido', totalVendido.toFixed(2));
}

// Carregar as saídas ao carregar a página
window.onload = carregarSaidas;
