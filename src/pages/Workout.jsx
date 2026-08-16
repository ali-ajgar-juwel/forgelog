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
                set.weight ?? '',
              reps:
                set.reps ?? '',
              time:
                set.time ?? '',
            }))
          : [
              {
                id: Date.now(),
                weight: '',
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
  //
  // Important:
  // Only save when workoutExercises changes.
  //
  // selectedDate is also included so that
  // switching dates does not accidentally
  // save the previous date's data.
  //
  // We intentionally do NOT save when the
  // component is loading a different date.
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


    // --------------------------------------
    // Compare current data with saved data
    // --------------------------------------

    const currentJSON =
      JSON.stringify(currentExercises)

    const newJSON =
      JSON.stringify(workoutExercises)


    if (
      currentJSON === newJSON
    ) {
      return
    }


    // --------------------------------------
    // IMPORTANT:
    // App's saveWorkout currently saves
    // today's date.
    //
    // So we only auto-save here when
    // selectedDate === today.
    // --------------------------------------

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
  // ADD EXERCISE
  // ========================================

  function addExercise(exercise) {

    const alreadyAdded =
      workoutExercises.some(
        (item) =>
          item.exerciseId === exercise.id
      )


    if (alreadyAdded) {

      setShowExercisePicker(false)

      return
    }


    const trackingType =
      exercise.type ||
      exercise.trackingType ||
      'weight'


    const newExercise = {

      id: Date.now(),

      exerciseId:
        exercise.id,

      name:
        exercise.name,

      muscle:
        exercise.muscle,

      type:
        trackingType,

      sets: [

        {
          id: Date.now(),

          weight:
            trackingType === 'weight'
              ? ''
              : '',

          reps:
            trackingType === 'weight'
              ? ''
              : '',

          time:
            trackingType === 'time'
              ? ''
              : '',
        },

      ],

    }


    setWorkoutExercises(
      (current) => [
        ...current,
        newExercise,
      ]
    )


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
  // UPDATE REPS
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


                    return {

                      ...set,

                      reps:
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


            const isTime =
              exercise.type === 'time'


            return {

              ...exercise,

              sets: [

                ...exercise.sets,

                {

                  id: Date.now(),

                  weight:
                    isTime
                      ? ''
                      : '',

                  reps:
                    isTime
                      ? ''
                      : '',

                  time:
                    isTime
                      ? ''
                      : '',

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


            // Keep at least one set

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


      {/* ==================================
          HEADER
      ================================== */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            WORKOUT
          </p>

          <h2>
            Workout
          </h2>

        </div>


        {/* DATE */}

        <input
          className="workout-date"
          type="date"
          value={selectedDate}
          max={today}
          onChange={handleDateChange}
        />

      </div>


      {/* ==================================
          SELECTED DATE
      ================================== */}

      <div className="workout-date-label">

        {selectedDate === today
          ? 'TODAY'
          : formatDate(selectedDate)}

      </div>


      {/* ==================================
          EMPTY STATE
      ================================== */}

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
              ? 'Add the exercises you performed today and record your sets.'
              : 'There is no workout recorded for this date.'}
          </p>


          {selectedDate === today && (

            <button
              className="primary-button"
              onClick={() =>
                setShowExercisePicker(true)
              }
            >
              + Add Exercise
            </button>

          )}

        </section>

      )}


      {/* ==================================
          WORKOUT EXERCISES
      ================================== */}

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


                  {/* ==========================
                      EXERCISE HEADER
                  ========================== */}

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


                  {/* ==========================
                      SET HEADER
                  ========================== */}

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


                  {/* ==========================
                      SETS
                  ========================== */}

                  <div className="sets-list">

                    {exercise.sets.map(
                      (set, setIndex) => (

                        <div
                          className="set-row"
                          key={set.id}
                        >


                          {/* SET NUMBER */}

                          <span className="set-number">
                            {setIndex + 1}
                          </span>


                          {/* TIME */}

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
                              {/* WEIGHT */}

                              <div className="set-input">

                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  placeholder="0"
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

                                <span>
                                  kg
                                </span>

                              </div>


                              {/* REPS */}

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


                          {/* REMOVE SET */}

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


                  {/* ==========================
                      ADD SET
                  ========================== */}

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


          {/* ==================================
              ADD EXERCISE
          ================================== */}

          {selectedDate === today && (

            <button
              className="add-workout-exercise"
              onClick={() =>
                setShowExercisePicker(true)
              }
            >
              + Add Exercise
            </button>

          )}


          {/* ==================================
              SAVED MESSAGE
          ================================== */}

          {selectedDate === today && savedMessage && (

            <div className="auto-save-message">
              ✓ Workout saved
            </div>

          )}

        </div>

      )}


      {/* ==================================
          EXERCISE PICKER
      ================================== */}

      {showExercisePicker && (

        <ExercisePicker

          exercises={
            exercises
          }

          selectedExercises={
            workoutExercises
          }

          onSelect={
            addExercise
          }

          onClose={() =>
            setShowExercisePicker(false)
          }

        />

      )}


      {/* ==================================
          DELETE MODAL
      ================================== */}

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