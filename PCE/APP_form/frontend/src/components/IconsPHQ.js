export const IconHappy = ({ width = 50, height = 50, style = {}, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className="icon-animated"
    style={{
      display: "block",
      filter: "drop-shadow(0 2px 8px #e0e0e0)",
      borderRadius: "50%",
      ...style,
    }}
    {...props}
  >
    <defs>
      <radialGradient id="gradHappy" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#C8E6C9" />
        <stop offset="100%" stopColor="#4CAF50" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#gradHappy)" />
    <circle cx="22" cy="24" r="5" fill="#1B5E20" />
    <circle cx="42" cy="24" r="5" fill="#1B5E20" />
    <path d="M22 44 Q32 52 42 44" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const IconNeutral = ({ width = 50, height = 50, style = {}, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className="icon-animated"
    style={{
      display: "block",
      filter: "drop-shadow(0 2px 8px #e0e0e0)",
      borderRadius: "50%",
      ...style,
    }}
    {...props}
  >
    <defs>
      <radialGradient id="gradNeutral" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFECB3" />
        <stop offset="100%" stopColor="#FFC107" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#gradNeutral)" />
    <circle cx="22" cy="24" r="5" fill="#FFB300" />
    <circle cx="42" cy="24" r="5" fill="#FFB300" />
    <line x1="22" y1="44" x2="42" y2="44" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconConcerned = ({ width = 50, height = 50, style = {}, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className="icon-animated"
    style={{
      display: "block",
      filter: "drop-shadow(0 2px 8px #e0e0e0)",
      borderRadius: "50%",
      ...style,
    }}
    {...props}
  >
    <defs>
      <radialGradient id="gradConcerned" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFCCBC" />
        <stop offset="100%" stopColor="#FF5722" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#gradConcerned)" />
    <circle cx="22" cy="24" r="5" fill="#E64A19" />
    <circle cx="42" cy="24" r="5" fill="#E64A19" />
    <path d="M24 45 Q32 40 40 45" stroke="#E64A19" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const IconSad = ({ width = 50, height = 50, style = {}, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className="icon-animated"
    style={{
      display: "block",
      filter: "drop-shadow(0 2px 8px #e0e0e0)",
      borderRadius: "50%",
      ...style,
    }}
    {...props}
  >
    <defs>
      <radialGradient id="gradSad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#EF9A9A" />
        <stop offset="100%" stopColor="#F44336" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#gradSad)" />
    <circle cx="22" cy="24" r="5" fill="#B71C1C" />
    <circle cx="42" cy="24" r="5" fill="#B71C1C" />
    <path d="M22 46 Q32 52 42 46" stroke="#B71C1C" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);