export class NotificationService {
  private static instance: NotificationService
  private permission: NotificationPermission = 'default'

  private constructor() {
    this.init()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async init() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission()
    }
  }

  async sendWateringReminder(plantName: string, amount: number) {
    if (this.permission === 'granted') {
      new Notification('Watering Reminder', {
        body: `Time to water your ${plantName} (${amount}ml)`,
        icon: '/plant-icon.png' // Add your icon
      })
    }
  }
} 