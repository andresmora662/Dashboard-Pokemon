let todosLosDatosPokemones = [];
let pokemonChart;

async function ObtenerDatosPokemon() {
  try {
    const respuesta = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=10"
    );

    const pokemonDatos = respuesta.data.results;

    const alturaEnMetros = await Promise.all(
      pokemonDatos.map(async (pokemon) => {
        const respuesta = await axios.get(pokemon.url);

        return respuesta.data.height / 10;
      })
    );

    todosLosDatosPokemones = pokemonDatos.map((pokemon, index) => ({
      name: pokemon.name,
      height: alturaEnMetros[index],
    }));

    crearChart(todosLosDatosPokemones);
  } catch (error) {
    console.error("Error al intentar obtener datos", error);
  }
}

function crearChart(data) {
  if (pokemonChart) {
    pokemonChart.destroy();
  }
  const ctx = document.getElementById("pokemonChart").getContext("2d");

  pokemonChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: data.map((pokemon) => pokemon.name),

      datasets: [
        {
          label: "Altura del Pokémon en metros",

          data: data.map((pokemon) => pokemon.height),

          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function buscarPokemon() {
  const InputBuscarPokemon = document.getElementById("nombrePokemon");
  const ValorInputBucarPokemon = InputBuscarPokemon.value.toLowerCase();

  if (!ValorInputBucarPokemon) {
    crearChart(todosLosDatosPokemones);
  } else {
    const filtrarPokemon = todosLosDatosPokemones.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(ValorInputBucarPokemon)
    );
    crearChart(filtrarPokemon);
  }
}

async function mostrarPanelPokemon() {
  await ObtenerDatosPokemon();
}

document.addEventListener("DOMContentLoaded", mostrarPanelPokemon);
