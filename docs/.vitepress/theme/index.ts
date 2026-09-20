import DefaultTheme from 'vitepress/theme';
import { onMounted } from 'vue';
import './custom.css';

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      // Check for saved preference or system preference
      const stored = localStorage.getItem('vitepress-theme-appearance');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (stored === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Default to dark per DESIGN2.md dark-first philosophy
        localStorage.setItem('vitepress-theme-appearance', 'dark');
        document.documentElement.classList.add('dark');
      }
    });
  }
};
