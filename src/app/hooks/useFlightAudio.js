"use client";

import { useEffect, useRef } from "react";

const FLIGHT_MUSIC_TRACKS = [
  "/audio/blues.mp3",
  "/audio/breath.mp3",
  "/audio/honey.mp3",
  "/audio/lazy.mp3",
  "/audio/long.mp3",
  "/audio/moon.mp3",
  "/audio/no_hurry.mp3",
  "/audio/patience.mp3",
  "/audio/pause.mp3",
  "/audio/pour.mp3",
  "/audio/savor.mp3",
  "/audio/soft.mp3",
  "/audio/stirring.mp3",
];

const SEATBELT_AUDIO_SRC = "/audio/seatbelt.wav";
const SEATBELT_DELAY_MS = 3000;
const FLIGHT_MUSIC_VOLUME = 1;
const DUCKED_FLIGHT_MUSIC_VOLUME = 0.25;

const getShuffledTracks = () => {
  const tracks = [...FLIGHT_MUSIC_TRACKS];

  for (let index = tracks.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [tracks[index], tracks[randomIndex]] = [tracks[randomIndex], tracks[index]];
  }

  return tracks;
};

export const useFlightAudio = ({ isMuted }) => {
  const flightAudioRef = useRef(null);
  const isDuckedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const isPlayingRef = useRef(false);
  const musicQueueRef = useRef([]);
  const seatbeltAudioRef = useRef(null);
  const seatbeltTimeoutRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  const applyAudioState = () => {
    const musicAudio = flightAudioRef.current;
    const seatbeltAudio = seatbeltAudioRef.current;

    if (musicAudio) {
      musicAudio.muted = isMutedRef.current;
      musicAudio.volume = isDuckedRef.current
        ? DUCKED_FLIGHT_MUSIC_VOLUME
        : FLIGHT_MUSIC_VOLUME;
    }

    if (seatbeltAudio) {
      seatbeltAudio.muted = isMutedRef.current;
      seatbeltAudio.volume = 1;
    }
  };

  const stopFlightAudio = () => {
    isPlayingRef.current = false;
    isDuckedRef.current = false;
    musicQueueRef.current = [];

    window.clearTimeout(seatbeltTimeoutRef.current);
    window.clearTimeout(stopTimeoutRef.current);

    seatbeltTimeoutRef.current = null;
    stopTimeoutRef.current = null;

    if (flightAudioRef.current) {
      flightAudioRef.current.onended = null;
      flightAudioRef.current.onerror = null;
      flightAudioRef.current.pause();
      flightAudioRef.current = null;
    }

    if (seatbeltAudioRef.current) {
      seatbeltAudioRef.current.onended = null;
      seatbeltAudioRef.current.onerror = null;
      seatbeltAudioRef.current.pause();
      seatbeltAudioRef.current = null;
    }
  };

  const playNextMusicTrack = () => {
    if (!isPlayingRef.current) {
      return;
    }

    if (!musicQueueRef.current.length) {
      musicQueueRef.current = getShuffledTracks();
    }

    const nextTrack = musicQueueRef.current.shift();
    const nextAudio = new Audio(nextTrack);

    if (flightAudioRef.current) {
      flightAudioRef.current.onended = null;
      flightAudioRef.current.onerror = null;
      flightAudioRef.current.pause();
    }

    flightAudioRef.current = nextAudio;
    nextAudio.onended = playNextMusicTrack;
    nextAudio.onerror = playNextMusicTrack;
    applyAudioState();
    nextAudio.play().catch(() => {});
  };

  const playSeatbeltAudio = () => {
    if (!isPlayingRef.current) {
      return;
    }

    isDuckedRef.current = true;
    const seatbeltAudio = new Audio(SEATBELT_AUDIO_SRC);

    seatbeltAudioRef.current = seatbeltAudio;
    applyAudioState();

    const restoreMusicVolume = () => {
      if (seatbeltAudioRef.current === seatbeltAudio) {
        seatbeltAudioRef.current = null;
      }

      isDuckedRef.current = false;
      applyAudioState();
    };

    seatbeltAudio.onended = restoreMusicVolume;
    seatbeltAudio.onerror = restoreMusicVolume;
    seatbeltAudio.play().catch(restoreMusicVolume);
  };

  const startFlightAudio = (durationMs) => {
    if (!durationMs) {
      return;
    }

    stopFlightAudio();
    isPlayingRef.current = true;
    musicQueueRef.current = getShuffledTracks();

    playNextMusicTrack();

    seatbeltTimeoutRef.current = window.setTimeout(
      playSeatbeltAudio,
      SEATBELT_DELAY_MS,
    );
    stopTimeoutRef.current = window.setTimeout(stopFlightAudio, durationMs);
  };

  useEffect(() => {
    isMutedRef.current = isMuted;
    applyAudioState();
  }, [isMuted]);

  useEffect(() => {
    return () => stopFlightAudio();
  }, []);

  return {
    startFlightAudio,
    stopFlightAudio,
  };
};
