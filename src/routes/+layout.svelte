<script lang="ts">
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    </script>
    
    <div class="app">
      <Header />
      <main>
        <slot></slot>
      </main>
      <Footer />
    </div>
    
    <style>
      .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
    
      main {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }
    
      :global(body) {
        margin: 0;
        font-family: Arial, sans-serif;
      }
    </style>