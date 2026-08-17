import { useState } from 'react'
import { calculateStreak } from '../utils/helpers'
import './Dashboard.css'

function Dashboard({
  workouts = [],
  restDays = [],
  setRestDays,
}) {

  // ========================================
  // TODAY
  // ========================================

  const today = new Date()


  // ========================================
  // REST DAY MENU
  // ========================================

  const [
    showRestDays,
    setShowRestDays,
  ] = useState(false)


  // ========================================
  // DAY NAMES
  // ========================================

  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]


  const shortDayNames = [
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
    'S',
  ]


  // ========================================
  // CURRENT MONTH
  // ========================================

  const monthName =
    today.toLocaleDateString(
      'en-US',
      {
        month: 'long',
      }
    )


  // ========================================
  // CURRENT WEEK
  // MONDAY → SUNDAY
  // ========================================

  function getCurrentWeek() {

    const current =
      new Date(today)

    const day =
      current.getDay()

    const difference =
      day === 0
        ? 6
        : day - 1


    current.setDate(
      current.getDate() -
      difference
    )


    return Array.from(
      { length: 7 },
      (_, index) => {

        const date =
          new Date(current)

        date.setDate(
          current.getDate() +
          index
        )

        return date

      }
    )
  }


  const week =
    getCurrentWeek()


  // ========================================
  // DATE STRING
  // ========================================

  function getDateString(date) {

    const year =
      date.getFullYear()

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0')

    const day =
      String(
        date.getDate()
      ).padStart(2, '0')


    return `${year}-${month}-${day}`
  }


  // ========================================
  // CHECK WORKOUT
  // ========================================

  function hasWorkout(date) {

    const dateString =
      getDateString(date)


    return workouts.some(
      (workout) =>
        workout &&
        workout.date === dateString
    )

  }


  // ========================================
  // REST DAY TOGGLE
  // ========================================

  function toggleRestDay(dayIndex) {

    if (
      typeof setRestDays !==
      'function'
    ) {
      return
    }


    const currentDays =
      Array.isArray(restDays)
        ? restDays
        : []


    let newDays


    if (
      currentDays.includes(
        dayIndex
      )
    ) {

      newDays =
        currentDays.filter(
          (day) =>
            day !== dayIndex
        )

    } else {

      newDays = [
        ...currentDays,
        dayIndex,
      ]

    }


    newDays =
      [
        ...new Set(newDays),
      ].sort(
        (a, b) =>
          a - b
      )


    setRestDays(
      newDays
    )

  }


  // ========================================
  // REST DAY LABEL
  // ========================================

  function getRestDayLabel() {

    if (
      restDays.length === 0
    ) {
      return 'No rest days'
    }


    if (
      restDays.length === 7
    ) {
      return 'Every day'
    }


    return restDays
      .map(
        (day) =>
          dayNames[day]
      )
      .join(', ')

  }


  // ========================================
  // CURRENT STREAK
  // ========================================

  const streak =
    calculateStreak(
      workouts,
      restDays
    )


  // ========================================
  // COLLECT EXERCISES
  // ========================================

  const exerciseMap = {}


  workouts.forEach(
    (workout) => {

      if (
        !workout ||
        !Array.isArray(
          workout.exercises
        )
      ) {
        return
      }


      workout.exercises.forEach(
        (exercise) => {

          if (!exercise) {
            return
          }


          const exerciseId =
            String(
              exercise.exerciseId
            )


          if (
            !exerciseMap[
              exerciseId
            ]
          ) {

            exerciseMap[
              exerciseId
            ] = {

              id:
                exercise.exerciseId,

              name:
                exercise.name ||
                'Exercise',

              muscle:
                exercise.muscle ||
                '',

              type:
                exercise.type ||
                exercise.trackingType ||
                'weight',

            }

          }

        }
      )

    }
  )


  const exerciseOptions =
    Object.values(
      exerciseMap
    )


  // ========================================
  // SELECTED EXERCISE
  // ========================================

  const [
    selectedExerciseId,
    setSelectedExerciseId,
  ] = useState('')


  const selectedExercise =
    exerciseOptions.find(
      (exercise) =>
        String(
          exercise.id
        ) ===
        String(
          selectedExerciseId
        )
    ) ||
    exerciseOptions[0] ||
    null


  // ========================================
  // PROGRESS DATA
  // ========================================

  function getProgressData(
    exerciseId,
    exerciseType
  ) {

    const data = []


    workouts.forEach(
      (workout) => {

        if (
          !workout ||
          !Array.isArray(
            workout.exercises
          )
        ) {
          return
        }


        const workoutExercise =
          workout.exercises.find(
            (exercise) =>
              String(
                exercise?.exerciseId
              ) ===
              String(
                exerciseId
              )
          )


        if (
          !workoutExercise
        ) {
          return
        }


        // ==================================
        // TIME EXERCISE
        // ==================================

        if (
          exerciseType === 'time'
        ) {

          let maxTime = 0


          const sets =
            Array.isArray(
              workoutExercise.sets
            )
              ? workoutExercise.sets
              : []


          sets.forEach(
            (set) => {

              const time =
                Number(
                  set.time ??
                  set.duration ??
                  set.seconds ??
                  0
                )


              if (
                !Number.isNaN(time)
              ) {

                maxTime =
                  Math.max(
                    maxTime,
                    time
                  )

              }

            }
          )


          if (
            maxTime > 0
          ) {

            data.push({

              date:
                workout.date,

              time:
                maxTime,

            })

          }


          return

        }


        // ==================================
        // WEIGHT EXERCISE
        // ==================================

        let maxWeight = 0

        let repsAtMaxWeight = 0

        let totalReps = 0

        let totalSetsCount = 0

        let hasValidSet = false


        const sets =
          Array.isArray(
            workoutExercise.sets
          )
            ? workoutExercise.sets
            : []


        sets.forEach(
          (set) => {

            let weight = 0
            if (set.weight === 'Body Weight' || set.weight === '' || set.weight == null) {
              weight = 0
            } else {
              const parsed = Number(set.weight)
              weight = Number.isNaN(parsed) ? 0 : parsed
            }


            const reps =
              Number(
                set.reps
              ) || 0


            totalReps += reps
            totalSetsCount += 1
            hasValidSet = true


            if (
              weight >=
              maxWeight
            ) {

              maxWeight =
                weight

              repsAtMaxWeight =
                reps

            }

          }
        )


        const avgReps =
          totalSetsCount >
          0
            ? Math.round(
                totalReps /
                totalSetsCount
              )
            : 0


        if (
          hasValidSet
        ) {

          data.push({

            date:
              workout.date,

            weight:
              maxWeight,

            reps:
              repsAtMaxWeight,

            avgReps,

          })

        }

      }
    )


    return data.slice(-6)

  }


  // ========================================
  // CURRENT PROGRESS
  // ========================================

  const isTimeExercise =
    selectedExercise?.type ===
    'time'


  const progressData =
    selectedExercise
      ? getProgressData(
          selectedExercise.id,
          selectedExercise.type
        )
      : []


  // ========================================
  // LATEST DATA
  // ========================================

  const latestWorkout =
    progressData.length > 0
      ? progressData[
          progressData.length - 1
        ]
      : null


  // ========================================
  // WEIGHT METRICS
  // ========================================

  const currentWeight =
    latestWorkout?.weight || 0


  const currentAvgReps =
    latestWorkout?.avgReps || 0


  const bestWeight =
    progressData.length > 0 &&
    !isTimeExercise
      ? Math.max(
          ...progressData.map(
            (item) =>
              item.weight
          )
        )
      : 0


  const bestWeightItem =
    progressData.find(
      (item) =>
        item.weight ===
        bestWeight
    )


  const bestReps =
    bestWeightItem?.reps || 0


  // ========================================
  // TIME METRICS
  // ========================================

  const currentTime =
    latestWorkout?.time || 0


  const bestTime =
    progressData.length > 0 &&
    isTimeExercise
      ? Math.max(
          ...progressData.map(
            (item) =>
              item.time
          )
        )
      : 0


  // ========================================
  // FORMAT TIME
  // ========================================

  function formatTime(
    seconds
  ) {

    const safeSeconds =
      Number(seconds) || 0


    const minutes =
      Math.floor(
        safeSeconds / 60
      )


    const remainingSeconds =
      safeSeconds % 60


    if (
      minutes === 0
    ) {

      return `${remainingSeconds}s`

    }


    return `${minutes}m ${String(
      remainingSeconds
    ).padStart(2, '0')}s`

  }


  // ========================================
  // BAR HEIGHT (Full fill for Body Weight / 0 weight)
  // ========================================

  function getBarHeight(
    item
  ) {

    if (
      isTimeExercise
    ) {
      return Math.min(100, Math.max(35, (item.time / 60) * 40))
    }

    if (item.weight === 0) {
      return 100
    }

    const val = Math.max(50, (item.weight / (bestWeight || 50)) * 70 + 30)
    return Math.min(100, val)

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="page">

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            YOUR PROGRESS
          </p>

          <h2>
            Dashboard
          </h2>

        </div>

      </div>


      {/* WORKOUT STREAK */}

      <section className="card streak-card">

        <div className="streak-header">

          <div>

            <p className="eyebrow">
              WORKOUT STREAK
            </p>


            <div className="streak-value">

              <strong>
                {streak}
              </strong>

              <span>
                Days
              </span>

            </div>

          </div>


          {/* REST DAYS */}

          <div className="rest-day-container">

            <button
              type="button"
              className="streak-month rest-day-button"
              onClick={() =>
                setShowRestDays(
                  (value) =>
                    !value
                )
              }
            >

              <span>
                REST DAYS
              </span>

              <strong>
                {getRestDayLabel()}
              </strong>

            </button>


            {showRestDays && (

              <div className="rest-day-popup">

                <div className="rest-popup-header">

                  <strong>
                    Rest Days
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setShowRestDays(
                        false
                      )
                    }
                  >
                    ×
                  </button>

                </div>


                <p>
                  Select the days you
                  don't train.
                </p>


                <div className="rest-day-options">

                  {dayNames.map(
                    (
                      day,
                      index
                    ) => {

                      const checked =
                        restDays.includes(
                          index
                        )


                      return (

                        <label
                          key={day}
                          className={
                            checked
                              ? 'rest-option checked'
                              : 'rest-option'
                          }
                        >

                          <input
                            type="checkbox"
                            checked={
                              checked
                            }
                            onChange={() =>
                              toggleRestDay(
                                index
                              )
                            }
                          />

                          <span>
                            {day}
                          </span>

                        </label>

                      )

                    }
                  )}

                </div>


                <button
                  type="button"
                  className="rest-done-button"
                  onClick={() =>
                    setShowRestDays(
                      false
                    )
                  }
                >
                  Done
                </button>

              </div>

            )}

          </div>

        </div>


        {/* WEEK CALENDAR */}

        <div className="week-calendar">

          <div className="week-days">

            {week.map(
              (
                date,
                index
              ) => (

                <span
                  key={
                    date.toISOString()
                  }
                  className={
                    restDays.includes(
                      index
                    )
                      ? 'off-day-label'
                      : ''
                  }
                >
                  {
                    shortDayNames[
                      index
                    ]
                  }
                </span>

              )
            )}

          </div>


          <div className="week-status">

            {week.map(
              (
                date,
                index
              ) => {

                const isRestDay =
                  restDays.includes(
                    index
                  )


                const isToday =
                  getDateString(
                    date
                  ) ===
                  getDateString(
                    today
                  )


                const completed =
                  hasWorkout(
                    date
                  )


                return (

                  <div
                    key={
                      date.toISOString()
                    }
                    className={`
                      calendar-day
                      ${isToday ? 'today' : ''}
                      ${isRestDay ? 'off-day' : ''}
                      ${completed ? 'completed' : ''}
                    `}
                  >

                    {isRestDay ? (

                      <span className="off-label">
                        OFF
                      </span>

                    ) : completed ? (

                      <span className="workout-dot">
                        ●
                      </span>

                    ) : (

                      <span className="empty-dot">
                        ○
                      </span>

                    )}

                  </div>

                )

              }
            )}

          </div>


          <div className="week-dates">

            {week.map(
              (date) => (

                <span
                  key={
                    date.toISOString()
                  }
                  className={
                    getDateString(
                      date
                    ) ===
                    getDateString(
                      today
                    )
                      ? 'current-date'
                      : ''
                  }
                >
                  {date.getDate()}
                </span>

              )
            )}

          </div>

        </div>


        <div className="streak-note">

          <span>

            {restDays.length === 0
              ? 'No rest days selected'
              : `Rest: ${getRestDayLabel()}`}

          </span>

          <span>
            Rest days don't break your streak
          </span>

        </div>

      </section>


      {/* STRENGTH PROGRESS */}

      <section className="card progress-card">

        <div className="progress-top">

          <div>

            <p className="eyebrow">
              PROGRESS
            </p>

            <h3>
              Exercise Progress
            </h3>

          </div>


          {exerciseOptions.length > 0 && (

            <select
              className="progress-select"
              value={
                selectedExercise
                  ? String(
                      selectedExercise.id
                    )
                  : ''
              }
              onChange={(e) =>
                setSelectedExerciseId(
                  e.target.value
                )
              }
            >

              {exerciseOptions.map(
                (exercise) => (

                  <option
                    key={
                      String(
                        exercise.id
                      )
                    }
                    value={
                      String(
                        exercise.id
                      )
                    }
                  >
                    {exercise.name}
                  </option>

                )
              )}

            </select>

          )}

        </div>


        {exerciseOptions.length === 0 && (

          <div className="progress-empty">

            <div className="chart-icon">
              ↗
            </div>

            <div>

              <h4>
                No progress yet
              </h4>

              <p>
                Complete a workout to
                start tracking your progress.
              </p>

            </div>

          </div>

        )}


        {exerciseOptions.length > 0 &&
          progressData.length === 0 && (

            <div className="progress-empty">

              <div className="chart-icon">
                ↗
              </div>

              <div>

                <h4>
                  Start tracking your progress
                </h4>

                <p>
                  Record your
                  {isTimeExercise
                    ? ' time'
                    : ' weight and reps'}
                  {' '}
                  to see your progress here.
                </p>

              </div>

            </div>

          )}


        {progressData.length > 0 && (

          <div className="progress-layout">


            {/* STATS */}

            <div className="progress-stats-grid">


              {isTimeExercise ? (

                <>

                  <div className="stat-box">

                    <span>
                      CURRENT
                    </span>

                    <strong>
                      {formatTime(
                        currentTime
                      )}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      BEST TIME
                    </span>

                    <strong>
                      {formatTime(
                        bestTime
                      )}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      SESSIONS
                    </span>

                    <strong>
                      {progressData.length}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      LAST
                    </span>

                    <strong>
                      {formatTime(
                        currentTime
                      )}
                    </strong>

                  </div>

                </>

              ) : (

                <>

                  <div className="stat-box">

                    <span>
                      CURRENT WEIGHT
                    </span>

                    <strong>
                      {currentWeight === 0 ? 'Body Weight' : `${currentWeight}kg`}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      BEST WEIGHT
                    </span>

                    <strong>
                      {bestWeight === 0 ? 'Body Weight' : `${bestWeight}kg`}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      AVG REPS
                    </span>

                    <strong>
                      {currentAvgReps}
                    </strong>

                  </div>


                  <div className="stat-box">

                    <span>
                      BEST REPS
                    </span>

                    <strong>
                      {bestReps}
                    </strong>

                  </div>

                </>

              )}

            </div>


            {/* BAR CHART */}

            <div className="bar-chart">

              {progressData.map(
                (
                  item,
                  index
                ) => {

                  const height =
                    getBarHeight(
                      item
                    )


                  return (

                    <div
                      className="bar-column"
                      key={
                        item.date +
                        index
                      }
                    >


                      {/* VALUE */}

                      <div className="bar-value">

                        {isTimeExercise ? (

                          <>
                            {formatTime(
                              item.time
                            )}
                          </>

                        ) : (

                          <>
                            {item.weight === 0 ? 'Body Weight' : `${item.weight}kg`}

                            <span className="bar-reps-sub">
                              {' '}
                              ({item.reps}r)
                            </span>
                          </>

                        )}

                      </div>


                      {/* BAR */}

                      <div className="bar-track">

                        <div
                          className="bar-fill"
                          style={{
                            height:
                              `${height}%`,
                          }}
                        />

                      </div>


                      {/* DATE */}

                      <span>

                        {new Date(
                          item.date +
                          'T00:00:00'
                        ).toLocaleDateString(
                          'en-US',
                          {
                            month:
                              'short',
                            day:
                              'numeric',
                          }
                        )}

                      </span>

                    </div>

                  )

                }
              )}

            </div>

          </div>

        )}

      </section>

    </div>

  )

}

export default Dashboard