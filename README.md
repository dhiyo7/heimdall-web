# Heimdall Web Listing

![Heimdall Banner](/heimdall-hero.jpg)

> **"The All-Seeing QA Automation Tool"**

Official landing page for **Heimdall**, an open-source local QA automation tool designed to overcome the fatigue of manual regression testing. This website showcases Heimdall's capabilities, features, and documentation in a retro-styled interface.

## 🚀 Features

- **Retro Aesthetic**: A unique design using Tailwind CSS with retro shadows and typography.
- **Responsive Layout**: Fully responsive design for Desktop, Tablet, and Mobile.
- **Documentation Section**: Interactive command cheat sheet and guides.
- **Dynamic Components**: Reusable UI components like `WindowCard`.
- **Netlify Status Integration**: Real-time deployment status updates in the footer.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/dhiyo7/heimdall-web.git
    cd heimdall-web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔧 Configuration

### Netlify Status Badge
To enable the real-time deployment status in the footer, you need to configure your Netlify Site ID:

1.  Open `modules/layout/Footer.tsx`
2.  Find the `img` tag inside the footer
3.  Replace `YOUR_NETLIFY_SITE_ID` with your actual Netlify API ID (found in Site Settings > General > Site Information).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Created with ❤️ by [dhiyo7](https://github.com/dhiyo7)*
