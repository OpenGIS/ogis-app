<template>
  <div id="app">
    <header>
      <Icon name="ogis" size="32" color="black" text="Open GIS" />

      <nav>
        <Icon name="polyline" size="32" color="black" text="Polyline" />
        <Icon name="marker" size="32" color="black" text="Marker" />
        <Icon name="circle" size="32" color="black" text="Circle" />
        <Icon name="rectangle" size="32" color="black" text="Rectangle" />
        <Icon name="freehand" size="32" color="black" text="Freehand" />
        <Icon name="clear" size="32" color="black" text="Clear" />
        <Icon name="select" size="32" color="black" text="Select" />
        <Icon name="greatcircle" size="32" color="black" text="Great Circle" />
      </nav>
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

    display: flex;

    background-color: #f0f0f0;

    img {
      padding: 10px;
      width: 32px;
      height: 32px;
    }

    nav {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0;
      gap: 10px;

      img {
        width: 32px;
        height: 32px;
      }
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
