function ExercisePicker({
  exercises,
  selectedExercises,
  onSelect,
  onClose,
}) {

  return (

    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >

      <div
        className="picker-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div className="modal-header">

          <div>

            <p className="eyebrow">
              WORKOUT
            </p>

            <h3>
              Add Exercise
            </h3>

          </div>


          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* ==================================
            EXERCISE LIST
        ================================== */}

        <div className="picker-list">

          {exercises.length === 0 && (

            <div className="picker-empty">

              <p>
                No exercises available.
              </p>

              <span>
                Add an exercise first.
              </span>

            </div>

          )}


          {exercises.map(
            (exercise) => {

              const selected =
                selectedExercises.some(
                  (item) =>
                    item.exerciseId ===
                    exercise.id
                )


              return (

                <button
                  type="button"
                  className={
                    selected
                      ? 'picker-item selected'
                      : 'picker-item'
                  }

                  key={
                    exercise.id
                  }

                  onClick={() =>
                    onSelect(
                      exercise
                    )
                  }
                >

                  {/* EXERCISE INFO */}

                  <div>

                    <strong>
                      {exercise.name}
                    </strong>

                    <span>
                      {exercise.muscle}
                    </span>

                  </div>


                  {/* TRACKING TYPE */}

                  <span className="picker-type">

                    {exercise.trackingType === 'time'
                      ? 'TIME'
                      : 'KG'}

                  </span>


                  {/* SELECT ICON */}

                  <span className="picker-check">

                    {selected
                      ? '✓'
                      : '+'}

                  </span>

                </button>

              )

            }
          )}

        </div>

      </div>

    </div>

  )
}


export default ExercisePicker