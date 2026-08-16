function AppLogo({ size = 38, showText = true }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* =====================================
          FORGELOG LOGO
      ===================================== */}

      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ForgeLog logo"
      >
        {/* Outer Shape */}

        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="13"
          fill="#151518"
        />

        <rect
          x="2.5"
          y="2.5"
          width="43"
          height="43"
          rx="12.5"
          stroke="#29292F"
        />


        {/* =================================
            FORGED "F" SYMBOL
        ================================= */}

        {/* Main vertical bar */}

        <path
          d="
            M14 12
            H34
            V17
            H20
            V21
            H31
            V26
            H20
            V36
            H14
            Z
          "
          fill="#EEEEEF"
        />


        {/* =================================
            FORGE CUT / ENERGY SLASH
        ================================= */}

        <path
          d="
            M27 12
            H34
            L24 27
            H18
            Z
          "
          fill="#77777F"
        />


        {/* Small bottom accent */}

        <rect
          x="14"
          y="34"
          width="10"
          height="2"
          rx="1"
          fill="#77777F"
        />
      </svg>


      {/* =====================================
          BRAND TEXT
      ===================================== */}

      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: '1.1',
          }}
        >
          <span
            style={{
              color: '#EEEEEF',
              fontSize: '15px',
              fontWeight: '800',
              letterSpacing: '0.5px',
            }}
          >
            Forge<span style={{ color: '#77777F' }}>Log</span>
          </span>

          <span
            style={{
              marginTop: '3px',
              color: '#77777F',
              fontSize: '8px',
              fontWeight: '700',
              letterSpacing: '1px',
            }}
          >
            BUILD. TRACK. IMPROVE.
          </span>
        </div>
      )}
    </div>
  )
}

export default AppLogo