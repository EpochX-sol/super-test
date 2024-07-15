<script lang="ts">
    export let type: string = 'text';
    export let label: string;
    export let value: string = '';
    export let name: string;
    export let required: boolean = false;
    </script>
    
    <div class="input-group">
      <label for={name}>{label}</label>
      <input {type} {name} bind:value {required} id={name}>
    </div>
    
    <style>
      .input-group {
        margin-bottom: 1rem;
      }
    
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
    
      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    </style>