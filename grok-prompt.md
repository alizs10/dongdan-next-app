# Personal Finance Dashboard Project Prompt

I’m developing a minimalistic personal finance dashboard using Next.js, React, and Tailwind CSS, with a Persian (RTL) interface. The app tracks income, expenses, and savings goals in a three-column layout: left sidebar, main content, and right sidebar. Here’s the full context based on my inputs and our collaboration as of April 1, 2025:

## Initial Setup (Provided by Me)
- **Tech Stack**: Next.js (`"use client"`), React, Tailwind CSS, Lucide React icons, custom components (`Button`, `IncomeItem`, `ExpenseItem`), potentially TypeScript.
- **Original Code**: A single `PersonalPage` component with:
  - **Imports**: `MoveRight`, `Plus` from Lucide, `Link` from Next.js, custom `Button`.
  - **Mock Data**: `transactions` array (10 entries) with `type` ("income"/"expense"), `title`, `date`, `amount`, `description`, `tags`, sorted by date descending.
  - **Layout**: 
    - **Left Sidebar**: Tags ("ماهانه", "حقوق") and calendar filters ("اسفند ۱۴۰۳").
    - **Main Content**: Header ("مدیریت هزینه های شخصی"), tabs ("نمای کلی", "هزینه‌ها"), filters ("همه", "درآمد", "هزینه"), "Add New Transaction" button, transaction list.
    - **Right Sidebar**: Placeholder ("منوی راست").
  - **Styling**: Custom classes (`app_bg_color`, `app_border_color`, `primary_bg_color`, `primary_text_color`), Tailwind for hover/dark mode.

## Component Breakdown (Provided by Me)
- **PersonalPage**: Manages tabs, now holds `transactions` data, renders `LeftSidebar`, `Transactions`, `RightSidebar`, `OverallView`.
- **Transactions**: 
  - Contains `transactions` (moved to `PersonalPage` later), renders `IncomeItem`/`ExpenseItem`.
  - Updated to include filters and "Add New Transaction" button with `activeFilter` state.
- **RightSidebar**: Static content for upcoming bills, budget alerts, savings goals with a "New Goal" button.
- **Button Component**: Reusable with props:
  - `type ButtonProps`: `onClick`, `text`, `icon`, `size` ("small"/"medium"/"large"), `color` ("accent"/"gray"/"danger"/"success"/"warning"), `shape` ("rect"/"square"), `type`, `disabled`.
  - Styling: e.g., `gray`: `bg-gray-100 dark:bg-dark-gray text-gray-700 dark:text-gray-300`.
- **OverallView**: Added for "نمای کلی" tab, initially mocked, now with charts.

## Progress and Modifications (Done Together)
1. **Design Refinements**:
   - **Minimalism**: No rounded borders, padding on children (e.g., `px-6`), flat design.
   - **Left Sidebar**: Added `Tags`/`Calendar` icons, subtle hover (`hover:bg-gray-50`), numbers in `text-gray-500 dark:text-gray-400`.
   - **Right Sidebar**: 
     - **Upcoming Bills**: "اجاره خانه" (11 Esfand), "هزینه اینترنت" (9 Esfand).
     - **Budget Alerts**: "۸۰٪ بودجه تفریح مصرف شده" with `AlertTriangle`.
     - **Savings Goals**: Dynamic list (e.g., "لپ‌تاپ جدید" at 50%), "New Goal" button (`Button`, `gray`, `Plus`).
   - **Colors**: `primary_text_color` for titles, grays for secondary text, `accent` for highlights.

2. **Component Evolution**:
   - **Breakdown**: Split into `LeftSidebar`, `Transactions`, `RightSidebar`, added `OverallView`.
   - **Transactions**: Moved filters/button from `PersonalPage`, added filtering logic.
   - **RightSidebar**: Added `savingsGoals` state and button functionality (placeholder).
   - **OverallView**: 
     - Initial: Mocked summary stats, trends, categories, insights.
     - Updated: Added charts with `react-chartjs-2`.

3. **OverallView with Charts**:
   - **Library**: `react-chartjs-2` (Chart.js wrapper) chosen for simplicity, supports bar/line/pie charts, lightweight.
     - Install: `npm install react-chartjs-2 chart.js`.
   - **Charts**:
     - **Bar**: Income vs. Expenses (March 2025), green (#4CAF50) and red (#F44336).
     - **Line**: 6-month trend (Oct 2024 - March 2025), income (green), expenses (red).
     - **Pie**: Top expense categories (March 2025), multi-colored.
   - **Data**: Derived from `transactions`, lifted to `PersonalPage`, passed as prop.
   - **Type Fixes**: Added TS interfaces (`Transaction`, `OverallViewProps`), typed chart data/options.
   - **Dark Mode Fixes**: Dynamic text colors (`gray-700` light, `gray-300` dark), adjusted grid/tooltip for visibility.

## Current State
- **PersonalPage**: Holds `transactions`, manages tabs, renders components conditionally.
- **Transactions**: Filters transactions, includes controls (filters, button).
- **RightSidebar**: Displays bills, alerts, dynamic savings goals.
- **OverallView**: 
  - Shows 3 charts (bar, line, pie) for March 2025 and 6-month trends.
  - TS-typed, dark mode adapted (text `rgb(55, 65, 81)` light, `rgb(209, 213, 219)` dark).
- **LeftSidebar**: Static filters (unchanged since initial setup).

## Key Design Principles
- **Minimalism**: Flat UI, no excessive decoration, padding on children.
- **RTL**: Persian text, right-aligned.
- **Colors**: `primary_text_color`, `gray-500 dark:gray-400`, `accent`, dark mode support.
- **Charts**: Simple, data-driven, visually clear in both modes.

## Code Details
- **PersonalPage**: Passes `transactions` to `OverallView` and `Transactions`.
- **Transactions**: Accepts `transactions` prop, filters locally.
- **OverallView**: 
  - Processes `transactions` for March 2025 and 6 months.
  - Charts use fixed heights (`h-40`), dynamic colors for dark mode.
- **RightSidebar**: Uses `Button` with `gray` for "New Goal".

## Issues Resolved
- **Type Errors**: Fixed with `Transaction` interface, typed chart data/options.
- **Dark Mode**: Charts now adapt text/grid colors dynamically.

## Next Steps (Pending)
- **Data Refinement**: Enhance `OverallView` with real-time insights (e.g., largest expense).
- **Savings Goal Form**: Implement form for "New Goal" in `RightSidebar`.
- **Chart Customization**: Adjust chart sizes, colors, or add tooltips if needed.
- **State Management**: Consider global state (e.g., Context) if more data sharing is required.

This captures all my inputs and our work. Please continue from here, focusing on [insert next priority]!