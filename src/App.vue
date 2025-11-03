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
<div v-if="weather" class="text-white flex flex-col w-screen h-screen bg-black">
  <div class="ml-5 xl:ml-25 flex flex-col justify-center h-2/3 center">
    <div v-if="editingCity">
      <input v-model="cityInput" @keyup.enter="updateCity" @blur="updateCity" class="transition duration-300 ease-in-out border-b-2 ring-0 p-1 rounded text-neutral-300 mb-5" placeholder="Enter city"/> 
        </div>
    <h2 v-else class="mb-1 text-neutral-600 md:text-xl transition duration-300 ease-in-out"><a @click="editingCity = true" class="cursor-pointer">{{ weather.location.name }}, <span class="text-lg text-neutral-800">{{ weather.location.region }}</span><i class="pi pi-pencil text-sm"></i></a></h2> 
    <h1 class="mb-1 text-5xl font-light">Today is <span class="font-bold">{{Math.round(weather.current.temp_c)}}°C <span class="text-lg text-neutral-800">(feels like {{ Math.round(weather.current.feelslike_c) }} °C)</span></span></h1>
    <h2 class="text-neutral-600 text-xl flex">{{ weather.current.condition.text }}</h2> 
  </div>
    <div class="flex mr-20 md:ml-25 flex-col md:flex-row items-center gap-15 overflow-scroll h-36 snap-y snap-mandatory">
      <div class="w-65 snap-center" v-for="(day, d) in weather.forecast.forecastday" :key="d">
        <h1 class="text-2xl text-neutral-100 font-bold">{{ day.date.slice(-5).replace('-', '.') }} <span class="text-neutral-500 text-sm">({{ Math.round(day.day.avgtemp_c) }} °C) <span class="text-sm">{{ day.day.condition.text }}</span></span></h1>
        <div v-for="(hour, h) in day.hour.filter(h => ['00:00', '06:00', '12:00', '18:00'].includes(h.time.slice(-5)))" :key="h" class="flex justify-between items-center">
        <h1 class="text-xl text-neutral-600 font-light">{{ hour.time.slice(-5) }} </h1>
        <h1 class="text-xl text-neutral-600 font-bold">{{ Math.round(hour.temp_c) }} °C <span class="text-sm">({{ Math.round(hour.feelslike_c)  }} °C)</span></h1>
      </div>
      </div>
      
    </div>
</div>
</template>

<style scoped>

</style>
