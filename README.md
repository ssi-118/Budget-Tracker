# Budget-Tracker
Smart Finance Tracker is a client-side web app for daily expense management with zero backend. It features a dashboard to log income, manage categories, and visualize habits via dynamic charts. Using localStorage, data stays synced across sessions without a database or account, offering a private, streamlined financial overview. It features a responsive design with support for both light and dark modes, ensuring a seamless user experience across different devices and preferences.

The project utilizes:
* **HTML5/CSS3**: For structure and responsive styling.
* **JavaScript (ES6+)**: For dynamic UI updates and data management logic.
* **Chart.js**: To render interactive data visualizations.
* **LocalStorage**: To persist transaction and category data directly in the browser without the need for a backend database.

## Inputs
The application gathers data through several interactive elements:

* **Transaction Form**:
    * **Description**: A text string describing the transaction (e.g., "Grocery Shopping").
    * **Amount**: A numerical value where positive numbers represent income and negative numbers represent expenses.
    * **Date**: The calendar date of the transaction.
    * **Category**: A selection from a dynamic list of categories.
* **Category Management**:
    * **New Category**: Text input to add custom spending or income classifications.
* **Search & Filter**:
    * **Search Bar**: Text input used to filter the transaction history by description or category name in real-time.
* **System Settings**:
    * **Theme Toggle**: User interaction to switch between Light and Dark visual themes.

## Outputs
The application processes inputs to provide the following visual and data-driven outputs:

* **Real-time Statistics**:
    * **Total Balance**: The net sum of all recorded transactions.
    * **Total Income**: A highlighted sum of all positive transactions.
    * **Total Expenses**: A highlighted sum of all negative transactions.
* **Data Visualizations**:
    * **Spending Breakdown (Doughnut Chart)**: A proportional view of expenses categorized by type (e.g., Rent, Food, Entertainment).
    * **Income vs. Expenses (Bar Chart)**: A direct comparison of total money earned versus total money spent.
* **Transaction History**:
    * A chronologically sorted list of transactions, color-coded for quick identification (green for income, red for expenses), including options to edit or delete entries.
* **Persistence**:
    * Automated saving of all transactions and custom categories to the browser's local storage.
