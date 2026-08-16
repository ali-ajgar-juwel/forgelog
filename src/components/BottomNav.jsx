import './BottomNav.css'

function BottomNav({
  activePage,
  setActivePage,
}) {
  return (
    <nav className="bottom-nav">

      <button
        className={
          activePage === 'dashboard'
            ? 'nav-item active'
            : 'nav-item'
        }
        onClick={() =>
          setActivePage('dashboard')
        }
      >
        <span className="nav-icon">
          ⌂
        </span>

        <span>
          Dashboard
        </span>
      </button>

      <button
        className={
          activePage === 'workout'
            ? 'nav-item active'
            : 'nav-item'
        }
        onClick={() =>
          setActivePage('workout')
        }
      >
        <span className="nav-icon">
          +
        </span>

        <span>
          Workout
        </span>
      </button>

      <button
        className={
          activePage === 'exercises'
            ? 'nav-item active'
            : 'nav-item'
        }
        onClick={() =>
          setActivePage('exercises')
        }
      >
        <span className="nav-icon">
          ☷
        </span>

        <span>
          Exercises
        </span>
      </button>

    </nav>
  )
}

export default BottomNav