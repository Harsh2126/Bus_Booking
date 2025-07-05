import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return <div>Component loaded successfully</div>;
} 