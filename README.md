# Bible Word Weaver

🎮 Play Now: [Live Demo](https://bible-word-weaver.vercel.app) (update after deploy)


A modern, interactive word search puzzle game featuring biblical themes. Players can find hidden words in multiple categories while enjoying smooth animations and a clean, responsive interface.

## Features

- 🎯 Multiple Biblical Categories:
  - Old Testament Books
  - New Testament Books
  - Prophets
  - Kings & Queens
  - Jesus' Disciples
  - Women of the Bible
  - Biblical Places
  - Parables & Stories
  - Fruits of the Spirit
  - Angels & Heavenly Beings
  - Miracles
  - Psalms & Worship

- 🎲 Gameplay Features:
  - Dynamic 15x15 grid generation
  - Words can be found horizontally, vertically, or diagonally
  - Drag selection with visual feedback
  - Progress tracking
  - Hint system
  - Mystery phrases
  - Game statistics (time and moves)
  - Random/mixed category challenges
  - **Daily limit system: 2 free games per day**
  - Automatic reset at midnight
  - Live countdown timer for next reset

- 💅 UI Features:
  - Modern, dark theme design
  - Responsive layout for all screen sizes
  - Smooth animations and transitions
  - Difficulty indicators
  - Category badges
  - Progress bar
  - Victory celebrations

## How to Play

1. Choose a category from the available options at the top
2. Find words by clicking and dragging across letters
3. Words can be horizontal, vertical, or diagonal
4. Use the hint button if you need help
5. Complete the puzzle by finding all words
6. Try to beat your best time and move count!

## Technical Details

- Pure HTML, CSS, and JavaScript implementation
- No external dependencies
- Mobile-friendly design
- Efficient word placement algorithm
- Responsive grid system

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## Installation

1. Clone the repository or download the files
2. Open `index.html` in a web browser
3. Or visit the Live Demo once deployed
4. Start playing!

## Deployment

See `DEPLOYMENT.md` for step-by-step instructions to deploy on Vercel or Netlify. After deployment, update the Live Demo link above and the `homepage` field in `package.json`.

## Development

The game is built with vanilla JavaScript and uses modern ES6+ features. The code is organized into two main classes:

- `BiblicalDatabase`: Manages the word categories and content
- `WordSearchGame`: Handles game logic and UI interactions

### Key Components

- Grid Generation: Dynamic puzzle grid creation with word placement
- Word Placement: Smart algorithm for fitting words in various directions
- Selection System: Smooth drag-to-select mechanism
- Progress Tracking: Real-time progress updates and statistics
- Category Management: Easy to add new categories and words

## Daily Play Limit

The game includes a built-in daily limit system to encourage mindful playing:

- **2 free games per day** for each user
- Automatic reset at midnight (local time)
- Live countdown showing time until next reset
- Game progress is saved locally using browser storage
- Categories are hidden once daily limit is reached

## Future Enhancements

- Premium version with unlimited plays
- Additional biblical categories
- Difficulty levels within categories
- Social sharing features
- Sound effects and background music
- Multiplayer mode
- Achievement system
- Weekly challenges

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the MIT License.
