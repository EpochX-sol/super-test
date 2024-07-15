<script lang="ts">
    import { onMount } from 'svelte';
    import { projects, projectStore } from '$lib/stores/projectsStore';
    import { user } from '$lib/stores/userStore';
    import ProjectCard from '$lib/components/project/ProjectCard.svelte';
    import ProjectForm from '$lib/components/project/ProjectForm.svelte';
    
    let showForm = false;
    
    onMount(async () => {
      if ($user) {
        await projectStore.loadProjects($user.id);
      }
    });
    
    function toggleForm() {
      showForm = !showForm;
    }
    
    async function handleProjectCreate(event) {
      const newProject = event.detail;
      await projectStore.addProject({ ...newProject, userId: $user.id });
      showForm = false;
    }
    </script>
    
    <h1>My Projects</h1>
    
    <button on:click={toggleForm}>
      {showForm ? 'Cancel' : 'Create New Project'}
    </button>
    
    {#if showForm}
      <ProjectForm on:submit={handleProjectCreate} />
    {/if}
    
    <div class="project-list">
      {#each $projects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
    
    <style>
      .project-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
    </style>