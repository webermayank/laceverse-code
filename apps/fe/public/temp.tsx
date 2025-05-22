import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';



const MultiplayerGame = () => {
  const [user, setUser] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [spaceElements, setSpaceElements] = useState([]);
  const [players, setPlayers] = useState({});
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const playerPosition = useRef({ x: 0, y: 0 });
  
  // Authentication
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password
      });
      
      if (response.status === 200) {
        setToken(response.data.token);
        setIsLoggedIn(true);
        localStorage.setItem('token', response.data.token);
        fetchUserData();
        fetchSpaces();
        fetchAvatars();
      }
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

  // Register function
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        type: "user"
      });
      
      if (response.status === 200) {
        const loginResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username,
          password
        });
        
        setToken(loginResponse.data.token);
        setIsLoggedIn(true);
        localStorage.setItem('token', loginResponse.data.token);
        fetchUserData();
        fetchSpaces();
        fetchAvatars();
      }
    } catch (err) {
      setError('Registration failed. Username might be taken.');
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      // Placeholder for user data fetch - your API might have a different endpoint
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Fetch available spaces
  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      setSpaces(response.data.spaces);
    } catch (err) {
      console.error("Error fetching spaces:", err);
    }
  };

  // Fetch available avatars
  const fetchAvatars = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
      setAvatars(response.data.avatars);
    } catch (err) {
      console.error("Error fetching avatars:", err);
    }
  };

  // Set user avatar
  const setUserAvatar = async (avatarId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/metadata`,
        { avatarId },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      setSelectedAvatar(avatarId);
    } catch (err) {
      console.error("Error setting avatar:", err);
    }
  };

  // Join a space
  const joinSpace = async (spaceId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      
      setCurrentSpace(response.data);
      setSpaceElements(response.data.elements);
      
      // Close existing WebSocket if open
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Connect to WebSocket
      connectWebSocket(spaceId);
    } catch (err) {
      console.error("Error joining space:", err);
    }
  };

  // WebSocket connection
  const connectWebSocket = (spaceId) => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: token
        }
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message:", message);
      
      switch (message.type) {
        case "space-joined":
          // Set initial player position
          playerPosition.current = message.payload.spawn;
          
          // Add existing users to the players list
          const existingPlayers = {};
          message.payload.users.forEach(user => {
            existingPlayers[user.userId] = {
              x: user.x,
              y: user.y,
              userId: user.userId,
              avatarId: user.avatarId
            };
          });
          setPlayers(existingPlayers);
          break;
          
        case "user-joined":
          setPlayers(prev => ({
            ...prev,
            [message.payload.userId]: {
              x: message.payload.x,
              y: message.payload.y,
              userId: message.payload.userId,
              avatarId: message.payload.avatarId
            }
          }));
          break;
          
        case "user-left":
          setPlayers(prev => {
            const newPlayers = { ...prev };
            delete newPlayers[message.payload.userId];
            return newPlayers;
          });
          break;
          
        case "movement":
          setPlayers(prev => ({
            ...prev,
            [message.payload.userId]: {
              ...prev[message.payload.userId],
              x: message.payload.x,
              y: message.payload.y
            }
          }));
          break;
          
        case "movement-rejected":
          // Reset player position
          playerPosition.current = {
            x: message.payload.x,
            y: message.payload.y
          };
          break;
      }
      
      renderCanvas();
    };
    
    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    wsRef.current = ws;
  };

  // Handle player movement
  const handleKeyDown = (e) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    let newX = playerPosition.current.x;
    let newY = playerPosition.current.y;
    
    switch (e.key) {
      case "ArrowUp":
        newY -= 1;
        break;
      case "ArrowDown":
        newY += 1;
        break;
      case "ArrowLeft":
        newX -= 1;
        break;
      case "ArrowRight":
        newX += 1;
        break;
      default:
        return;
    }
    
    // Send movement to server
    wsRef.current.send(JSON.stringify({
      type: "move",
      payload: {
        x: newX,
        y: newY
      }
    }));
    
    // Update local position (will be corrected by server if invalid)
    playerPosition.current = { x: newX, y: newY };
  };

  // Canvas rendering
  const renderCanvas = () => {
    if (!canvasRef.current || !currentSpace) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tileSize = 32; // Size of each grid cell
    
    // Parse dimensions
    const [width, height] = currentSpace.dimensions.split('x').map(Number);
    
    // Set canvas size
    canvas.width = width * tileSize;
    canvas.height = height * tileSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid for visualization
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(canvas.width, y * tileSize);
      ctx.stroke();
    }
    
    // Draw static elements
    spaceElements.forEach(element => {
      ctx.fillStyle = '#8aa';
      ctx.fillRect(element.x * tileSize, element.y * tileSize, tileSize, tileSize);
    });
    
    // Draw other players
    Object.values(players).forEach(player => {
      ctx.fillStyle = '#f55';
      ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
      
      // Draw player ID or avatar info
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.fillText(player.userId.substring(0, 5), player.x * tileSize, player.y * tileSize - 2);
    });
    
    // Draw current player
    ctx.fillStyle = '#5f5';
    ctx.fillRect(
      playerPosition.current.x * tileSize, 
      playerPosition.current.y * tileSize, 
      tileSize, 
      tileSize
    );
  };

  // Create a new space
  const createSpace = async (name) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name,
          dimensions: "20x20" // Default dimensions
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        fetchSpaces();
      }
    } catch (err) {
      console.error("Error creating space:", err);
    }
  };

  // Effect to handle canvas rendering
  useEffect(() => {
    if (currentSpace) {
      renderCanvas();
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSpace, spaceElements, players]);

  // Effect to clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Check for stored token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUserData();
      fetchSpaces();
      fetchAvatars();
    } else {
      setLoading(false);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Multiplayer Avatar Game</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="button"
                onClick={handleLogin}
              >
                Sign In
              </button>
              
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                type="button"
                onClick={handleRegister}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left sidebar for spaces */}
          <div className="lg:w-1/4 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Your Spaces</h2>
            
            {spaces.length === 0 ? (
              <p className="text-gray-500">No spaces found</p>
            ) : (
              <ul className="space-y-2">
                {spaces.map((space) => (
                  <li key={space.id}>
                    <button
                      className={`w-full text-left p-2 rounded ${
                        currentSpace && currentSpace.id === space.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => joinSpace(space.id)}
                    >
                      {space.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Create New Space</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Space name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    if (newSpaceName.trim()) {
                      createSpace(newSpaceName);
                      setNewSpaceName('');
                    }
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle section - Game canvas */}
          <div className="lg:w-2/4">
            {currentSpace ? (
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4">{currentSpace.name}</h2>
                <div className="overflow-auto">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300"
                    tabIndex={0}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Use arrow keys to move. Green square is you, red squares are other players.</p>
                  <p>Dimensions: {currentSpace.dimensions}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-xl font-bold mb-4">Select a Space</h2>
                <p className="text-gray-600">Choose a space from the list or create a new one to start playing</p>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Avatar selection */}
          <div className="lg:w-1/4 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Choose Avatar</h2>
            
            {avatars.length === 0 ? (
              <p className="text-gray-500">No avatars available</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`p-2 border rounded cursor-pointer ${
                      selectedAvatar === avatar.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => setUserAvatar(avatar.id)}
                  >
                    <div className="aspect-square bg-gray-100 mb-2 overflow-hidden">
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Avatar';
                        }}
                      />
                    </div>
                    <p className="text-center text-sm">{avatar.name}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium mb-2">Game Controls</h3>
              <ul className="text-sm space-y-1">
                <li>↑ Move Up</li>
                <li>↓ Move Down</li>
                <li>← Move Left</li>
                <li>→ Move Right</li>
              </ul>
            </div>
            
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setToken('');
                if (wsRef.current) wsRef.current.close();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGame;