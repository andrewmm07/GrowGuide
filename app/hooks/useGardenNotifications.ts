import { useEffect } from 'react'
import { GardenPlant } from '../types'

export function useGardenNotifications(plants: GardenPlant[]) {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    const checkPermissionAndSchedule = async () => {
      let permission = Notification.permission
      
      if (permission === "default") {
        permission = await Notification.requestPermission()
      }
      
      if (permission === "granted") {
        scheduleNotifications(plants)
      }
    }

    checkPermissionAndSchedule()
  }, [plants])
}

function scheduleNotifications(plants: GardenPlant[]) {
  plants.forEach(plant => {
    plant.schedule.forEach(task => {
      if (task.completed) return

      const dueDate = new Date(task.dueDate)
      const now = new Date()
      
      // Notify day before
      const dayBefore = new Date(dueDate)
      dayBefore.setDate(dayBefore.getDate() - 1)
      
      if (dayBefore > now) {
        const timeout = dayBefore.getTime() - now.getTime()
        setTimeout(() => {
          new Notification(`Garden Task Tomorrow: ${plant.name}`, {
            body: `Remember to ${task.activity.toLowerCase()}`,
            icon: '/plant-icon.png'
          })
        }, timeout)
      }

      // Notify on due date
      if (dueDate > now) {
        const timeout = dueDate.getTime() - now.getTime()
        setTimeout(() => {
          new Notification(`Garden Task Due: ${plant.name}`, {
            body: `Time to ${task.activity.toLowerCase()}`,
            icon: '/plant-icon.png'
          })
        }, timeout)
      }
    })
  })
} 