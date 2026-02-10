# 🏆 Codeforces Gym Contest Analytics & Livestream Dashboard

A production-grade web application for visualizing, analyzing, and replaying Codeforces Gym contests with a focus on storytelling and livestream presentation.

![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

## ✨ Features

### 🎬 Timeline Scrubber
- **Video-like playback** of contest progression
- Scrub through any moment in the contest
- Quick jump presets (15min, 30min, 1hr, 2hr)
- Variable playback speed (0.5x to 10x)
- Real-time standings recomputation

### 📊 Live Standings
- **ICPC-style scoring** with accurate penalty calculation
- Animated rank changes with arrows
- Problem-by-problem status visualization
- Highlight first solves and breakthrough moments
- Color-coded problem states (AC, WA, pending)

### 🎯 Moment Detection
- **Automatic detection** of key contest events:
  - 🏆 Rank 1 takeovers
  - 🚀 Major rank jumps (3+ positions)
  - 🎯 First solves on each problem
  - ⚡ Clutch solves in final minutes
- One-click jump to any moment
- Chronological event feed

### 📈 Team Performance Pages
- Detailed rank progression graphs
- Solve timeline visualization
- Problem-by-problem breakdown
- Accuracy metrics and WA analysis
- Key moments for individual teams

### 🎥 Livestream Mode
- Optimized for projectors and OBS
- Clean, distraction-free UI
- Larger fonts for readability
- Dark theme optimized for streaming
- Perfect for YouTube recaps and live commentary

### 🔄 Team Comparison
- Side-by-side team analysis
- Solve speed comparison
- Accuracy metrics
- Performance radar charts
- Problem-by-problem race visualization

### 🏋️ Gym Mashup Support
- Input single or multiple contest IDs
- Aggregate standings across contests
- Perfect for college tryouts and training

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeforces-gym-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional - for authenticated API requests):
```env
NEXT_PUBLIC_CF_API_KEY=your_api_key
NEXT_PUBLIC_CF_API_SECRET=your_api_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage

### Loading a Contest

1. Enter a Codeforces Gym contest ID (e.g., `102391`, `505970`)
2. Click "Load Contest"
3. Wait for data to load from Codeforces API

### Using Timeline Controls

- **Drag the slider** to scrub through contest timeline
- **Click Play** to auto-advance time
- **Adjust speed** from the dropdown (0.5x - 10x)
- **Jump to presets** using quick buttons

### Team Analysis

- Click on any team name in standings
- View detailed performance metrics
- See rank progression over time
- Analyze solve timeline and accuracy

### Comparing Teams

1. Click "Compare Teams" button
2. Select two teams from dropdowns
3. View side-by-side performance metrics
4. Analyze solve speed, accuracy, and rank progression

### Livestream Mode

- Toggle "Livestream Mode" for optimized viewing
- Full-width standings display
- Larger fonts and cleaner UI
- Perfect for OBS capture

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **API**: Codeforces Public API

### Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── team/[teamId]/      # Team detail pages
├── components/
│   ├── ContestDashboard.tsx    # Main dashboard
│   ├── TimelineScrubber.tsx    # Timeline controls
│   ├── StandingsTable.tsx      # ICPC standings
│   ├── MomentsFeed.tsx         # Key moments list
│   ├── TeamDetailPage.tsx      # Team analysis
│   └── ComparisonModal.tsx     # Team comparison
├── lib/
│   ├── codeforces-api.ts       # API client
│   ├── timeline-engine.ts      # Contest reconstruction
│   ├── store.ts                # Global state
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript types
```

### Core Algorithms

#### Timeline Reconstruction
The `TimelineEngine` class reconstructs contest state at any timestamp by:
1. Sorting submissions chronologically
2. Processing submissions up to target time
3. Computing ICPC scoring (solve time + 20min/WA)
4. Ranking teams by problems solved, then penalty

#### Moment Detection
Automated detection by comparing consecutive snapshots:
- Rank changes (especially rank 1 takeovers)
- Position jumps of 3+ ranks
- First AC on each problem
- Solves in final 30 minutes

#### ICPC Scoring
```
Penalty = Solve Time (minutes) + (Wrong Attempts × 20)
Ranking = Sort by (Solved DESC, Penalty ASC)
```

## 🎨 UI/UX Highlights

- **Smooth animations** for rank changes
- **Color coding** for problem status
- **Responsive design** for all screen sizes
- **Dark theme** optimized for long viewing sessions
- **Accessibility** considerations throughout

## 🔧 Configuration

### API Keys (Optional)

For authenticated Codeforces API requests, add to `.env.local`:
```env
NEXT_PUBLIC_CF_API_KEY=your_key
NEXT_PUBLIC_CF_API_SECRET=your_secret
```

### Snapshot Interval

Modify in `timeline-engine.ts`:
```typescript
generateSnapshots(intervalMinutes: number = 1)
```

### Moment Detection Sensitivity

Adjust thresholds in `detectMoments()`:
```typescript
if (rankChange >= 3) { // Change this value
  // Big jump detected
}
```

## 🎯 Use Cases

- **College ICPC Tryouts**: Review and analyze team performance
- **Gym Mashups**: Aggregate results from multiple contests
- **YouTube Recaps**: Create engaging contest recap videos
- **Live Commentary**: Use livestream mode for real-time narration
- **Training Analysis**: Study solving patterns and strategies

## 🚧 Future Enhancements

- [ ] Database caching for faster subsequent loads
- [ ] Export functionality (CSV, images, video)
- [ ] Custom OBS overlays
- [ ] Historical comparison across multiple contests
- [ ] Submission code viewer
- [ ] Real-time updates during live contests
- [ ] Mobile-optimized UI
- [ ] Multi-contest mashup aggregation

## 📝 API Usage

This application uses the [Codeforces API](https://codeforces.com/apiHelp):

- `contest.status`: Fetch all submissions
- `contest.standings`: Get baseline team information

Rate limits and retry logic are built-in.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for your contests and events!

## 🙏 Acknowledgments

- Codeforces for the excellent API
- Next.js team for the amazing framework
- College programming communities worldwide

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for the competitive programming community**
