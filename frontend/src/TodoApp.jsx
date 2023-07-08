import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import styled from 'styled-components'
import { Bar, Doughnut, Line, Pie, Scatter } from 'react-chartjs-2';
import './App.css';
import buttonClickSound from './Beeper_End.mp3';

const TodoApp = () => {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', completed: false, tomatoes: 0 });
    const [currentTask, setCurrentTask] = useState(null);
    const [timer, setTimer] = useState(1500); // Initial timer value in seconds (25 minutes)
    const [completedTasksRatio, setCompletedTasksRatio] = useState(0);
    const [mode, setMode] = useState('day'); // 'day' or 'night'


    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            handleTimerEnd();
        }
    }, [timer]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api');
            setTasks(response.data);
            calculateCompletedTasksRatio(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateCompletedTasksRatio = (tasks) => {
        const completedTasks = tasks.filter((task) => task.completed);
        const ratio = completedTasks.length / tasks.length;
        setCompletedTasksRatio(ratio);
    };

    const createTask = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', newTask);
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '', dueDate: '', completed: false, tomatoes: 0 });
            calculateCompletedTasksRatio([...tasks, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const url = `http://localhost:5000/api/tasks/${taskId}`;
            const response = await axios.delete(url);
            setTasks(tasks.filter((task) => task._id !== taskId));
            calculateCompletedTasksRatio(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error(error);
        }
    };
    const buttonAudio = new Audio(buttonClickSound);

    
    const startTimer = (task) => {
        setCurrentTask(task);
        buttonAudio.play()
        setTimer(1500); // Reset timer to 25 minutes
    };

    const handleTimerEnd = async () => {
        // Update the task with the completed Pomodoro session
        const updatedTask = { ...currentTask, tomatoes: (currentTask.tomatoes || 0) + 1 };
        try {
            await axios.put(`http://localhost:5000/api/tasks/${updatedTask.id}`, updatedTask);
            setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
            setCurrentTask(null);
            calculateCompletedTasksRatio(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };


    const toggleTaskCompletion = async (task) => {
        try {
            // Check if the task object or id is available
            if (!task || !task._id) {
                throw new Error('Task object or id is missing');
            }

            // Update the task's completion status
            const updatedTask = { ...task, completed: !task.completed };
            await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask);

            // Update the tasks in your state
            const updatedTasks = tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t));
            setTasks(updatedTasks);
        } catch (error) {
            console.error(error);
        }
    };
    const toggleMode = () => {
        setMode(mode === 'day' ? 'night' : 'day');
    };

    return (
        <Container className={`container ${mode}`}>
            <Button className="toggle-mode" onClick={toggleMode}>
                {mode === 'day' ? 'Night Mode' : 'Day Mode'}
            </Button>
            <h1 style={{ textAlign: 'center', fontSize: '40px' }}>ToDo App</h1>
            <header>
                {!isAuthenticated ? (
                    <Button onClick={() => loginWithRedirect()}>Log In</Button>
                ) : (
                    <>
                        <h4>Welcome, {user.name}</h4>
                        <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</Button>
                    </>
                )}
            </header>
            {isAuthenticated && (
                <Container>
                    <Container className="tasks">
                        <h2>Tasks</h2>
                        <ul>
                            {tasks.map((task) => (
                                <Container style={{ border: "1px solid black", borderRadius: '10px', marginBottom: '5px' }} className='add-task' key={task.id}>
                                    <h1>Title:{task.title} </h1>
                                    <h3>Timer: {task.tomatoes || 0} Pomodoros</h3>
                                    <Container className="task-actions">
                                        <Container>
                                            <Button className='gap' onClick={() => startTimer(task)}>Start Pomodoro</Button>
                                            <Button onClick={() => deleteTask(task._id)}>Delete</Button>
                                        </Container>
                                        <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
                                        <Button onClick={() => toggleTaskCompletion(task)}>
                                            Mark as {task.completed ? 'Not Completed' : 'Completed'}
                                        </Button>
                                    </Container>
                                </Container>
                            ))}
                        </ul>
                        <Container className="add-task">
                            <h2>Add TODO</h2>
                            <Input
                                type="text"
                                value={newTask.title}
                                placeholder="Title"
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <Input
                                type="text"
                                value={newTask.description}
                                placeholder="Description"
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <Input
                                type="text"
                                value={newTask.dueDate}
                                placeholder="Due Date"
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                            <Input
                                type="number"
                                value={newTask.tomatoes}
                                placeholder="Tomatoes"
                                onChange={(e) => setNewTask({ ...newTask, tomatoes: e.target.value })}
                            />
                            <Container className="task-status">
                                <Input
                                    type="radio"
                                    name="status"
                                    value="completed"
                                    checked={newTask.completed}
                                    onChange={() => setNewTask({ ...newTask, completed: true })}
                                />
                                <label htmlFor="status">Completed</label>

                                <Input
                                    type="radio"
                                    name="status"
                                    value="notCompleted"
                                    checked={!newTask.completed}
                                    onChange={() => setNewTask({ ...newTask, completed: false })}
                                />
                                <label htmlFor="status">Not Completed</label>
                            </Container>
                            <Button onClick={createTask}>Add Task</Button>
                        </Container>
                    </Container>
                    {currentTask && (
                        <Container className="timer">
                            <h2>Pomodoro Timer</h2>
                            <Container className="clock">
                            <svg viewBox="0 0 100 100" className="clock-face">
                  <circle className="circle" cx="50" cy="50" r="45" />
                  <line className="hour-hand" x1="50" y1="50" x2="50" y2="25" />
                  <line className="minute-hand" x1="50" y1="50" x2="50" y2="10" />
                  <line className="second-hand" x1="50" y1="50" x2="50" y2="5" />
                </svg>
                                <p>{formatTime(timer)}</p>
                            </Container>
                        </Container>
                    )}
                </Container>
            )}

        </Container>
    );
};

export default TodoApp;

const Container = styled.div`
  /* Add container styles here */
  .timer {
    margin-top: 40px;
  }
  
  .timer h2 {
    font-size: 20px;
    margin: 0 20px 20px 0px;
  }
  
  .timer .clock {
    position: relative;
    width: 200px;
    height: 200px;
    margin:  auto;
  }
  
  .timer .clock-face {
    width: 100%;
    height: 100%;
  }
  
  .timer .circle {
    fill: #3f51b5;
  }
  
  .timer .hour-hand,
  .timer .minute-hand,
  .timer .second-hand {
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    transform-origin: center center;
  }
  
  .timer p {
    text-align: center;
    font-size: 24px;
    margin-top: 0px;
  }
  
  /* Animations */
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .timer .hour-hand {
    animation: rotate 43200s infinite linear; /* 12 hours */
  }
  
  .timer .minute-hand {
    animation: rotate 3600s infinite steps(60); /* 1 hour */
  }
  
  .timer .second-hand {
    animation: rotate 60s infinite steps(60);
    
  }
`;

const Button = styled.button`
  /* Add button styles here */
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #45a049;
  }
`;

const Span = styled.span`
  /* Add span styles here */
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;


const Input = styled.input`
`
