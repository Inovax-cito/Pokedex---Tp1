 const input = document.getElementById("name");
 const formulario = document.querySelector('form');
const PokemonContainer = document.querySelector('.Pokemon-Container')

// function fetchPokemon (id) {
//     fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//          CrearPokemon(data);
//         });
// }

 fetchPokemon(1);

 formulario.addEventListener("submit", async (e) => {
     e.preventDefault();
     const pokemonName = input.value.trim().toLowerCase();

    if (!pokemonName) {
         PokemonContainer.innerHTML = "<p>Ingresa un nombre de Pokémon válido.</p>";
         return;
     }

     PokemonContainer.innerHTML = "";
     
     await fetchPokemon(pokemonName);
 });

async function fetchPokemon(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await res.json();

    console.log(data);
    CrearPokemon(data);
}

async function obtenerDebilidades(types) {
    let debilidades = [];

    for (let type of types) {
        const res = await fetch(type.type.url);
        const data = await res.json();

        debilidades.push(
            ...data.damage_relations.double_damage_from.map(d => d.name)
        );
    }

    return [...new Set(debilidades)];
}

const pokemonContainer = document.getElementById('pokemon-info');

function TiposPokemon(pokemon) {
    return pokemon.types.map(t=> t.type.name).join(' ');
}

function EtiquetaTipos(pokemon) {
    const conteinerTipos = document.createElement('div');
    conteinerTipos.classList.add('pokemonTipos');

    pokemon.types.forEach(t => { const tipo = t.type.name;
        
    const badge = document.createElement('span');
    badge.classList.add('type', tipo);
    badge.textContent = tipo;

    conteinerTipos.appendChild(badge);

    });

    return conteinerTipos;
} 

async function CrearPokemon (pokemon) {
    const Card = document.createElement('div')
    Card.classList.add('pokemon-card')
    const name = pokemon.name;
    const id = pokemon.id.toString().padStart(3,0);
    const img = pokemon.sprites.other['official-artwork'].front_default
    const alt = pokemon.height / 10 ;
    const peso = pokemon.weight / 10;
   let estadisticasHtml = '';
    for (let estadistica of pokemon.stats) {
        estadisticasHtml += `<li>${estadistica.stat.name}: ${estadistica.base_stat}</li>`;
    }
    
    

    Card.innerHTML = `
    <div class="pokemon-mostrar">

    <div class="pokemon-izq">
        <h2 class = "nombreP">${name}</h2>
        <h6 class="pokemonId">N.º ${id}</h6>

        <img class="pokemon-img" src="${img}" alt="${name}">

        <p class = "altP">Altura: ${alt} m</p>
        <p class = "PesoP">Peso: ${peso} kg</p>
    </div>

    <div class="pokemon-der">
        <h4 class = "stats" >Estadisticas</h4>
        <ul class="lista-estadisticas">
                ${estadisticasHtml} </ul>

        <h5>Tipos</h5>
        <div class="tipos-container"></div>

        <h5>Debilidad</h5>
        <div class="debilidades"></div>
    </div>

</div>
 
    `;

   const colortipo = EtiquetaTipos(pokemon);
   Card.querySelector('.tipos-container').appendChild(colortipo);

   const debilidades = await obtenerDebilidades(pokemon.types);

    const debilidadesContainer = Card.querySelector('.debilidades');

    debilidades.forEach(d => {
        const span = document.createElement('span');
        span.classList.add('type', d);
        span.textContent = d;
        debilidadesContainer.appendChild(span);
    });

   PokemonContainer.appendChild(Card);
    
}

