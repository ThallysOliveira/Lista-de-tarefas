let listas = JSON.parse(localStorage.getItem('listas')) || [];
let listaAtual = null;

const btnNovaLista = document.getElementById('btnNovaLista');
const btnAdicionarTarefa = document.getElementById('btnAdicionarTarefa');
const inputArea = document.getElementById('inputArea');

btnNovaLista.addEventListener('click', criarLista);
btnAdicionarTarefa.addEventListener('click', adicionarTarefa);

function salvar() {
localStorage.setItem('listas', JSON.stringify(listas));
}

function atualizarSidebar() {
const container = document.getElementById('listas');
container.innerHTML = '';

listas.forEach(lista => {
    const div = document.createElement('div');
    div.className = 'lista-item';
    div.dataset.id = lista.id;

    const span = document.createElement('span');
    span.textContent = lista.nome;

    const actions = document.createElement('div');
    actions.className = 'lista-actions';

    const btnEdit = document.createElement('button');
    btnEdit.innerHTML = '✏️';
    btnEdit.addEventListener('click', (e) => {
    e.stopPropagation();
    editarLista(lista.id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.innerHTML = '🗑️';
    btnDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    deletarLista(lista.id);
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    div.appendChild(span);
    div.appendChild(actions);

    div.addEventListener('click', () => selecionarLista(lista.id));

    container.appendChild(div);
});
}

function criarLista() {
const nome = prompt("Nome da nova lista:");
if (!nome) return;
const nova = { id: Date.now(), nome: nome, tarefas: [] };
listas.push(nova);
salvar();
atualizarSidebar();
}

function editarLista(id) {
const lista = listas.find(l => l.id === id);
const novoNome = prompt("Novo nome da lista:", lista.nome);
if (!novoNome) return;
lista.nome = novoNome;
salvar();
atualizarSidebar();
if (listaAtual && listaAtual.id === id) {
    document.getElementById('tituloLista').textContent = novoNome;
}
}

function deletarLista(id) {
if (!confirm("Tem certeza que deseja excluir esta lista?")) return;
listas = listas.filter(l => l.id !== id);
salvar();
atualizarSidebar();
if (listaAtual && listaAtual.id === id) {
    listaAtual = null;
    document.getElementById('tituloLista').textContent = "Selecione uma Lista";
    inputArea.style.display = "none";
    document.getElementById('tarefas').innerHTML = "";
}
}

function selecionarLista(id) {
listaAtual = listas.find(l => l.id === id);
document.getElementById('tituloLista').textContent = listaAtual.nome;
inputArea.style.display = "flex";
atualizarTarefas();
}

function atualizarTarefas() {
const ul = document.getElementById('tarefas');
ul.innerHTML = '';
listaAtual.tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = tarefa.texto;

    const actions = document.createElement('div');
    actions.className = 'tarefa-actions';

    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'confirm';
    btnConfirm.innerHTML = '✅';
    btnConfirm.addEventListener('click', () => concluirTarefa(tarefa.id));

    const btnDelete = document.createElement('button');
    btnDelete.className = 'delete';
    btnDelete.innerHTML = '🗑️';
    btnDelete.addEventListener('click', () => excluirTarefa(tarefa.id, li));

    actions.appendChild(btnConfirm);
    actions.appendChild(btnDelete);

    li.appendChild(span);
    li.appendChild(actions);

    ul.appendChild(li);
});
}

function adicionarTarefa() {
const input = document.getElementById('tarefaInput');
const texto = input.value.trim();
if (!texto) {
    alert("Digite uma tarefa!");
    return;
}

const novaTarefa = { id: Date.now(), texto: texto, concluida: false };
listaAtual.tarefas.push(novaTarefa);
salvar();
atualizarTarefas();
input.value = '';
}

function concluirTarefa(id) {
const tarefa = listaAtual.tarefas.find(t => t.id === id);
tarefa.concluida = !tarefa.concluida;
salvar();
atualizarTarefas();
}

function excluirTarefa(id, elemento) {
listaAtual.tarefas = listaAtual.tarefas.filter(t => t.id !== id);
salvar();
if (elemento) {
    elemento.classList.add('fade-out');
    setTimeout(() => atualizarTarefas(), 500);
} else {
    atualizarTarefas();
}
}

atualizarSidebar();
