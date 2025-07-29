
const tabelaRelatorio = document.getElementById('tabelaRelatorio').getElementsByTagName('tbody')[0];
const totalVendasElement = document.getElementById('totalVendas');
const totalLucroElement = document.getElementById('totalLucro');

async function carregarRelatorio() {
    const response = await fetch('http://localhost:3000/vendas');
    const vendas = await response.json();

    tabelaRelatorio.innerHTML = '';
    let totalVendas = 0;
    let totalLucro = 0;

    vendas.forEach(venda => {
        const lucroOuPrejuizo = (venda.valorUnitario * venda.quantidade - venda.custoTotal).toFixed(2);
        const lucroOuPrejuizoTexto = lucroOuPrejuizo >= 0 ? `Lucro: R$ ${lucroOuPrejuizo}` : `Prejuízo: R$ ${Math.abs(lucroOuPrejuizo)}`;
        const corClasse = lucroOuPrejuizo >= 0 ? 'text-success' : 'text-danger';

        tabelaRelatorio.innerHTML += `
            <tr>
                <td>${venda.nome}</td>
                <td>${venda.quantidade}</td>
                <td>R$ ${venda.total}</td>
                <td>${venda.data}</td>
                <td class="${corClasse}">${lucroOuPrejuizoTexto}</td>
            </tr>
        `;

        totalVendas += parseFloat(venda.total);
        totalLucro += parseFloat(lucroOuPrejuizo);
    });

    totalVendasElement.textContent = totalVendas.toFixed(2);
    totalLucroElement.textContent = totalLucro.toFixed(2);
}

window.onload = carregarRelatorio;
