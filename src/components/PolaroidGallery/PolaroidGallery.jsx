import { useState } from 'react';
import gsap from 'gsap';
import './PolaroidGallery.css';

const memories = [
  {
    id: 1,
    image: '/yearend (1).jpg',
    title: 'Valentine\'s Day 2024',
    date: 'February 14, 2024',
    story: 'A perfect day filled with love and laughter. We celebrated our special bond with dinner and endless conversations.'
  },
  {
    id: 2,
    image: '/yearend (8).jpg',
    title: 'MPL Tournament',
    date: 'March 2024',
    story: 'Epic gaming session with the squad! We dominated the Mobile Legends tournament and made unforgettable memories.'
  },
  {
    id: 3,
    image: '/yearend (14).jpg',
    title: 'Mystery Adventures',
    date: 'April 2024',
    story: 'Those spontaneous adventures that turn into the best stories. Never knew where we\'d end up!'
  },
  {
    id: 4,
    image: '/yearend (3).jpg',
    title: 'Cat Café Day',
    date: 'May 2024',
    story: 'CATTOS! Spent the entire afternoon surrounded by adorable felines. Best therapy session ever.'
  },
  {
    id: 5,
    image: '/yearend (19).jpg',
    title: 'Pre-Defense Victory Pose',
    date: 'September 2024',
    story: 'That moment before the defense when you know you\'ve got this. Team spirit at its peak!'
  },
  {
    id: 6,
    image: '/yearend (17).jpg',
    title: 'Post-Exam Samgyup',
    date: 'October 2024',
    story: 'Celebrating survival! Nothing beats unlimited Korean BBQ after crushing those exams.'
  },
  {
    id: 7,
    image: '/yearend (6).jpg',
    title: 'ANTIPS 2K25',
    date: 'November 2024',
    story: 'The event that brought everyone together. Dancing, laughing, and creating core memories.'
  },
  {
    id: 8,
    image: '/yearend (21).jpg',
    title: 'LabGuard Team photo',
    date: 'December 2024',
    story: 'The dream team that made it all possible. From late nights to early triumphs - we did it together!'
  },
];

export default function PolaroidGallery() {
  const [selectedMemory, setSelectedMemory] = useState(null);

  const openModal = (memory) => {
    setSelectedMemory(memory);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMemory(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="polaroid-section" id="polaroids">
      <div className="polaroid-header">
        <h2 className="polaroid-title">Your 2024 Memories</h2>
        <p className="polaroid-subtitle">Click any polaroid to reveal the story</p>
      </div>

      <div className="polaroid-grid">
        {memories.map((memory, index) => {
          // Random Christmas decoration
          const decorations = ['🎅', '🦌', '⛄', '🎄', '🍬'];
          const decoration = decorations[index % decorations.length];
          
          return (
            <div
              key={memory.id}
              className="polaroid-card"
              onClick={() => openModal(memory)}
              data-aos="flip-left"
              data-aos-delay={index * 100}
            >
              {/* Christmas decoration overlay */}
              <div className="polaroid-decoration">{decoration}</div>
              
              <div className="polaroid-image-wrapper">
                <img src={memory.image} alt={memory.title} className="polaroid-image" />
              </div>
              <div className="polaroid-caption">
                <p className="polaroid-caption-text">{memory.title}</p>
                <span className="polaroid-date">{memory.date}</span>
              </div>
              
              {/* Tape effect */}
              <div className="polaroid-tape"></div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedMemory && (
        <div className="polaroid-modal" onClick={closeModal}>
          <div className="polaroid-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="polaroid-modal-close" onClick={closeModal}>×</button>
            <div className="polaroid-modal-image">
              <img src={selectedMemory.image} alt={selectedMemory.title} />
            </div>
            <div className="polaroid-modal-details">
              <h3 className="polaroid-modal-title">{selectedMemory.title}</h3>
              <p className="polaroid-modal-date">{selectedMemory.date}</p>
              <p className="polaroid-modal-story">{selectedMemory.story}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
