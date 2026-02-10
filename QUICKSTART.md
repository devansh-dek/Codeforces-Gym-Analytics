# 🚀 Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Try These Demo Contests

### Recommended Gym Contests to Test:

1. **Contest ID: 102391** - ICPC Regional Contest
2. **Contest ID: 505970** - Team Contest
3. **Contest ID: 104901** - Practice Contest

Just paste any of these IDs into the input field and click "Load Contest"!

## ⚡ Quick Features Tour

### 1. Timeline Scrubber
- Drag the slider to any point in time
- Click Play to auto-advance
- Use preset jump buttons (15min, 30min, 1hr, 2hr)
- Adjust playback speed (0.5x - 10x)

### 2. Standings Analysis
- Watch ranks change in real-time
- Click any team name to see detailed analysis
- Green = Accepted, Red = Wrong Answer
- Yellow highlight = First place

### 3. Key Moments
- Automatically detected important events
- Click any moment to jump to that time
- See rank takeovers, big jumps, first solves

### 4. Team Comparison
- Click "Compare Teams" button
- Select two teams from dropdowns
- View side-by-side performance metrics

### 5. Livestream Mode
- Toggle "Livestream Mode" for full-screen view
- Optimized for OBS and projectors
- Larger fonts, cleaner UI

### 6. Keyboard Shortcuts
- **Space**: Play/Pause
- **← →**: Skip 30 seconds backward/forward
- **L**: Toggle Livestream Mode
- **C**: Open Comparison Modal
- **E**: Open Export Panel

### 7. Export Options
- CSV: Current standings export
- JSON: Full contest report
- HTML: Stream overlay code for OBS

## 📊 Understanding the Data

### ICPC Scoring Rules
```
Penalty = Solve Time (minutes) + (Wrong Attempts × 20)
Ranking = Sort by (Solved DESC, Penalty ASC)
```

### Problem Status Colors
- 🟢 **Green**: Accepted (solved)
- 🔴 **Red**: Wrong answers/failures
- ⚫ **Gray**: Not attempted

### Rank Indicators
- 🥇 **Yellow highlight**: Rank 1
- **↑ Green arrows**: Rank improved
- **↓ Red arrows**: Rank dropped

## 🎥 Perfect for YouTube Recaps

1. Load contest
2. Enable Livestream Mode
3. Use OBS Browser Source
4. Scrub through key moments
5. Use comparison mode for team rivalries
6. Export overlays for fancy graphics

## 🔧 Troubleshooting

### Contest won't load?
- Check that the contest ID is correct
- Ensure it's a **Gym** or team contest (ID usually > 100000)
- Try a different contest ID
- Check your internet connection

### Slow performance?
- Large contests (500+ teams) may take time to load
- Timeline reconstruction happens in browser
- Use playback speed control to speed up replay

### API Rate Limits?
- Codeforces API has rate limits
- Wait a few seconds between requests
- Use the provided API keys in `.env.local`

## 💡 Pro Tips

1. **Pre-cache contests**: Load once, then scrub freely
2. **Bookmark key moments**: Note timestamps manually
3. **Use comparison mode**: Great for team rivalry narratives
4. **Export data**: Save reports for later analysis
5. **Keyboard shortcuts**: Much faster than clicking

## 🏋️ Advanced: Gym Mashups

For multi-contest mashups, you'll need to modify the code slightly:

```typescript
// In ContestDashboard.tsx
const contestIds = [102391, 505970]; // Multiple IDs
// Then use CodeforcesAPI.getMultipleContestData(contestIds)
```

## 📝 Example Workflow

### Creating a Contest Recap Video

1. **Load contest** with contest ID
2. **Enable Livestream Mode** (L key)
3. **Setup OBS** to capture the page
4. **Scrub to key moments** using the moments feed
5. **Pause and explain** what's happening
6. **Use comparison mode** for team showdowns
7. **Show final standings** at contest end
8. **Export stats** for closing graphics

## 🎓 For College Organizers

### During Contest:
- Load contest as it progresses
- Monitor standings live
- Detect interesting moments as they happen

### After Contest:
- Create recap videos
- Analyze team performance
- Share insights with participants
- Export data for reports

## 🌟 Best Practices

- **Test with smaller contests first** (< 100 teams)
- **Use keyboard shortcuts** for smooth navigation
- **Prepare narratives** before livestreaming
- **Practice scrubbing** through the timeline
- **Bookmark key moments** in your notes

---

**Need help?** Open an issue on GitHub or check the README.md for detailed documentation.

**Have fun analyzing contests! 🏆**
