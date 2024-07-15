<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/userStore';
  
    onMount(() => {
      if (!$user) {
        goto('/login');
      }
    });
  </script>
  
  <h1>Welcome to Project Manager</h1> 
    <a href="/projects">View Projects</a> 