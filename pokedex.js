const input = document.getElementById('pokemonInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const pokedex = document.getElementById('pokedex');
const sound = document.getElementById('pokeballSound');

const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let exibidos = JSON.parse(localStorage.getItem("exibidos")) || [];

// Função para criar o card do Pokémon
const criaCardPokemon = (pokemon) => {
  const tipos = pokemon.types.map(t => t.type.name).join(', ');

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <button class="favorite-btn ${favoritos.includes(pokemon.name) ? 'favorited' : ''}" data-name="${pokemon.name}">
      ❤️
    </button>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name}</h2>
    <p>Tipo: ${tipos}</p>
  `;

  pokedex.appendChild(card);

  card.querySelector('.favorite-btn').addEventListener('click', (e) => {
    const name = e.target.dataset.name;
    if (favoritos.includes(name)) {
      const index = favoritos.indexOf(name);
      favoritos.splice(index, 1);
      e.target.classList.remove('favorited');
    } else {
      favoritos.push(name);
      e.target.classList.add('favorited');
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  });
};

// Buscar Pokémon
const buscaPokemon = async () => {
  const valor = input.value.toLowerCase().trim();
  if (!valor) return;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
    if (!response.ok) throw new Error("Pokémon não encontrado");

    const pokemon = await response.json();

    // Salvar no array de exibidos se não existir ainda
    if (!exibidos.includes(pokemon.name)) {
      exibidos.push(pokemon.name);
      localStorage.setItem("exibidos", JSON.stringify(exibidos));
    }

    criaCardPokemon(pokemon);
    sound.play();
    input.value = "";

  } catch (err) {
    alert("Pokémon não encontrado 😢");
    console.error(err);
  }
};

// Carregar Pokémons exibidos ao abrir a página
const carregarExibidos = async () => {
  for (const nome of exibidos) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      const pokemon = await res.json();
      criaCardPokemon(pokemon);
    } catch (err) {
      console.error("Erro ao carregar Pokémon salvo:", err);
    }
  }
};

searchBtn.addEventListener('click', buscaPokemon);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscaPokemon();
});
clearBtn.addEventListener('click', () => {
  pokedex.innerHTML = "";
  exibidos = [];
  localStorage.removeItem("exibidos");
});

// Carregar ao iniciar a página
carregarExibidos();
