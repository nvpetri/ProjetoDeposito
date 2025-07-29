
const tabelaSaidas = document.getElementById('tabelaSaidas');
const totalInvestido = document.getElementById('totalInvestido');
const totalRepostos = document.getElementById('totalRepostos');

async function carregarSaidas() {
    const response = await fetch('http://localhost:3000/vendas');
    const vendas = await response.json();

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

    totalInvestido.innerText = `R$ ${totalVendido.toFixed(2)}`;
    totalRepostos.innerText = totalQuantidadeVendida;
}

window.onload = carregarSaidas;
