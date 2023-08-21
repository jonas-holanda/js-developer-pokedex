
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    const base_status = pokeDetail.stats.map((base_status) => base_status.base_stat)
    const name_status = pokeDetail.stats.map((name_status) => name_status.stat.name)
    const status = []
    for (let i = 0; i < base_status.length; i++) {
        status[i] = [base_status[i], name_status[i]];
        
    }
    pokemon.height = (pokeDetail.height / 10)
    pokemon.weight = (pokeDetail.weight / 10)

    pokemon.stats = status
    pokemon.types = types
    pokemon.type = type
    
    console.log("Pokemon: "+pokemon.name+" Peso é de: "+pokemon.weight+" e Altura é de: "+pokemon.height)
    console.log("Status do Pokemon")
    console.log(pokemon.stats)
    pokemon.photo = pokeDetail.sprites.versions["generation-v"]["black-white"].animated.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
