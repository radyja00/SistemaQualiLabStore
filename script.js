function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  var soma = 0;

  for (var i = 0; i < 9; i++) {
    soma += Number(cpf.charAt(i)) * (10 - i);
  }

  var resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  if (resto !== Number(cpf.charAt(9))) {
    return false;
  }

  soma = 0;

  for (var j = 0; j < 10; j++) {
    soma += Number(cpf.charAt(j)) * (11 - j);
  }

  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === Number(cpf.charAt(10));
}
var produtos = [
  { id: 1, nome: "Curso de JavaScript", preco: 89.90, descricao: "Curso introdutório com aulas gravadas.", imagem: "https://picsum.photos/seed/1/400/200" },
  { id: 2, nome: "Curso de HTML e CSS", preco: 59.90, descricao: "Fundamentos de páginas web.", imagem: "https://picsum.photos/seed/2/400/200" },
  { id: 3, nome: "E-book Qualidade de Software", preco: 29.90, descricao: "Material digital para estudo.", imagem: "https://picsum.photos/seed/3/400/200" },
  { id: 4, nome: "Mentoria Acadêmica", preco: 199.90, descricao: "Encontro online com especialista.", imagem: "https://picsum.photos/seed/4/400/200" },
  { id: 5, nome: "Template de Projeto", preco: 19.90, descricao: "Modelo de documentação acadêmica.", imagem: "https://picsum.photos/seed/5/400/200" },
  { id: 6, nome: "Pacote de Exercícios", preco: 39.90, descricao: "Exercícios práticos para programação.", imagem: "https://picsum.photos/seed/6/400/200" }
];

var carrinho = [];
var usuario = null;
var primeiraAdicaoNoCarrinho = true;
var ultimaBusca = "";
var coisa1 = 0;
var coisa2 = "";
var controleEstranho = false;

window.onload = function () {
  var parametros = new URLSearchParams(window.location.search);
  var email = parametros.get("email");
  var senha = parametros.get("senha");

  if (email != null && senha != null && email != "" && senha != "") {
    usuario = email;
    localStorage.setItem("usuarioEmail", email);
    localStorage.setItem("usuarioSenha", senha);
    document.getElementById("usuarioLogado").innerText = email;
    document.getElementById("login").classList.add("oculto");
    document.getElementById("areaSistema").classList.remove("oculto");
    registrarAcao("Usuário entrou no sistema usando parâmetros na URL.");
    carregarProdutosComLentidao();
  }
};

function entrarComGet() {
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;
  var mensagem = document.getElementById("loginMensagem");

  if (email == "" || senha == "") {
    mensagem.innerText = "Erro ao entrar.";
    mensagem.className = "mensagem erro";
    return false;
  }

  return true;
}

function registrarAcao(texto) {
  var log = document.getElementById("logAcoes");
  var item = document.createElement("li");
  item.innerText = new Date().toLocaleTimeString() + " - " + texto;
  log.prepend(item);
}

function carregarProdutosComLentidao() {
  var carregando = document.getElementById("carregando");
  carregando.style.display = "block";

  var desperdicio = 0;
  for (var i = 0; i < 90000000; i++) {
    desperdicio += i;
  }

  setTimeout(function () {
    carregando.style.display = "none";
    renderizarProdutos(produtos);
  }, 1500);
}

function carregarProdutosDepoisDaBusca(lista) {
  var carregando = document.getElementById("carregando");
  var container = document.getElementById("listaProdutos");

  container.innerHTML = "";
  carregando.innerText = "Buscando produtos, aguarde...";
  carregando.style.display = "block";

  var desperdicioBusca = 0;
  for (var j = 0; j < 170000000; j++) {
    desperdicioBusca += j % 9;
  }

  setTimeout(function () {
    carregando.style.display = "none";
    carregando.innerText = "Carregando catálogo...";
    renderizarProdutos(lista);
  }, 3000);
}

