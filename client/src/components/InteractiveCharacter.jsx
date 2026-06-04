import { useEffect, useRef, useState } from 'react';
import '../styles/globals.css';

export default function InteractiveCharacter() {
  const containerRef = useRef(null);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation based on mouse position
      const rotateY = (mouseX / rect.width) * 25; // Clamp to ±25 degrees
      const rotateX = -(mouseY / rect.height) * 20; // Clamp to ±20 degrees

      setHeadRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setHeadRotation({ x: 0, y: 0 });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="character-container"
      style={{
        perspective: '1200px',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isHovering ? 'grab' : 'default',
      }}
    >
      {/* Character body - 3D cube aesthetic */}
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '250px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main body */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '25px',
            width: '150px',
            height: '120px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '16px',
            boxShadow: `
              inset -4px -4px 12px rgba(0, 0, 0, 0.2),
              inset 4px 4px 12px rgba(255, 255, 255, 0.1),
              0 20px 40px rgba(99, 102, 241, 0.3)
            `,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            animation: isHovering ? 'float 3s ease-in-out infinite' : 'none',
          }}
        >
          {/* Jacket/Outfit accent - orange band */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '-8px',
              right: '-8px',
              height: '40px',
              background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
              borderRadius: '8px',
              opacity: 0.9,
              boxShadow: '0 8px 16px rgba(249, 115, 22, 0.3)',
            }}
          />

          {/* Arms - left */}
          <div
            style={{
              position: 'absolute',
              left: '-45px',
              top: '30px',
              width: '40px',
              height: '60px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '12px',
              transform: 'rotateZ(-15deg)',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
              transition: 'transform 0.3s ease',
            }}
          />

          {/* Arms - right */}
          <div
            style={{
              position: 'absolute',
              right: '-45px',
              top: '30px',
              width: '40px',
              height: '60px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '12px',
              transform: 'rotateZ(15deg)',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            }}
          />

          {/* Belly badge */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
              background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '50%',
              boxShadow: 'inset -2px -2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(251, 191, 36, 0.3)',
            }}
          />
        </div>

        {/* Head - interactive 3D element */}
        <div
          style={{
            position: 'absolute',
            bottom: '170px',
            left: '50px',
            width: '100px',
            height: '100px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.08s ease-out',
            transform: `rotateX(${headRotation.x}deg) rotateY(${headRotation.y}deg)`,
          }}
        >
          {/* Head cube */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '16px',
              boxShadow: `
                inset -6px -6px 16px rgba(0, 0, 0, 0.15),
                inset 6px 6px 16px rgba(255, 255, 255, 0.15),
                0 16px 32px rgba(251, 191, 36, 0.3)
              `,
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Eyes container */}
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '20px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {/* Left eye */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#1f2937',
                  borderRadius: '50%',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                  animation: isHovering ? 'blink 3s ease-in-out infinite' : 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    background: '#fff',
                    borderRadius: '50%',
                    top: '3px',
                    left: '4px',
                    opacity: 0.8,
                  }}
                />
              </div>

              {/* Right eye */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#1f2937',
                  borderRadius: '50%',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                  animation: isHovering ? 'blink 3s ease-in-out infinite' : 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    background: '#fff',
                    borderRadius: '50%',
                    top: '3px',
                    left: '4px',
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>

            {/* Mouth */}
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '28px',
                height: '12px',
                background: 'linear-gradient(180deg, #ea580c 0%, #d97706 100%)',
                borderRadius: '0 0 8px 8px',
                animation: isHovering ? 'smile 0.6s ease-in-out infinite' : 'none',
              }}
            />

            {/* Blush - left */}
            <div
              style={{
                position: 'absolute',
                bottom: '35px',
                left: '8px',
                width: '20px',
                height: '16px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />

            {/* Blush - right */}
            <div
              style={{
                position: 'absolute',
                bottom: '35px',
                right: '8px',
                width: '20px',
                height: '16px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>

        {/* Legs */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '24px',
          }}
        >
          {/* Left leg */}
          <div
            style={{
              width: '28px',
              height: '50px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(79, 70, 229, 0.3)',
              animation: isHovering ? 'wiggle 0.5s ease-in-out infinite' : 'none',
            }}
          />

          {/* Right leg */}
          <div
            style={{
              width: '28px',
              height: '50px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(79, 70, 229, 0.3)',
              animation: isHovering ? 'wiggle 0.5s ease-in-out infinite 0.1s' : 'none',
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes blink {
          0%, 90%, 100% { height: 16px; }
          95% { height: 2px; }
        }

        @keyframes smile {
          0%, 100% { height: 12px; }
          50% { height: 16px; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotateZ(0deg); }
          50% { transform: rotateZ(2deg); }
        }
      `}</style>
    </div>
  );
}
