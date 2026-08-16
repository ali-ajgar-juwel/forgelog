import { groupExercises } from '../utils/helpers'
import './Exercises.css'
function Exercises({
  exercises,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">
            YOUR EXERCISES
          </p>

          <h2>
            Exercises
          </h2>
        </div>

        <button
          className="add-button"
          onClick={onAdd}
        >
          +
        </button>

      </div>


      {exercises.length === 0 ? (

        <section className="card exercise-empty">

          <div className="exercise-icon">
            +
          </div>

          <h3>
            No exercises yet
          </h3>

          <p>
            Add your exercises to start
            tracking your strength.
          </p>

          <button
            className="primary-button"
            onClick={onAdd}
          >
            + Add Exercise
          </button>

        </section>

      ) : (

        <div className="exercise-groups">

          {groupExercises(exercises).map(
            ([muscle, muscleExercises]) => (

              <section
                className="exercise-group card"
                key={muscle}
              >

                <div className="group-title">
                  {muscle}
                </div>


                {muscleExercises.map(
                  (exercise) => (

                    <div
                      className="exercise-row"
                      key={exercise.id}
                    >

                      <div className="exercise-info">

                        <strong>
                          {exercise.name}
                        </strong>

                        <span>
                          {exercise.muscle}
                        </span>

                      </div>


                      <div className="exercise-actions">

                        <button
                          onClick={() =>
                            onEdit(exercise)
                          }
                          aria-label="Edit exercise"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() =>
                            onDelete(exercise)
                          }
                          aria-label="Delete exercise"
                        >
                          ×
                        </button>

                      </div>

                    </div>

                  )
                )}

              </section>

            )
          )}

        </div>

      )}

    </div>
  )
}

export default Exercises