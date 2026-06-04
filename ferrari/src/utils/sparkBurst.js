import './sparkBurst.css';

export const triggerSparks = (e, count = 12) => {
  const { clientX, clientY } = e;
  
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark-particle';
    
    // Mix of primary red and molten gold
    const isGold = Math.random() > 0.6;
    spark.style.backgroundColor = isGold ? 'var(--accent)' : 'var(--primary)';
    
    // Random size 3px to 7px
    const size = Math.random() * 4 + 3;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    
    // Set position to exact cursor center
    spark.style.left = `${clientX - size/2}px`;
    spark.style.top = `${clientY - size/2}px`;
    
    // Math for explosion radius
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 40; // distance 40px to 120px
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    
    document.body.appendChild(spark);
    
    // Garbage collection after animation finishes
    setTimeout(() => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 600);
  }
};
