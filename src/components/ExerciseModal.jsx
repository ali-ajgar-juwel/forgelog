import { useEffect, useState } from 'react'

import './ExerciseModal.css'


function ExerciseModal({
  exercise,
  onSave,
  onClose,
}) {

  // ========================================
  // NAME
  // ========================================

  const [name, setName] = useState(
    exercise?.name || ''
  )


  // ========================================
  // MUSCLE
  // ========================================

  const [muscle, setMuscle] = useState(
    exercise?.muscle || 'Chest'
  )


  // ========================================
  // TYPE
  // weight / time
  // ========================================

  const [type, setType] = useState(
    exercise?.type || 'weight'
  )


  // ========================================
  // RESET WHEN EXERCISE CHANGES
  // ========================================

  useEffect(() => {

    setName(
      exercise?.name || ''
    )

    setMuscle(
      exercise?.muscle || 'Chest'
    )

    setType(
      exercise?.type || 'weight'
    )

  }, [exercise])


  // ========================================
  // SUBMIT
  // ========================================

  function handleSubmit(e) {

    e.preventDefault()


    if (!name.trim()) {
      return
    }


    onSave({

      id:
        exercise?.id,

      name:
        name.trim(),

      muscle:
        muscle,

      type:
        type,

    })

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >

      <div
        className="form-modal"
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
              EXERCISE
            </p>

            <h3>
              {exercise
                ? 'Edit Exercise'
                : 'Add Exercise'}
            </h3>

          </div>


          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>


        {/* ==================================
            FORM
        ================================== */}

        <form onSubmit={handleSubmit}>


          {/* EXERCISE NAME */}

          <label>
            Exercise Name
          </label>

          <input
            autoFocus
            type="text"
            placeholder="e.g. Biceps Curl"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          {/* MUSCLE */}

          <label>
            Muscle Group
          </label>

          <select
            value={muscle}
            onChange={(e) =>
              setMuscle(e.target.value)
            }
          >

            <option>Chest</option>
            <option>Back</option>
            <option>Shoulder</option>
            <option>Biceps</option>
            <option>Triceps</option>
            <option>Legs</option>
            <option>Abs</option>
            <option>Other</option>

          </select>


          {/* ==================================
              TRACKING TYPE
          ================================== */}

          <label>
            Track By
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="weight">
              Weight
            </option>

            <option value="time">
              Time
            </option>

          </select>


          {/* ==================================
              ACTIONS
          ================================== */}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="primary-button"
            >

              {exercise
                ? 'Save Changes'
                : 'Add Exercise'}

            </button>

          </div>

        </form>

      </div>

    </div>

  )
}


export default ExerciseModal