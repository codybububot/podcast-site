import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const colors = {
  pastelPink: '#ffd6e0',
  pastelPinkLight: '#fff0f3',
  pastelYellow: '#fff3cd',
  pastelYellowWarm: '#ffe8a3',
  cream: '#fffbf5',
  textDark: '#5c4a4a',
  green: '#81b29a',
  pot: '#e07a5f',
};

const Window: React.FC<{ scale: number }> = ({ scale }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 180 * scale,
        height: 220 * scale,
        background: `linear-gradient(180deg, #ffeaa7 0%, #fdcb6e 100%)`,
        borderRadius: `${20 * scale}px ${20 * scale}px ${4 * scale}px ${4 * scale}px`,
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Window cross */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 8 * scale,
          background: 'rgba(92, 74, 74, 0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 8 * scale,
          transform: 'translateX(-50%)',
          background: 'rgba(92, 74, 74, 0.3)',
        }}
      />

      {/* Plant */}
      <div style={{ position: 'absolute', bottom: 0, left: 20 * scale }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 20 * scale,
              left: '50%',
              width: 18 * scale,
              height: 28 * scale,
              background: colors.green,
              borderRadius: '50%',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${-30 + i * 30 + Math.sin((frame + i * 10) / 15) * 5}deg)`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 28 * scale,
            height: 22 * scale,
            background: colors.pot,
            borderRadius: `${3 * scale}px ${3 * scale}px ${8 * scale}px ${8 * scale}px`,
          }}
        />
      </div>

      {/* Mug with steam */}
      <div style={{ position: 'absolute', bottom: 5 * scale, right: 25 * scale }}>
        <div
          style={{
            width: 24 * scale,
            height: 20 * scale,
            background: colors.pastelPink,
            borderRadius: `${3 * scale}px ${3 * scale}px ${8 * scale}px ${8 * scale}px`,
          }}
        />
        {/* Steam */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 22 * scale + Math.sin((frame + i * 8) / 10) * 6,
              left: 6 * scale + i * 6 * scale,
              width: 3 * scale,
              height: 12 * scale,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 10 * scale,
              opacity: 0.4 + Math.sin((frame + i * 10) / 12) * 0.3,
            }}
          />
        ))}
      </div>

      {/* Window sill */}
      <div
        style={{
          position: 'absolute',
          bottom: -12 * scale,
          left: -15 * scale,
          right: -15 * scale,
          height: 18 * scale,
          background: '#ddb892',
          borderRadius: 4 * scale,
        }}
      />
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animations
  const windowScale = spring({ frame, fps, from: 0, to: 1, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = spring({ frame: frame - 30, fps, from: 30, to: 0, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = spring({ frame: frame - 45, fps, from: 20, to: 0, config: { damping: 12 } });

  // Floating circles
  const circle1Y = Math.sin(frame / 30) * 15;
  const circle2Y = Math.sin((frame + 20) / 25) * 12;

  // Fade out at end
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.pastelPinkLight} 0%, ${colors.cream} 50%, ${colors.pastelYellow} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Outfit, system-ui, sans-serif',
        opacity: fadeOut,
      }}
    >
      {/* Floating circles */}
      <div
        style={{
          position: 'absolute',
          top: -80 + circle1Y,
          right: -30,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: colors.pastelPink,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 50 + circle2Y,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: colors.pastelYellowWarm,
          opacity: 0.5,
        }}
      />

      {/* Window */}
      <div style={{ transform: `scale(${windowScale})`, marginBottom: 40 }}>
        <Window scale={1.2} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 600,
          color: colors.textDark,
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: -1,
        }}
      >
        P人客廳
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 28,
          fontWeight: 300,
          color: '#8b7373',
          margin: 0,
          marginTop: 8,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        unfiltered room
      </p>
    </AbsoluteFill>
  );
};
