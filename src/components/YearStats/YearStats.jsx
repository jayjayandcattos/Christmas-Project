import { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import './YearStats.css';

const stats = [
  { number: 365, label: 'Days of Memories', suffix: '' },
  { number: 1247, label: 'Photos Captured', suffix: '+' },
  { number: 52, label: 'Adventures', suffix: '' },
  { number: 100, label: 'Laughs Per Day', suffix: '%' },
];

export default function YearStats() {
  const statsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            const endVal = parseInt(entry.target.dataset.value);
            const suffix = entry.target.dataset.suffix || '';
            
            const countUp = new CountUp(entry.target, endVal, {
              duration: 2.5,
              useEasing: true,
              useGrouping: true,
              suffix: suffix,
            });
            
            if (!countUp.error) {
              countUp.start();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statsRef.current.forEach((stat) => {
      if (stat) observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="year-stats-section" id="stats">
      <div className="stats-content">
        <h2 
          className="stats-title"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          Your 2024 in Numbers
        </h2>
        <p 
          className="stats-subtitle"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          A year worth celebrating
        </p>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
              data-aos-duration="1000"
            >
              <div className="stat-number-wrapper">
                <span
                  ref={(el) => (statsRef.current[index] = el)}
                  className="stat-number"
                  data-index={index}
                  data-value={stat.number}
                  data-suffix={stat.suffix}
                >
                  0
                </span>
              </div>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
