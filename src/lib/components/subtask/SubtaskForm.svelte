<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Input from '$lib/components/common/Input.svelte';
    
    const dispatch = createEventDispatcher();
    
    let title = '';
    let description = '';
    let status = 'Not Started';
    
    function handleSubmit() {
      dispatch('submit', {
        title,
        description,
        status
      });
    
      // Reset form
      title = '';
      description = '';
      status = 'Not Started';
    }
    </script>
    
    <form on:submit|preventDefault={handleSubmit}>
      <Input label="Subtask Title" name="title" bind:value={title} required />
      
      <div>
        <label for="description">Description</label>
        <textarea id="description" bind:value={description}></textarea>
      </div>
    
      <div>
        <label for="status">Status</label>
        <select id="status" bind:value={status}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    
      <Button type="submit">Create Subtask</Button>
    </form>
    
    <style>
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 400px;
        margin: 20px 0;
      }
    
      textarea, select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    </style>