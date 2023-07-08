# TodoApp

This is a TodoApp built with React that allows users to manage their tasks and track their progress using the Pomodoro Technique. The app provides features such as task creation, task deletion, task completion, and Pomodoro timer.

## Features

- Login: Users can log in to the app to access their tasks.
- Task Management: Users can create tasks by providing a title, description, due date, and number of Pomodoros (completed work sessions). They can also delete tasks and mark tasks as completed or not completed.
- Pomodoro Timer: Users can start a Pomodoro timer for a selected task. The timer runs for 25 minutes (default value) and tracks the completion of work sessions. After each completed session, the task's Pomodoros count is incremented.
- Dark Mode: Users can switch between day mode and night mode for a personalized visual experience.

## Installation

To run the TodoApp locally, follow these steps:

1. Clone the repository: `git clone https://github.com/ishwersharma13/quizapp.git`
2. Navigate to the project directory: `cd quizapp`
3. Install the dependencies: `npm install`
4. Start the development server: `npm start`
5. Open your web browser and visit `http://localhost:3000`

## Dependencies

The TodoApp relies on the following dependencies:

- React: A JavaScript library for building user interfaces.
- @auth0/auth0-react: A library for handling authentication using Auth0.
- axios: A library for making HTTP requests.
- styled-components: A CSS-in-JS library for styling components.
- react-chartjs-2: A library for creating interactive charts.

## Usage

1. Upon launching the app, you will see a login button. Click the button to log in and access the app.
2. Once logged in, you will be able to view and manage your tasks.
3. To create a new task, fill in the task details in the "Add TODO" section and click the "Add Task" button.
4. Existing tasks will be displayed in a list. You can start the Pomodoro timer for a task by clicking the "Start Pomodoro" button. The timer runs for 25 minutes by default.
5. To delete a task, click the "Delete" button next to the task.
6. You can mark a task as completed or not completed by clicking the corresponding button.
7. Use the "Day Mode" and "Night Mode" buttons to switch between light and dark modes.

## Contributing

Contributions are welcome! If you would like to contribute to the TodoApp, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b my-feature`
3. Make your changes and commit them: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin my-feature`
5. Submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and modify the code for your own purposes.
