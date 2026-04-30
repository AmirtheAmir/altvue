"use client";

import { useCallback, useEffect, useRef } from "react";
import { fetchAudioTracks } from "@/lib/audioApi";

const SEATBELT_DELAY_MS = 5000;
const ARRIVAL_SEATBELT_OFFSET_MS = 5 * 60 * 1000;
const FLIGHT_MUSIC_VOLUME = 1;
const DUCKED_FLIGHT_MUSIC_VOLUME = 0.25;
const SEATBELT_AUDIO_VOLUME = 0.25;

const normalizeAudioText = (value) => {
  return String(value ?? "").toLowerCase().replace(/[-_\s/\\.]/g, "");
};

const isSeatbeltTrack = (track) => {
  return normalizeAudioText(
    `${track.type} ${track.filePath} ${track.file_path}`,
  ).includes("seatbelt");
};

const isFlightMusicTrack = (track) => {
  const trackType = normalizeAudioText(track.type);

  return !isSeatbeltTrack(track) && trackType.includes("flightmode");
};

const getRandomTrack = (tracks) => {
  if (!tracks.length) {
    return null;
  }

  return tracks[Math.floor(Math.random() * tracks.length)];
};

const getShuffledTracks = (tracks) => {
  const shuffledTracks = [...tracks];

  for (let index = shuffledTracks.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledTracks[index], shuffledTracks[randomIndex]] = [
      shuffledTracks[randomIndex],
      shuffledTracks[index],
    ];
  }

  return shuffledTracks;
};

export const useFlightAudio = ({ isMuted }) => {
  const flightAudioRef = useRef(null);
  const arrivalSeatbeltRemainingMsRef = useRef(null);
  const isDuckedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const musicTrackUrlsRef = useRef([]);
  const musicQueueRef = useRef([]);
  const playNextMusicTrackRef = useRef(null);
  const seatbeltTrackUrlsRef = useRef([]);
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

    if (!musicTrackUrlsRef.current.length) {
      return;
    }

    if (!musicQueueRef.current.length) {
      musicQueueRef.current = getShuffledTracks(musicTrackUrlsRef.current);
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
      console.warn("Seatbelt audio skipped: flight audio is not active", {
        isPaused: isPausedRef.current,
        isPlaying: isPlayingRef.current,
      });
      return;
    }

    isDuckedRef.current = true;
    const seatbeltTrack = getRandomTrack(seatbeltTrackUrlsRef.current);

    if (!seatbeltTrack) {
      isDuckedRef.current = false;
      console.warn("Seatbelt audio skipped: no Supabase seatbelt track found", {
        seatbeltTrackCount: seatbeltTrackUrlsRef.current.length,
      });
      return;
    }

    console.info("Playing seatbelt audio from Supabase", {
      url: seatbeltTrack,
    });

    const seatbeltAudio = new Audio(seatbeltTrack);

    seatbeltAudioRef.current = seatbeltAudio;
    applyAudioState();

    const restoreMusicVolume = () => {
      if (seatbeltAudioRef.current === seatbeltAudio) {
        seatbeltAudioRef.current = null;
      }

      isDuckedRef.current = false;
      applyAudioState();
    };

    seatbeltAudio.onended = () => {
      console.info("Seatbelt audio finished");
      restoreMusicVolume();
    };
    seatbeltAudio.onerror = (event) => {
      console.error("Seatbelt audio failed to load or play", event);
      restoreMusicVolume();
    };
    seatbeltAudio.play().catch((error) => {
      console.error("Seatbelt audio play() was blocked or failed", error);
      restoreMusicVolume();
    });
  };

  const startFlightAudio = (durationMs) => {
    if (!durationMs) {
      return;
    }

    stopFlightAudio();
    isPlayingRef.current = true;
    isPausedRef.current = false;
    musicQueueRef.current = getShuffledTracks(musicTrackUrlsRef.current);

    playNextMusicTrack();

    console.info("Seatbelt audio scheduled", {
      delayMs: SEATBELT_DELAY_MS,
      seatbeltTrackCount: seatbeltTrackUrlsRef.current.length,
    });

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
    playNextMusicTrackRef.current = playNextMusicTrack;
  });

  useEffect(() => {
    let isMounted = true;

    fetchAudioTracks()
      .then((tracks) => {
        if (!isMounted) {
          return;
        }

        const trackUrls = tracks
          .filter((track) => track.url)
          .map((track) => ({
            filePath: track.filePath ?? track.file_path,
            file_path: track.file_path,
            type: track.type,
            url: track.url,
          }));

        seatbeltTrackUrlsRef.current = trackUrls
          .filter(isSeatbeltTrack)
          .map((track) => track.url);
        musicTrackUrlsRef.current = trackUrls
          .filter(isFlightMusicTrack)
          .map((track) => track.url);

        console.info("Loaded Supabase audio tracks", {
          musicTrackCount: musicTrackUrlsRef.current.length,
          rawTracks: tracks.map((track) => ({
            filePath: track.filePath ?? track.file_path,
            type: track.type,
          })),
          seatbeltTrackCount: seatbeltTrackUrlsRef.current.length,
          seatbeltTracks: trackUrls.filter(isSeatbeltTrack),
          totalTrackCount: tracks.length,
        });

        if (
          isPlayingRef.current &&
          !isPausedRef.current &&
          !flightAudioRef.current
        ) {
          playNextMusicTrackRef.current?.();
        }
      })
      .catch((error) => {
        console.error("Failed to load audio tracks", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
