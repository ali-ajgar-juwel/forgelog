import './DeleteModal.css'

function DeleteModal({
  exercise,
  onDelete,
  onClose,
}) {
  if (!exercise) {
    return null
  }

  return (
    <div className="delete-overlay">

      <div
        className="delete-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Handle */}

        <div className="delete-handle" />


        {/* Icon */}

        <div className="delete-icon">
          !
        </div>


        {/* Title */}

        <h3>
          Delete Exercise?
        </h3>


        {/* Message */}

        <p>
          Are you sure you want to delete{' '}
          <strong>
            {exercise.name}
          </strong>
          ?
        </p>


        <p className="warning-text">
          This action cannot be undone.
        </p>


        {/* Buttons */}

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>


          <button
            type="button"
            className="danger-button"
            onClick={() =>
              onDelete(exercise.id)
            }
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  )
}

export default DeleteModal