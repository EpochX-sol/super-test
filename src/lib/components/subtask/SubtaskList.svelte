<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from '$lib/components/common/Button.svelte';
    
    export let subtasks;
    export let taskId;
    
    const dispatch = createEventDispatcher();
    
    function handleStatusChange(subtaskId, newStatus) {
      dispatch('updateSubtask', { subtaskId, data: { status: newStatus } });
    }
    
    function handleDeleteSubtask(subtaskId) {
      dispatch('deleteSubtask', subtaskId);
    }
    </script>
    
    <div class="subtask-list">
      {#each subtasks as subtask (subtask.id)}
        <div class="subtask-item">
          <h4>{subtask.title}</h4>
          <p>{subtask.description}</p>
          <p>Status: {subtask.status}</p>
          <div class="subtask-actions">
            <select on:change={(e) => handleStatusChange(subtask.id, e.target.value)}>
              <option value="Not Started" selected={subtask.status === 'Not Started'}>Not Started</option>
              <option value="In Progress" selected={subtask.status === 'In Progress'}>In Progress</option>
              <option value="Completed" selected={subtask.status === 'Completed'}>Completed</option>
            </select>
            <Button variant="danger" on:click={() => handleDeleteSubtask(subtask.id)}>Delete</Button>
          </div>
        </div>
      {/each}
    </div>
    
    <style>
      .subtask-list {
        margin-top: 10px;
      }
    
      .subtask-item {
        background-color: #f8f8f8;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
      }
    
      .subtask-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
    </style>