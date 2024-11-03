import { useEffect, useState } from 'react';

export const ElementCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/mongoose-app/api/elements');
        if (!response.ok) throw new Error('Failed to fetch elements');
        const data = await response.json();
        setCount(data.length);
      } catch (error) {
        console.error('Error fetching element count:', error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg z-50">
      <span className="font-bold">Временных элементов: {count}</span>
    </div>
  );
}; 