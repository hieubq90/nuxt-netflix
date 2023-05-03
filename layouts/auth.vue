<template>
  <div class="h-screen w-screen">
    <div
      class="relative h-full w-full bg-[url(images/hero.jpg)] bg-cover bg-fixed bg-center bg-no-repeat"
    >
      <div
        class="h-full w-full"
        un-bg="black lg:opacity-50"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
