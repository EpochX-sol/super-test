
declare global {
    namespace App {
      interface Locals {
        userid: string;
      }
    }
    interface ImportMetaEnv {
      VITE_JWT_SECRET: string;
    }
  }
  
  export {glo};