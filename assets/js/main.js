const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <a href="#${pokemon.number}" data-open="modal${pokemon.number}">
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
        </a>
    `;
}

function convertPokemonToModal(pokemon) {
    
    let lineStat = "";
    for (let i = 0; i < pokemon.stats.length; i++) {
        lineStat += `<tr><td>${pokemon.stats[i][1]} = ${pokemon.stats[i][0]}</td></tr>`;
    }
    
    return `
    <div class="modal" id="modal${pokemon.number}">
        <div class="modal-dialog ${pokemon.type}"">
            <header class="modal-header">
                <h2>${pokemon.name}  <span style="font-size: 1.1rem;">&#10148; #${pokemon.number}</span></h2>
                <button class="close-modal" aria-label="close modal" data-close>✕</button>
                </header>
                
                <section class="modal-content">
                <img src="${pokemon.photo}" alt="${pokemon.name}" width="30%" height="auto">
                <p>
                <ul style="list-style: none;">
                <li style="display: inline-block;"><h3 style="margin-left: -1rem;">Peso: ${pokemon.weight} kg</h3></li> &#9865;
                <li style="display: inline-block;"><h3><h3>Altura: ${pokemon.height} m</h3></h3></li>
                
                <br>
                ${pokemon.types.map((type) => `<li style="display: inline-block; margin-right: 5px;" class="stat ${type}">${type}</li>`).join('')}
            
                
                </ul>
                </p>
                <table align="center">
                    <thead>
                        <tr>
                            <th class="${pokemon.type}" style="filter: brightness(1.20);">STATUS POKEMON</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        ${lineStat}
                        
                    </tbody>
                </table>
                
                
                </section>
             
        </div>
    </div>
    `;
}


function chamarModal () {
    const openEls = document.querySelectorAll("[data-open]");
    const isVisible1 = "is-visible";
    for(const el of openEls) {
    el.addEventListener("click", function() {
        const modalId = this.dataset.open;
        document.getElementById(modalId).classList.add(isVisible1);
    });
    }

    const closeEls = document.querySelectorAll("[data-close]");
    const isVisible2 = "is-visible";
    for (const el of closeEls) {
    el.addEventListener("click", function() {
        this.parentElement.parentElement.parentElement.classList.remove(isVisible2);
    });
    }

    const isVisible3 = "is-visible";
    document.addEventListener("click", e => {
    if (e.target == document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove(isVisible3);
    }
    });

    const isVisible4 = "is-visible";
    document.addEventListener("keyup", e => {
    if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove(isVisible4);
    }
    });
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        const newModal = pokemons.map(convertPokemonToModal).join('');
        pokemonList.insertAdjacentHTML('afterend', newModal);
        chamarModal();
    })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
})


