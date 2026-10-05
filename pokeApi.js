const prompt = require("prompt-sync")();

async function buscarPokemon(nombre) {
  const respuesta = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`,
  );

  if (!respuesta.ok) {
    console.log("Algo salió mal. Código:", respuesta.status);
    return null;
  }

  return await respuesta.json();
}

async function probar() {
  const pedirPokemon = prompt("Escribe el nombre del pokemon: ");
  const prueba = await buscarPokemon(pedirPokemon);
  mostrarFicha(prueba);
}

function mostrarFicha(datos) {
  if (!datos) {
    console.log("No hay nada que mostrar");
    return;
  }

  console.log(`Nombre: ${datos.name.toUpperCase()}`);
  console.log(`Id: ${datos.id}`);

  let listaTipos = [];
  for (let t of datos.types) {
    listaTipos.push(t.type.name);
  }
  console.log(`Tipos: ${listaTipos.join(" / ")}`);

  let altura = datos.height * 10;
  let peso = datos.weight / 10;
  console.log(`Altura: ${altura} cm`);
  console.log(`Peso: ${peso} kg`);

  for (let s of datos.stats) {
    console.log(`Stats: ${s.stat.name} -> ${s.base_stat}`);
  }

  for (let a of datos.abilities) {
    if (a.is_hidden === true) {
      console.log(`Habilidades: ${a.ability.name} (oculta)`);
    } else {
      console.log(`Habilidades: ${a.ability.name}`);
    }
  }
}

function obtenerStat(datos, nombreStat) {
  if (!datos) {
    return null;
  }

  for (let s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat;
    }
  }
  return null;
}

async function compararPokemon(nombre1, nombre2, stat) {
  let paquetePokemon1 = await buscarPokemon(nombre1);
  let paquetePokemon2 = await buscarPokemon(nombre2);

  if (!paquetePokemon1 || !paquetePokemon2) {
    console.log("No se puede comparar");

    return;
  }

  let statPokemon1 = obtenerStat(paquetePokemon1, stat);
  let statPokemon2 = obtenerStat(paquetePokemon2, stat);

  let listaStatValida = [];

  if (statPokemon1 === null || statPokemon2 === null) {
    for (let sv of paquetePokemon1.stats) {
      listaStatValida.push(sv.stat.name);
    }
    console.log(
      `La stast no es valida. Por favor escribir alguna de las sigueintes:  ${listaStatValida.join(" - ")}`,
    );
    return;
  } else if (statPokemon1 > statPokemon2) {
    console.log(
      `${paquetePokemon1.name.toUpperCase()} tiene ${statPokemon1} de ${stat} y ${paquetePokemon2.name.toUpperCase()} tiene ${statPokemon2} de ${stat}. Gana ${paquetePokemon1.name.toUpperCase()}!`,
    );
  } else if (statPokemon1 < statPokemon2) {
    console.log(
      `${paquetePokemon2.name.toUpperCase()} tiene ${statPokemon2} de ${stat} y ${paquetePokemon1.name.toUpperCase()} tiene ${statPokemon1} de ${stat}. Gana ${paquetePokemon2.name.toUpperCase()}!`,
    );
  } else {
    console.log(`Es un empate`);
  }
}

async function pokemonMasFuerte(listaNombres, stat) {
  let mejorPokemon = null;
  let mejorStat = -1;

  for (let buscarMejorPokemon of listaNombres) {
    let nombreActualPokemon = await buscarPokemon(buscarMejorPokemon);

    if (nombreActualPokemon === null) {
      continue;
    }
    let actualStatPokemon = obtenerStat(nombreActualPokemon, stat);

    if (actualStatPokemon === null) {
      continue;
    }

    if (actualStatPokemon > mejorStat) {
      mejorPokemon = nombreActualPokemon.name;
      mejorStat = actualStatPokemon;
    }
  }

  if (mejorPokemon === null) {
    console.log("Nadie es valido");
    return null;
  }

  console.log(
    `El mejor pokemon de tu equipo en ${stat} es ${mejorPokemon.toUpperCase()} con ${mejorStat}.`,
  );

  return mejorPokemon;
}
compararPokemon("gengar", "charizard", "special-attack");
pokemonMasFuerte(["charizard", "nidoking", "gengar", "aerodactyl", "lapras", "meowth"], "speed");
probar();
