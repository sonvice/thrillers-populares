//API KEY
const apiKey = '9d13fcef48d5353656dc4b1146a298ce';
//ID Peliculas
const idPeli = 'https://api.themoviedb.org/3/movie/634649/videos?api_key=9d13fcef48d5353656dc4b1146a298ce&language=en-US'
//Dom Selection
const peliImage = document.getElementById('peli-image');
const peliLIst = document.getElementById('list-peli')
const main = document.getElementById('main')
//Crear Elemento pop up
const body = document.querySelector('body');
//Nodos
const modalContent = document.createElement('div')
const iframeModal = document.createElement('iframe')
const closeX = document.createElement('i')
//Loader
const loader = document.getElementById('loader');
//Paginación
const paginacion = document.getElementById('paginacion')
//Content API
let apiPeliculas = [];
let apiTrailer = [];
//Number Pagination
let num = 10;
//Button Series
const btnSeries = document.getElementById('series');
const btnPeliculas = document.getElementById('peliculas');

//Dark Mode
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIconBox = document.getElementById('toggle-icon-box');
const iconDarMoon = document.getElementById('icon');
const navigation = document.querySelector('.navigation');

//Estado
function imageMode(estado) {
    iconDarMoon.src = `images/icon/${estado}.svg`;
}

function darkMode() {
    toggleIconBox.children[0].textContent = 'Dark Mode';
    imageMode('moon')
    navigation.style.backgroundColor = 'hsl(217 37.5% 28.2% / .6)';
}
function lightMode() {
    toggleIconBox.children[0].textContent = 'Light Mode';
    imageMode('sun')
    navigation.style.backgroundColor = 'hsl(0 0% 98% / .6)';
}
//Evento Switch
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkMode()

    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        lightMode()
    }

}
//Revisar Local Storage
const currenTheme = localStorage.getItem('theme');
if (currenTheme) {
    document.documentElement.setAttribute('data-theme', currenTheme);
    if (currenTheme === 'dark') {
        toggleSwitch.checked = true;
        darkMode()
    }
}


toggleSwitch.addEventListener('change', switchTheme);



//Loader
function loading() {
    loader.hidden = false;
    main.hidden = true;
}

function complete() {
    loader.hidden = true;
    main.hidden = false;
}


//Paginación
let fragment = new DocumentFragment();

for (let i = 1; i <= num; i++) {
    let li = document.createElement('li')
    li.textContent = i;
    fragment.append(li)
}
paginacion.appendChild(fragment);

let numPagina;
let numPagina1;
let contentList;

//Variable guarda num página
numPagina1 = document.querySelectorAll('.paginacion li')
numPagina1[0].setAttribute('class', 'active-page')
//Active Paginación
contentList = document.querySelector('.paginacion')

function nunActives() {
    numPagina1.forEach((item) => {
        item.addEventListener('click', () => {
            //Menu active
            contentList.querySelector('.active-page').classList.remove('active-page')
            item.classList.add('active-page')

            numPagina = item.textContent;

            getPeliculas()
            peliLIst.innerHTML = '';

        })
    })
}

nunActives()


//Active BTN Series y Películas  
let page1Serie;
let page1Movie;
let peliculaActive = 'movie';
btnSeries.addEventListener('click', () => {
    peliculaActive = 'tv';
    peliLIst.innerHTML = '';
    btnSeries.classList.add('active')
    btnPeliculas.classList.remove('active')
    paginaDeInicio()
})

btnPeliculas.addEventListener('click', () => {
    peliculaActive = 'movie';
    peliLIst.innerHTML = '';
    btnSeries.classList.remove('active')
    btnPeliculas.classList.add('active')
    paginaDeInicio()
})

//Función que al hacer click en cualquier botón de series o películas te manada a la pagina 1
function paginaDeInicio() {

    numPagina1.forEach((itenPag) => {
        //Menu active
        contentList.querySelector('.active-page').classList.remove('active-page')
        numPagina = itenPag.textContent;
        numPagina1[0].setAttribute('class', 'active-page')
    })

    numPagina = numPagina1[0].textContent
    getPeliculas()
}

//Mostrar Película
function showPeli() {

    apiPeliculas.results.forEach(pelicula => {

        if (pelicula.title != null) {
            //Insertar HTML 
            peliLIst.innerHTML +=
                `<li>
                <div class="box-img"><img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" class="link-trailer" alt="${pelicula.title}" title="${pelicula.title}"  data-id="${pelicula.id}"></div>
                <h2 data-trailer="${pelicula.overview}" id="${pelicula.title}" aria-describedby="tooltip">${pelicula.title}</h2>
                <time>${pelicula.release_date}</time>
                </li>
                `
        } else {
            //Insertar HTML 
            peliLIst.innerHTML +=
                `<li>
                <div class="box-img"><img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" class="link-trailer" alt="${pelicula.title}" data-id="${pelicula.id}"></div>
                <h2 data-trailer="${pelicula.overview}" id="${pelicula.title}" aria-describedby="tooltip">${pelicula.name}</h2>
                <time>${pelicula.first_air_date}</time>
                </li>
                `
        }
    });

    complete()
    clickVideo()
}



//Consulta de peliculas
async function getPeliculas() {
    loading()

    const apiUrl = `https://api.themoviedb.org/3/${peliculaActive}/popular?api_key=${apiKey}&language=en-US&page=${numPagina}`;
    try {
        const respond = await fetch(apiUrl);
        apiPeliculas = await respond.json();
        showPeli();

    }
    catch (err) {

    }

}

let dataID;

//Consultar trailer de película
async function getTrailer() {

    const apiIDTrailer = `https://api.themoviedb.org/3/${peliculaActive}/${dataID}/videos?api_key=${apiKey}&language=en-US`;
    try {
        const respuesta = await fetch(apiIDTrailer);
        apiTrailer = await respuesta.json();

        if (apiTrailer.results[0].key == null) {

            let keyUrl = `https://www.youtube.com/embed/${apiTrailer.results[1].key}`
            iframeModal.setAttribute('src', keyUrl)
        } else {
            let keyUrl = `https://www.youtube.com/embed/${apiTrailer.results[0].key}`
            iframeModal.setAttribute('src', keyUrl)
        }

    }
    catch (error) {

    }
}


//Event Listener
function clickVideo() {
    const linkTrailer = document.querySelectorAll('.link-trailer');

    linkTrailer.forEach((img) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            //Get data ID
            dataID = img.dataset.id
            modalContent.setAttribute('class', 'popup')
            modalContent.append(closeX, iframeModal);
            body.append(modalContent)
            modalContent.setAttribute('class', 'active-modal')
            iframeModal.setAttribute('class', 'frame-active')

            closeX.innerText = '☒';
            closeX.addEventListener('click', () => {
                let parentNode = closeX.parentNode
                parentNode.remove()
            })
            getTrailer()

        })
    })
}

getPeliculas()


