<script setup lang="ts">
  import { ref } from "vue";

  const username = ref("");
  const isLoggedIn = ref(false);

  function login() {
    if (username.value.trim() === "") {
      alert("Introdueix un nom d'usuari de Trakt");
      return;
    }

    isLoggedIn.value = true;
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
</style>