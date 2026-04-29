"use client";

import { useCallback, useEffect, useRef } from "react";

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
const SEATBELT_DELAY_MS = 5000;
const ARRIVAL_SEATBELT_OFFSET_MS = 5 * 60 * 1000;
const FLIGHT_MUSIC_VOLUME = 1;
const DUCKED_FLIGHT_MUSIC_VOLUME = 0.25;
const SEATBELT_AUDIO_VOLUME = 0.25;

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
  const arrivalSeatbeltRemainingMsRef = useRef(null);
  const isDuckedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const musicQueueRef = useRef([]);
  const arrivalSeatbeltTimeoutRef = useRef(null);
  const arrivalSeatbeltTimeoutTargetRef = useRef(null);
  const seatbeltRemainingMsRef = useRef(null);
  const seatbeltAudioRef = useRef(null);
  const seatbeltTimeoutRef = useRef(null);
  const seatbeltTimeoutTargetRef = useRef(null);
  const stopRemainingMsRef = useRef(null);
  const stopTimeoutRef = useRef(null);
  const stopTimeoutTargetRef = useRef(null);

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
      seatbeltAudio.volume = SEATBELT_AUDIO_VOLUME;
    }
  };

  const clearScheduledTimeout = useCallback((timeoutRef, timeoutTargetRef) => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    timeoutTargetRef.current = null;
  }, []);

  const scheduleTimeout = (timeoutRef, timeoutTargetRef, callback, delayMs) => {
    clearScheduledTimeout(timeoutRef, timeoutTargetRef);

    if (delayMs <= 0) {
      callback();
      return;
    }

    timeoutTargetRef.current = Date.now() + delayMs;
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      timeoutTargetRef.current = null;
      callback();
    }, delayMs);
  };

  const pauseScheduledTimeout = (timeoutRef, timeoutTargetRef) => {
    if (!timeoutRef.current || !timeoutTargetRef.current) {
      return null;
    }

    const remainingMs = Math.max(timeoutTargetRef.current - Date.now(), 0);

    clearScheduledTimeout(timeoutRef, timeoutTargetRef);

    return remainingMs;
  };

  const stopFlightAudio = useCallback(() => {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    isDuckedRef.current = false;
    musicQueueRef.current = [];

    clearScheduledTimeout(seatbeltTimeoutRef, seatbeltTimeoutTargetRef);
    clearScheduledTimeout(
      arrivalSeatbeltTimeoutRef,
      arrivalSeatbeltTimeoutTargetRef,
    );
    clearScheduledTimeout(stopTimeoutRef, stopTimeoutTargetRef);

    arrivalSeatbeltRemainingMsRef.current = null;
    seatbeltRemainingMsRef.current = null;
    stopRemainingMsRef.current = null;

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
  }, [clearScheduledTimeout]);

  const playNextMusicTrack = () => {
    if (!isPlayingRef.current || isPausedRef.current) {
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
    if (!isPlayingRef.current || isPausedRef.current) {
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
    isPausedRef.current = false;
    musicQueueRef.current = getShuffledTracks();

    playNextMusicTrack();

    scheduleTimeout(
      seatbeltTimeoutRef,
      seatbeltTimeoutTargetRef,
      playSeatbeltAudio,
      SEATBELT_DELAY_MS,
    );

    if (durationMs > ARRIVAL_SEATBELT_OFFSET_MS) {
      scheduleTimeout(
        arrivalSeatbeltTimeoutRef,
        arrivalSeatbeltTimeoutTargetRef,
        playSeatbeltAudio,
        durationMs - ARRIVAL_SEATBELT_OFFSET_MS,
      );
    }

    scheduleTimeout(
      stopTimeoutRef,
      stopTimeoutTargetRef,
      stopFlightAudio,
      durationMs,
    );
  };

  const pauseFlightAudio = () => {
    if (!isPlayingRef.current || isPausedRef.current) {
      return;
    }

    isPausedRef.current = true;
    flightAudioRef.current?.pause();
    seatbeltAudioRef.current?.pause();

    seatbeltRemainingMsRef.current = pauseScheduledTimeout(
      seatbeltTimeoutRef,
      seatbeltTimeoutTargetRef,
    );
    arrivalSeatbeltRemainingMsRef.current = pauseScheduledTimeout(
      arrivalSeatbeltTimeoutRef,
      arrivalSeatbeltTimeoutTargetRef,
    );
    stopRemainingMsRef.current = pauseScheduledTimeout(
      stopTimeoutRef,
      stopTimeoutTargetRef,
    );
  };

  const resumeFlightAudio = () => {
    if (!isPlayingRef.current || !isPausedRef.current) {
      return;
    }

    isPausedRef.current = false;
    flightAudioRef.current?.play().catch(() => {});
    seatbeltAudioRef.current?.play().catch(() => {});

    if (!flightAudioRef.current) {
      playNextMusicTrack();
    }

    if (seatbeltRemainingMsRef.current !== null) {
      scheduleTimeout(
        seatbeltTimeoutRef,
        seatbeltTimeoutTargetRef,
        playSeatbeltAudio,
        seatbeltRemainingMsRef.current,
      );
      seatbeltRemainingMsRef.current = null;
    }

    if (arrivalSeatbeltRemainingMsRef.current !== null) {
      scheduleTimeout(
        arrivalSeatbeltTimeoutRef,
        arrivalSeatbeltTimeoutTargetRef,
        playSeatbeltAudio,
        arrivalSeatbeltRemainingMsRef.current,
      );
      arrivalSeatbeltRemainingMsRef.current = null;
    }

    if (stopRemainingMsRef.current !== null) {
      scheduleTimeout(
        stopTimeoutRef,
        stopTimeoutTargetRef,
        stopFlightAudio,
        stopRemainingMsRef.current,
      );
      stopRemainingMsRef.current = null;
    }
  };

  useEffect(() => {
    isMutedRef.current = isMuted;
    applyAudioState();
  }, [isMuted]);

  useEffect(() => {
    return () => stopFlightAudio();
  }, [stopFlightAudio]);

  return {
    pauseFlightAudio,
    resumeFlightAudio,
    startFlightAudio,
    stopFlightAudio,
  };
};
