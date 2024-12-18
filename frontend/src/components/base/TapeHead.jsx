import { React, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import whistleSong from '../../assets/tape-sounds/whistle-song.mp3';
import Cassette from '../../assets/tape-sounds/cassette.mp3';
import PlaySound from '../../assets/tape-sounds/play-sound.mp3';
import StopSound from '../../assets/tape-sounds/stop-sound.mp3';

import "./TapeHead.css";

export default function Tape() {
  const [firstMusicRef, secondMusicRef, startSoundRef, stopSoundRef] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const baseAudio = firstMusicRef.current;
    const secondAudio = secondMusicRef.current;

    if (baseAudio) {
      const promise = baseAudio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            baseAudio.play();
          })
          .catch((error) => {});
      }
    }
    const playSecondAudio = setTimeout(() => {
      if (secondAudio) {
        playMusic();
      }
    }, 3200);

    return () => {
      clearTimeout(playSecondAudio);
      if (baseAudio) {
        baseAudio.pause();
        baseAudio.currentTime = 0;
      }
      if (secondAudio) {
        secondAudio.pause();
        secondAudio.currentTime = 0;
        secondAudio.removeEventListener("ended", handleAudioEnded);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const playMusic = () => {
    const audio = secondMusicRef.current;
    audio.volume = 0;

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          audio.addEventListener("ended", handleAudioEnded);
          graduallyIncreaseVolume(audio);
        })
        .catch((error) => {});
    }
  };

  const stopMusic = () => {
    const audio = secondMusicRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const graduallyIncreaseVolume = (audio) => {
    let volume = 0;
    const targetVolume = 0.5;
    const interval = setInterval(() => {
      if (volume < targetVolume) {
        volume += 0.02;
        audio.volume = Math.min(volume, targetVolume);
      } else {
        clearInterval(interval);
      }
    }, 300);
  };

  return (
    <div className="container">
      <audio ref={secondMusicRef}>
        <source src={whistleSong} type="audio/mpeg" />
      </audio>
      <audio ref={firstMusicRef}>
        <source src={Cassette} type="audio/mpeg" />
      </audio>
      <div
        className="side left"
        onClick={() => {
          const audio = startSoundRef.current;
          audio.volume = 0.5;
          audio.play();
          playMusic();
        }}
      >
        <audio ref={startSoundRef}>
          <source src={PlaySound} type="audio/mpeg" />
        </audio>
      </div>
      <div className="cassette">
        <div className="tape beginning">
          <div className="center">
            <div className={isPlaying ? "hole rotate" : "hole"}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="tape end">
          <div className="center">
            <div className={isPlaying ? "hole rotate" : "hole"}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="face">
          <span className="screw">
            <span className="screw-center"></span>
            <span className="screw-center"></span>
          </span>
          <span className="screw">
            <span className="screw-center"></span>
            <span className="screw-center"></span>
          </span>
          <span className="screw">
            <span className="screw-center"></span>
            <span className="screw-center"></span>
          </span>
          <span className="screw">
            <span className="screw-center"></span>
            <span className="screw-center"></span>
          </span>
          <span className="screw">
            <span className="screw-center"></span>
            <span className="screw-center"></span>
          </span>
          <div className="sticker">
            <div className="title-label"></div>
            <div className="title-label"></div>
            <div className="title-label"></div>
            <span id="text2">지금까지 본 최고의 시리즈/영화들 #</span>
            <div className="bottom-label">
              <span id="text3">TAPE</span>
              <span id="text4">4L min</span>
              <span id="text5">CHAOS CASSETTE VIDEO</span>
            </div>
            <div className="window">
              <div
                className={
                  isPlaying ? "tape beginning rotate" : "tape beginning"
                }
              ></div>
            </div>
            <span id="text1" className="text">
              Z
            </span>
          </div>
        </div>
        <div className="socket">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>
      <div
        className="side right"
        onClick={() => {
          if (secondMusicRef.current) {
            const audio = stopSoundRef.current;
            audio.volume = 0.3;
            audio.play();
            stopMusic();
          }
        }}
      >
        <audio ref={stopSoundRef}>
          <source src={StopSound} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}
