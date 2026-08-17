import { useEffect, useState } from 'react'

import {
  getToday,
  formatDate,
} from '../utils/helpers'

import ExercisePicker from '../components/ExercisePicker'
import DeleteModal from '../components/DeleteModal'

import './Workout.css'


function Workout({
  exercises,
  workouts,
  onSave,
}) {

  // ========================================
  // TODAY
  // ========================================

  const today = getToday()


  // ========================================
  // SELECTED DATE
  // ========================================

  const [selectedDate, setSelectedDate] =
    useState(today)


  // ========================================
  // PRESETS LOAD (Local Storage)
  // ========================================

  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('forgelog_custom_presets')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Fallback
      }
    }
    return [
      { id: 'push', title: 'Push Day' },
      { id: 'pull', title: 'Pull Day' },
      { id: 'legs', title: 'Legs & Core' },
    ]
  })


  // ========================================
  // GET WORKOUT FOR SELECTED DATE
  // ========================================

  function getWorkoutForDate(date) {
    return workouts.find(
      (workout) =>
        workout.date === date
    )
  }


  // ========================================
  // CREATE EXERCISE DATA
  // ========================================

  function normalizeExercise(exercise) {
    return {
      ...exercise,

      type:
        exercise.type ||
        exercise.trackingType ||
        'weight',

      sets:
        Array.isArray(exercise.sets)
          ? exercise.sets.map((set) => ({
              ...set,
              weight:
                set.weight ?? 'Body Weight',
              reps:
                set.reps ?? '',
              time:
                set.time ?? '',
            }))
          : [
              {
                id: Date.now() + Math.random(),
                weight: 'Body Weight',
                reps: '',
                time: '',
              },
            ],
    }
  }


  // ========================================
  // INITIAL WORKOUT STATE
  // ========================================

  const [workoutExercises, setWorkoutExercises] =
    useState(() => {
      const workout =
        getWorkoutForDate(today)

      if (!workout) {
        return []
      }

      if (!Array.isArray(workout.exercises)) {
        return []
      }

      return workout.exercises.map(
        normalizeExercise
      )
    })


  // ========================================
  // UI STATES
  // ========================================

  const [
    showExercisePicker,
    setShowExercisePicker,
  ] = useState(false)


  const [
    deletingExercise,
    setDeletingExercise,
  ] = useState(null)


  const [
    savedMessage,
    setSavedMessage,
  ] = useState(false)


  // ========================================
  // CHANGE DATE
  // ========================================

  function handleDateChange(e) {
    const newDate =
      e.target.value

    setSelectedDate(newDate)

    const workout =
      getWorkoutForDate(newDate)

    if (
      workout &&
      Array.isArray(workout.exercises)
    ) {
      setWorkoutExercises(
        workout.exercises.map(
          normalizeExercise
        )
      )
    } else {
      setWorkoutExercises([])
    }

    setSavedMessage(false)
  }


  // ========================================
  // AUTO SAVE
  // ========================================

  useEffect(() => {
    const currentWorkout =
      getWorkoutForDate(selectedDate)

    const currentExercises =
      Array.isArray(
        currentWorkout?.exercises
      )
        ? currentWorkout.exercises
        : []

    const currentJSON =
      JSON.stringify(currentExercises)

    const newJSON =
      JSON.stringify(workoutExercises)

    if (
      currentJSON === newJSON
    ) {
      return
    }

    if (
      selectedDate !== today
    ) {
      return
    }

    onSave(workoutExercises)
  }, [
    workoutExercises,
    selectedDate,
    today,
    onSave,
  ])


  // ========================================
  // ADD ENTIRE PRESET (ALL EXERCISES)
  // ========================================

  function addPresetExercises(preset) {
    const matchedExercises = exercises.filter((ex) => {
      const matchPresetId = ex.presetId === preset.id
      const matchMuscle = ex.muscle?.toLowerCase() === preset.title.toLowerCase()
      return matchPresetId || matchMuscle
    })

    if (matchedExercises.length === 0) {
      setShowExercisePicker(false)
      return
    }

    const newExercisesToAdd = []

    matchedExercises.forEach((exercise) => {
      const alreadyAdded =
        workoutExercises.some(
          (item) =>
            item.exerciseId === exercise.id || item.id === exercise.id
        ) || newExercisesToAdd.some((item) => item.exerciseId === exercise.id)

      if (!alreadyAdded) {
        const trackingType =
          exercise.type ||
          exercise.trackingType ||
          'weight'

        newExercisesToAdd.push({
          id: Date.now() + Math.random(),
          exerciseId: exercise.id,
          name: exercise.name,
          muscle: exercise.muscle,
          type: trackingType,
          sets: [
            {
              id: Date.now() + Math.random(),
              weight: 'Body Weight',
              reps: '',
              time: '',
            },
          ],
        })
      }
    })

    if (newExercisesToAdd.length > 0) {
      setWorkoutExercises((current) => [
        ...current,
        ...newExercisesToAdd,
      ])
    }

    setShowExercisePicker(false)
  }


  // ========================================
  // UPDATE WEIGHT
  // ========================================

  function updateWeight(
    exerciseId,
    setId,
    value
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.id !==
              exerciseId
            ) {
              return exercise
            }

            return {
              ...exercise,
              sets:
                exercise.sets.map(
                  (set) => {
                    if (
                      set.id !== setId
                    ) {
                      return set
                    }

                    return {
                      ...set,
                      weight:
                        value,
                    }
                  }
                ),
            }
          }
        )
    )
  }


  // ========================================
  // UPDATE REPS (WITH AUTO WEIGHT FALLBACK)
  // ========================================

  function updateReps(
    exerciseId,
    setId,
    value
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.id !==
              exerciseId
            ) {
              return exercise
            }

            return {
              ...exercise,
              sets:
                exercise.sets.map(
                  (set) => {
                    if (
                      set.id !== setId
                    ) {
                      return set
                    }

                    const calculatedWeight =
                      (set.weight === '' || set.weight === 'Body Weight') && value !== ''
                        ? 'Body Weight'
                        : set.weight

                    return {
                      ...set,
                      reps:
                        value,
                      weight:
                        calculatedWeight,
                    }
                  }
                ),
            }
          }
        )
    )
  }


  // ========================================
  // UPDATE TIME
  // ========================================

  function updateTime(
    exerciseId,
    setId,
    value
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.id !==
              exerciseId
            ) {
              return exercise
            }

            return {
              ...exercise,
              sets:
                exercise.sets.map(
                  (set) => {
                    if (
                      set.id !== setId
                    ) {
                      return set
                    }

                    return {
                      ...set,
                      time:
                        value,
                    }
                  }
                ),
            }
          }
        )
    )
  }


  // ========================================
  // ADD SET
  // ========================================

  function addSet(exerciseId) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.id !==
              exerciseId
            ) {
              return exercise
            }

            return {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: Date.now() + Math.random(),
                  weight: 'Body Weight',
                  reps: '',
                  time: '',
                },
              ],
            }
          }
        )
    )
  }


  // ========================================
  // REMOVE SET
  // ========================================

  function removeSet(
    exerciseId,
    setId
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.id !==
              exerciseId
            ) {
              return exercise
            }

            if (
              exercise.sets.length <= 1
            ) {
              return exercise
            }

            return {
              ...exercise,
              sets:
                exercise.sets.filter(
                  (set) =>
                    set.id !== setId
                ),
            }
          }
        )
    )
  }


  // ========================================
  // ASK REMOVE EXERCISE
  // ========================================

  function requestRemoveExercise(
    exercise
  ) {
    setDeletingExercise(exercise)
  }


  // ========================================
  // CONFIRM REMOVE EXERCISE
  // ========================================

  function confirmRemoveExercise(
    exerciseId
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.filter(
          (exercise) =>
            exercise.id !==
            exerciseId
        )
    )

    setDeletingExercise(null)
  }


  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            WORKOUT
          </p>
          <h2>
            Workout
          </h2>
        </div>

        <input
          className="workout-date"
          type="date"
          value={selectedDate}
          max={today}
          onChange={handleDateChange}
        />
      </div>

      <div className="workout-date-label">
        {selectedDate === today
          ? 'TODAY'
          : formatDate(selectedDate)}
      </div>

      {workoutExercises.length === 0 && (
        <section className="card workout-empty">
          <div className="workout-icon">
            +
          </div>

          <h3>
            {selectedDate === today
              ? "Start today's workout"
              : 'No workout recorded'}
          </h3>

          <p>
            {selectedDate === today
              ? 'Select a workout preset to start tracking.'
              : 'There is no workout recorded for this date.'}
          </p>

          {selectedDate === today && (
            <button
              className="primary-button"
              onClick={() =>
                setShowExercisePicker(true)
              }
            >
              + Select Preset
            </button>
          )}
        </section>
      )}

      {workoutExercises.length > 0 && (
        <div className="workout-list">
          {workoutExercises.map(
            (exercise, index) => {
              const isTime =
                exercise.type === 'time' ||
                exercise.trackingType === 'time'

              return (
                <section
                  className="card workout-card"
                  key={exercise.id}
                >
                  <div className="workout-card-header">
                    <div>
                      <span className="exercise-number">
                        {String(
                          index + 1
                        ).padStart(2, '0')}
                      </span>

                      <div>
                        <h3>
                          {exercise.name}
                        </h3>
                        <span>
                          {exercise.muscle}
                        </span>
                      </div>
                    </div>

                    {selectedDate === today && (
                      <button
                        className="remove-exercise"
                        onClick={() =>
                          requestRemoveExercise(
                            exercise
                          )
                        }
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="sets-header">
                    <span>
                      SET
                    </span>
                    <span>
                      {isTime
                        ? 'TIME'
                        : 'WEIGHT'}
                    </span>
                    {!isTime && (
                      <span>
                        REPS
                      </span>
                    )}
                    <span />
                  </div>

                  <div className="sets-list">
                    {exercise.sets.map(
                      (set, setIndex) => (
                        <div
                          className="set-row"
                          key={set.id}
                        >
                          <span className="set-number">
                            {setIndex + 1}
                          </span>

                          {isTime ? (
                            <div className="set-input">
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={
                                  set.time ??
                                  ''
                                }
                                disabled={
                                  selectedDate !==
                                  today
                                }
                                onChange={(e) =>
                                  updateTime(
                                    exercise.id,
                                    set.id,
                                    e.target.value
                                  )
                                }
                              />
                              <span>
                                sec
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="set-input">
                                <input
                                  type="text"
                                  placeholder="Body Weight"
                                  value={
                                    set.weight ??
                                    ''
                                  }
                                  disabled={
                                    selectedDate !==
                                    today
                                  }
                                  onChange={(e) =>
                                    updateWeight(
                                      exercise.id,
                                      set.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <span style={{ fontSize: '11px', opacity: 0.7 }}>
                                  {set.weight === '' || set.weight === 'Body Weight' ? '' : 'kg'}
                                </span>
                              </div>

                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={
                                  set.reps ??
                                  ''
                                }
                                disabled={
                                  selectedDate !==
                                  today
                                }
                                onChange={(e) =>
                                  updateReps(
                                    exercise.id,
                                    set.id,
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          )}

                          {selectedDate === today ? (
                            <button
                              className="remove-set"
                              onClick={() =>
                                removeSet(
                                  exercise.id,
                                  set.id
                                )
                              }
                            >
                              ×
                            </button>
                          ) : (
                            <span />
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {selectedDate === today && (
                    <button
                      className="add-set-button"
                      onClick={() =>
                        addSet(
                          exercise.id
                        )
                      }
                    >
                      + Add Set
                    </button>
                  )}
                </section>
              )
            }
          )}

          {selectedDate === today && (
            <button
              className="add-workout-exercise"
              onClick={() =>
                setShowExercisePicker(true)
              }
            >
              + Select Another Preset
            </button>
          )}

          {selectedDate === today && savedMessage && (
            <div className="auto-save-message">
              ✓ Workout saved
            </div>
          )}
        </div>
      )}

      {showExercisePicker && (
        <div className="modal-overlay" onClick={() => setShowExercisePicker(false)}>
          <div className="form-modal picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">SELECT WORKOUT</p>
                <h3>Choose a Preset</h3>
              </div>
              <button className="close-button" onClick={() => setShowExercisePicker(false)}>×</button>
            </div>

            <div className="picker-list">
              {presets.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.6, padding: '20px' }}>No presets found. Create presets in the Exercises tab first.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      className="picker-item"
                      onClick={() => addPresetExercises(preset)}
                    >
                      <strong>{preset.title}</strong>
                      <span>›</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deletingExercise && (
        <DeleteModal
          exercise={
            deletingExercise
          }
          onDelete={
            confirmRemoveExercise
          }
          onClose={() =>
            setDeletingExercise(null)
          }
        />
      )}
    </div>
  )
}

export default Workout