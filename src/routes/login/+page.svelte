<script>
    import { authHandler } from '$lib/stores/userStore'
    import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function handleLogin(e) {
      e.preventDefault();
      try {
        const user = await authHandler.login(email, password);
        console.log(user);
        goto('/projects');
      } catch (e) {
        error = e.message;
      }
    }
  </script>
  
  <h1>Login</h1>
  <form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <p>Don't have an account? <a href="/signup">Sign up</a></p>