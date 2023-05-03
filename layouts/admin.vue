<template>
  <div class="relative h-screen w-screen bg-[url(images/hero.jpg)] bg-cover bg-fixed bg-center bg-no-repeat">
    <v-layout>
      <v-navigation-drawer
        class="backdrop-blur-lg"
        color="transparent"
        permanent
        width="250"
        style="borderRight: thin solid rgba(255, 255, 255, .8) !important;"
      >
        <div class="flex flex-col px-1 pt-2">
          <NuxtLink class="px-5" to="/">
            <img
              src="/images/logo.png"
              alt="Logo"
              class="h-12"
            >
          </NuxtLink>
        </div>
        <v-list nav class="text-white">
          <v-list-item prepend-icon="mdi-tag-multiple" title="Thể loại" value="genres" to="/admin/genres" />
          <v-list-item prepend-icon="mdi-movie" title="Phim" value="movies" to="/admin/movies" />
          <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Người dùng" value="users" to="/admin/users" />
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        class="backdrop-blur-lg"
        color="transparent"
        height="64"
        flat
        :order="0"
        style="borderBottom: thin solid rgba(255, 255, 255, .8) !important;"
      >
        <v-app-bar-title class="font-semibold text-white">
          Quản trị viên
        </v-app-bar-title>
        <template #append>
          <v-avatar color="white" class="mr-4 cursor-pointer">
            <span class="text-h5">CJ</span>
          </v-avatar>
        </template>
      </v-app-bar>

      <v-main>
        <v-container
          class="d-flex justify-center pr-8"
          style="minHeight: calc(100vh - 112px); maxHeight: calc(100vh - 112px);"
        >
          <slot />
        </v-container>
      </v-main>
      <v-app-bar
        class="justify-center backdrop-blur-lg"
        color="transparent"
        flat
        height="48"
        location="bottom"
        style="borderTop: thin solid rgba(255, 255, 255, .8) !important;"
      >
        <div class="w-full flex items-center justify-center">
          <p class="text-center font-semibold text-white">
            Nuxt Netflix Clone ©2023 Cloned by HieuBQ
          </p>
        </div>
      </v-app-bar>
    </v-layout>
  </div>
</template>
