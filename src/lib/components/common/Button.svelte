<script lang="ts">
    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
    </script>
    
    <button {type} class={variant} on:click>
      <slot></slot>
    </button>
    
    <style>
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }
    
      .primary {
        background-color: #4CAF50;
        color: white;
      }
    
      .primary:hover {
        background-color: #45a049;
      }
    
      .secondary {
        background-color: #f0f0f0;
        color: #333;
      }
    
      .secondary:hover {
        background-color: #e0e0e0;
      }
    
      .danger {
        background-color: #f44336;
        color: white;
      }
    
      .danger:hover {
        background-color: #d32f2f;
      }
    </style>