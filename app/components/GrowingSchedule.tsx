interface PlantSchedule {
  week: number;
  activity: string;
  details: string;
  completed: boolean;
  dueDate: string;
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate';
}

interface GrowingScheduleProps {
  schedule: PlantSchedule[];
  onTaskComplete: (taskIndex: number) => void;
}

const categoryColors = {
  planting: { bg: 'bg-green-50', text: 'text-green-700', icon: '🌱' },
  fertilizing: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '💧' },
  watering: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '💦' },
  pruning: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '✂️' },
  pest: { bg: 'bg-red-50', text: 'text-red-700', icon: '🐛' },
  harvest: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🌾' },
  climate: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '🌡️' }
}

export default function GrowingSchedule({ schedule, onTaskComplete }: GrowingScheduleProps) {
  const today = new Date()
  const sortedSchedule = [...schedule].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  
  const getTaskStatus = (dueDate: string, completed: boolean) => {
    if (completed) return 'completed'
    const due = new Date(dueDate)
    if (due < today) return 'overdue'
    if (due.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) return 'upcoming'
    return 'future'
  }

  return (
    <div className="space-y-4">
      {sortedSchedule.map((task, i) => {
        const status = getTaskStatus(task.dueDate, task.completed)
        const colors = categoryColors[task.category]
        
        return (
          <div 
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${colors.bg} ${
              status === 'overdue' ? 'border-l-4 border-red-500' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              <span role="img" aria-label={task.category}>
                {colors.icon}
              </span>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className={`font-medium ${colors.text} ${task.completed ? 'line-through opacity-50' : ''}`}>
                  {task.activity}
                </p>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskComplete(i)}
                  className={`rounded border-2 text-green-600 focus:ring-green-500 ${
                    status === 'overdue' ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className={`${colors.text} opacity-75`}>Week {task.week}</span>
                <span className="text-gray-400">•</span>
                <span className={`${
                  status === 'overdue' ? 'text-red-600 font-medium' :
                  status === 'upcoming' ? 'text-orange-600' :
                  status === 'completed' ? 'text-gray-400' :
                  'text-gray-500'
                }`}>
                  {status === 'overdue' ? 'Overdue - ' : ''}
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 