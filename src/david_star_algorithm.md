<svg xmlns="http://www.w3.org/2000/svg" viewBox="-250 -250 500 500">
  <!-- Фоновый круг -->
  <circle cx="0" cy="0" r="200" fill="#f0f0f0"/>
  
  <!-- Генерация множества маленьких элементов для первого треугольника -->
  <g>
    {[...Array(60)].map((_, i) => {
      const angle = (i * 6) * Math.PI / 180;
      const r = 180;
      const x1 = r * Math.cos(angle);
      const y1 = r * Math.sin(angle);
      const x2 = (r-30) * Math.cos(angle);
      const y2 = (r-30) * Math.sin(angle);
      return `<line 
        x1="${x1}" 
        y1="${y1}" 
        x2="${x2}" 
        y2="${y2}" 
        stroke="#2957a4" 
        stroke-width="2"
      />`
    }).join('')}
  </g>
  
  <!-- Генерация элементов для второго треугольника -->
  <g transform="rotate(180)">
    {[...Array(60)].map((_, i) => {
      const angle = (i * 6) * Math.PI / 180;
      const r = 180;
      const x1 = r * Math.cos(angle);
      const y1 = r * Math.sin(angle);
      const x2 = (r-30) * Math.cos(angle);
      const y2 = (r-30) * Math.sin(angle);
      return `<line 
        x1="${x1}" 
        y1="${y1}" 
        x2="${x2}" 
        y2="${y2}" 
        stroke="#2957a4" 
        stroke-width="2"
      />`
    }).join('')}
  </g>
  
  <!-- Внутренние соединительные элементы -->
  <g>
    {[...Array(60)].map((_, i) => {
      const angle = (i * 6) * Math.PI / 180;
      const r1 = 150;
      const r2 = 120;
      const x1 = r1 * Math.cos(angle);
      const y1 = r1 * Math.sin(angle);
      const x2 = r2 * Math.cos(angle);
      const y2 = r2 * Math.sin(angle);
      return `<line 
        x1="${x1}" 
        y1="${y1}" 
        x2="${x2}" 
        y2="${y2}" 
        stroke="#1e3c72" 
        stroke-width="1.5"
      />`
    }).join('')}
  </g>
  
  <!-- Центральная звезда -->
  <path d="M0,-100 L86.6,50 L-86.6,50 Z" fill="none" stroke="#1e3c72" stroke-width="2"/>
  <path d="M0,100 L-86.6,-50 L86.6,-50 Z" fill="none" stroke="#1e3c72" stroke-width="2"/>
</svg>