const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list')
const paragraffoDescricaoTarefa = document.querySelector('.app__section-active-task-description')



// Seleciona os botões do formulário
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');
const btnConfirmar = document.querySelector('.app__form-footer__button--confirm');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null



function atualizarTarefas (){
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa (tarefa) {
 const li = document.createElement('li');
 li.classList.add('app__section-task-list-item');

 const svg = document.createElement('div');
 svg.innerHTML = `
         <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
             `
 const paragrafo = document.createElement('p')
 paragrafo.textContent = tarefa.descricao;
 paragrafo.classList.add('app__section-task-list-item-description')

 const botao = document.createElement('button')
 botao.classList.add('app_button-edit')

 botao.onclick = () => {
    const novaDescricao = prompt("Qual é o novo nome da tarefa?")
    if (novaDescricao) {
        paragrafo.textContent = novaDescricao
        tarefa.descricao = novaDescricao
        atualizarTarefas()
    }
    

 }


 const imagemBotao = document.createElement('img')
 imagemBotao.setAttribute('src', '/imagens/edit.png')

 botao.append(imagemBotao)
 li.append(svg)
 li.append(paragrafo)
 li.append(botao)

 if(tarefa.completa){
     li.classList.add('app__section-task-list-item-complete')
     botao.setAttribute('disabled', 'disabled')
 }else{
    li.onclick = () => {
     document.querySelectorAll('.app__section-task-list-item-active')
    .forEach(elemento => {
        elemento.classList.remove('app__section-task-list-item-active')
    })
    if(tarefaSelecionada == tarefa){
        paragraffoDescricaoTarefa.textContent = ''
        tarefaSelecionada = null
        liTarefaSelecionada = null
        return
    }
    tarefaSelecionada = tarefa
    liTarefaSelecionada = li
    paragraffoDescricaoTarefa.textContent = tarefa.descricao
   
    li.classList.add('app__section-task-list-item-active')
 }
 
}
    return(li)
 }

 


btnAdicionarTarefa.addEventListener('click', () => {
    
    formAdicionarTarefa.classList.toggle('hidden')
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        if (textarea.value.trim() === '') {
        alert('Por favor, insira uma descrição para a tarefa');
        return;
    }
    
    const tarefa = {
        descricao: textarea.value.trim(),
        completa: false
    };
    
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    limparFormulario();
} )

tarefas.forEach(tarefa => {
  const elementoTarefa =   criarElementoTarefa(tarefa)
  ulTarefas.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true;
        atualizarTarefas()
    }
})


const removerTarefas = (somenteCompletas) =>{
    //  const seletor = somenteCompletas ? "'.app__section-task-list-item-complete" : ".app__section-task-list-item"
    let seletor = ".app__section-task-list-item"
    if (somenteCompletas){
        seletor = ".app__section-task-list-item-complete"

    }
     document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
     })
     tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
     atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)


// Função para limpar e esconder o formulário
function limparFormulario() {
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
}

// Evento para o botão Cancelar
btnCancelar.addEventListener('click', (e) => {
    e.preventDefault();
    limparFormulario();
});

// Evento para o botão Deletar
btnDeletar.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmacao = confirm('Tem certeza que deseja descartar esta tarefa?');
    if (confirmacao) {
        limparFormulario();
    }
});
