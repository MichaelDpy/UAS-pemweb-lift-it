// LocalStorage utilities
export const storage = {
  getWorkouts: () => {
    try {
      return JSON.parse(localStorage.getItem('liftit_workouts') || '[]');
    } catch {
      return [];
    }
  },

  saveWorkouts: (workouts) => {
    localStorage.setItem('liftit_workouts', JSON.stringify(workouts));
  },

  getTodayCompleted: () => {
    const today = new Date().toDateString();
    const lastCompletion = localStorage.getItem('liftit_last_completion');
    return localStorage.getItem('liftit_today_completed') === 'true' && lastCompletion === today;
  },

  setTodayCompleted: (completed) => {
    const today = new Date().toDateString();
    localStorage.setItem('liftit_today_completed', completed ? 'true' : 'false');
    if (completed) {
      localStorage.setItem('liftit_last_completion', today);
    }
  },

  getCompletedExercises: () => {
    return JSON.parse(localStorage.getItem('liftit_completed_exercises') || '{}');
  },

  setCompletedExercises: (exercises) => {
    localStorage.setItem('liftit_completed_exercises', JSON.stringify(exercises));
  },

  clearToday: () => {
    const today = new Date().toDateString();
    const lastCompletion = localStorage.getItem('liftit_last_completion');
    
    if (lastCompletion !== today) {
      localStorage.removeItem('liftit_today_completed');
      localStorage.removeItem('liftit_completed_exercises');
    }
  }
};