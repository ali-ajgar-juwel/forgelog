export function getToday() {
  const date = new Date()

  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}


export function formatDate(dateString) {
  const date = new Date(
    `${dateString}T00:00:00`
  )

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  )
}


export function calculateStreak(workouts) {

  if (workouts.length === 0) {
    return 0
  }


  // ========================================
  // WORKOUT DATES
  // ========================================

  const workoutDates =
    new Set(
      workouts.map(
        (workout) =>
          workout.date
      )
    )


  // ========================================
  // START FROM TODAY
  // ========================================

  const today =
    new Date()

  today.setHours(
    0,
    0,
    0,
    0
  )


  let current =
    new Date(today)

  let streak = 0


  // ========================================
  // CHECK BACKWARDS
  // ========================================

  while (true) {

    const day =
      current.getDay()


    // ======================================
    // FRIDAY = OFF DAY
    // Friday is ignored completely.
    // It cannot break the streak.
    // ======================================

    if (day === 5) {

      current.setDate(
        current.getDate() - 1
      )

      continue
    }


    // ======================================
    // CREATE YYYY-MM-DD
    // ======================================

    const year =
      current.getFullYear()

    const month =
      String(
        current.getMonth() + 1
      ).padStart(2, '0')

    const date =
      String(
        current.getDate()
      ).padStart(2, '0')


    const dateString =
      `${year}-${month}-${date}`


    // ======================================
    // WORKOUT EXISTS
    // ======================================

    if (
      workoutDates.has(dateString)
    ) {

      streak++

      current.setDate(
        current.getDate() - 1
      )

      continue
    }


    // ======================================
    // TODAY CAN BE EMPTY
    // ======================================

    if (
      dateString ===
      getToday()
    ) {

      current.setDate(
        current.getDate() - 1
      )

      continue
    }


    // ======================================
    // NO WORKOUT = STREAK ENDS
    // ======================================

    break

  }


  return streak
}


export function groupExercises(exercises) {
  const groups = {}

  exercises.forEach((exercise) => {
    if (!groups[exercise.muscle]) {
      groups[exercise.muscle] = []
    }

    groups[exercise.muscle].push(
      exercise
    )
  })

  return Object.entries(groups)
}