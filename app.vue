<script setup lang="ts">
  import { ref } from "vue";
  import { getSkyscannerFlight, getSkyscannerPlace, SkyscannerFlightResponse } from "./test_skyloc";

  const username = ref("");
  const isLoggedIn = ref(false);

  const source = ref("");
  const destination = ref("");
  const date = ref("");
  const flightResults = ref<SkyscannerFlightResponse | null>(null);

  function login() {
    if (username.value.trim() === "") {
      alert("Introdueix un nom d'usuari de Trakt");
      return;
    }

    isLoggedIn.value = true;
  }

  async function searchFlights() {
    if (!source.value || !destination.value || !date.value) {
      alert("Omple tots els camps");
      return;
    }

    const sourcePlace = await getSkyscannerPlace(source.value);
    const destPlace = await getSkyscannerPlace(destination.value);

    if (!sourcePlace || !destPlace) {
      alert("No s'han trobat llocs per als aeroports");
      return;
    }

    const result = await getSkyscannerFlight(sourcePlace.entityId, destPlace.entityId, date.value);
    flightResults.value = result;
  }
</script>

<template>
  <main class="app">
    <section v-if="!isLoggedIn" class="login-card">
      <h1>SkyFilmScanner</h1>
      <p>Introdueix el teu usuari de Trakt per descobrir viatges basats en les teves pel·lícules i sèries.</p>

      <input v-model="username" type="text" placeholder="Usuari de Trakt" @keyup.enter="login" />

      <button @click="login">
        Entrar
      </button>
    </section>

    <section v-else>
      <h1>Hola, {{ username }}</h1>
      <p>Aquí mostrarem les recomanacions de viatge.</p>

      <div class="flight-search">
        <h2>Cerca vols</h2>
        <input v-model="source" type="text" placeholder="Origen" />
        <input v-model="destination" type="text" placeholder="Destinació" />
        <input v-model="date" type="date" placeholder="Data" />
        <button @click="searchFlights">Cerca</button>

        <div v-if="flightResults" class="results">
          <h3>Resultats</h3>
          <p>Estat: {{ flightResults.status }}</p>
          <p>Acció: {{ flightResults.action }}</p>
          <pre>{{ JSON.stringify(flightResults.content, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .app {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    background: #f4f7fb;
  }

  .login-card {
    width: 360px;
    padding: 32px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    text-align: center;
  }

  input {
    width: 100%;
    padding: 12px;
    margin: 20px 0 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #0062e3;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background: #004fb8;
  }

  .flight-search {
    margin-top: 20px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .flight-search input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .flight-search button {
    width: auto;
    padding: 10px 20px;
  }

  .results {
    margin-top: 20px;
  }

  .results pre {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
</style>