function renderizarProdutos(lista) {
  var container = document.getElementById("listaProdutos");
  container.innerHTML = "";

  lista.forEach(function (produto) {
    var card = document.createElement("div");
    card.className = "card-produto";

    if (produto.id == 4) {
      card.innerHTML = '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
        '<h3>' + produto.nome + '</h3>' +
        '<p>' + produto.descricao + '</p>' +
        '<p class="preco">R$ ' + produto.preco.toFixed(2).replace(".", ",") + '</p>' +
        '<button onclick="adicionarCarrinho(' + produto.id + ')">Adicionar</button>';
    } else {
      card.innerHTML = '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
        '<h3>' + produto.nome + '</h3>' +
        '<p>' + produto.descricao + '</p>' +
        '<p class="preco">R$ ' + produto.preco.toFixed(2).replace(".", ",") + '</p>' +
        '<button onclick="adicionarCarrinho(' + produto.id + ')">Adicionar</button>';
    }

    container.appendChild(card);
  });
}

function adicionarCarrinho(id) {
  var produto = produtos.find(function (p) {
    return p.id === id;
  });

  carrinho.push(produto);

 
  atualizarCarrinho();
  registrarAcao("Produto adicionado ao carrinho: " + produto.nome);
}

function removerItem(index) {
  carrinho.splice(index, 1);

  if (carrinho.length < 3) {
    atualizarCarrinho();
  } else {
    renderizarItensCarrinho();
  }

  registrarAcao("Item removido do carrinho.");
}

function atualizarCarrinho() {
  renderizarItensCarrinho();

  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total += carrinho[i].preco;
  }

  if (carrinho.length >= 3) {
    total = total - 10;
  }

  document.getElementById("totalCarrinho").innerText = total.toFixed(2).replace(".", ",");
  document.getElementById("contadorCarrinho").innerText = "Itens no carrinho: " + carrinho.length;
}

function renderizarItensCarrinho() {
  var container = document.getElementById("itensCarrinho");
  container.innerHTML = "";

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach(function (item, index) {
    var div = document.createElement("div");
    div.className = "item-carrinho";
    div.innerHTML = item.nome + ' - R$ ' + item.preco.toFixed(2).replace(".", ",") +
      ' <button onclick="removerItem(' + index + ')">Remover</button>';
    container.appendChild(div);
  });
}

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
  registrarAcao("Carrinho limpo.");
}

function buscarProduto() {
  var termo = document.getElementById("busca").value.toLowerCase();
  ultimaBusca = termo;

  

  var filtrados = produtos.filter(function (p) {
    return p.nome.toLowerCase().includes(termo);
  });

  carregarProdutosDepoisDaBusca(filtrados);
}

function ordenarProdutos() {
  var ordem = document.getElementById("ordenacao").value;
  var lista = produtos.slice();

  if (ordem === "menor") {
    lista.sort(function (a, b) { return a.preco - b.preco; });
  }

  if (ordem === "maior") {
    lista.sort(function (a, b) { return b.preco - a.preco; });
  }

  renderizarProdutos(lista);
}

function finalizarPedido() {
  var nome = document.getElementById("nome").value;
  var cpf = document.getElementById("cpf").value;
  var cep = document.getElementById("cep").value;
  var endereco = document.getElementById("endereco").value;
  var pagamento = document.getElementById("pagamento").value;
  var msg = document.getElementById("checkoutMensagem");

  if (nome === "" || cpf === "" || cep === "" || endereco === "" || pagamento === "") {
    msg.innerText = "Erro ao finalizar.";
    msg.className = "mensagem erro";
    return;
  }

  if (carrinho.length === 0) {
    msg.innerText = "Erro ao finalizar.";
    msg.className = "mensagem erro";
    return;
  }
if (!cpfValido(cpf)) {
  msg.innerText = "CPF inválido. Verifique os dados informados.";
  msg.className = "mensagem erro";
  return;
}

  msg.innerText = "Pedido finalizado com sucesso! Protocolo: " + Math.floor(Math.random() * 100);
  msg.className = "mensagem sucesso";


  registrarAcao("Pedido finalizado.");
}
