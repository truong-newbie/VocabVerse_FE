import { FiBriefcase, FiCoffee, FiMap, FiMessageCircle, FiShoppingBag, FiUsers } from 'react-icons/fi'
import { roleplayTopics } from '../roleplayUtils'

const topicIcons = {
  'Job Interview': FiBriefcase,
  Travel: FiMap,
  'Daily Conversation': FiMessageCircle,
  'Business Meeting': FiUsers,
  Restaurant: FiCoffee,
  'IELTS Speaking': FiShoppingBag,
}

export default function TopicSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {roleplayTopics.map((topic) => {
        const Icon = topicIcons[topic] || FiMessageCircle
        return (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            className={`rounded-card border p-4 text-left transition hover:shadow-md ${value === topic ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" />
              </span>
              <span className="font-semibold">{topic}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
