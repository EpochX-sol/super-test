<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Input from '$lib/components/common/Input.svelte';
    
    const dispatch = createEventDispatcher();
    
    let name = '';
    let description = '';
    let status = 'Not Started';
    let startDate = new Date().toISOString().split('T')[0];
    let endDate = '';
    
    function handleSubmit() {
      dispatch('submit', {
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      });
    
      // Reset form
      name = '';
      description = '';
      status = 'Not Started';
      startDate = new Date().toISOString().split('T')[0];
      endDate = '';
    }
    </script>
    
    <form on:submit|preventDefault={handleSubmit}>
      <Input label="Project Name" name="name" bind:value={name} required />
      
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
    
      <Input type="date" label="Start Date" name="startDate" bind:value={startDate} required />
      <Input type="date" label="End Date (Optional)" name="endDate" bind:value={endDate} />
    
      <Button type="submit">Create Project</Button>
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