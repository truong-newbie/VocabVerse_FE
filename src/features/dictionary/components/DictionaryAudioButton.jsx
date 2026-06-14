import { toast } from 'sonner'
import { FiVolume2 } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default function DictionaryAudioButton({ audioUrl }) {
  const handlePlay = async () => {
    if (!audioUrl) return

    try {
      await new Audio(audioUrl).play()
    } catch {
      toast.error('Unable to play pronunciation audio')
    }
  }

  return (
    <Button variant="secondary" onClick={handlePlay} disabled={!audioUrl} aria-label="Play pronunciation audio">
      <FiVolume2 aria-hidden="true" /> Audio
    </Button>
  )
}
