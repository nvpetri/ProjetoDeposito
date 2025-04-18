document.addEventListener("DOMContentLoaded", () => {
    const estoque = JSON.parse(localStorage.getItem("estoque") || "[]");
  
    const totalCusto = estoque.reduce((acc, item) => acc + (item.custo * item.quantidade), 0);
    const totalVenda = estoque.reduce((acc, item) => acc + (item.venda * item.quantidade), 0);
    const totalProdutos = estoque.length;
  
    document.getElementById("estoqueTotal").textContent = `R$ ${totalCusto.toFixed(2)}`;
    document.getElementById("valorVenda").textContent = `R$ ${totalVenda.toFixed(2)}`;
    document.getElementById("produtosCadastrados").textContent = totalProdutos;
  });
  