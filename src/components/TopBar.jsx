import './TopBar.css'
import AppLogo from './AppLogo'

function TopBar() {
  return (
    <header className="topbar">

      <div className="brand">

        <AppLogo
          size={36}
          showText={false}
        />

        <div className="brand-text">
          <h1>ForgeLog</h1>

          <span>
            Build. Track. Improve.
          </span>
        </div>

      </div>

    </header>
  )
}

export default TopBar