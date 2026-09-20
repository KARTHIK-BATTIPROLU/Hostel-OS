import confetti from 'canvas-confetti';

/**
 * Real Web Audio API Soundbox synthesizer.
 * Creates an authentic PhonePe / Paytm / BharatPe soundbox multi-tone chime
 * without requiring external audio files or internet access!
 */
export function playSoundboxChime(amount?: number, studentName?: string) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Sequence of frequencies for a pleasant modern smart speaker chime (C5 -> E5 -> G5 -> C6)
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.12 },
      { freq: 659.25, time: 0.12, dur: 0.12 },
      { freq: 783.99, time: 0.24, dur: 0.16 },
      { freq: 1046.50, time: 0.40, dur: 0.35 }
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });

    // Fire joyful festive confetti burst
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Voice announcement via Web Speech Synthesis if available
    if ('speechSynthesis' in window && amount) {
      setTimeout(() => {
        try {
          window.speechSynthesis.cancel(); // Clear any pending speech queue
          const utterance = new SpeechSynthesisUtterance(
            `PhonePe received payment of rupees ${amount}${studentName ? ` from ${studentName}` : ''}.`
          );
          utterance.rate = 1.05;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore speech errors if browser blocks speech
        }
      }, 700);
    }
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
}

/**
 * Onboarding success chime: warm welcoming two-tone chime
 */
export function playOnboardingChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const notes = [
      { freq: 440.0, time: 0.00, dur: 0.15 },
      { freq: 880.0, time: 0.15, dur: 0.30 }
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.time + note.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  } catch {
    // ignore
  }
}
