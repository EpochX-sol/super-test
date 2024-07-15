<script lang="ts">
  import { user, authHandler } from '$lib/stores/userStore';
  import { goto } from '$app/navigation';
  
  async function handleLogout() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
      await authHandler.logout();
      goto('/login');
    }
  }
</script>

<header>
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    {#if $user}
      <li><a href="/projects">Projects</a></li>
      <li><button on:click={handleLogout}>Logout</button></li>
    {:else}
      <li><a href="/login">Login</a></li>
      <li><a href="/signup">Sign Up</a></li>
    {/if}
  </ul>
</nav>
</header>

<style>
header {
  background:  #135D66;
  color: white;
  padding: .2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;  
}

nav li {
  margin-left: 1rem;
}

nav a, nav button {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;  
}

nav a:hover, nav button:hover {
  color: #ffd700; 
}

nav button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem; 
  border-radius: 5px; 
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: center;
  }
}
</style>
