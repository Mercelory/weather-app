<script setup lang="ts">

import {ref, onMounted} from 'vue'
import { weatherApi } from './weatherApi';

import 'primeicons/primeicons.css'

const weather = ref<any>(null)
const cityInput = ref('')
const editingCity = ref(false)

async function updateCity() {
  if (!cityInput.value) {
    editingCity.value = false
    return
  }
  const data = await weatherApi(cityInput.value)
  if (data) weather.value = data 
  editingCity.value = false
  cityInput.value = ''
}

async function getWeather() {
  const data = await weatherApi('auto:ip')
  if(data) weather.value = data 
}

onMounted(() => getWeather())
</script>

<template>
  <div v-if="weather" class="text-white flex flex-col w-screen h-screen">
    <div class="ml-5 xl:ml-25 flex flex-col justify-center h-2/3 center">
      <transition name="fade">
        <div v-if="editingCity" key="input">
          <input
            v-model="cityInput"
            @keyup.enter="updateCity"
            @blur="updateCity"
            class="p-1 text-neutral-300"
            placeholder="Enter city"
          />
        </div>
        <h2 v-else key="text" class="mb-1 text-neutral-600 md:text-xl">
          <a @click="editingCity = true" class="cursor-pointer text-neutral-400 font-bold">
            {{ weather.location.name }}, 
            <span class="text-lg text-neutral-800">{{ weather.location.region }}</span>
            <i class="ml-2 pi pi-pencil text-sm text-neutral-800"></i>
          </a>
        </h2>
      </transition>
    <h1 class="mb-1 text-5xl font-light text-neutral-400">Today is <span class="font-bold text-neutral-400">{{Math.round(weather.current.temp_c)}}°C <span class="text-sm text-neutral-800 md:text-xl font-light">(feels like {{ Math.round(weather.current.feelslike_c) }} °C)</span></span></h1>
    <h2 class="text-neutral-800 text-xl flex font-light"><span class="text-neutral-800">Maybe,</span> <span class="font-bold ml-1 text-neutral-300"> {{ weather.current.condition.text }}</span></h2> 
  </div>
  <p class="ml-5 text-center text-neutral-800 md:hidden">scroll <i class="pi pi-arrow-down"></i></p>
    <div class="flex md:ml-25 flex-col md:flex-row items-center gap-15 overflow-auto h-38 snap-y snap-mandatory">
      <div class="w-screen md:w-64 snap-center px-5" v-for="(day, d) in weather.forecast.forecastday" :key="d">
        <h1 class="text-2xl text-neutral-100 font-bold">{{ day.date.slice(-5).replace('-', '.') }} <span class="text-neutral-500 text-sm ml-2">({{ Math.round(day.day.avgtemp_c) }} °C) <span class="text-sm">{{ day.day.condition.text }}</span></span></h1>
        <div v-for="(hour, h) in day.hour.filter(h => ['00:00', '06:00', '12:00', '18:00'].includes(h.time.slice(-5)))" :key="h" class="flex justify-between items-center">
        <h1 class="text-xl text-neutral-600 font-light">{{ hour.time.slice(-5) }} </h1>
        <h1 class="text-xl text-neutral-600 font-bold">{{ Math.round(hour.temp_c) }} °C <span class="text-sm">({{ Math.round(hour.feelslike_c)  }} °C)</span></h1>
      </div>
      </div>
      <p class="md:hidden">nazar telka</p>
    </div>
</div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
