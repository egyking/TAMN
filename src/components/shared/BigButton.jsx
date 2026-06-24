import React from 'react';

export default function BigButton({ 
  label, 
  onClick, 
  color = 'var(--green)', 
  textColor = 'white', 
  icon, 
  size = 'lg', 
  fullWidth = true, 
  disabled, 
  loading, 
  style 
}) {
  const heights = {
    md: '56px',
    lg: '68px',
    xl: '80px',
  };
  const fontSizes = {
    md: '18px',
    lg: '20px',
    xl: '22px',
  };

  const buttonStyle = {
    backgroundColor: color,
    color: textColor,
    height: heights[size],
    fontSize: fontSizes[size],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style
  };

  return (
    <button 
      onClick={disabled || loading ? undefined : onClick} 
      style={buttonStyle}
      disabled={disabled || loading}
    >
      {loading ? (
        <div style={{
          width: '24px', 
          height: '24px', 
          border: '3px solid rgba(255,255,255,0.3)', 
          borderTop: '3px solid white', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite'
        }}></div>
      ) : (
        <>
          {icon && <i className={icon}></i>}
          {label}
        </>
      )}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
