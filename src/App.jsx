import { useEffect, useState } from 'react'

import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'

import ExerciseModal from './components/ExerciseModal'
import DeleteModal from './components/DeleteModal'

import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import Exercises from './pages/Exercises'

import './App.css'


// ========================================
// DEFAULT EXERCISES
// ========================================

const defaultExercises = [
  {
    id: 1,
    name: 'Bench Press',
    muscle: 'Chest',
    type: 'weight',
  },
  {
    id: 2,
    name: 'Lat Pulldown',
    muscle: 'Back',
    type: 'weight',
  },
  {
    id: 3,
    name: 'Biceps Curl',
    muscle: 'Biceps',
    type: 'weight',
  },
  {
    id: 4,
    name: 'Shoulder Press',
    muscle: 'Shoulder',
    type: 'weight',
  },
  {
    id: 5,
    name: 'Squat',
    muscle: 'Legs',
    type: 'weight',
  },
  {
    id: 6,
    name: 'Plank',
    muscle: 'Core',
    type: 'time',
  },
]


// ========================================
// DEFAULT REST DAYS
//
// 0 = Sunday
// 1 = Monday
// 2 = Tuesday
// 3 = Wednesday
// 4 = Thursday
// 5 = Friday
// 6 = Saturday
// ========================================

const defaultRestDays = [5]


// ========================================
// GET LOCAL DATE
// ========================================

function getLocalDateString() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}


// ========================================
// NORMALIZE EXERCISES
// ========================================

function normalizeExercises(data) {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((exercise) => ({
    ...exercise,
    type:
      exercise.type ||
      exercise.trackingType ||
      'weight',
  }))
}


// ========================================
// NORMALIZE WORKOUTS
// ========================================

function normalizeWorkouts(data) {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .filter(
      (workout) =>
        workout &&
        typeof workout === 'object'
    )
    .map((workout) => ({
      ...workout,
      exercises: Array.isArray(
        workout.exercises
      )
        ? workout.exercises
        : [],
    }))
    .filter((workout) => workout.date)
}


// ========================================
// APP
// ========================================

