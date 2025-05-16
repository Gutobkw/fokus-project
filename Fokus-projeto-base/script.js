const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const starPauseBtn = document.querySelector('#start-pause');
const iniciarOuPausarBtn = document.querySelector('#start-pause span');
const startPauseIcon = document.querySelector('img.app__card-primary-butto-icon');

const tempoNaTela = document.querySelector('#timer')


const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const musicaStart = new Audio('/sons/play.wav');
const musicaPause = new Audio('/sons/pause.mp3');
const musicaBeep = new Audio('/sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500
let intervaloId = null



musica.loop = true


musicaFocoInput.addEventListener('change', () => {
    if(musica.paused){
        musica.play()
    }else {
        musica.pause()
    }
})

focoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco')
    focoBtn.classList.add('active')
})

curtoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto')
    curtoBtn.classList.add('active')

})

longoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo')
    longoBtn.classList.add('active')
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            
            break;
         case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong"> Faça uma pausa curta!</strong> ` 

            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.
                               <strong class="app__title-strong"> Faça uma pausa longa.</strong> ` 

                default:
                    break;
    }
}

const contagemRegrssiva = () =>{
    if(tempoDecorridoEmSegundos <= 0){
        
        musicaBeep.play();
        alert('tempo finalizado!')
        const focoAtivo = html.getAttribute('data-contexto') === "foco"
        if (focoAtivo){
            const evento = new Event('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar()
        reiniciarTemporizador();
        return
        
    }
    
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

starPauseBtn.addEventListener('click', iniciarOuPausar )

function iniciarOuPausar (){
    if(intervaloId){
        zerar();
        musicaPause.play();
        startPauseIcon.src = "/imagens/play_arrow.png";
        return
    }
    musicaStart.play();
    intervaloId = setInterval(contagemRegrssiva, 1000)
     startPauseIcon.src = "/imagens/pause.png";
    iniciarOuPausarBtn.textContent = "Pausar"
}
function zerar(){
    clearInterval(intervaloId)
    startPauseIcon.src = "/imagens/play_arrow.png";
    iniciarOuPausarBtn.textContent = "Começar"
    intervaloId = null
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

function reiniciarTemporizador() {
    switch(html.getAttribute('data-contexto')) {
        case 'foco':
            tempoDecorridoEmSegundos = 1500;
            break;
        case 'descanso-curto':
            tempoDecorridoEmSegundos = 300;
            break;
        case 'descanso-longo':
            tempoDecorridoEmSegundos = 900;
            break;
    }
    mostrarTempo();
}
mostrarTempo()