import { useEffect } from 'react';
import './SnowCursor.css';

export default function SnowCursor() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'snow-cursor-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const snowflakes = [];
    const maxSnowflakes = 50;
    
    class Snowflake {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.opacity = 1;
        this.life = 60; // frames
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life--;
        this.opacity = this.life / 60;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        // Sparkle effect
        if (Math.random() > 0.95) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 38, 38, ${this.opacity * 0.5})`;
          ctx.fill();
        }
      }
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Add snowflakes at cursor position
      for (let i = 0; i < 3; i++) {
        if (snowflakes.length < maxSnowflakes) {
          snowflakes.push(new Snowflake(
            mouseX + (Math.random() - 0.5) * 20,
            mouseY + (Math.random() - 0.5) * 20
          ));
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = snowflakes.length - 1; i >= 0; i--) {
        snowflakes[i].update();
        snowflakes[i].draw();
        
        if (snowflakes[i].life <= 0) {
          snowflakes.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);
  
  return null;
}