function App() {

  // ========================================
  // ACTIVE PAGE
  // ========================================

  const [
    activePage,
    setActivePage,
  ] = useState('dashboard')


  // ========================================
  // EXERCISES (Fixed to allow 0 exercises)
  // ========================================

  const [
    exercises,
    setExercises,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        'forgelog_exercises'
      )

    if (!saved) {
      return defaultExercises
    }

    try {
      const parsed = JSON.parse(saved)
      return normalizeExercises(parsed)
    } catch {
      return defaultExercises
    }
  })


  // ========================================
  // WORKOUTS
  // ========================================

  const [
    workouts,
    setWorkouts,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        'forgelog_workouts'
      )

    if (!saved) {
      return []
    }

    try {
      const parsed = JSON.parse(saved)
      return normalizeWorkouts(parsed)
    } catch {
      return []
    }
  })


  // ========================================
  // REST DAYS
  // ========================================

  const [
    restDays,
    setRestDays,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        'forgelog_rest_days'
      )

    if (!saved) {
      return defaultRestDays
    }

    try {
      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return defaultRestDays
      }

      return parsed
    } catch {
      return defaultRestDays
    }
  })


  // ========================================
  // EXERCISE MODAL
  // ========================================

  const [
    showExerciseModal,
    setShowExerciseModal,
  ] = useState(false)

  const [
    editingExercise,
    setEditingExercise,
  ] = useState(null)

  // নির্দিষ্ট প্রেসেটের ভেতরে থেকে অ্যাড করার সময় প্রেসেট ট্র্যাক করার স্টেট
  const [
    activePresetContext,
    setActivePresetContext,
  ] = useState(null)


  // ========================================
  // DELETE MODAL
  // ========================================

  const [
    deletingExercise,
    setDeletingExercise,
  ] = useState(null)


  // ========================================
  // SAVE EXERCISES
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      'forgelog_exercises',
      JSON.stringify(exercises)
    )
  }, [exercises])


  // ========================================
  // SAVE WORKOUTS
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      'forgelog_workouts',
      JSON.stringify(workouts)
    )
  }, [workouts])


  // ========================================
  // SAVE REST DAYS
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      'forgelog_rest_days',
      JSON.stringify(restDays)
    )
  }, [restDays])


  // ========================================
  // ADD EXERCISE MODAL
  // ========================================

  function handleAddExercise(preset = null) {
    setEditingExercise(null)
    setActivePresetContext(preset)
    setShowExerciseModal(true)
  }


  // ========================================
  // EDIT EXERCISE MODAL
  // ========================================

  function handleEditExercise(exercise) {
    setEditingExercise(exercise)
    setActivePresetContext(null)
    setShowExerciseModal(true)
  }


  // ========================================
  // ADD EXERCISE
  // ========================================

  function addExercise(
    name,
    muscle,
    type
  ) {
    const newExercise = {
      id: Date.now(),
      name: name.trim(),
      muscle: muscle || (activePresetContext ? activePresetContext.title : 'Chest'),
      presetId: activePresetContext ? activePresetContext.id : undefined,
      type:
        type === 'time'
          ? 'time'
          : 'weight',
    }

    setExercises(
      (currentExercises) => [
        ...currentExercises,
        newExercise,
      ]
    )
  }


  // ========================================
  // UPDATE EXERCISE
  // ========================================

  function updateExercise(
    id,
    name,
    muscle,
    type
  ) {
    setExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (exercise.id === id) {
              return {
                ...exercise,
                name: name.trim(),
                muscle,
                type:
                  type === 'time'
                    ? 'time'
                    : 'weight',
              }
            }
            return exercise
          }
        )
    )
  }


  // ========================================
  // SAVE EXERCISE (ADD + EDIT)
  // ========================================

  function handleSaveExercise(data) {
    if (!data) {
      return
    }

    if (data.id) {
      updateExercise(
        data.id,
        data.name,
        data.muscle,
        data.type
      )
    } else {
      addExercise(
        data.name,
        data.muscle,
        data.type
      )
    }

    setShowExerciseModal(false)
    setEditingExercise(null)
    setActivePresetContext(null)
  }


  // ========================================
  // DELETE REQUEST
  // ========================================

  function handleDeleteRequest(exercise) {
    setDeletingExercise(exercise)
  }


  // ========================================
  // DELETE EXERCISE
  // ========================================

  function deleteExercise(id) {
    setExercises(
      (currentExercises) =>
        currentExercises.filter(
          (exercise) =>
            exercise.id !== id
        )
    )
  }


  // ========================================
  // CONFIRM DELETE
  // ========================================

  function handleDeleteExercise(id) {
    deleteExercise(id)
    setDeletingExercise(null)
  }


  // ========================================
  // SAVE / UPDATE WORKOUT
  // ========================================

  function saveWorkout(workoutData) {
    const safeWorkoutData =
      Array.isArray(workoutData)
        ? workoutData
        : []

    const today = getLocalDateString()

    setWorkouts(
      (currentWorkouts) => {
        const existingIndex =
          currentWorkouts.findIndex(
            (workout) =>
              workout.date === today
          )

        if (
          safeWorkoutData.length === 0
        ) {
          if (existingIndex === -1) {
            return currentWorkouts
          }

          return currentWorkouts.filter(
            (workout) =>
              workout.date !== today
          )
        }

        if (existingIndex !== -1) {
          const oldWorkout =
            currentWorkouts[
              existingIndex
            ]

          const oldData =
            JSON.stringify(
              oldWorkout.exercises || []
            )

          const newData =
            JSON.stringify(
              safeWorkoutData
            )

          if (oldData === newData) {
            return currentWorkouts
          }

          const updatedWorkouts = [
            ...currentWorkouts,
          ]

          updatedWorkouts[
            existingIndex
          ] = {
            ...oldWorkout,
            exercises: safeWorkoutData,
          }

          return updatedWorkouts
        }

        const newWorkout = {
          id: Date.now(),
          date: today,
          exercises: safeWorkoutData,
        }

        return [
          ...currentWorkouts,
          newWorkout,
        ]
      }
    )
  }


  // ========================================
  // UPDATE REST DAYS
  // ========================================

  function updateRestDays(newRestDays) {
    if (
      !Array.isArray(newRestDays)
    ) {
      return
    }

    const cleanedDays = [
      ...new Set(
        newRestDays
          .map(Number)
          .filter(
            (day) =>
              day >= 0 &&
              day <= 6
          )
      ),
    ].sort((a, b) => a - b)

    setRestDays(
      (currentDays) => {
        const oldValue =
          JSON.stringify(currentDays)
        const newValue =
          JSON.stringify(cleanedDays)

        if (oldValue === newValue) {
          return currentDays
        }

        return cleanedDays
      }
    )
  }


  // ========================================
  // RENDER PAGE
  // ========================================

  function renderPage() {
    if (
      activePage === 'dashboard'
    ) {
      return (
        <Dashboard
          workouts={workouts}
          restDays={restDays}
          setRestDays={
            updateRestDays
          }
        />
      )
    }

    if (
      activePage === 'workout'
    ) {
      return (
        <Workout
          exercises={exercises}
          workouts={workouts}
          onSave={saveWorkout}
        />
      )
    }

    if (
      activePage === 'exercises'
    ) {
      return (
        <Exercises
          exercises={exercises}
          onAdd={handleAddExercise}
          onEdit={handleEditExercise}
          onDelete={
            handleDeleteRequest
          }
        />
      )
    }

    return null
  }


  // ========================================
  // APP UI
  // ========================================

  return (
    <div className="app">
      <TopBar />

      <main className="content">
        {renderPage()}
      </main>

      <BottomNav
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {showExerciseModal && (
        <ExerciseModal
          exercise={editingExercise}
          defaultMuscle={activePresetContext ? activePresetContext.title : ''}
          onSave={handleSaveExercise}
          onClose={() => {
            setShowExerciseModal(
              false
            )
            setEditingExercise(
              null
            )
            setActivePresetContext(null)
          }}
        />
      )}

      {deletingExercise && (
        <DeleteModal
          exercise={deletingExercise}
          onDelete={
            handleDeleteExercise
          }
          onClose={() => {
            setDeletingExercise(
              null
            )
          }}
        />
      )}
    </div>
  )
}

export default App