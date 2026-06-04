import { FiBriefcase, FiSmile, FiUser, FiUsers } from 'react-icons/fi'
import { roleplayPersonas } from '../roleplayUtils'

const personaIcons = {
  Teacher: FiUser,
  Interviewer: FiBriefcase,
  Friend: FiSmile,
  Customer: FiUsers,
  Manager: FiBriefcase,
}

export default function PersonaSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {roleplayPersonas.map((persona) => {
        const Icon = personaIcons[persona] || FiUser
        return (
          <button
            key={persona}
            type="button"
            onClick={() => onChange(persona)}
            className={`rounded-card border p-4 text-center transition hover:shadow-md ${value === persona ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
          >
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon aria-hidden="true" />
            </span>
            <span className="mt-3 block font-semibold">{persona}</span>
          </button>
        )
      })}
    </div>
  )
}
