<script lang="ts">
    import { goto } from '$app/navigation';
    
    export let project;
    
    function navigateToProject() {
      goto(`/projects/${project.id}`);
    }
    </script>
    
    <div class="project-card" on:click={navigateToProject}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
      {#if project.endDate}
        <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
      {/if}
    </div>
    
    <style>
      .project-card {
        background-color: #f0f0f0;
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
    
      .project-card:hover {
        background-color: #e0e0e0;
      }
    
      h2 {
        margin-top: 0;
      }
    </style>