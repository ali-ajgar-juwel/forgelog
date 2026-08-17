import { useState, useEffect } from 'react'
import './Exercises.css'

function Exercises({
  exercises,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [showNewPresetModal, setShowNewPresetModal] = useState(false)
  const [editingPreset, setEditingPreset] = useState(null)
  const [newPresetName, setNewPresetName] = useState('')
  const [presetToDelete, setPresetToDelete] = useState(null)

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

  useEffect(() => {
    localStorage.setItem('forgelog_custom_presets', JSON.stringify(presets))
  }, [presets])

  function handleSavePreset(e) {
    e.preventDefault()
    if (!newPresetName.trim()) return

    if (editingPreset) {
      setPresets(presets.map(p => p.id === editingPreset.id ? {
        ...p,
        title: newPresetName.trim(),
      } : p))
    } else {
      const newPreset = {
        id: 'preset_' + Date.now(),
        title: newPresetName.trim(),
      }
      setPresets([...presets, newPreset])
    }

    closeModal()
  }

  function handleOpenEditModal(e, preset) {
    e.stopPropagation()
    setEditingPreset(preset)
    setNewPresetName(preset.title)
    setShowNewPresetModal(true)
  }

  function confirmDeletePreset() {
    if (presetToDelete) {
      setPresets(presets.filter(p => p.id !== presetToDelete.id))
      setPresetToDelete(null)
    }
  }

  function closeModal() {
    setShowNewPresetModal(false)
    setEditingPreset(null)
    setNewPresetName('')
  }

  if (selectedPreset) {
    // এখানে খুব ভালোভাবে ফিল্টার করা হচ্ছে যাতে প্রেসেটের আইডি অথবা নাম ম্যাচ করে
    const presetExercises = exercises.filter((ex) => {
      const matchPresetId = ex.presetId === selectedPreset.id
      const matchMuscle = ex.muscle?.toLowerCase() === selectedPreset.title.toLowerCase()
      return matchPresetId || matchMuscle
    })

    return (
      <div className="page">
        <div className="page-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="preset-back-icon-btn"
              onClick={() => setSelectedPreset(null)}
              aria-label="Back to Presets"
            >
              ↩
            </button>
            <h2>{selectedPreset.title}</h2>
          </div>

          <button
            className="add-button"
            onClick={() => onAdd(selectedPreset)}
            aria-label="Add Exercise"
          >
            +
          </button>
        </div>

        {presetExercises.length === 0 ? (
          <section className="card exercise-empty">
            <h3>No exercises in {selectedPreset.title}</h3>
            <p>Your preset is empty. Add your exercises to start tracking your progress.</p>
            <button className="primary-button" onClick={() => onAdd(selectedPreset)}>
              + Add Exercise
            </button>
          </section>
        ) : (
          <div className="exercise-groups">
            <section className="exercise-group card">
              {presetExercises.map((exercise) => (
                <div className="exercise-row" key={exercise.id}>
                  <div className="exercise-info">
                    <strong>{exercise.name}</strong>
                    <span>{exercise.muscle}</span>
                  </div>

                  <div className="exercise-actions">
                    <button
                      onClick={() => onEdit(exercise)}
                      aria-label="Edit exercise"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDelete(exercise)}
                      aria-label="Delete exercise"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKOUT PRESETS</p>
          <h2>Exercise Presets</h2>
        </div>

        <button
          className="add-button"
          onClick={() => {
            setEditingPreset(null)
            setNewPresetName('')
            setShowNewPresetModal(true)
          }}
          aria-label="Create New Preset"
        >
          +
        </button>
      </div>

      {presets.length === 0 ? (
        <section className="card exercise-empty" style={{ marginTop: '20px' }}>
          <h3>No Presets Found</h3>
          <p>Create your custom workout presets like Push, Pull, or Legs to organize your exercises.</p>
          <button 
            className="primary-button" 
            onClick={() => {
              setEditingPreset(null)
              setNewPresetName('')
              setShowNewPresetModal(true)
            }}
          >
            + Create Preset
          </button>
        </section>
      ) : (
        <div className="preset-grid">
          {presets.map((preset) => {
            const count = exercises.filter((ex) => {
              const matchPresetId = ex.presetId === preset.id
              const matchMuscle = ex.muscle?.toLowerCase() === preset.title.toLowerCase()
              return matchPresetId || matchMuscle
            }).length

            return (
              <div
                key={preset.id}
                className="card preset-card"
                onClick={() => setSelectedPreset(preset)}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{preset.title}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {count}
                    </span>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>Exercises</p>
                  </div>

                  <div className="exercise-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => handleOpenEditModal(e, preset)}
                      aria-label="Edit preset"
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPresetToDelete(preset)
                      }}
                      aria-label="Delete preset"
                      style={{ color: '#ff4d4d' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showNewPresetModal && (
        <div className="modal-overlay" onMouseDown={closeModal}>
          <div className="form-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">CUSTOM PRESET</p>
                <h3>{editingPreset ? 'Edit Preset' : 'Create New Preset'}</h3>
              </div>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSavePreset}>
              <label>Preset Name</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Chest Day, Arms"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
              />

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingPreset ? 'Save Changes' : 'Create Preset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {presetToDelete && (
        <div className="delete-overlay" onMouseDown={() => setPresetToDelete(null)}>
          <div className="delete-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="delete-handle" />
            <div className="delete-icon">!</div>
            <h3>Delete Preset?</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{presetToDelete.title}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPresetToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={confirmDeletePreset}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Exercises