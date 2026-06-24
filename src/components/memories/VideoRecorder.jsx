import React, { useState, useRef, useEffect } from 'react';
import BigButton from '../shared/BigButton';

export default function VideoRecorder({ onVideoRecorded, onCancel }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        const str = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = str;
        setStream(str);
        if (videoRef.current) {
          videoRef.current.srcObject = str;
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        alert("يرجى السماح بالوصول إلى الكاميرا والمايكروفون لتسجيل الفيديو.");
        onCancel();
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const handleStartRecording = () => {
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data]);
      }
    };

    mediaRecorder.onstop = () => {
      // Stream is still active, we just stopped recording
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (!isRecording && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onVideoRecorded(blob);
    }
  }, [isRecording, recordedChunks, onVideoRecorded]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        position: 'relative', width: '100%', aspectRatio: '4/3', 
        backgroundColor: 'black', borderRadius: 'var(--radius-md)', overflow: 'hidden' 
      }}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
        {isRecording && (
          <div style={{ 
            position: 'absolute', top: '16px', right: '16px', 
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 12px', 
            borderRadius: '20px', color: 'white', fontWeight: 'bold'
          }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'red', borderRadius: '50%', animation: 'timerPulse 1s infinite' }} />
            جاري التسجيل...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {!isRecording ? (
          <BigButton 
            label="بدء التسجيل 🔴" 
            onClick={handleStartRecording} 
            color="var(--red)" 
            style={{ flex: 2 }}
          />
        ) : (
          <BigButton 
            label="إيقاف التسجيل ⏹️" 
            onClick={handleStopRecording} 
            color="var(--text)" 
            style={{ flex: 2 }}
          />
        )}
        <button
          onClick={onCancel}
          style={{
            flex: 1, height: '68px', borderRadius: 'var(--radius-full)',
            backgroundColor: 'transparent', border: '2px solid var(--border)',
            color: 'var(--text-muted)', fontSize: '18px', fontWeight: 'bold',
            fontFamily: "'Cairo', sans-serif", cursor: 'pointer'
          }}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
