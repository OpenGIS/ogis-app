<template>
  <div id="app">
    <header>
      <Icon name="polygon" size="32" color="black" text="Polygon" />
    </header>

    <article>
      <main>
        <slot />
      </main>
    </article>
  </div>
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;

  header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background-color: #f0f0f0;

    img {
      padding: 10px;
      width: 32px;
      height: 32px;
    }
  }

  article {
    padding-top: 48px;
    height: calc(100% - 48px);

    main {
      height: 100%;
    }
  }
}
</style>
