<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { projectStore } from '$lib/stores/projectStore';
    import Button from '$lib/components/common/Button.svelte';
    import TaskList from '$lib/components/task/TaskList.svelte';
    import TaskForm from '$lib/components/task/TaskForm.svelte';
    
    let project;
    let showTaskForm = false;
    
    onMount(async () => {
      const projectId = $page.params.id;
      project = await projectStore.getProject(projectId);
    });
    
    function toggleTaskForm() {
      showTaskForm = !showTaskForm;
    }
    
    async function handleTaskCreate(event) {
      const newTask = event.detail;
      await projectStore.addTask(project.id, newTask);
      showTaskForm = false;
    }
    </script>
    
    <div class="project-detail">
      {#if project}
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <p>Status: {project.status}</p>
        <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
        {#if project.endDate}
          <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
        {/if}
    
        <h2>Tasks</h2>
        <Button on:click={toggleTaskForm}>
          {showTaskForm ? 'Cancel' : 'Add New Task'}
        </Button>
    
        {#if showTaskForm}
          <TaskForm on:submit={handleTaskCreate} />
        {/if}
    
        <TaskList tasks={project.tasks} projectId={project.id} />
      {:else}
        <p>Loading project...</p>
      {/if}
    </div>
    
    <style>
      .project-detail {
        max-width: 800px;
        margin: 0 auto;
      }
    </style>