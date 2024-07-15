<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from '$lib/components/common/Button.svelte';
    import SubtaskList from '$lib/components/subtask/SubtaskList.svelte';
    import SubtaskForm from '$lib/components/subtask/SubtaskForm.svelte';
    import { projectStore } from '$lib/stores/projectsStore';
    
    export let tasks;
    export let projectId;
    
    const dispatch = createEventDispatcher();
    
    let expandedTaskId = null;
    let showSubtaskForm = false;
    
    function handleStatusChange(taskId, newStatus) {
      dispatch('updateTask', { taskId, data: { status: newStatus } });
    }
    
    function handleDeleteTask(taskId) {
      dispatch('deleteTask', taskId);
    }
    
    function toggleExpand(taskId) {
      expandedTaskId = expandedTaskId === taskId ? null : taskId;
      showSubtaskForm = false;
    }
    
    function toggleSubtaskForm() {
      showSubtaskForm = !showSubtaskForm;
    }
    
    async function handleSubtaskCreate(event) {
      const newSubtask = event.detail;
      await projectStore.addSubtask(expandedTaskId, newSubtask);
      showSubtaskForm = false;
      // Refresh the task to show the new subtask
      const updatedTask = await projectStore.getTask(expandedTaskId);
      tasks = tasks.map(task => task.id === expandedTaskId ? updatedTask : task);
    }
    
    async function handleUpdateSubtask(event) {
      const { subtaskId, data } = event.detail;
      await projectStore.updateSubtask(subtaskId, data);
      // Refresh the task to show the updated subtask
      const updatedTask = await projectStore.getTask(expandedTaskId);
      tasks = tasks.map(task => task.id === expandedTaskId ? updatedTask : task);
    }
    
    async function handleDeleteSubtask(subtaskId) {
      await projectStore.deleteSubtask(subtaskId);
      // Refresh the task to remove the deleted subtask
      const updatedTask = await projectStore.getTask(expandedTaskId);
      tasks = tasks.map(task => task.id === expandedTaskId ? updatedTask : task);
    }
    </script>
    
    <div class="task-list">
      {#each tasks as task (task.id)}
        <div class="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          {#if task.startDate}
            <p>Start Date: {new Date(task.startDate).toLocaleDateString()}</p>
          {/if}
          {#if task.dueDate}
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          {/if}
          <div class="task-actions">
            <select on:change={(e) => handleStatusChange(task.id, e.target.value)}>
              <option value="Not Started" selected={task.status === 'Not Started'}>Not Started</option>
              <option value="In Progress" selected={task.status === 'In Progress'}>In Progress</option>
              <option value="Completed" selected={task.status === 'Completed'}>Completed</option>
            </select>
            <Button on:click={() => toggleExpand(task.id)}>
              {expandedTaskId === task.id ? 'Hide Subtasks' : 'Show Subtasks'}
            </Button>
            <Button variant="danger" on:click={() => handleDeleteTask(task.id)}>Delete</Button>
          </div>
          
          {#if expandedTaskId === task.id}
            <div class="subtasks-section">
              <h4>Subtasks</h4>
              <Button on:click={toggleSubtaskForm}>
                {showSubtaskForm ? 'Cancel' : 'Add Subtask'}
              </Button>
              
              {#if showSubtaskForm}
                <SubtaskForm on:submit={handleSubtaskCreate} />
              {/if}
              
              <SubtaskList 
                subtasks={task.subtasks} 
                taskId={task.id}
                on:updateSubtask={handleUpdateSubtask}
                on:deleteSubtask={handleDeleteSubtask}
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <style>
      .task-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
    
      .task-item {
        background-color: #f0f0f0;
        border-radius: 8px;
        padding: 16px;
      }
    
      .task-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
    
      .subtasks-section {
        margin-top: 20px;
        border-top: 1px solid #ccc;
        padding-top: 10px;
      }
    </style>