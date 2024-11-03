import { useEffect, useState } from 'react';

interface ElementStats {
  temporary: number;
  permanent: number;
  permanentElements: Array<{
    name: string;
    symbol: string;
    mass: string;
  }>;
}

export const ElementCounter = () => {
  const [stats, setStats] = useState<ElementStats>({
    temporary: 0,
    permanent: 1,
    permanentElements: [{
      name: 'OLOLOSHA',
      symbol: '❤️‍🔥',
      mass: '∞'
    }]
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        // Временное решение с моком данных
        // TODO: Раскомментировать когда API будет готов
        /*
        const response = await fetch('/api/elements/stats');
        const data = await response.json();
        setStats(data);
        */

        // Имитация получения данных
        const mockStats = {
          temporary: Math.floor(Math.random() * 3), // 0-2 временных элемента
          permanent: 1, // Одно постоянное сердце
          permanentElements: [{
            name: 'OLOLOSHA',
            symbol: '❤️‍🔥',
            mass: '∞'
          }]
        };
        setStats(mockStats);
        setError(null);
      } catch (error) {
        console.debug('Stats temporarily unavailable');
        setError('Stats temporarily unavailable');
      }
    };

    fetchStats();
    intervalId = setInterval(fetchStats, 30000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (error) return null;

  return (
    <div className="fixed left-4 top-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
      <div className="text-sm mb-1">Временных элементов: {stats.temporary}</div>
      <div className="text-sm flex items-center mb-1">
        Вечных сердец: {stats.permanent} <span className="ml-1">❤️‍🔥</span>
      </div>
      <div className="text-xs text-pink-300">
        {stats.permanentElements.map((el, index) => (
          <div key={index} className="flex items-center gap-1">
            <span>{el.symbol}</span>
            <span>{el.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 